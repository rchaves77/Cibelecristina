import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Search,
  Plus,
  FileText,
  Phone,
  Mail,
  Calendar,
  Clock,
  HeartPulse,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Upload,
  Download,
  Lock,
  Eye,
  Trash2,
  History,
  Printer,
  FileSpreadsheet,
  Activity,
  X,
  Image as ImageIcon,
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  Stethoscope,
  Sparkles,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clinicalDb } from '../../services/clinicalDatabase';
import {
  Paciente,
  Prontuario,
  AnexoProntuario,
  Perfil,
  AdendoEvolucao,
  Agendamento,
  PrescricaoEmitida,
  ValidacaoAtestado
} from '../../types/clinical';
import { CidAutocompleteInput } from '../../components/common/CidAutocompleteInput';
import { FrasesEvolucaoModal } from '../../components/sistema/FrasesEvolucaoModal';
import { EmbeddedPrescricaoSection } from '../../components/sistema/EmbeddedPrescricaoSection';
import { EmbeddedAtestadoSection } from '../../components/sistema/EmbeddedAtestadoSection';
import { LinearAnexosSection } from '../../components/sistema/LinearAnexosSection';
import { LinearTimelineAtendimentos } from '../../components/sistema/LinearTimelineAtendimentos';
import { resolveCidString } from '../../data/cidDatabase';
import { DOCTOR_INFO } from '../../data/medicinarteData';
import { generatePrescricaoPdf, generateAtestadoPdf } from '../../utils/pdfGenerator';

export const ProntuarioPage: React.FC = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [anexos, setAnexos] = useState<AnexoProntuario[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [prescricoes, setPrescricoes] = useState<PrescricaoEmitida[]>([]);
  const [atestados, setAtestados] = useState<ValidacaoAtestado[]>([]);

  // Permissão do Usuário Logado (RBAC)
  const canAccessSoap = clinicalDb.canAccessClinicalProntuario(currentUser);
  const canPrescribe = clinicalDb.canPrescribe(currentUser);
  const canIssueCertificates = clinicalDb.canIssueCertificates(currentUser);

  // Nova Evolução Clínica (SOAP)
  const [novaEvolucao, setNovaEvolucao] = useState({
    subjetivo: '',
    objetivo: '',
    avaliacao: '',
    plano: '',
    diagnostico_cid: ''
  });

  // Modal de Adendo / Retificação de Evolução (Imutabilidade CFM)
  const [showAdendoModal, setShowAdendoModal] = useState(false);
  const [selectedProntuarioForAdendo, setSelectedProntuarioForAdendo] = useState<Prontuario | null>(null);
  const [adendoTexto, setAdendoTexto] = useState('');
  const [adendoMotivo, setAdendoMotivo] = useState('');



  // Modal de Frases e Modelos Rápidos de Evolução (Atalho Ctrl + Espaço)
  const [showFrasesModal, setShowFrasesModal] = useState(false);
  const [focusedSoapField, setFocusedSoapField] = useState<'subjetivo' | 'objetivo' | 'avaliacao' | 'plano'>('subjetivo');

  // Atalho de Teclado Global/Local Ctrl + Espaço para abrir quadro de Frases de Evolução
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        if (canAccessSoap) {
          e.preventDefault();
          setShowFrasesModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canAccessSoap]);

  const handleInsertFraseFromModal = (
    conteudo: string,
    targetField?: 'subjetivo' | 'objetivo' | 'avaliacao' | 'plano'
  ) => {
    const field = targetField || focusedSoapField || 'subjetivo';
    setNovaEvolucao((prev) => {
      const existing = prev[field];
      const updated =
        existing && existing.trim().length > 0
          ? `${existing.trim()}\n\n${conteudo}`
          : conteudo;
      return {
        ...prev,
        [field]: updated
      };
    });
    setFeedback('Modelo de frase inserido na evolução com sucesso!');
    setTimeout(() => setFeedback(''), 2500);
  };

  // Visualizador Simulado de Anexo / Foto Ampliada
  const [viewingAnexo, setViewingAnexo] = useState<AnexoProntuario | null>(null);

  const [feedback, setFeedback] = useState('');

  const reloadData = () => {
    const user = clinicalDb.getActiveUser();
    setCurrentUser(user);
    const list = clinicalDb.getPacientes();
    setPacientes(list);
    setProntuarios(clinicalDb.getProntuarios());
    setAnexos(clinicalDb.getAnexos());
    setAgendamentos(clinicalDb.getAgendamentos());
    setPrescricoes(clinicalDb.getPrescricoesEmitidas());
    setAtestados(clinicalDb.getValidacoes());

    // Se houver patientId na URL, seleciona aquele paciente
    if (patientId && list.length > 0) {
      const target = list.find(p => String(p.id) === String(patientId) || p.id === Number(patientId));
      if (target) {
        setSelectedPaciente(target);
      } else {
        setSelectedPaciente(list[0]);
      }
    } else if (list.length > 0 && !selectedPaciente) {
      setSelectedPaciente(list[0]);
    }
  };

  useEffect(() => {
    reloadData();
  }, [patientId]);

  // Registra log quando o usuário acessa ou altera o paciente
  useEffect(() => {
    if (selectedPaciente) {
      if (canAccessSoap) {
        clinicalDb.logAuditoria({
          usuario_id: currentUser.id,
          usuario_nome: currentUser.nome,
          role: currentUser.role,
          acao: 'ACESSO_PRONTUARIO',
          detalhes: `Acesso clínico ao prontuário SOAP exclusivo do paciente "${selectedPaciente.nome}".`,
          paciente_id: selectedPaciente.id,
          paciente_nome: selectedPaciente.nome
        });
      } else {
        clinicalDb.logAuditoria({
          usuario_id: currentUser.id,
          usuario_nome: currentUser.nome,
          role: currentUser.role,
          acao: 'ACESSO_PRONTUARIO',
          detalhes: `Acesso da recepção ao cadastro de "${selectedPaciente.nome}" (SOAP oculto por sigilo).`,
          paciente_id: selectedPaciente.id,
          paciente_nome: selectedPaciente.nome
        });
      }
    }
  }, [selectedPaciente?.id]);

  const handleSelectPaciente = (pId: string | number) => {
    navigate(`/sistema/prontuario/${pId}`);
  };

  const prontuariosDoPaciente = selectedPaciente
    ? prontuarios.filter(pr => pr.paciente_id === selectedPaciente.id)
    : [];

  const anexosDoPaciente = selectedPaciente
    ? anexos.filter(a => a.paciente_id === selectedPaciente.id)
    : [];

  const agendamentosDoPaciente = selectedPaciente
    ? agendamentos.filter(ag => ag.paciente_id === selectedPaciente.id)
    : [];

  const prescricoesDoPaciente = selectedPaciente
    ? prescricoes.filter(pr => pr.paciente_nome.toLowerCase().includes(selectedPaciente.nome.toLowerCase()))
    : [];

  const atestadosDoPaciente = selectedPaciente
    ? atestados.filter(at => at.paciente_nome.toLowerCase().includes(selectedPaciente.nome.toLowerCase()))
    : [];

  const handleAddEvolucao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente || !canAccessSoap) return;

    const resolvedCid = resolveCidString(novaEvolucao.diagnostico_cid);

    clinicalDb.saveProntuario({
      paciente_id: selectedPaciente.id,
      profissional_nome: currentUser.crm ? `${currentUser.nome} (${currentUser.crm})` : DOCTOR_INFO.fullName,
      subjetivo: novaEvolucao.subjetivo,
      objetivo: novaEvolucao.objetivo,
      avaliacao: novaEvolucao.avaliacao,
      plano: novaEvolucao.plano,
      diagnostico_cid: resolvedCid
    });

    setNovaEvolucao({
      subjetivo: '',
      objetivo: '',
      avaliacao: '',
      plano: '',
      diagnostico_cid: ''
    });

    setFeedback('Evolução clínica SOAP registrada com sucesso e preservada permanentemente!');
    reloadData();
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleOpenAdendoModal = (prontuario: Prontuario) => {
    setSelectedProntuarioForAdendo(prontuario);
    setAdendoTexto('');
    setAdendoMotivo('Esclarecimento complementar de exame físico e conduta pactuada.');
    setShowAdendoModal(true);
  };

  const handleSaveAdendo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProntuarioForAdendo || !adendoTexto.trim()) return;

    clinicalDb.addAdendoAoProntuario(selectedProntuarioForAdendo.id, {
      autor_nome: currentUser.nome,
      autor_crm: currentUser.crm || DOCTOR_INFO.crm,
      texto: adendoTexto.trim(),
      motivo_retificacao: adendoMotivo.trim()
    });

    setShowAdendoModal(false);
    setSelectedProntuarioForAdendo(null);
    setAdendoTexto('');
    setFeedback('Adendo retificador CFM registrado com sucesso no prontuário!');
    reloadData();
    setTimeout(() => setFeedback(''), 4000);
  };



  const handlePrintPEP = () => {
    if (!selectedPaciente) return;
    window.print();
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (!selectedPaciente) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <Users size={48} className="mx-auto text-stone-300" />
        <h2 className="font-serif font-bold text-xl text-stone-800">
          Nenhum paciente selecionado
        </h2>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Escolha um paciente na lista geral de pacientes para visualizar seu prontuário exclusivo.
        </p>
        <Link
          to="/sistema/pacientes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1A3C34] text-white text-xs font-semibold shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>Ir para Pacientes</span>
        </Link>
      </div>
    );
  }

  const age = calculateAge(selectedPaciente.data_nascimento);

  return (
    <div className="space-y-6 antialiased print:p-0">
      {/* NAVEGAÇÃO & SELETOR RÁPIDO DE PACIENTE (NÃO IMPRESSO) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/sistema/pacientes"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="Voltar para Lista de Pacientes"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Prontuário Eletrônico do Paciente (PEP)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <label htmlFor="patientSelect" className="text-xs text-stone-500 font-medium">
                Paciente Atual:
              </label>
              <select
                id="patientSelect"
                value={selectedPaciente.id}
                onChange={(e) => handleSelectPaciente(e.target.value)}
                className="bg-stone-50 font-serif font-bold text-sm text-stone-900 rounded-xl px-3 py-1.5 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 cursor-pointer"
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} (ID: #{p.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO RÁPIDA NO TOPO DO PRONTUÁRIO */}
        <div className="flex items-center gap-2 flex-wrap">
          {canAccessSoap && (
            <button
              type="button"
              onClick={() => document.getElementById('secao-evolucao')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <HeartPulse size={14} className="text-emerald-700" />
              <span>Registrar Evolução</span>
            </button>
          )}

          {canPrescribe && (
            <button
              type="button"
              onClick={() => document.getElementById('secao-prescricoes')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileText size={14} className="text-[#1A3C34]" />
              <span>Prescrever Receita</span>
            </button>
          )}

          {canIssueCertificates && (
            <button
              type="button"
              onClick={() => document.getElementById('secao-atestados')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b58f4a] text-[#0E231E] text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="Ação Rápida: Gerar Atestado Médico ou Declaração com QR Code"
            >
              <Award size={15} />
              <span>Gerar Atestado / Declaração</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => document.getElementById('secao-anexos')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <Paperclip size={14} className="text-blue-700" />
            <span>Anexar Exame</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPEP}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir PEP</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in print:hidden">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CARD PRINCIPAL DO PACIENTE: DADOS GERAIS, ALERTAS E CONTATOS */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1A3C34] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
              {selectedPaciente.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-serif font-bold text-2xl text-stone-900">
                  {selectedPaciente.nome}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#C5A059]/20 text-[#8F7030]">
                  {selectedPaciente.convenio || 'Particular'}
                </span>
                <span className="text-xs font-mono text-stone-400">
                  ID: #{selectedPaciente.id}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 flex-wrap">
                {selectedPaciente.data_nascimento && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-stone-400" />
                    <span>{selectedPaciente.data_nascimento} {age !== null ? `(${age} anos)` : ''}</span>
                  </span>
                )}
                {selectedPaciente.cpf && (
                  <span className="flex items-center gap-1 font-mono">
                    <FileText size={13} className="text-stone-400" />
                    <span>CPF: {selectedPaciente.cpf}</span>
                  </span>
                )}
                {selectedPaciente.telefone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-stone-400" />
                    <span>{selectedPaciente.telefone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {!canAccessSoap && (
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                <Lock size={14} className="text-amber-600" />
                <span>Perfil Recepção: Dados Clínicos em Sigilo</span>
              </span>
            </div>
          )}
        </div>

        {/* ALERTA DE ALERGIAS E CONDICOES CRONICAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 space-y-1.5">
            <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
              <ShieldAlert size={16} />
              <span>ALERGIAS RELATADAS E ALERTAS DE SEGURANÇA</span>
            </div>
            {selectedPaciente.alergias && selectedPaciente.alergias.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPaciente.alergias.map((al, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-300 shadow-2xs"
                  >
                    🚨 {al}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-600 italic">
                Nenhuma alergia grave ou restrição medicamentosa cadastrada até o momento.
              </p>
            )}
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Activity size={16} />
              <span>CONDIÇÕES CRÔNICAS & ANTECEDENTES RELEVANTES</span>
            </div>
            {selectedPaciente.condicoes_cronicas && selectedPaciente.condicoes_cronicas.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedPaciente.condicoes_cronicas.map((cond, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    🩺 {cond}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-amber-800 italic">
                Sem antecedentes crônicos cadastrados.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BARRA DE ATENDIMENTO MÉDICO LINEAR UNIFICADO */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stone-200 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#1A3C34] text-white flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="font-bold text-xs text-stone-800">
              Fluxo Linear de Atendimento:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => document.getElementById('secao-evolucao')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl bg-[#1A3C34] text-white font-bold hover:brightness-110 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              1. Evolução SOAP
            </button>
            <span className="text-stone-300">→</span>

            <button
              type="button"
              onClick={() => document.getElementById('secao-prescricoes')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span>2. Prescrições & Receitas</span>
              {prescricoesDoPaciente.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {prescricoesDoPaciente.length}
                </span>
              )}
            </button>
            <span className="text-stone-300">→</span>

            <button
              type="button"
              onClick={() => document.getElementById('secao-atestados')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span>3. Atestados & Declarações</span>
              {atestadosDoPaciente.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#C5A059]/20 text-[#8F7030] text-[10px] font-bold">
                  {atestadosDoPaciente.length}
                </span>
              )}
            </button>
            <span className="text-stone-300">→</span>

            <button
              type="button"
              onClick={() => document.getElementById('secao-anexos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <span>4. Anexos & Exames</span>
              {anexosDoPaciente.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {anexosDoPaciente.length}
                </span>
              )}
            </button>
            <span className="text-stone-300">→</span>

            <button
              type="button"
              onClick={() => document.getElementById('secao-historico')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-all cursor-pointer whitespace-nowrap"
            >
              5. Histórico Clínico ({prontuariosDoPaciente.length})
            </button>
          </div>
        </div>
      </div>

      {/* BLOCO 1: FORMULÁRIO DE NOVA EVOLUÇÃO CLÍNICA (SOAP) */}
      {canAccessSoap ? (
        <form id="secao-evolucao" onSubmit={handleAddEvolucao} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A3C34] text-white flex items-center justify-center">
                <HeartPulse size={16} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                  REGISTRAR NOVA EVOLUÇÃO CLÍNICA (METODOLOGIA SOAP)
                </h2>
                <p className="text-xs text-stone-500">Pressione <kbd className="px-1.5 py-0.5 bg-stone-100 border border-stone-300 rounded-md font-mono text-[10px] text-stone-800 font-bold">Ctrl + Espaço</kbd> a qualquer momento para abrir frases salvas</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowFrasesModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#C5A059] hover:bg-[#b08e4c] text-[#0E231E] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                title="Abrir quadro de frases rápidas e modelos salvos (Ctrl + Espaço)"
              >
                <Sparkles size={15} />
                <span>Modelos Rápidos (Ctrl+Espaço)</span>
              </button>
              <span className="text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1.5 rounded-full hidden md:inline-block">
                Registro Imutável CFM
              </span>
            </div>
          </div>

          {/* 4 BLOCOS VERTICAIS SOAP - UM POR LINHA (LARGURA TOTAL PARA CONFORTO) */}
          <div className="flex flex-col gap-5">
            {/* S - SUBJETIVO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  S – Subjetivo <span className="font-normal text-stone-500">(Queixa principal, história clínica, sintomas relatados)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFocusedSoapField('subjetivo');
                    setShowFrasesModal(true);
                  }}
                  className="text-[11px] text-[#1A3C34] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C5A059]" />
                  <span>Modelos S (Ctrl+Espaço)</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={novaEvolucao.subjetivo}
                onFocus={() => setFocusedSoapField('subjetivo')}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, subjetivo: e.target.value })}
                placeholder="Relato trazido pelo paciente sobre sua queixa, evolução dos sintomas, sono, hábitos..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* O - OBJETIVO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  O – Objetivo <span className="font-normal text-stone-500">(Exame físico, PA, FC, Otoscopia, ausculta, IMC)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFocusedSoapField('objetivo');
                    setShowFrasesModal(true);
                  }}
                  className="text-[11px] text-[#1A3C34] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C5A059]" />
                  <span>Modelos O (Ctrl+Espaço)</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={novaEvolucao.objetivo}
                onFocus={() => setFocusedSoapField('objetivo')}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, objetivo: e.target.value })}
                placeholder="Achados do exame físico: PA 120/80 mmHg, FC 72 bpm, Otoscopia sem cerúmen obstrutivo..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* A - AVALIAÇÃO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  A – Avaliação <span className="font-normal text-stone-500">(Raciocínio clínico, hipóteses e diagnósticos)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFocusedSoapField('avaliacao');
                    setShowFrasesModal(true);
                  }}
                  className="text-[11px] text-[#1A3C34] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C5A059]" />
                  <span>Modelos A (Ctrl+Espaço)</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={novaEvolucao.avaliacao}
                onFocus={() => setFocusedSoapField('avaliacao')}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, avaliacao: e.target.value })}
                placeholder="Interpretação clínica, estabilidade de patologias prévias e raciocínio diagnóstico..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* P - PLANO */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-stone-800">
                  P – Plano <span className="font-normal text-stone-500">(Conduta, prescrições, pedidos de exame, retorno)</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setFocusedSoapField('plano');
                    setShowFrasesModal(true);
                  }}
                  className="text-[11px] text-[#1A3C34] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} className="text-[#C5A059]" />
                  <span>Modelos P (Ctrl+Espaço)</span>
                </button>
              </div>
              <textarea
                rows={5}
                value={novaEvolucao.plano}
                onFocus={() => setFocusedSoapField('plano')}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, plano: e.target.value })}
                placeholder="Plano terapêutico pactuado com o paciente, exames solicitados, orientações e prazo de retorno..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>
          </div>

          {/* DIAGNÓSTICO CID-10 COM BUSCA INSTANTÂNEA */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <BookOpen size={14} className="text-[#1A3C34]" />
                <span>Diagnóstico de Conclusão / Hipótese (CID-10)</span>
              </label>
            </div>
            <CidAutocompleteInput
              value={novaEvolucao.diagnostico_cid}
              onChange={(val) => setNovaEvolucao({ ...novaEvolucao, diagnostico_cid: val })}
              placeholder="Digite código sem ponto (ex: k041, j00) ou patologia (ex: gripe, cerume)..."
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Digite o código sem ponto (ex: k041) ou a doença para buscar.
            </p>
          </div>

          {/* RODA PÉ DO FORMULÁRIO */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500 italic">
              O registro de evolução é assinado com o CRM da médica e preservado permanentemente.
            </p>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#142E28] hover:bg-[#0E231E] text-white text-xs font-bold shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98 shrink-0"
            >
              <CheckCircle2 size={16} />
              <span>Salvar Evolução no Prontuário</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 bg-amber-50/80 border border-amber-200 rounded-3xl text-amber-900 text-xs space-y-2 print:hidden">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Lock size={18} />
            <span>Sigilo Médico Regulatório (Resolução CFM nº 1.821)</span>
          </div>
          <p>
            O preenchimento de evoluções clínicas SOAP e diagnósticos CID-10 é de acesso restrito à Dra. Cibele Cristina e profissionais médicos autorizados.
          </p>
        </div>
      )}

      {/* BLOCO 2: PRESCRIÇÕES & RECEITUÁRIOS MÉDICOS (EMBUTIDO NO ATENDIMENTO) */}
      {selectedPaciente && canPrescribe && (
        <EmbeddedPrescricaoSection
          paciente={selectedPaciente}
          canPrescribe={canPrescribe}
          prescricoesDoPaciente={prescricoesDoPaciente}
          onPrescricaoSaved={reloadData}
        />
      )}

      {/* BLOCO 3: ATESTADOS MÉDICOS, DECLARAÇÕES & LAUDOS COM QR CODE (EMBUTIDO NO ATENDIMENTO) */}
      {selectedPaciente && canIssueCertificates && (
        <EmbeddedAtestadoSection
          paciente={selectedPaciente}
          canIssueCertificates={canIssueCertificates}
          atestadosDoPaciente={atestadosDoPaciente}
          onAtestadoSaved={reloadData}
        />
      )}

      {/* BLOCO 4: ANEXOS DO PRONTUÁRIO — DRAG AND DROP & CATEGORIZAÇÃO */}
      {selectedPaciente && (
        <LinearAnexosSection
          paciente={selectedPaciente}
          anexos={anexosDoPaciente}
          currentUserNome={currentUser.nome}
          onAnexoUpdated={reloadData}
          onViewAnexo={(anx) => setViewingAnexo(anx)}
        />
      )}

      {/* BLOCO 5: HISTÓRICO INTEGRADO DE ATENDIMENTOS PASSADOS (TIMELINE VERTICAL) */}
      {selectedPaciente && (
        <LinearTimelineAtendimentos
          prontuarios={prontuariosDoPaciente}
          prescricoes={prescricoesDoPaciente}
          atestados={atestadosDoPaciente}
          anexos={anexosDoPaciente}
          canAccessSoap={canAccessSoap}
          onOpenAdendoModal={handleOpenAdendoModal}
          onRepetirPrescricao={(presc) => {
            document.getElementById('secao-prescricoes')?.scrollIntoView({ behavior: 'smooth' });
            setFeedback(`Itens da receita de ${new Date(presc.created_at).toLocaleDateString('pt-BR')} prontos no formulário.`);
            setTimeout(() => setFeedback(''), 3000);
          }}
          onReimprimirPrescricao={async (presc) => {
            try {
              await generatePrescricaoPdf({
                pacienteNome: selectedPaciente.nome,
                tipo: presc.tipo,
                itens: presc.itens,
                observacoes: presc.observacoes,
                dataEmissao: new Date(presc.created_at).toLocaleDateString('pt-BR')
              });
            } catch (err) {
              console.error(err);
              alert('Erro ao reemitir PDF da prescrição.');
            }
          }}
          onReimprimirAtestado={async (at) => {
            try {
              await generateAtestadoPdf({
                validacao: at,
                baseUrl: window.location.origin
              });
            } catch (err) {
              console.error(err);
              alert('Erro ao gerar PDF do atestado.');
            }
          }}
          onViewAnexo={(anx) => setViewingAnexo(anx)}
        />
      )}

      {/* MODAL DE ADENDO CFM */}
      {showAdendoModal && selectedProntuarioForAdendo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in print:hidden">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <History size={18} className="text-[#1A3C34]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Registrar Adendo Retificador CFM
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdendoModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdendo} className="p-6 space-y-4">
              <div className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs">
                A Resolução CFM nº 1.821 proíbe alteração ou exclusão do registro original. O adendo será anexado permanentemente com carimbo de data/hora e seu nome.
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">
                  Texto Complementar / Esclarecimento do Adendo *
                </label>
                <textarea
                  required
                  rows={4}
                  value={adendoTexto}
                  onChange={(e) => setAdendoTexto(e.target.value)}
                  placeholder="Escreva a complementação técnica da evolução..."
                  className="w-full p-3 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">
                  Motivo da Retificação Regulatória *
                </label>
                <input
                  type="text"
                  required
                  value={adendoMotivo}
                  onChange={(e) => setAdendoMotivo(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAdendoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1A3C34] text-white text-xs font-bold shadow-xs hover:bg-[#142E28]"
                >
                  Registrar Adendo Permanentemente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO ANEXO / FOTO / DOCUMENTO */}


      {/* VISUALIZADOR DE ANEXO EM TELA CHEIA */}
      {viewingAnexo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in print:hidden">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900 truncate">
                  {viewingAnexo.nome_arquivo}
                </h3>
                <p className="text-[11px] text-stone-500">
                  {viewingAnexo.categoria} • {viewingAnexo.tamanho_formatado} • Enviado por {viewingAnexo.enviado_por}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingAnexo(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 bg-stone-100 flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-4">
              {viewingAnexo.nome_arquivo.endsWith('.pdf') ? (
                <div className="p-8 bg-white rounded-2xl border border-stone-300 text-center space-y-3 max-w-md shadow-xs">
                  <FileText size={48} className="mx-auto text-blue-700" />
                  <h4 className="font-bold text-sm text-stone-900">Documento PDF Clínico</h4>
                  <p className="text-xs text-stone-600">{viewingAnexo.observacoes || 'Sem observações adicionais.'}</p>
                  <span className="text-xs font-mono text-stone-400 block">{viewingAnexo.tamanho_formatado}</span>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-lg mx-auto">
                    <img
                      src="/logo.png"
                      alt="Preview Anexo"
                      className="max-h-80 mx-auto object-contain rounded-lg border border-stone-100"
                    />
                  </div>
                  {viewingAnexo.observacoes && (
                    <p className="text-xs text-stone-700 max-w-md mx-auto bg-white p-3 rounded-xl border border-stone-200">
                      <strong>Observação Médica:</strong> {viewingAnexo.observacoes}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone-200 bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setViewingAnexo(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Fechar Visualizador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUADRO MODAL DE FRASES E MODELOS RÁPIDOS DE EVOLUÇÃO (CTRL + ESPAÇO) */}
      <FrasesEvolucaoModal
        isOpen={showFrasesModal}
        onClose={() => setShowFrasesModal(false)}
        onSelectFrase={handleInsertFraseFromModal}
        currentActiveField={focusedSoapField}
        currentFieldContent={novaEvolucao[focusedSoapField]}
      />
    </div>
  );
};
