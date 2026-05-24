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
    user_id?: string; // ID do dono da solicitação
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
    // 1. Configura as chaves VAPID que você salvou nos secrets do Supabase
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

    // 2. Lê os dados enviados pelo Webhook do Banco de Dados
    const payload: WebhookPayload = await req.json()
    console.log("🔔 Webhook acionado para a tabela:", payload.table)

    // 3. Inicializa o cliente do Supabase interno da função para buscar os tokens
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 4. Busca todos os dispositivos ativos cadastrados para receber notificações
    // (Para testar de forma simples, vamos buscar TODOS os registros)
    const { data: subscriptions, error: dbError } = await supabase
      .from("push_subscriptions")
      .select("*")

    if (dbError) throw dbError

    if (!subscriptions || subscriptions.length === 0) {
      console.log("⚠️ Nenhuma inscrição de push encontrada no banco.")
      return new Response(JSON.stringify({ message: "Nenhum dispositivo cadastrado." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // 5. Prepara a mensagem baseada no evento do banco
    let tituloNotificacao = "Sistema de Compras"
    let corpoNotificacao = `A solicitação "${payload.record.titulo}" sofreu alterações.`

    if (payload.type === 'INSERT') {
      tituloNotificacao = "🛒 Nova Solicitação!"
      corpoNotificacao = `Uma nova solicitação foi criada: ${payload.record.titulo}`
    } else if (payload.type === 'UPDATE') {
      tituloNotificacao = "🔄 Status Atualizado!"
      corpoNotificacao = `A solicitação "${payload.record.titulo}" mudou para: ${payload.record.status}`
    }

    const pushPayload = JSON.stringify({
      title: tituloNotificacao,
      body: corpoNotificacao,
      icon: "/icon-192x192.png" // Caminho do ícone do seu app Vite se houver
    })

    // 6. Percorre os dispositivos e dispara o Push de verdade!
    const disparos = subscriptions.map(async (sub) => {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }
        await webpush.sendNotification(pushSubscription, pushPayload)
        console.log(`✅ Push enviado com sucesso para o usuário: ${sub.user_id}`)
      } catch (err) {
        console.error(`❌ Falha ao enviar para o dispositivo ${sub.id}:`, err)
        // Opcional: Se o token expirou ou é inválido, deleta do banco para limpar a tabela
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