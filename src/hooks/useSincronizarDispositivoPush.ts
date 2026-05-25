// src/hooks/useSincronizarDispositivoPush.ts
import { useEffect } from "react";
import { supabase } from "../lib/supabase"; // 🎯 Ajuste o caminho relativo do seu cliente Supabase

export function useSincronizarDispositivoPush(userId: string | undefined) {
  useEffect(() => {
    // 🛡️ Guard Clauses: Só roda se houver usuário autenticado e suporte a Service Worker
    if (!userId || !("serviceWorker" in navigator)) return;

    const sincronizarAparelhoInbackground = async () => {
      try {
        console.log("🔄 [SILENCIOSO] Verificando tokens de push ativos para alinhar proprietário...");
        
        // 1. Captura as inscrições do Service Worker unificado do PWA
        const registrations = await navigator.serviceWorker.getRegistrations();
        const activeReg = registrations.find(r => 
          r.active && r.active.scriptURL.includes("sw.js")
        );

        if (!activeReg) {
          console.log("ℹ️ [SILENCIOSO] Nenhum Service Worker do PWA ativo neste momento.");
          return;
        }

        // 2. Pega a assinatura/token criptográfico atual desse navegador
        const subscription = await activeReg.pushManager.getSubscription();

        if (subscription) {
          const subJson = subscription.toJSON();
          
          console.log(`🎯 [SILENCIOSO] Token de push localizado! Forçando UPSERT para o usuário atual: ${userId}`);
          
          // 3. Executa o UPSERT. Se outra conta usou esse PC antes, o banco reescreve o user_id agora!
          const { error } = await supabase
            .from("push_subscriptions")
            .upsert(
              {
                user_id: userId,
                endpoint: subJson.endpoint,
                p256dh: subJson.keys?.p256dh,
                auth: subJson.keys?.auth,
              },
              { onConflict: "endpoint" } // Garante que a chave de verificação seja o link único do navegador
            );

          if (error) {
            console.error("❌ [SILENCIOSO] Erro ao executar upsert no Supabase:", error.message);
          } else {
            console.log("💾 [SILENCIOSO] Vínculo de dispositivo auto-corrigido e atualizado com sucesso!");
          }
        } else {
          console.log("ℹ️ [SILENCIOSO] Este dispositivo ainda não possui nenhuma permissão ou token gerado.");
        }
      } catch (error) {
        console.error("❌ [SILENCIOSO ERROR] Falha crítica na sincronização automática em background:", error);
      }
    };

    // Dispara a verificação imediatamente ao carregar a sessão ou mudar de usuário
    sincronizarAparelhoInbackground();
  }, [userId]); // 🔥 Roda automaticamente SEMPRE que o userId mudar (troca de conta)
}