import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  BookmarkPlus,
  Sparkles,
  Search,
  User,
  CheckCircle2,
  Copy,
  Printer,
  ChevronDown,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, PrescricaoItem, PrescricaoTemplate } from '../../types/clinical';
import { generatePrescricaoPdf } from '../../utils/pdfGenerator';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const PrescricoesPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [templates, setTemplates] = useState<PrescricaoTemplate[]>([]);
  const [selectedPacienteId, setSelectedPacienteId] = useState<number>(0);
  const [pacienteAvulsoNome, setPacienteAvulsoNome] = useState('');
  
  const [tipoDocumento, setTipoDocumento] = useState<'Receita Médica' | 'Pedido de Exames' | 'Plano de Cuidado'>('Receita Médica');
  const [itens, setItens] = useState<PrescricaoItem[]>([
    {
      id: 'item-1',
      tipo: 'medicamento',
      nome: 'Cerumin gotas otológicas',
      posologia_ou_instrucao: 'Instilar 3 a 5 gotas no ouvido afetado, 3x ao dia por 4 dias.',
      quantidade: '1 frasco',
      via: 'Otológica'
    }
  ]);
  const [observacoes, setObservacoes] = useState('Manter repouso de 5 minutos com a cabeça inclinada após aplicação.');

  // Salvar Novo Template
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [novoTemplateTitulo, setNovoTemplateTitulo] = useState('');
  const [novoTemplateCategoria, setNovoTemplateCategoria] = useState<PrescricaoTemplate['categoria']>('Geral');

  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    setPacientes(clinicalDb.getPacientes());
    setTemplates(clinicalDb.getPrescricaoTemplates());
    if (clinicalDb.getPacientes().length > 0) {
      setSelectedPacienteId(clinicalDb.getPacientes()[0].id);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Carregar Template
  const handleLoadTemplate = (template: PrescricaoTemplate) => {
    setItens(JSON.parse(JSON.stringify(template.itens)));
    setObservacoes(template.observacoes_padrao || '');
    if (template.itens.some(i => i.tipo === 'exame')) {
      setTipoDocumento('Pedido de Exames');
    } else {
      setTipoDocumento('Receita Médica');
    }
    showToast(`Modelo "${template.titulo}" carregado com sucesso!`);
  };

  // Adicionar Item em Branco
  const handleAddItem = (tipo: 'medicamento' | 'exame' | 'orientacao') => {
    const novo: PrescricaoItem = {
      id: `item-${Date.now()}`,
      tipo,
      nome: tipo === 'medicamento' ? 'Novo Medicamento' : tipo === 'exame' ? 'Novo Exame' : 'Nova Orientação',
      posologia_ou_instrucao: tipo === 'medicamento' ? 'Tomar 1 comprimido ao dia...' : 'Conforme indicação clínica...',
      quantidade: tipo === 'medicamento' ? '1 caixa' : '1',
      via: tipo === 'medicamento' ? 'Oral' : undefined
    };
    setItens([...itens, novo]);
  };

  const handleRemoveItem = (id: string) => {
    setItens(itens.filter(i => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PrescricaoItem, value: string) => {
    setItens(itens.map(i => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Salvar a prescrição atual como Modelo / Padrão reutilizável
  const handleSaveAsTemplate = () => {
    if (!novoTemplateTitulo.trim()) {
      alert('Informe um título para o modelo.');
      return;
    }

    const saved = clinicalDb.savePrescricaoTemplate({
      titulo: novoTemplateTitulo.trim(),
      categoria: novoTemplateCategoria,
      itens,
      observacoes_padrao: observacoes
    });

    setTemplates(clinicalDb.getPrescricaoTemplates());
    setShowSaveTemplateModal(false);
    setNovoTemplateTitulo('');
    showToast(`Padrão "${saved.titulo}" salvo com sucesso na sua biblioteca!`);
  };

  // Deletar template
  const handleDeleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja excluir este modelo de prescrição?')) {
      clinicalDb.deletePrescricaoTemplate(id);
      setTemplates(clinicalDb.getPrescricaoTemplates());
      showToast('Modelo excluído.');
    }
  };

  // Gerar PDF Oficial
  const handleGeneratePdf = async () => {
    let nomeFinal = pacienteAvulsoNome.trim();
    if (!nomeFinal && selectedPacienteId) {
      const p = pacientes.find(item => item.id === selectedPacienteId);
      if (p) nomeFinal = p.nome;
    }
    if (!nomeFinal) nomeFinal = 'Paciente Sob Cuidados Clínicos';

    try {
      await generatePrescricaoPdf({
        pacienteNome: nomeFinal,
        tipo: tipoDocumento,
        itens,
        observacoes
      });

      // Salva no banco como prescrição emitida
      clinicalDb.savePrescricaoEmitida({
        paciente_id: selectedPacienteId || 1,
        paciente_nome: nomeFinal,
        profissional_nome: DOCTOR_INFO.fullName,
        tipo: tipoDocumento,
        itens,
        observacoes
      });

      showToast('PDF gerado e baixado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar documento PDF.');
    }
  };

  // Copiar Texto Formatado
  const handleCopyText = () => {
    let texto = `*${tipoDocumento.toUpperCase()} - DRA. CIBELE CRISTINA*\n`;
    texto += `CRM-AC 1810 • RQE 1078\n\n`;
    itens.forEach((item, index) => {
      texto += `${index + 1}. *${item.nome}* ${item.quantidade ? `(${item.quantidade})` : ''} ${item.via ? `[Via ${item.via}]` : ''}\n`;
      texto += `   ${item.posologia_ou_instrucao}\n\n`;
    });
    if (observacoes) {
      texto += `*Orientações:* ${observacoes}\n`;
    }
    navigator.clipboard.writeText(texto);
    showToast('Texto copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C5A059]/15 text-[#8F7030]">
              Prescrição Inteligente & Padrões
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Agilidade no atendimento diário</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Prescrições, Pedidos de Exames & Protocolos
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSaveTemplateModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors border border-stone-200"
          >
            <BookmarkPlus size={15} className="text-[#C5A059]" />
            <span>Salvar como Novo Padrão</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePdf}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Download size={15} />
            <span>Baixar Receita PDF</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* BIBLIOTECA DE MODELOS PREDEFINIDOS DA DRA. CIBELE */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#C5A059]" />
            <h3 className="font-serif font-bold text-sm text-stone-800">
              Padrões de Preenchimento da Dra. Cibele (1 Clique para Carregar)
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">
            {templates.length} modelo(s) salvos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleLoadTemplate(tmpl)}
              className="p-3.5 rounded-xl border border-stone-200 bg-[#FBFBF9] hover:bg-white hover:border-[#C5A059] hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                    {tmpl.categoria}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteTemplate(tmpl.id, e)}
                    className="text-stone-300 hover:text-rose-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir modelo"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <h4 className="font-semibold text-xs text-stone-900 leading-snug line-clamp-2">
                  {tmpl.titulo}
                </h4>
                <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                  {tmpl.itens.map(i => i.nome).join(', ')}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#1A3C34] font-semibold">
                <span>Aplicar modelo &rarr;</span>
                <span className="text-stone-400 font-normal">{tmpl.itens.length} item(ns)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ÁREA DE MONTAGEM DA RECEITA / EXAME */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: CONFIGURAÇÕES E PACIENTE */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-600">
              Dados do Documento
            </h4>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Tipo de Prescrição
              </label>
              <select
                value={tipoDocumento}
                onChange={(e) => setTipoDocumento(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              >
                <option value="Receita Médica">Receita Médica</option>
                <option value="Pedido de Exames">Pedido de Exames</option>
                <option value="Plano de Cuidado">Plano de Cuidado Terapêutico</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Selecionar Paciente Cadastrado
              </label>
              <select
                value={selectedPacienteId}
                onChange={(e) => {
                  setSelectedPacienteId(Number(e.target.value));
                  setPacienteAvulsoNome('');
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              >
                <option value={0}>-- Selecionar ou digitar abaixo --</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.telefone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Ou Nome do Paciente (Avulso)
              </label>
              <input
                type="text"
                value={pacienteAvulsoNome}
                onChange={(e) => setPacienteAvulsoNome(e.target.value)}
                placeholder="Ex: Pedro Henrique Souza"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>
          </div>

          {/* AÇÕES RÁPIDAS */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-600 mb-2">
              Opções de Compartilhamento
            </h4>

            <button
              type="button"
              onClick={handleCopyText}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
            >
              <Copy size={14} />
              <span>Copiar Texto p/ WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleGeneratePdf}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <Printer size={14} />
              <span>Imprimir / Gerar PDF</span>
            </button>
          </div>
        </div>

        {/* COLUNA DIREITA: ITENS DA PRESCRIÇÃO */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Itens da Prescrição ({itens.length})
              </h3>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddItem('medicamento')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1A3C34] hover:text-white text-stone-700 text-xs font-medium transition-all flex items-center gap-1"
                >
                  <Plus size={13} /> + Medicamento
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('exame')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1A3C34] hover:text-white text-stone-700 text-xs font-medium transition-all flex items-center gap-1"
                >
                  <Plus size={13} /> + Exame
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('orientacao')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1A3C34] hover:text-white text-stone-700 text-xs font-medium transition-all flex items-center gap-1"
                >
                  <Plus size={13} /> + Orientação
                </button>
              </div>
            </div>

            {/* LISTA DE ITENS */}
            <div className="space-y-3">
              {itens.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 bg-stone-50/80 rounded-xl border border-stone-200 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    <input
                      type="text"
                      value={item.nome}
                      onChange={(e) => handleUpdateItem(item.id, 'nome', e.target.value)}
                      placeholder="Nome do medicamento ou exame..."
                      className="flex-1 text-xs font-semibold p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                    />

                    {item.tipo === 'medicamento' && (
                      <input
                        type="text"
                        value={item.quantidade || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'quantidade', e.target.value)}
                        placeholder="Qtd (ex: 1 caixa)"
                        className="w-28 text-xs p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    )}

                    {item.tipo === 'medicamento' && (
                      <select
                        value={item.via || 'Oral'}
                        onChange={(e) => handleUpdateItem(item.id, 'via', e.target.value)}
                        className="w-24 text-xs p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      >
                        <option value="Oral">Oral</option>
                        <option value="Otológica">Otológica</option>
                        <option value="Tópica">Tópica</option>
                        <option value="Nasal">Nasal</option>
                        <option value="Inalatória">Inalatória</option>
                        <option value="Oftálmica">Oftálmica</option>
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remover item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={item.posologia_ou_instrucao}
                      onChange={(e) => handleUpdateItem(item.id, 'posologia_ou_instrucao', e.target.value)}
                      placeholder="Posologia detalhada ou instruções para o paciente..."
                      className="w-full text-xs p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* OBSERVAÇÕES COMPLEMENTARES */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Orientações Gerais / Observações Clínicas
              </label>
              <textarea
                rows={3}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Ex: Retorno em 15 dias, ingerir bastante água, evitar exposição solar..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SALVAR COMO NOVO PADRÃO */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-base text-stone-900 mb-3">
              Salvar como Padrão de Preenchimento
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Este padrão ficará salvo para você carregar com apenas 1 clique em qualquer atendimento futuro.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Título do Padrão *
                </label>
                <input
                  type="text"
                  value={novoTemplateTitulo}
                  onChange={(e) => setNovoTemplateTitulo(e.target.value)}
                  placeholder="Ex: Protocolo Amigdalite Bacteriana"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Categoria
                </label>
                <select
                  value={novoTemplateCategoria}
                  onChange={(e) => setNovoTemplateCategoria(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                >
                  <option value="Lavagem Otológica">Lavagem Otológica</option>
                  <option value="Check-up Racional">Check-up Racional</option>
                  <option value="Doenças Crônicas">Doenças Crônicas</option>
                  <option value="Saúde Mental">Saúde Mental</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAsTemplate}
                className="px-4 py-2 text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white rounded-xl shadow-sm"
              >
                Salvar Padrão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
