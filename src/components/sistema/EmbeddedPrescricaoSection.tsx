import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  BookmarkPlus,
  Sparkles,
  Printer,
  CheckCircle2,
  Layers,
  ChevronDown,
  Clock,
  Eye,
  Copy,
  Pill,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, PrescricaoItem, PrescricaoTemplate, PrescricaoEmitida } from '../../types/clinical';
import { generatePrescricaoPdf } from '../../utils/pdfGenerator';
import { DOCTOR_INFO } from '../../data/medicinarteData';
import { MedicamentoAutocompleteInput } from '../common/MedicamentoAutocompleteInput';
import { MedicamentoPrescricao } from '../../data/medicamentosBrasil';

interface EmbeddedPrescricaoSectionProps {
  paciente: Paciente;
  canPrescribe: boolean;
  prescricoesDoPaciente: PrescricaoEmitida[];
  onPrescricaoSaved: () => void;
}

export const EmbeddedPrescricaoSection: React.FC<EmbeddedPrescricaoSectionProps> = ({
  paciente,
  canPrescribe,
  prescricoesDoPaciente,
  onPrescricaoSaved
}) => {
  const [templates, setTemplates] = useState<PrescricaoTemplate[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState<'Receita Médica' | 'Pedido de Exames' | 'Plano de Cuidado'>('Receita Médica');
  const [tipoReceitaEspecial, setTipoReceitaEspecial] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  const [itens, setItens] = useState<PrescricaoItem[]>([
    {
      id: 'item-1',
      tipo: 'medicamento',
      nome: 'Losartana Potássica 50mg',
      posologia_ou_instrucao: 'Tomar 1 comprimido de 12/12 horas (ou 1 comprimido pela manhã).',
      duracao: 'Uso contínuo',
      quantidade: '60 comprimidos',
      via: 'Oral'
    }
  ]);
  const [observacoes, setObservacoes] = useState('');
  const [isEmitindo, setIsEmitindo] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(clinicalDb.getPrescricaoTemplates());
  }, []);

  const handleAddItem = (tipo: 'medicamento' | 'exame' | 'orientacao') => {
    const novo: PrescricaoItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tipo,
      nome: '',
      posologia_ou_instrucao: '',
      duracao: tipo === 'medicamento' ? 'Uso contínuo' : undefined,
      quantidade: tipo === 'medicamento' ? '1 caixa' : '1',
      via: tipo === 'medicamento' ? 'Oral' : undefined
    };
    setItens((prev) => [...prev, novo]);
  };

  const handleRemoveItem = (id: string) => {
    if (itens.length <= 1) {
      handleClearForm();
      return;
    }
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof PrescricaoItem, value: string) => {
    setItens((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  // Regra 2: Quando o médico CLICAR em qualquer item da lista, preencha automaticamente os campos de Medicamento, Via, Posologia, Duração e Quantidade com os valores exatos do item clicado (e se controlado: true, altere automaticamente o tipo da receita para "Receita de Controle Especial - 2 Vias").
  const handleSelectMedicamento = (itemId: string, med: MedicamentoPrescricao) => {
    // Normalizar via ("Uso Oral" -> "Oral")
    const cleanVia = med.via.replace(/^Uso\s+/i, '');
    
    setItens((prev) =>
      prev.map((i) => {
        if (i.id === itemId) {
          return {
            ...i,
            nome: med.medicamento,
            via: cleanVia,
            posologia_ou_instrucao: med.posologia,
            duracao: med.duracao,
            quantidade: med.quantidade
          };
        }
        return i;
      })
    );

    // Se for medicamento de controle especial, ajusta automaticamente o tipo da receita para Controle Especial (2 Vias)
    if (med.controlado) {
      setTipoReceitaEspecial(true);
      setFeedback(`Medicamento "${med.medicamento}" é de Controle Especial (Portaria 344). Receita ajustada automaticamente para Controle Especial (2 Vias).`);
      setTimeout(() => setFeedback(null), 4500);
    }
  };

  const handleLoadTemplate = (template: PrescricaoTemplate) => {
    setItens(JSON.parse(JSON.stringify(template.itens)));
    setObservacoes(template.observacoes_padrao || '');
    if (template.itens.some((i) => i.tipo === 'exame')) {
      setTipoDocumento('Pedido de Exames');
    } else {
      setTipoDocumento('Receita Médica');
    }
    setFeedback(`Modelo "${template.titulo}" carregado com sucesso!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleClearForm = () => {
    setItens([
      {
        id: `item-${Date.now()}`,
        tipo: 'medicamento',
        nome: '',
        posologia_ou_instrucao: '',
        duracao: 'Uso contínuo',
        quantidade: '1 caixa',
        via: 'Oral'
      }
    ]);
    setObservacoes('');
    setTipoReceitaEspecial(false);
  };

  const handleEmitirPrescricao = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canPrescribe) return;

    const itensValidos = itens.filter((i) => i.nome.trim().length > 0);
    if (itensValidos.length === 0) {
      alert('Preencha ao menos um medicamento, exame ou orientação para emitir a receita.');
      return;
    }

    setIsEmitindo(true);
    try {
      const docTipoFinal = tipoReceitaEspecial ? 'Controle Especial' : tipoDocumento;

      // 1. Salva no banco clínico vinculado ao paciente
      clinicalDb.savePrescricaoEmitida({
        paciente_id: paciente.id,
        paciente_nome: paciente.nome,
        profissional_nome: `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm})`,
        tipo: tipoDocumento,
        itens: itensValidos,
        observacoes: observacoes.trim()
      });

      // 2. Registra na auditoria
      clinicalDb.logAuditoria({
        usuario_id: DOCTOR_INFO.crm,
        usuario_nome: DOCTOR_INFO.fullName,
        role: 'profissional',
        acao: 'EMISSAO_PRESCRICAO',
        detalhes: `Emissão de ${docTipoFinal} com ${itensValidos.length} item(ns) para o paciente ${paciente.nome}.`,
        paciente_id: paciente.id,
        paciente_nome: paciente.nome
      });

      // 3. Renderiza e baixa o PDF oficial
      await generatePrescricaoPdf({
        pacienteNome: paciente.nome,
        tipo: docTipoFinal,
        itens: itensValidos,
        observacoes: observacoes.trim(),
        dataEmissao: new Date().toLocaleDateString('pt-BR')
      });

      setFeedback('Prescrição médica emitida com sucesso, salva no histórico do paciente e PDF gerado!');
      setTimeout(() => setFeedback(null), 4000);
      onPrescricaoSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao emitir o receituário.');
    } finally {
      setIsEmitindo(false);
    }
  };

  const handleRepetirPrescricao = (presc: PrescricaoEmitida) => {
    setItens(JSON.parse(JSON.stringify(presc.itens)));
    setObservacoes(presc.observacoes || '');
    setTipoDocumento(presc.tipo);
    setIsFormOpen(true);
    setFeedback(`Itens da receita de ${new Date(presc.created_at).toLocaleDateString('pt-BR')} carregados no formulário.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReimprimirPdf = async (presc: PrescricaoEmitida) => {
    try {
      await generatePrescricaoPdf({
        pacienteNome: paciente.nome,
        tipo: presc.tipo,
        itens: presc.itens,
        observacoes: presc.observacoes,
        dataEmissao: new Date(presc.created_at).toLocaleDateString('pt-BR')
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao reemitir PDF da prescrição.');
    }
  };

  const viasAdministracao = [
    'Oral',
    'Tópico',
    'Inalatório',
    'Otológico',
    'Ocular',
    'Nasal',
    'Sublingual',
    'Injetável',
    'Retal'
  ];

  return (
    <div id="secao-prescricoes" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#1A3C34] text-white flex items-center justify-center font-bold shadow-xs">
            <FileText size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                Passo 2 do Atendimento
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              PRESCRIÇÃO & RECEITUÁRIO MÉDICO (BASE RENAME / MEDICINA DE FAMÍLIA)
            </h2>
            <p className="text-xs text-stone-500">
              Autocomplete com medicamentos da Atenção Primária, posologia, vias e controle especial
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            {isFormOpen ? 'Ocultar / Recolher' : '+ Abrir Prescritor'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* FORMULÁRIO DE PRESCRIÇÃO DIRETA NO ATENDIMENTO */}
      {isFormOpen && canPrescribe && (
        <form onSubmit={handleEmitirPrescricao} className="space-y-5 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
          {/* SELETOR DE TIPO E MODELOS PRONTOS */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-700 mr-1">Tipo de Receituário:</span>
              
              <button
                type="button"
                onClick={() => {
                  setTipoDocumento('Receita Médica');
                  setTipoReceitaEspecial(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tipoDocumento === 'Receita Médica' && !tipoReceitaEspecial
                    ? 'bg-[#1A3C34] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Receita Simples (Branca)
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoDocumento('Receita Médica');
                  setTipoReceitaEspecial(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  tipoReceitaEspecial
                    ? 'bg-amber-800 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>💊 Controle Especial (2 Vias)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoDocumento('Pedido de Exames');
                  setTipoReceitaEspecial(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tipoDocumento === 'Pedido de Exames'
                    ? 'bg-[#1A3C34] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🧪 Pedido de Exames
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipoDocumento('Plano de Cuidado');
                  setTipoReceitaEspecial(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  tipoDocumento === 'Plano de Cuidado'
                    ? 'bg-[#1A3C34] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                📋 Plano de Cuidado
              </button>
            </div>

            {/* Modelos Predefinidos da Medicina de Família */}
            {templates.length > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <Sparkles size={14} className="text-[#C5A059]" />
                <select
                  onChange={(e) => {
                    const tmpl = templates.find((t) => t.id === e.target.value);
                    if (tmpl) handleLoadTemplate(tmpl);
                  }}
                  defaultValue=""
                  className="px-3 py-1.5 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#1A3C34] cursor-pointer"
                >
                  <option value="" disabled>
                    Carregar Protocolo Pronto (MFC)...
                  </option>
                  {templates.map((tmpl) => (
                    <option key={tmpl.id} value={tmpl.id}>
                      {tmpl.titulo} ({tmpl.categoria})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ITENS DA PRESCRIÇÃO */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-stone-800">
                Medicamentos & Itens a Prescrever ({itens.length})
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAddItem('medicamento')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus size={13} />
                  <span>+ Adicionar Medicamento à Lista</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('exame')}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus size={13} />
                  <span>+ Exame Laboratorial</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddItem('orientacao')}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus size={13} />
                  <span>+ Orientação</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {itens.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1A3C34] text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-stone-700">
                        {item.tipo === 'medicamento' ? 'Medicamento / Fármaco' : item.tipo === 'exame' ? 'Exame Laboratorial / Imagem' : 'Orientação Médica'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                        title="Remover item da prescrição"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* LINHA 1: BUSCA COM AUTOCOMPLETE RENAME + VIA */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
                    <div className="lg:col-span-8">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Medicamento + Concentração (Busca com Autocomplete RENAME):
                      </label>
                      {item.tipo === 'medicamento' ? (
                        <MedicamentoAutocompleteInput
                          value={item.nome}
                          onChange={(val) => handleUpdateItem(item.id, 'nome', val)}
                          onSelectMedicamento={(med) => handleSelectMedicamento(item.id, med)}
                          placeholder="Digite nome, categoria ou princípio ativo (ex: Losartana 50mg, Antibióticos, Omeprazol)..."
                          required
                        />
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder={item.tipo === 'exame' ? 'Nome do exame (ex: Hemograma Completo, Glicemia, Lipidograma)' : 'Título da orientação'}
                          value={item.nome}
                          onChange={(e) => handleUpdateItem(item.id, 'nome', e.target.value)}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34] focus:bg-white"
                        />
                      )}
                    </div>

                    <div className="lg:col-span-4">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Via de Administração:
                      </label>
                      <select
                        value={item.via || 'Oral'}
                        onChange={(e) => handleUpdateItem(item.id, 'via', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34] focus:bg-white cursor-pointer"
                      >
                        {viasAdministracao.map((v) => (
                          <option key={v} value={v}>
                            Via {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* LINHA 2: POSOLOGIA, DURAÇÃO E QUANTIDADE TOTAL */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Posologia Detalhada:
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Tomar 1 comprimido por via oral a cada 12 horas após as refeições"
                        value={item.posologia_ou_instrucao}
                        onChange={(e) => handleUpdateItem(item.id, 'posologia_ou_instrucao', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1A3C34] focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Duração do Tratamento:
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Uso contínuo / Por 7 dias"
                        value={item.duracao || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'duracao', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1A3C34] focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Quantidade Total:
                      </label>
                      <input
                        type="text"
                        placeholder="ex: 60 comprimidos / 2 caixas"
                        value={item.quantidade || ''}
                        onChange={(e) => handleUpdateItem(item.id, 'quantidade', e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1A3C34] focus:bg-white text-center font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OBSERVAÇÕES E RECOMENDAÇÕES */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              Orientações Complementares / Observações Médicas (opcional)
            </label>
            <input
              type="text"
              placeholder="ex: Ingerir com água após as refeições. Manter boa hidratação. Retorno agendado em 30 dias com exames."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
            />
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearForm}
                className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
              >
                Limpar Campos
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEmitirPrescricao()}
                disabled={isEmitindo}
                className="px-6 py-2.5 rounded-2xl bg-[#1A3C34] hover:bg-[#122b25] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 disabled:opacity-75"
              >
                {isEmitindo ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Gerando PDF Oficial...</span>
                  </>
                ) : (
                  <>
                    <Printer size={15} />
                    <span>Imprimir / Gerar PDF do Receituário</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* HISTÓRICO DE RECEITAS DESTE PACIENTE */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} className="text-stone-400" />
          <span>Receitas Anteriores deste Paciente ({prescricoesDoPaciente.length})</span>
        </h3>

        {prescricoesDoPaciente.length > 0 ? (
          <div className="space-y-2.5">
            {prescricoesDoPaciente.map((pr) => (
              <div
                key={pr.id}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {pr.tipo === 'Pedido de Exames'
                        ? '🧪 Pedido de Exames'
                        : pr.tipo === 'Plano de Cuidado'
                        ? '📋 Plano de Cuidado'
                        : '📄 Receita Médica'}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {new Date(pr.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(pr.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                    {pr.itens.map((i) => i.nome).filter(Boolean).join(' • ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRepetirPrescricao(pr)}
                    className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Carregar itens no formulário acima"
                  >
                    <Copy size={12} />
                    <span>Repetir Itens</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReimprimirPdf(pr)}
                    className="px-3 py-1 rounded-xl bg-[#1A3C34] hover:bg-[#122b25] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Baixar ou imprimir novamente"
                  >
                    <Download size={12} />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Nenhuma receita emitida anteriormente para este paciente.
          </p>
        )}
      </div>
    </div>
  );
};
