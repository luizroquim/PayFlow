import * as S from "./styles";

interface CamposPagamentoProps {
  formaPagamento: string;
  setFormaPagamento: (valor: string) => void;
  valor: string;
  setValor: (valor: string) => void;
  
  // Estados do PIX / Link de Pagamento
  tipoChavePix: string;
  setTipoChavePix: (valor: string) => void;
  chavePix: string;
  setChavePix: (valor: string) => void;

  // Estados da Transferência (TED/DOC)
  bancoTed: string;
  setBancoTed: (valor: string) => void;
  agenciaTed: string;
  setAgenciaTed: (valor: string) => void;
  contaTed: string;
  setContaTed: (valor: string) => void;
  cpfCnpjFavorecido: string;
  setCpfCnpjFavorecido: (valor: string) => void;
  nomeFavorecido: string;
  setNomeFavorecido: (valor: string) => void;
}

export function CamposPagamentoDinamicos({
  formaPagamento,
  setFormaPagamento,
  valor,
  setValor,
  tipoChavePix,
  setTipoChavePix,
  chavePix,
  setChavePix,
  bancoTed,
  setBancoTed,
  agenciaTed,
  setAgenciaTed,
  contaTed,
  setContaTed,
  cpfCnpjFavorecido,
  setCpfCnpjFavorecido,
  nomeFavorecido,
  setNomeFavorecido,
}: CamposPagamentoProps) {

  // 🪙 MÁSCARA DE MOEDA
  function handleValorChange(e: React.ChangeEvent<HTMLInputElement>) {
    const numStr = e.target.value.replace(/\D/g, "");
    if (!numStr) {
      setValor("");
      return;
    }
    const calculado = (Number(numStr) / 100).toFixed(2);
    let formatado = calculado.replace(".", ",");
    formatado = formatado.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    setValor("R$ " + formatado);
  }

  // 🛡️ MÁSCARA DINÂMICA CPF / CNPJ
  function aplicarCpfCnpj(v: string) {
    let valorLimpo = v.replace(/\D/g, "");
    if (valorLimpo.length <= 11) {
      valorLimpo = valorLimpo.replace(/(\d{3})(\d)/, "$1.$2");
      valorLimpo = valorLimpo.replace(/(\d{3})(\d)/, "$1.$2");
      valorLimpo = valorLimpo.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      valorLimpo = valorLimpo.substring(0, 14);
      valorLimpo = valorLimpo.replace(/^(\d{2})(\d)/, "$1.$2");
      valorLimpo = valorLimpo.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valorLimpo = valorLimpo.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valorLimpo = valorLimpo.replace(/(\d{4})(\d)/, "$1-$2");
    }
    return valorLimpo;
  }

  // MÁSCARA ESPECÍFICA DA CHAVE PIX
  function handleChavePixChange(e: React.ChangeEvent<HTMLInputElement>) {
    let inputVal = e.target.value;
    if (tipoChavePix === "cnpj_cpf") {
      inputVal = aplicarCpfCnpj(inputVal);
    } else if (tipoChavePix === "celular") {
      let digitos = inputVal.replace(/\D/g, "").substring(0, 11);
      digitos = digitos.replace(/^(\d{2})(\d)/g, "($1) $2");
      digitos = digitos.replace(/(\d{5})(\d)/, "$1-$2");
      inputVal = digitos;
    }
    setChavePix(inputVal);
  }

  // PLACEHOLDER DINÂMICO PIX
  function obterPlaceholderPix() {
    switch (tipoChavePix) {
      case "cnpj_cpf": return "CPF ou CNPJ";
      case "celular": return "(00) 90000-0000";
      case "email": return "nome@empresa.com";
      case "aleatoria": return "Chave EVP de 36 caracteres";
      case "copia_cola": return "Cole o código BR.GOV.PIX...";
      default: return "Digite a chave...";
    }
  }

  return (
    <>
      <S.GridDuplo>
        <S.GrupoInput>
          <label htmlFor="select-forma-pagamento">Forma de Pagamento</label>
          <select
            id="select-forma-pagamento"
            value={formaPagamento}
            onChange={(e) => {
              setFormaPagamento(e.target.value);
              setChavePix(""); // Limpa os campos secundários para evitar lixo eletrônico
            }}
          >
            <option value="">Selecione</option>
            <option value="boleto">Boleto</option>
            <option value="pix">PIX</option>
            <option value="transferencia">Transferência (TED/DOC)</option>
            <option value="link_pagamento">Link de Pagamento</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </S.GrupoInput>

        <S.GrupoInput>
          <label htmlFor="input-valor">Valor (R$)</label>
          <input
            id="input-valor"
            type="text"
            placeholder="R$ 0,00"
            value={valor}
            onChange={handleValorChange}
          />
        </S.GrupoInput>
      </S.GridDuplo>

      {/* CAMPO DINÂMICO PARA LINK DE PAGAMENTO */}
      {formaPagamento === "link_pagamento" && (
        <S.BlocoDinamicoAnimado>
          <S.GrupoInput>
            <label htmlFor="input-link-pagamento">URL do Link de Pagamento</label>
            <input
              id="input-link-pagamento"
              type="url"
              placeholder="https://link.mercadopago.com.br/..."
              value={chavePix}
              onChange={(e) => setChavePix(e.target.value)}
              required
            />
          </S.GrupoInput>
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "pix" && (
        <S.BlocoDinamicoAnimado>
          <S.GridPix>
            {/* 🎯 ADICIONADO: Input do Nome do Favorecido no topo do bloco PIX */}
            <div style={{ gridColumn: "1 / -1" }}>
              <S.GrupoInput>
                <label htmlFor="pix-nome-favorecido">Nome do Favorecido</label>
                <input
                  id="pix-nome-favorecido"
                  type="text"
                  placeholder="Nome completo ou Razão Social"
                  value={nomeFavorecido}
                  onChange={(e) => setNomeFavorecido(e.target.value)}
                  required
                />
              </S.GrupoInput>
            </div>

            <S.GrupoInput>
              <label htmlFor="select-tipo-pix">Tipo de Chave</label>
              <select
                id="select-tipo-pix"
                value={tipoChavePix}
                onChange={(e) => {
                  setTipoChavePix(e.target.value);
                  setChavePix("");
                }}
              >
                <option value="cnpj_cpf">CPF / CNPJ</option>
                <option value="celular">Celular</option>
                <option value="email">E-mail</option>
                <option value="aleatoria">Aleatória</option>
                <option value="copia_cola">Copia e Cola</option>
              </select>
            </S.GrupoInput>

            <S.GrupoInput>
              <label htmlFor="input-chave-pix">
                {tipoChavePix === "copia_cola" ? "Código Copia e Cola" : "Chave PIX"}
              </label>
              <input
                id="input-chave-pix"
                type="text"
                placeholder={obterPlaceholderPix()}
                value={chavePix}
                onChange={handleChavePixChange}
              />
            </S.GrupoInput>
          </S.GridPix>
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "transferencia" && (
        <S.BlocoDinamicoAnimado>
          <S.GridTedLinhaUm>
            <S.GrupoInput>
              <label htmlFor="ted-banco">Banco</label>
              <input
                id="ted-banco"
                type="text"
                placeholder="Ex: Itaú"
                value={bancoTed}
                onChange={(e) => setBancoTed(e.target.value)}
              />
            </S.GrupoInput>

            <S.GrupoInput>
              <label htmlFor="ted-agencia">Ag.</label>
              <input
                id="ted-agencia"
                type="text"
                placeholder="0001"
                value={agenciaTed}
                onChange={(e) => setAgenciaTed(e.target.value.replace(/\D/g, "").substring(0, 4))}
              />
            </S.GrupoInput>

            <S.GrupoInput>
              <label htmlFor="ted-conta">Conta Corrente</label>
              <input
                id="ted-conta"
                type="text"
                placeholder="12345-6"
                value={contaTed}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length > 1) v = v.replace(/(\d+)(\d{1})$/, "$1-$2");
                  setContaTed(v);
                }}
              />
            </S.GrupoInput>
          </S.GridTedLinhaUm>

          <S.GridTedLinhaDois>
            <S.GrupoInput>
              <label htmlFor="ted-favorecido-doc">CPF/CNPJ Favorecido</label>
              <input
                id="ted-favorecido-doc"
                type="text"
                placeholder="000.000.000-00"
                value={cpfCnpjFavorecido}
                onChange={(e) => setCpfCnpjFavorecido(aplicarCpfCnpj(e.target.value))}
              />
            </S.GrupoInput>

            <S.GrupoInput>
              <label htmlFor="ted-nome-titular">Nome do Favorecido / Titular</label>
              <input
                id="ted-nome-titular"
                type="text"
                placeholder="Nome completo ou Razão Social"
                value={nomeFavorecido}
                onChange={(e) => setNomeFavorecido(e.target.value)}
              />
            </S.GrupoInput>
          </S.GridTedLinhaDois>
        </S.BlocoDinamicoAnimado>
      )}
    </>
  );
}