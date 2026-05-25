// supabase/functions/send-push-notifications/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import webpush from "https://esm.sh/web-push@3.6.6"

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE';
  table: string;
  record: {
    id: string;
    titulo: string;
    status: string;
    user_id: string; // ID do comprador (quem criou a solicitação)
  };
  old_record?: {
    status: string;
  };
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const publicKey = Deno.env.get("VAPID_PUBLIC_KEY") || ""
    const privateKey = Deno.env.get("VAPID_PRIVATE_KEY") || ""

    if (!publicKey || !privateKey) {
      throw new Error("Chaves VAPID não configuradas nos secrets do Supabase.")
    }

    webpush.setVapidDetails(
      "mailto:luizpheliperoquim@gmail.com",
      publicKey,
      privateKey
    )

    const payload: WebhookPayload = await req.json()
    console.log("🔔 Webhook acionado para a tabela:", payload.table)

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Array que guardará os IDs de quem vai receber a notificação
    let targetUserIds: string[] = []
    let tituloNotificacao = "PayFlow"
    let corpoNotificacao = `A solicitação "${payload.record.titulo}" foi atualizada.`

    // ========================================================
    // 🎯 REGRAS DINÂMICAS DE DIRECIONAMENTO (COMPRADOR VS FINANCEIRO)
    // ========================================================
    
    if (payload.type === 'INSERT') {
      // 🛒 CASO 1: Comprador cria a solicitação -> Buscar todos do Financeiro dinamicamente
      tituloNotificacao = "🛒 Nova Solicitação!"
      corpoNotificacao = `Uma nova solicitação aguarda pagamento: ${payload.record.titulo}`

      // 🔍 Busca na tabela 'usuarios' usando as colunas do seu print
      const { data: financeiroUsers, error: userError } = await supabase
        .from('usuarios') // Nome real da sua tabela de usuários
        .select('id')
        .eq('tipo_usuario', 'financeiro') // Filtra pelo tipo exato do print

      if (userError) throw userError

      if (financeiroUsers && financeiroUsers.length > 0) {
        targetUserIds = financeiroUsers.map(u => u.id)
      }

    } else if (payload.type === 'UPDATE' && payload.record.status === 'comprado' && payload.old_record?.status !== 'comprado') {
      // ✅ CASO 2: Mudou para "comprado" -> Envia de volta APENAS para o Comprador original (user_id)
      targetUserIds = [payload.record.user_id]
      tituloNotificacao = "✅ Solicitação Paga!"
      corpoNotificacao = `Sua solicitação "${payload.record.titulo}" foi concluída e marcada como comprada.`
    }

    // Se nenhuma regra de push bateu com o evento atual, encerra sem dar erro
    if (targetUserIds.length === 0) {
      console.log("ℹ️ Evento ignorado. Nenhum destinatário qualificado para receber push.")
      return new Response(JSON.stringify({ message: "Nenhum push necessário para este evento." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // 4. BUSCA AS INSCRIÇÕES DE PUSH DOS USUÁRIOS SELECIONADOS 🎯
    const { data: subscriptions, error: dbError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .in("user_id", targetUserIds) 

    if (dbError) throw dbError

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`⚠️ Nenhuma inscrição de push ativa encontrada para os alvos:`, targetUserIds)
      return new Response(JSON.stringify({ message: "Nenhum dispositivo cadastrado para os destinatários." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    const pushPayload = JSON.stringify({
      title: tituloNotificacao,
      body: corpoNotificacao,
      icon: "/favicon.ico"
    })

    // 6. Percorre os dispositivos filtrados e dispara o Push
    const disparos = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }
        }
        await webpush.sendNotification(pushSubscription, pushPayload)
        console.log(`✅ Push enviado com sucesso para o usuário: ${sub.user_id}`)
      } catch (err) {
        console.error(`❌ Falha ao enviar para o dispositivo ${sub.id}:`, err)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id)
          console.log(`🗑️ Inscrição antiga removida do banco: ${sub.id}`)
        }
      }
    })

    await Promise.all(disparos)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    console.error("❌ Erro na execução da Edge Function:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})