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
    user_id: string; // ID do comprador que criou a solicitação
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

    let targetUserIds: string[] = []
    let tituloNotificacao = "PayFlow"
    let corpoNotificacao = `A solicitação "${payload.record.titulo}" foi atualizada.`

    // ========================================================
    // 🎯 AJUSTE DAS REGRAS COM BASE NOS PRINTS REAIS
    // ========================================================
    
    if (payload.type === 'INSERT') {
      // 🛒 CASO 1: Comprador cria a solicitação -> Envia para quem tem funcao = 'pagador'
      tituloNotificacao = "🛒 Nova Solicitação!"
      corpoNotificacao = `Uma nova solicitação aguarda pagamento: ${payload.record.titulo}`

      // 🟢 CORRIGIDO: Tabela 'perfis', coluna 'funcao', valor 'pagador'
      const { data: pagadores, error: userError } = await supabase
        .from('perfis') 
        .select('id')
        .eq('funcao', 'pagador') 

      if (userError) throw userError

      if (pagadores && pagadores.length > 0) {
        targetUserIds = pagadores.map(p => p.id)
      }

    } else if (payload.type === 'UPDATE' && payload.record.status === 'comprado' && payload.old_record?.status !== 'comprado') {
      // ✅ CASO 2: Mudou para "comprado" -> Envia EXCLUSIVAMENTE para o Comprador (user_id)
      targetUserIds = [payload.record.user_id]
      tituloNotificacao = "✅ Solicitação Paga!"
      corpoNotificacao = `Sua solicitação "${payload.record.titulo}" foi concluída e marcada como comprada.`
    }

    // Se o evento não se encaixar em nenhuma regra, para aqui
    if (targetUserIds.length === 0) {
      console.log("ℹ️ Nenhuma ação de push necessária para esta alteração.")
      return new Response(JSON.stringify({ message: "Nenhum push necessário para este evento." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // 4. BUSCA AS INSCRIÇÕES APENAS DOS USUÁRIOS CHANCELADOS
    const { data: subscriptions, error: dbError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .in("user_id", targetUserIds) 

    if (dbError) throw dbError

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`⚠️ Nenhuma inscrição de push ativa para os IDs:`, targetUserIds)
      return new Response(JSON.stringify({ message: "Nenhum dispositivo cadastrado." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    const pushPayload = JSON.stringify({
      title: tituloNotificacao,
      body: corpoNotificacao,
      icon: "/favicon.ico"
    })

    const disparos = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }
        }
        await webpush.sendNotification(pushSubscription, pushPayload)
        console.log(`✅ Push enviado para o usuário: ${sub.user_id}`)
      } catch (err) {
        console.error(`❌ Falha no dispositivo ${sub.id}:`, err)
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id)
        }
      }
    })

    await Promise.all(disparos)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})