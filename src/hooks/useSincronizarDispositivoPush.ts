// src/hooks/useSincronizarDispositivoPush.ts
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
  
  // 🎯 EVOLUÇÃO DA TRAVA: Guarda o endpoint E o userId que sincronizou por último nesta sessão
  const ultimaSincronizacao = useRef<{ endpoint: string; userId: string } | null>(null);

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

        const existingSubscription = await activeReg.pushManager.getSubscription();
        
        let subscription = existingSubscription;

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

        // 🎯 O FILTRO DE LOOP: Só bloqueia se for o mesmo endpoint E o mesmo usuário
        if (
          ultimaSincronizacao.current?.endpoint === subJson.endpoint &&
          ultimaSincronizacao.current?.userId === userId
        ) {
          return;
        }

        if (!isCurrentRequestActive) return;

        console.log("🔄 [SINC] Executando sincronização atômica via RPC no Supabase...");
        
        // 🚀 AQUI ESTÁ A MUDANÇA: Substitui o .delete().insert() pela chamada da RPC segura
        const { error } = await supabase.rpc("sincronizar_dispositivo_push_seguro", {
          p_user_id: userId,
          p_endpoint: subJson.endpoint,
          p_p256dh: subJson.keys?.p256dh || null,
          p_auth: subJson.keys?.auth || null,
        });

        if (error) {
          console.error("❌ [SINC] Erro crítico na transação do Supabase:", error.message);
        } else {
          // 🎯 Atualiza a referência para travar loops locais
          ultimaSincronizacao.current = { endpoint: subJson.endpoint, userId };
          console.log("💾 [SINC] Dispositivo sincronizado com sucesso absoluto via RPC!");
        }
      } catch (error) {
        console.error("❌ [SINC ERROR] Falha na sincronização agressiva:", error);
      }
    };

    sincronizarForcado();

    return () => {
      isCurrentRequestActive = false;
    };
  }, [userId]);
}