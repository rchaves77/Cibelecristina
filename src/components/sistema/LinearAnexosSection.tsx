import React, { useState, useRef } from 'react';
import {
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  Download
} from 'lucide-react';
import { AnexoProntuario, Paciente } from '../../types/clinical';
import { clinicalDb } from '../../services/clinicalDatabase';

interface LinearAnexosSectionProps {
  paciente: Paciente;
  anexos: AnexoProntuario[];
  currentUserNome: string;
  onAnexoUpdated: () => void;
  onViewAnexo: (anx: AnexoProntuario) => void;
}

export const LinearAnexosSection: React.FC<LinearAnexosSectionProps> = ({
  paciente,
  anexos,
  currentUserNome,
  onAnexoUpdated,
  onViewAnexo
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [novoAnexo, setNovoAnexo] = useState<{
    arquivoNome: string;
    titulo: string;
    categoria: AnexoProntuario['categoria'];
    dataRealizacao: string;
    observacoes: string;
    tamanhoFormatado: string;
    previewUrl?: string;
    tipoMime: string;
  }>({
    arquivoNome: '',
    titulo: '',
    categoria: 'Exame Laboratorial',
    dataRealizacao: new Date().toISOString().split('T')[0],
    observacoes: '',
    tamanhoFormatado: '450 KB',
    tipoMime: 'application/pdf'
  });

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleProcessFile = (file: File) => {
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    let categoria: AnexoProntuario['categoria'] = 'Exame Laboratorial';
    const lower = file.name.toLowerCase();
    if (lower.includes('ecg') || lower.includes('eletro')) categoria = 'Eletrocardiograma (ECG)';
    else if (lower.includes('laudo') || lower.includes('raio') || lower.includes('tc') || lower.includes('ressonancia') || lower.includes('ultra')) categoria = 'Laudo de Imagem';
    else if (lower.includes('foto') || lower.includes('lesao') || lower.includes('pele') || lower.includes('ouvido') || lower.includes('otoscopia')) categoria = 'Foto Clínica / Lesão';
    else if (lower.includes('externo')) categoria = 'Laudo de Imagem';

    // Cria título sugerido a partir do nome limpo do arquivo
    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    setNovoAnexo({
      arquivoNome: file.name,
      titulo: cleanTitle,
      categoria,
      dataRealizacao: new Date().toISOString().split('T')[0],
      observacoes: '',
      tamanhoFormatado: sizeStr,
      previewUrl,
      tipoMime: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')
    });

    setIsFormOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSalvarAnexo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAnexo.arquivoNome) return;

    clinicalDb.saveAnexo({
      paciente_id: paciente.id,
      nome_arquivo: novoAnexo.titulo ? `${novoAnexo.titulo} (${novoAnexo.arquivoNome})` : novoAnexo.arquivoNome,
      categoria: novoAnexo.categoria,
      tamanho_formatado: novoAnexo.tamanhoFormatado,
      tipo_mime: novoAnexo.tipoMime,
      enviado_por: currentUserNome,
      observacoes: novoAnexo.observacoes.trim() || undefined
    });

    setFeedback(`Anexo "${novoAnexo.titulo || novoAnexo.arquivoNome}" adicionado com sucesso ao prontuário!`);
    setTimeout(() => setFeedback(null), 4000);

    setNovoAnexo({
      arquivoNome: '',
      titulo: '',
      categoria: 'Exame Laboratorial',
      dataRealizacao: new Date().toISOString().split('T')[0],
      observacoes: '',
      tamanhoFormatado: '450 KB',
      tipoMime: 'application/pdf'
    });
    setIsFormOpen(false);
    onAnexoUpdated();
  };

  const handleDelete = (anx: AnexoProntuario) => {
    if (window.confirm(`Deseja remover o anexo "${anx.nome_arquivo}" deste paciente?`)) {
      clinicalDb.deleteAnexo(anx.id);
      setFeedback('Anexo excluído com sucesso.');
      setTimeout(() => setFeedback(null), 3000);
      onAnexoUpdated();
    }
  };

  return (
    <div id="secao-anexos" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#1A3C34] text-white flex items-center justify-center font-bold shadow-xs">
            <Paperclip size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                Passo 4 do Atendimento
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              ANEXOS DE EXAMES, LAUDOS E FOTOS CLÍNICAS ({anexos.length})
            </h2>
            <p className="text-xs text-stone-500">
              Arraste e solte arquivos PDF, JPG ou PNG para enriquecer o prontuário do paciente
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            if (!isFormOpen) {
              fileInputRef.current?.click();
            }
          }}
          className="px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all shrink-0"
        >
          <Upload size={14} />
          <span>+ Anexar Novo Arquivo</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ÁREA DE DRAG AND DROP */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#1A3C34] bg-emerald-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-[#1A3C34] bg-stone-50/80 hover:bg-stone-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf,image/png,image/jpeg,image/webp"
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mx-auto text-[#1A3C34] shadow-xs">
            <Upload size={22} className={isDragging ? 'animate-bounce' : ''} />
          </div>
          <h3 className="font-serif font-bold text-sm text-stone-800">
            {isDragging ? 'Solte o arquivo aqui para anexar' : 'Arraste e solte arquivos aqui, ou clique para navegar'}
          </h3>
          <p className="text-xs text-stone-500">
            Formatos suportados: <strong>PDF, JPG, PNG</strong> (Exames laboratoriais, fotos de lesões/otoscopia, laudos e ECG).
          </p>
        </div>
      </div>

      {/* FORMULÁRIO DE CATEGORIZAÇÃO NO ENVIO */}
      {isFormOpen && novoAnexo.arquivoNome && (
        <form onSubmit={handleSalvarAnexo} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
            <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#C5A059]" />
              Categorização do Arquivo: {novoAnexo.arquivoNome} ({novoAnexo.tamanhoFormatado})
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* TÍTULO DO DOCUMENTO */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Título do Documento *
              </label>
              <input
                type="text"
                required
                value={novoAnexo.titulo}
                onChange={(e) => setNovoAnexo({ ...novoAnexo, titulo: e.target.value })}
                placeholder="ex: Hemograma Completo, Raio-X de Tórax, Otoscopia"
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>

            {/* TIPO / CATEGORIA */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Tipo de Anexo *
              </label>
              <select
                value={novoAnexo.categoria}
                onChange={(e) => setNovoAnexo({ ...novoAnexo, categoria: e.target.value as any })}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34] cursor-pointer"
              >
                <option value="Exame Laboratorial">Exame Laboratorial</option>
                <option value="Laudo de Imagem">Exame de Imagem (Raio-X, TC, RM, USG)</option>
                <option value="Eletrocardiograma (ECG)">Eletrocardiograma (ECG)</option>
                <option value="Foto Clínica / Lesão">Foto Clínica / Otoscopia / Lesão</option>
                <option value="Documento / Termo">Laudo Externo / Documento</option>
              </select>
            </div>

            {/* DATA DE REALIZAÇÃO */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Data de Realização do Exame *
              </label>
              <input
                type="date"
                required
                value={novoAnexo.dataRealizacao}
                onChange={(e) => setNovoAnexo({ ...novoAnexo, dataRealizacao: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Observações Médicas do Resultado (opcional)
            </label>
            <input
              type="text"
              value={novoAnexo.observacoes}
              onChange={(e) => setNovoAnexo({ ...novoAnexo, observacoes: e.target.value })}
              placeholder="ex: Hemoglobina 13.8, leucócitos normais, glicemia de jejum 94 mg/dL..."
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200/80">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs text-stone-600 hover:bg-stone-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1A3C34] text-white text-xs font-bold shadow-xs hover:bg-[#142E28]"
            >
              Salvar Anexo no Prontuário
            </button>
          </div>
        </form>
      )}

      {/* GALERIA / LISTA DE ANEXOS */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-stone-700 uppercase tracking-wider">
          Arquivos Anexados ({anexos.length})
        </h3>

        {anexos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {anexos.map((anx) => {
              const isImage = anx.tipo_mime?.startsWith('image/') ||
                anx.nome_arquivo.endsWith('.jpg') ||
                anx.nome_arquivo.endsWith('.png') ||
                anx.nome_arquivo.endsWith('.jpeg');

              return (
                <div
                  key={anx.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3 hover:border-stone-300 transition-all shadow-2xs group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-2xs">
                      {isImage ? (
                        <ImageIcon size={20} className="text-emerald-700" />
                      ) : (
                        <FileText size={20} className="text-blue-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-stone-900 truncate" title={anx.nome_arquivo}>
                        {anx.nome_arquivo}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-700">
                          {anx.categoria}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {anx.tamanho_formatado || '450 KB'}
                        </span>
                      </div>
                      {anx.observacoes && (
                        <p className="text-[11px] text-stone-600 mt-1.5 line-clamp-2">
                          {anx.observacoes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-200/60">
                    <span className="flex items-center gap-1 text-[10px]">
                      <Calendar size={11} /> {new Date(anx.data_upload).toLocaleDateString('pt-BR')}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewAnexo(anx)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-[#1A3C34] text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
                      >
                        <Eye size={12} />
                        <span>Visualizar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(anx)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg"
                        title="Excluir anexo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic py-3">
            Nenhum exame, foto clínica ou documento anexado ao prontuário deste paciente ainda.
          </p>
        )}
      </div>
    </div>
  );
};
