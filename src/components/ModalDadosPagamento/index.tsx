import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import * as S from "./styles";

// 🎯 IMPORTANDO O TIPO EXATO DO DASHBOARD PARA ACABAR COM O CONFLITO
import type { Solicitacao } from "../../pages/Dashboard";

interface ModalDadosPagamentoProps {
  // O Partial faz com que a modal aceite o objeto completo da Dashboard com segurança
  solicitacao: Partial<Solicitacao> & {
    forma_pagamento?: string | null;
    valor?: string | null;
    pix_tipo?: string | null;
    pix_chave?: string | null;
    ted_banco?: string | null;
    ted_agencia?: string | null;
    ted_conta?: string | null;
    ted_cpf_cnpj?: string | null;
    ted_favorecido?: string | null;
  };
}

function CampoCopiavel({ label, valor }: { label: string; valor: string }) {
  const [copiado, setCopiado] = useState(false);

  function handleCopy() {
    if (!valor || valor === "Não informado") return;

    let valorParaCopiar = valor;

    const ehEmail = valor.includes("@");
    const ehLinkOrUrl =
      valor.startsWith("http://") || valor.startsWith("https://");
    const ehChaveAleatoria = valor.length === 36 && valor.includes("-");

    if (
      !ehEmail &&
      !ehLinkOrUrl &&
      (!ehChaveAleatoria || label !== "Chave PIX")
    ) {
      valorParaCopiar = valor.replace(/\D/g, "");
    }

    navigator.clipboard.writeText(valorParaCopiar);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  return (
    <S.LinhaCopiavel>
      <label>{label}</label>
      <div className="wrapper-input">
        <input type="text" value={valor} readOnly onClick={handleCopy} />
        {copiado && <S.AlertaCopiado>Copiado!</S.AlertaCopiado>}
        <button
          type="button"
          className="btn-copy"
          onClick={handleCopy}
          title="Copiar"
        >
          {copiado ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
        </button>
      </div>
    </S.LinhaCopiavel>
  );
}

export function ModalDadosPagamento({ solicitacao }: ModalDadosPagamentoProps) {
  const forma_pagamento = solicitacao.forma_pagamento ?? undefined;
  const pix_chave = solicitacao.pix_chave ?? undefined;
  const pix_tipo = solicitacao.pix_tipo ?? undefined;
  const ted_banco = solicitacao.ted_banco ?? undefined;
  const ted_agencia = solicitacao.ted_agencia ?? undefined;
  const ted_conta = solicitacao.ted_conta ?? undefined;
  const ted_cpf_cnpj = solicitacao.ted_cpf_cnpj ?? undefined;
  const ted_favorecido = solicitacao.ted_favorecido ?? undefined;

  function obterNomeForma() {
    switch (forma_pagamento) {
      case "pix":
        return "Dados do PIX";
      case "transferencia":
        return "Dados Bancários (TED/DOC)";
      case "link_pagamento":
        return "Link de Pagamento";
      default:
        return "Informações de Pagamento";
    }
  }

  return (
    <S.WrapperModalPagamento>
      <h3 className="titulo-modal-pagamento">{obterNomeForma()}</h3>
      <p className="descricao-modal-pagamento">
        Clique no campo ou no ícone para copiar os dados limpos direto para o
        aplicativo do banco.
      </p>

      <S.ContainerDados>
        {solicitacao.valor && (
          <CampoCopiavel label="Valor do Pagamento" valor={solicitacao.valor} />
        )}

        {/* MÓDULO: LINK DE PAGAMENTO */}
        {forma_pagamento === "link_pagamento" && pix_chave && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <CampoCopiavel label="Link para copiar" valor={pix_chave} />
            <a
              href={pix_chave}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.9rem",
                color: "#0284c7",
                fontWeight: 600,
                textDecoration: "none",
                marginTop: "4px",
              }}
            >
              Abrir link em nova aba <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* MÓDULO: PIX */}
        {forma_pagamento === "pix" && (
          <S.GridPix>
            {/* 🎯 ADICIONADO: Nome do Favorecido ocupando toda a largura da linha no Grid */}
            <div style={{ gridColumn: "1 / -1" }}>
              <CampoCopiavel
                label="Nome do Favorecido"
                valor={ted_favorecido || "Não informado"}
              />
            </div>

            <S.LinhaCopiavel>
              <label>Tipo de Chave</label>
              <input
                type="text"
                value={
                  pix_tipo === "cnpj_cpf"
                    ? "CPF / CNPJ"
                    : pix_tipo === "copia_cola"
                      ? "Copia e Cola"
                      : pix_tipo || ""
                }
                readOnly
              />
            </S.LinhaCopiavel>
            <CampoCopiavel
              label={pix_tipo === "copia_cola" ? "Código Pix" : "Chave PIX"}
              valor={pix_chave || ""}
            />
          </S.GridPix>
        )}

        {/* MÓDULO: TED / DOC */}
        {forma_pagamento === "transferencia" && (
          <>
            <CampoCopiavel
              label="Nome do Favorecido"
              valor={ted_favorecido || ""}
            />
            <CampoCopiavel
              label="CPF / CNPJ do Favorecido"
              valor={ted_cpf_cnpj || ""}
            />

            <S.GridTedLinhaUm>
              <CampoCopiavel label="Banco" valor={ted_banco || ""} />
              <CampoCopiavel label="Agência" valor={ted_agencia || ""} />
              <CampoCopiavel label="Conta" valor={ted_conta || ""} />
            </S.GridTedLinhaUm>
          </>
        )}
      </S.ContainerDados>
    </S.WrapperModalPagamento>
  );
}
