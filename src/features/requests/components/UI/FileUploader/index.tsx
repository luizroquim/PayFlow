import { memo } from "react";
import { FileText } from "lucide-react";
import * as S from "./styles"; // Certifique-se de importar os estilos que extraímos

interface FileUploaderProps {
  anexoExistenteUrl: string | null | undefined;
  arquivoBoleto: File | null | undefined;
  nomeAnexo: string;
  onRemoverAnexo: () => void;
  onRemoverNovoArquivo: (e: React.MouseEvent) => void;
  onUploadArquivo: (file: File) => void;
}

export const FileUploader = memo(function FileUploader({
  anexoExistenteUrl,
  arquivoBoleto,
  nomeAnexo,
  onRemoverAnexo,
  onRemoverNovoArquivo,
  onUploadArquivo,
}: FileUploaderProps) {
    const url = anexoExistenteUrl ?? "";
  return (

    
    <S.InputGroup>
      <label>Anexar Boleto ou Orçamento (PDF/Imagem)</label>

      {url ? (
        <S.AnexoEditContainer>
          <S.NomeArquivo onClick={() => window.open(url, "_blank")}>
            <S.IconInline>
              <FileText size={18} color="#64748b" />
            </S.IconInline>
            <span>{nomeAnexo}</span>
          </S.NomeArquivo>
          <S.BtnTextoRemover type="button" onClick={onRemoverAnexo}>
            Remover
          </S.BtnTextoRemover>
        </S.AnexoEditContainer>
      ) : (
        <S.AnexoNovoContainer>
          <S.LabelAnexoCustomizado htmlFor="upload-boleto-nova-solicitacao">
            <S.TextoPlaceholder>
              {arquivoBoleto ? (
                <S.NomeArquivoNovo>
                  <S.IconInline>
                    <FileText size={18} color="#1e293b" />
                  </S.IconInline>
                  <S.TextoNomeFiltrado>{arquivoBoleto.name}</S.TextoNomeFiltrado>
                </S.NomeArquivoNovo>
              ) : (
                "Nenhum arquivo anexado..."
              )}
            </S.TextoPlaceholder>

            {arquivoBoleto ? (
              <S.BtnLimparArquivoNovo type="button" onClick={onRemoverNovoArquivo}>
                Remover
              </S.BtnLimparArquivoNovo>
            ) : (
              <S.BtnTextoAzulNativo>Anexar Arquivo</S.BtnTextoAzulNativo>
            )}
          </S.LabelAnexoCustomizado>

          <S.InputFileInvisivel
            id="upload-boleto-nova-solicitacao"
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onUploadArquivo(e.target.files[0]);
              }
            }}
          />
        </S.AnexoNovoContainer>
      )}
    </S.InputGroup>
  );
});