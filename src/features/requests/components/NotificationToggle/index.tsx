// src/features/requests/components/NotificationToggle/index.tsx
import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { usePushNotifications } from "../../../../hooks/usePushNotifications";
import { supabase } from "../../../../lib/supabase"; // 🎯 Importando a conexão do Supabase
import * as S from "./styles";

export function NotificationToggle() {
  const { solicitarPermissaoEInscrever } = usePushNotifications();

  // Inicializa o estado lendo direto da API do navegador
  const [statusPermissao, setStatusPermissao] =
    useState<NotificationPermission>(() => {
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission;
      }
      return "default";
    });

  const [carregando, setCarregando] = useState(false);

  // 🗄️ FUNÇÃO PARA SALVAR OS DADOS NA SUA TABELA DO SUPABASE (COM LOGS DE AUDITORIA)
  const salvarInscricaoNoBanco = async (subscription: PushSubscription) => {
    try {
      console.log("🔍 [AUDITORIA 1] Buscando sessão ativa no Supabase...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("❌ [AUDITORIA ERROR] Erro ao buscar sessão:", sessionError);
      }

      if (!session?.user) {
        console.warn("⚠️ [AUDITORIA 2] Abortando: Nenhum usuário autenticado foi encontrado na sessão deste componente.");
        return;
      }

      console.log("🔍 [AUDITORIA 3] Usuário encontrado:", session.user.email, "Iniciando conversão do JSON...");
      const subJson = subscription.toJSON();

      const payload = {
        user_id: session.user.id,
        endpoint: subJson.endpoint,
        p256dh: subJson.keys?.p256dh,
        auth: subJson.keys?.auth,
      };

      console.log("🔍 [AUDITORIA 4] Enviando payload para o Supabase...", payload);

      const { error } = await supabase
        .from("push_subscriptions")
        .insert([payload]);

      if (error) {
        throw error;
      }

      console.log("💾 [SUCESSO BANCO] Dispositivo registrado com sucesso no banco do Supabase!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      console.error("❌ [AUDITORIA ERRO CRÍTICO] Falha no try/catch do banco:", error);
      alert(`Notificação ativada, mas falhou ao sincronizar com o banco: ${errorMessage}`);
    }
  };

  const handleAtivarNotificacoes = async () => {
    setCarregando(true);
    console.log("Iniciando fluxo de permissão de Push...");

    const subscription = await solicitarPermissaoEInscrever();

    if (subscription) {
      console.log("--- SUCESSO NO FRONT-END ---");
      console.log(JSON.stringify(subscription, null, 2));

      // 🚀 CONEXÃO ATIVA: Envia a assinatura para persistir na tabela push_subscriptions
      await salvarInscricaoNoBanco(subscription);

      // Atualiza o estado para 'granted', o que vai fazer o componente sumir imediatamente
      setStatusPermissao("granted");
    } else {
      if ("Notification" in window) {
        setStatusPermissao(Notification.permission);
      }
    }
    setCarregando(false);
  };

  // 🛡️ REGRA ARQUITETURAL: Se o usuário já aceitou, não renderiza NADA na tela (retorna null)
  if (statusPermissao === "granted") {
    return null;
  }

  return (
    <S.CardContainer>
      <S.HeaderArea>
        <BellOff size={22} />
        <S.Title>Alertas do Sistema</S.Title>
      </S.HeaderArea>

      <S.Description>
        Ative as notificações para receber avisos instantâneos sobre o andamento
        dos seus pagamentos e cobranças.
      </S.Description>

      <S.ActionButton onClick={handleAtivarNotificacoes} disabled={carregando}>
        {carregando ? (
          "Configurando..."
        ) : (
          <>
            <Bell size={16} /> Ativar Notificações
          </>
        )}
      </S.ActionButton>
    </S.CardContainer>
  );
}