import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

export function useSincronizarDispositivoPush(userId: string | undefined) {
  
  const ultimoEndpointSincronizado = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || !("serviceWorker" in navigator) || !("Notification" in window)) return;

    let isCurrentRequestActive = true;

    const sincronizarForcado = async () => {
      try {
        if (Notification.permission !== "granted") {
          console.log("ℹ️ [SINC] Permissão de notificação não concedida ainda. Ignorando sincronização.");
          return;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        const activeReg = registrations.find(r => r.active && r.active.scriptURL.includes("sw.js"));

        if (!activeReg) {
          console.log("⚠️ [SINC] Service Worker ativo não localizado para sincronização.");
          return;
        }

        // Busca a inscrição de push atual no navegador
        const existingSubscription = await activeReg.pushManager.getSubscription();
        
        let subscription = existingSubscription;

        // Se não existir ou se a chave mudou, faz uma nova inscrição
        if (!subscription) {
          console.log("🔄 [SINC] Gerando nova inscrição de push diretamente no Service Worker...");
          subscription = await activeReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY || ""),
          });
        }

        const subJson = subscription.toJSON();

        if (!subJson.endpoint) {
          console.warn("⚠️ [SINC] Endpoint de push inválido gerado pelo navegador.");
          return;
        }

       
        if (ultimoEndpointSincronizado.current === subJson.endpoint) {
          return;
        }

        if (!isCurrentRequestActive) return;

        console.log("🔄 [SINC] Renovando/Buscando token de push diretamente no Service Worker...");
        console.log(`🗑️ [SINC] Removendo vínculos anteriores deste dispositivo...`);
        
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subJson.endpoint);

        if (!isCurrentRequestActive) return;

        console.log(`🎯 [SINC] Criando novo vínculo definitivo para o usuário atual: ${userId}`);
        const { error } = await supabase
          .from("push_subscriptions")
          .insert([
            {
              user_id: userId,
              endpoint: subJson.endpoint,
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
            }
          ]);

        if (error) {
          console.error("❌ [SINC] Erro crítico ao sincronizar no Supabase:", error.message);
        } else {
          // 🎯 SALVA NA REFERÊNCIA: Bloqueia qualquer execução futura idêntica até o app fechar ou deslogar
          ultimoEndpointSincronizado.current = subJson.endpoint;
          console.log("💾 [SINC] Dispositivo sincronizado com sucesso absoluto!");
        }
      } catch (error) {
        console.error("❌ [SINC ERROR] Falha na sincronização agressiva:", error);
      }
    };

    sincronizarForcado();

    return () => {
      isCurrentRequestActive = false;
    };
  }, [userId]); // Deixamos o userId seguro agora
}