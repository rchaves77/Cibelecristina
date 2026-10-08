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
import { resolveCidString } from '../../data/cidDatabase';
import { DOCTOR_INFO } from '../../data/medicinarteData';

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

  // Modal de Novo Anexo (Exames, ECG, Fotos, Laudos)
  const [showNovoAnexoModal, setShowNovoAnexoModal] = useState(false);
  const [novoAnexo, setNovoAnexo] = useState<{
    nome_arquivo: string;
    categoria: AnexoProntuario['categoria'];
    observacoes: string;
    tamanho_formatado: string;
    preview_url?: string;
  }>({
    nome_arquivo: '',
    categoria: 'Exame Laboratorial',
    observacoes: '',
    tamanho_formatado: '450 KB'
  });

  // Visualizador Simulado de Anexo / Foto Ampliada
  const [viewingAnexo, setViewingAnexo] = useState<AnexoProntuario | null>(null);

  const [feedback, setFeedback] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Upload de Anexo com Suporte a Foto / Imagem / Documentos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    let categoria: AnexoProntuario['categoria'] = 'Exame Laboratorial';
    const lower = file.name.toLowerCase();
    if (lower.includes('ecg') || lower.includes('eletro')) categoria = 'Eletrocardiograma (ECG)';
    else if (lower.includes('laudo') || lower.includes('raio') || lower.includes('tc') || lower.includes('ressonancia') || lower.includes('ultra')) categoria = 'Laudo de Imagem';
    else if (lower.includes('foto') || lower.includes('lesao') || lower.includes('pele') || lower.endsWith('.jpg') || lower.endsWith('.png') || lower.endsWith('.jpeg')) categoria = 'Foto Clínica / Lesão';
    else if (lower.includes('termo') || lower.includes('consentimento')) categoria = 'Documento / Termo';

    // Cria URL de preview temporária para imagens
    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }

    setNovoAnexo({
      nome_arquivo: file.name,
      categoria,
      observacoes: '',
      tamanho_formatado: sizeStr,
      preview_url: previewUrl
    });
  };

  const handleSaveAnexo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente || !novoAnexo.nome_arquivo.trim()) return;

    clinicalDb.saveAnexo({
      paciente_id: selectedPaciente.id,
      nome_arquivo: novoAnexo.nome_arquivo.trim(),
      categoria: novoAnexo.categoria,
      tamanho_formatado: novoAnexo.tamanho_formatado,
      tipo_mime: novoAnexo.nome_arquivo.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      enviado_por: currentUser.nome,
      observacoes: novoAnexo.observacoes.trim() || undefined
    });

    setShowNovoAnexoModal(false);
    setNovoAnexo({
      nome_arquivo: '',
      categoria: 'Exame Laboratorial',
      observacoes: '',
      tamanho_formatado: '450 KB'
    });
    setFeedback('Exame / foto anexado com sucesso ao prontuário!');
    reloadData();
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDeleteAnexo = (id: string, nomeArquivo: string) => {
    if (window.confirm(`Deseja realmente remover o anexo "${nomeArquivo}" do prontuário?`)) {
      clinicalDb.deleteAnexo(id);
      setFeedback('Anexo removido do prontuário.');
      reloadData();
      setTimeout(() => setFeedback(''), 4000);
    }
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

        {/* ATALHOS RAPIDOS DO ATENDIMENTO */}
        <div className="flex items-center gap-2 flex-wrap">
          {canPrescribe && (
            <Link
              to="/sistema/prescricoes"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <FileText size={14} className="text-[#1A3C34]" />
              <span>Emitir Receita</span>
            </Link>
          )}

          {canIssueCertificates && (
            <Link
              to="/sistema/atestados"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-all cursor-pointer"
            >
              <Award size={14} className="text-[#C5A059]" />
              <span>Emitir Atestado</span>
            </Link>
          )}

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

      {/* BLOCO 1: FORMULÁRIO DE NOVA EVOLUÇÃO CLÍNICA (SOAP) */}
      {canAccessSoap ? (
        <form onSubmit={handleAddEvolucao} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6 print:hidden">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A3C34] text-white flex items-center justify-center">
                <HeartPulse size={16} />
              </div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                REGISTRAR NOVA EVOLUÇÃO CLÍNICA (METODOLOGIA SOAP)
              </h2>
            </div>
            <span className="text-[11px] font-medium text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
              Registro Imutável CFM
            </span>
          </div>

          {/* 4 BLOCOS VERTICAIS SOAP - UM POR LINHA (LARGURA TOTAL PARA CONFORTO) */}
          <div className="flex flex-col gap-5">
            {/* S - SUBJETIVO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                S – Subjetivo <span className="font-normal text-stone-500">(Queixa principal, história clínica, sintomas relatados)</span>
              </label>
              <textarea
                rows={5}
                value={novaEvolucao.subjetivo}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, subjetivo: e.target.value })}
                placeholder="Relato trazido pelo paciente sobre sua queixa, evolução dos sintomas, sono, hábitos..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* O - OBJETIVO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                O – Objetivo <span className="font-normal text-stone-500">(Exame físico, PA, FC, Otoscopia, ausculta, IMC)</span>
              </label>
              <textarea
                rows={5}
                value={novaEvolucao.objetivo}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, objetivo: e.target.value })}
                placeholder="Achados do exame físico: PA 120/80 mmHg, FC 72 bpm, Otoscopia sem cerúmen obstrutivo..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* A - AVALIAÇÃO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                A – Avaliação <span className="font-normal text-stone-500">(Raciocínio clínico, hipóteses e diagnósticos)</span>
              </label>
              <textarea
                rows={5}
                value={novaEvolucao.avaliacao}
                onChange={(e) => setNovaEvolucao({ ...novaEvolucao, avaliacao: e.target.value })}
                placeholder="Interpretação clínica, estabilidade de patologias prévias e raciocínio diagnóstico..."
                className="w-full p-3.5 bg-stone-50/80 text-sm text-stone-800 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all resize-y min-h-[130px]"
              />
            </div>

            {/* P - PLANO */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                P – Plano <span className="font-normal text-stone-500">(Conduta, prescrições, pedidos de exame, retorno)</span>
              </label>
              <textarea
                rows={5}
                value={novaEvolucao.plano}
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

      {/* BLOCO 2: HISTÓRICO DE EVOLUÇÕES E CONSULTAS */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <History size={18} className="text-[#1A3C34]" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              HISTÓRICO DE EVOLUÇÕES E CONSULTAS ({prontuariosDoPaciente.length})
            </h2>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck size={12} /> Imutabilidade CFM Res. 1.821
          </span>
        </div>

        {prontuariosDoPaciente.length > 0 ? (
          <div className="space-y-4">
            {prontuariosDoPaciente.map((pr) => (
              <div
                key={pr.id}
                className="bg-stone-50/80 rounded-2xl border border-stone-200 p-5 space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900 font-serif">
                      {pr.profissional_nome || DOCTOR_INFO.fullName}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-500 font-mono">
                      {new Date(pr.data_hora).toLocaleDateString('pt-BR')} às {new Date(pr.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {canAccessSoap && (
                    <button
                      type="button"
                      onClick={() => handleOpenAdendoModal(pr)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A3C34] bg-white border border-[#1A3C34]/30 px-2.5 py-1 rounded-xl hover:bg-[#1A3C34] hover:text-white transition-colors cursor-pointer shrink-0 print:hidden"
                    >
                      <History size={12} />
                      <span>+ Adendo CFM</span>
                    </button>
                  )}
                </div>

                {/* DETALHES SOAP */}
                {canAccessSoap ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {pr.subjetivo && (
                      <div className="p-3 bg-white rounded-xl border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">S – Subjetivo:</span>
                        <p className="text-stone-700 whitespace-pre-wrap">{pr.subjetivo}</p>
                      </div>
                    )}
                    {pr.objetivo && (
                      <div className="p-3 bg-white rounded-xl border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">O – Objetivo:</span>
                        <p className="text-stone-700 whitespace-pre-wrap">{pr.objetivo}</p>
                      </div>
                    )}
                    {pr.avaliacao && (
                      <div className="p-3 bg-white rounded-xl border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">A – Avaliação:</span>
                        <p className="text-stone-700 whitespace-pre-wrap">{pr.avaliacao}</p>
                      </div>
                    )}
                    {pr.plano && (
                      <div className="p-3 bg-white rounded-xl border border-stone-100">
                        <span className="font-bold text-stone-800 block mb-1">P – Plano:</span>
                        <p className="text-stone-700 whitespace-pre-wrap">{pr.plano}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/60 text-amber-900 rounded-xl text-xs font-medium">
                    Atendimento registrado em prontuário eletrônico. Conteúdo reservado ao corpo médico.
                  </div>
                )}

                {pr.diagnostico_cid && canAccessSoap && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-stone-700">Diagnóstico Conclusivo:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/15 text-[#8F7030]">
                      {pr.diagnostico_cid}
                    </span>
                  </div>
                )}

                {/* ADENDOS CFM REGISTRADOS */}
                {pr.adendos && pr.adendos.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-2 bg-amber-50/50 p-3 rounded-xl">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      Adendos & Retificações CFM ({pr.adendos.length})
                    </span>
                    {pr.adendos.map((ad, idx) => (
                      <div key={idx} className="text-xs space-y-0.5 text-amber-950 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900">
                          <span>{ad.autor_nome} ({ad.autor_crm})</span>
                          <span className="font-mono text-[10px]">
                            {new Date(ad.data_hora).toLocaleDateString('pt-BR')} às {new Date(ad.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-stone-800 mt-1 whitespace-pre-wrap">{ad.texto}</p>
                        <p className="text-[10px] text-stone-500 italic mt-0.5">
                          Motivo oficial: {ad.motivo_retificacao}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic py-4">
            Nenhuma evolução médica registrada anteriormente para este paciente.
          </p>
        )}
      </div>

      {/* BLOCO 3: ANEXOS DO PRONTUÁRIO (EXAMES, LAUDOS, ECG E FOTOS) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Paperclip size={18} className="text-[#1A3C34]" />
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                ANEXOS DO PRONTUÁRIO — EXAMES, LAUDOS, ECG E FOTOS ({anexosDoPaciente.length})
              </h2>
              <p className="text-xs text-stone-500">
                Armazenamento de PDFs laboratoriais, imagens de otoscopia, ECG de repouso, fotos de lesões e laudos externos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowNovoAnexoModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer print:hidden shrink-0"
          >
            <Upload size={16} />
            <span>+ Anexar Exame / Documento</span>
          </button>
        </div>

        {anexosDoPaciente.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anexosDoPaciente.map((anx) => {
              const isImage = anx.tipo_mime?.startsWith('image/') ||
                anx.nome_arquivo.endsWith('.jpg') ||
                anx.nome_arquivo.endsWith('.png') ||
                anx.nome_arquivo.endsWith('.jpeg');

              return (
                <div
                  key={anx.id}
                  className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-3 hover:border-stone-300 transition-all"
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
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-700 mt-1">
                        {anx.categoria}
                      </span>
                      {anx.observacoes && (
                        <p className="text-[11px] text-stone-600 mt-1.5 line-clamp-2">
                          {anx.observacoes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-200/60">
                    <span>{anx.tamanho_formatado || '450 KB'} • {new Date(anx.data_upload).toLocaleDateString('pt-BR')}</span>

                    <div className="flex items-center gap-2 print:hidden">
                      <button
                        type="button"
                        onClick={() => setViewingAnexo(anx)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A3C34] hover:underline cursor-pointer"
                      >
                        <Eye size={13} /> Ver
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnexo(anx.id, anx.nome_arquivo)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remover anexo"
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
          <p className="text-xs text-stone-500 italic py-4">
            Nenhum exame, laudo ou foto anexado ao prontuário deste paciente ainda.
          </p>
        )}
      </div>

      {/* BLOCO 4: RECEITUÁRIOS & PRESCRIÇÕES EMITIDAS */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <FileCheck size={18} className="text-[#1A3C34]" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              RECEITUÁRIOS & PRESCRIÇÕES EMITIDAS ({prescricoesDoPaciente.length})
            </h2>
          </div>

          {canPrescribe && (
            <Link
              to="/sistema/prescricoes"
              className="text-xs font-bold text-[#1A3C34] hover:underline inline-flex items-center gap-1"
            >
              <span>+ Nova Receita</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {prescricoesDoPaciente.length > 0 ? (
          <div className="space-y-3">
            {prescricoesDoPaciente.map((pr) => (
              <div key={pr.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {pr.tipo_receita === 'Controle Especial' ? '💊 Controle Especial (Receita Branca 2 Vias)' : '📄 Receituário Simples'}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {new Date(pr.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {pr.itens.map(i => i.nome).join(', ')}
                  </p>
                </div>

                <Link
                  to="/sistema/prescricoes"
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 hover:bg-stone-100 transition-colors shrink-0"
                >
                  Ver no Módulo
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">
            Nenhuma receita gerada para este paciente no sistema ainda.
          </p>
        )}
      </div>

      {/* BLOCO 5: ATESTADOS E ACOMPANHAMENTOS DE DOENTE */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Award size={18} className="text-[#C5A059]" />
            <h2 className="font-serif font-bold text-lg text-stone-900">
              ATESTADOS E DECLARAÇÕES EMITIDAS ({atestadosDoPaciente.length})
            </h2>
          </div>

          {canIssueCertificates && (
            <Link
              to="/sistema/atestados"
              className="text-xs font-bold text-[#1A3C34] hover:underline inline-flex items-center gap-1"
            >
              <span>+ Novo Atestado</span>
              <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {atestadosDoPaciente.length > 0 ? (
          <div className="space-y-3">
            {atestadosDoPaciente.map((at) => (
              <div key={at.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {at.tipo_documento}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                      {at.hash_autenticidade}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {at.conteudo_texto}
                  </p>
                </div>

                <a
                  href={`/validar/${at.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#1A3C34] hover:bg-stone-100 transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <ExternalLink size={12} />
                  <span>Validar QR Code</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500 italic">
            Nenhum atestado ou declaração de acompanhamento emitido para este paciente ainda.
          </p>
        )}
      </div>

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
      {showNovoAnexoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in print:hidden">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <Upload size={18} className="text-[#1A3C34]" />
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Anexar Exame, Laudo ou Foto
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNovoAnexoModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAnexo} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">
                  Selecionar Arquivo ou Foto *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 border-2 border-dashed border-stone-300 hover:border-[#1A3C34] rounded-2xl text-center cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors space-y-1"
                >
                  <Upload size={24} className="mx-auto text-stone-400" />
                  <p className="text-xs font-semibold text-stone-700">
                    Clique para selecionar foto, PDF ou exame
                  </p>
                  <p className="text-[10px] text-stone-400">
                    Suporta imagens (JPG, PNG) e arquivos PDF até 10MB
                  </p>
                </div>
              </div>

              {novoAnexo.nome_arquivo && (
                <div className="p-3 bg-stone-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span className="truncate">{novoAnexo.nome_arquivo}</span>
                    <span className="text-[10px] font-mono text-stone-500">{novoAnexo.tamanho_formatado}</span>
                  </div>
                  {novoAnexo.preview_url && (
                    <img
                      src={novoAnexo.preview_url}
                      alt="Preview do anexo"
                      className="w-full h-32 object-cover rounded-lg border border-stone-300 mt-2"
                    />
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">Categoria do Documento</label>
                <select
                  value={novoAnexo.categoria}
                  onChange={(e) => setNovoAnexo({ ...novoAnexo, categoria: e.target.value as any })}
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                >
                  <option value="Exame Laboratorial">Exame Laboratorial</option>
                  <option value="Eletrocardiograma (ECG)">Eletrocardiograma (ECG)</option>
                  <option value="Laudo de Imagem">Laudo de Imagem (Raio-X, TC, RM)</option>
                  <option value="Foto Clínica / Lesão">Foto Clínica / Otoscopia / Lesão</option>
                  <option value="Documento / Termo">Documento / Termo de Consentimento</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-800">Observações do Exame</label>
                <input
                  type="text"
                  value={novoAnexo.observacoes}
                  onChange={(e) => setNovoAnexo({ ...novoAnexo, observacoes: e.target.value })}
                  placeholder="ex: Achados normais, colestorol HDL estável..."
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNovoAnexoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!novoAnexo.nome_arquivo}
                  className="px-5 py-2.5 rounded-xl bg-[#1A3C34] text-white text-xs font-bold shadow-xs hover:bg-[#142E28] disabled:opacity-50"
                >
                  Anexar ao Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};
