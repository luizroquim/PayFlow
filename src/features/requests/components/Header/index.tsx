import { LogOut,Plus  } from "lucide-react";
import icon from "../../../../assets/icon.ico";
import * as S from "./styles"; 
import { Button } from "../../components/UI";
interface HeaderProps {
  userEmail?: string;
  onNovaSolicitacao: () => void;
  onLogout: () => void;
}

export function Header({ userEmail, onNovaSolicitacao, onLogout }: HeaderProps) {
  return (
    <S.Header>
      <div className="brand-wrapper">
        <div className="logo-box">
          <img src={icon} alt="Logo" />
        </div>
        <h2>Gestão de Pagamentos</h2>
      </div>

      <div className="user-controls">
        <span className="user-email">{userEmail}</span>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onNovaSolicitacao}
        >
            <Plus size={14} />Nova Solicitação
        </Button>
        <button className="btn-logout" onClick={onLogout}>
          <LogOut size={19} />
        </button>
      </div>
    </S.Header>
  );
}