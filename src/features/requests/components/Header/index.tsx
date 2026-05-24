import { LogOut, Plus } from "lucide-react";
import icon from "../../../../assets/icon.ico";
import * as S from "./styles"; 
import { Button } from "../../components/UI";

interface HeaderProps {
  userEmail?: string;
  onNovaSolicitacao: () => void;
  onLogout: () => void;
}

export function Header({ userEmail, onNovaSolicitacao, onLogout }: HeaderProps) {
  
  // Função pura interna para extrair a primeira letra do e-mail de forma segura
  const obterInicial = (email?: string) => {
    if (!email) return "U";
    return email.trim().charAt(0);
  };

  return (
    <S.Header>
      <div className="brand-wrapper">
        <div className="logo-box">
          <img src={icon} alt="Logo" />
        </div>
        {/* Sumirá de telas menores automaticamente via Media Query */}
        <h2>Gestão de Pagamentos</h2>
      </div>

      <div className="user-controls">
        {/* Desktop: Mostra e-mail por extenso */}
        <span className="user-email" title={userEmail}>
          {userEmail}
        </span>
        
        {/* Mobile: Substitui o e-mail por um círculo minimalista com a inicial */}
        <div className="user-avatar" title={`Usuário logado: ${userEmail}`}>
          {obterInicial(userEmail)}
        </div>

        <Button 
          variant="primary" 
          size="sm" 
          onClick={onNovaSolicitacao}
        >
          <Plus size={14} /> Nova Solicitação
        </Button>
        
        <button className="btn-logout" onClick={onLogout} title="Sair do Sistema">
          <LogOut size={19} />
        </button>
      </div>
    </S.Header>
  );
}