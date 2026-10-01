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
  ShieldAlert,
  FileCheck,
  Eye,
  Trash2,
  History,
  Printer,
  FileSpreadsheet,
  Activity,
  X,
  FileQuestion,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clinicalDb } from '../../services/clinicalDatabase';
import { 
  Paciente, 
  Prontuario, 
  AnexoProntuario, 
  Perfil, 
  AdendoEvolucao,
  Agendamento 
} from '../../types/clinical';
import { CidAutocompleteInput } from '../../components/common/CidAutocompleteInput';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const PacientesProntuariosPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [anexos, setAnexos] = useState<AnexoProntuario[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  // Permissão do Usuário Logado (RBAC)
  const canAccessSoap = clinicalDb.canAccessClinicalProntuario(currentUser);
  const canPrescribe = clinicalDb.canPrescribe(currentUser);
  const canIssueCertificates = clinicalDb.canIssueCertificates(currentUser);

  // Modal Novo Paciente
  const [showNovoPacienteModal, setShowNovoPacienteModal] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState<{
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    data_nascimento: string;
    condicoes_cronicas: string;
    alergias: string;
  }>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    condicoes_cronicas: '',
    alergias: ''
  });

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

  // Visualizador Simulado de Anexo
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
    if (list.length > 0 && !selectedPaciente) {
      setSelectedPaciente(list[0]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Registra log quando o usuário seleciona um paciente
  useEffect(() => {
    if (selectedPaciente) {
      if (canAccessSoap) {
        clinicalDb.logAuditoria({
          usuario_id: currentUser.id,
          usuario_nome: currentUser.nome,
          role: currentUser.role,
          acao: 'ACESSO_PRONTUARIO',
          detalhes: `Acesso clínico ao prontuário SOAP do paciente "${selectedPaciente.nome}".`,
          paciente_id: selectedPaciente.id,
          paciente_nome: selectedPaciente.nome
        });
      } else {
        clinicalDb.logAuditoria({
          usuario_id: currentUser.id,
          usuario_nome: currentUser.nome,
          role: currentUser.role,
          acao: 'ACESSO_PRONTUARIO',
          detalhes: `Acesso administrativo da recepção ao cadastro de "${selectedPaciente.nome}" (dados clínicos SOAP ocultos).`,
          paciente_id: selectedPaciente.id,
          paciente_nome: selectedPaciente.nome
        });
      }
    }
  }, [selectedPaciente?.id]);

  const filteredPacientes = pacientes.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cpf && p.cpf.includes(searchTerm)) ||
    (p.telefone && p.telefone.includes(searchTerm))
  );

  const prontuariosDoPaciente = selectedPaciente
    ? prontuarios.filter(pr => pr.paciente_id === selectedPaciente.id)
    : [];

  const anexosDoPaciente = selectedPaciente
    ? anexos.filter(a => a.paciente_id === selectedPaciente.id)
    : [];

  const agendamentosDoPaciente = selectedPaciente
    ? agendamentos.filter(ag => ag.paciente_id === selectedPaciente.id)
    : [];

  const handleSaveNovoPaciente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPaciente.nome.trim()) return;

    const condicoes = novoPaciente.condicoes_cronicas
      ? novoPaciente.condicoes_cronicas.split(',').map(s => s.trim())
      : [];
    const alergias = novoPaciente.alergias
      ? novoPaciente.alergias.split(',').map(s => s.trim())
      : [];

    const p = clinicalDb.createPaciente({
      nome: novoPaciente.nome.trim(),
      cpf: novoPaciente.cpf.trim() || undefined,
      telefone: novoPaciente.telefone.trim(),
      email: novoPaciente.email.trim() || undefined,
      data_nascimento: novoPaciente.data_nascimento || undefined,
      condicoes_cronicas: condicoes,
      alergias: alergias
    });

    clinicalDb.logAuditoria({
      usuario_id: currentUser.id,
      usuario_nome: currentUser.nome,
      role: currentUser.role,
      acao: 'CRIACAO_PACIENTE',
      detalhes: `Novo paciente cadastrado no sistema: "${p.nome}" (CPF: ${p.cpf || 'Não informado'}).`,
      paciente_id: p.id,
      paciente_nome: p.nome
    });

    setShowNovoPacienteModal(false);
    setNovoPaciente({
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      data_nascimento: '',
      condicoes_cronicas: '',
      alergias: ''
    });
    setFeedback('Paciente cadastrado com sucesso!');
    reloadData();
    setSelectedPaciente(p);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleAddEvolucao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente || !canAccessSoap) return;

    clinicalDb.saveProntuario({
      paciente_id: selectedPaciente.id,
      profissional_nome: currentUser.crm ? `${currentUser.nome} (${currentUser.crm})` : DOCTOR_INFO.fullName,
      subjetivo: novaEvolucao.subjetivo,
      objetivo: novaEvolucao.objetivo,
      avaliacao: novaEvolucao.avaliacao,
      plano: novaEvolucao.plano,
      diagnostico_cid: novaEvolucao.diagnostico_cid
    });

    setNovaEvolucao({
      subjetivo: '',
      objetivo: '',
      avaliacao: '',
      plano: '',
      diagnostico_cid: ''
    });

    setFeedback('Evolução clínica SOAP salva permanentemente no prontuário!');
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
    setFeedback('Adendo retificador registrado com sucesso no prontuário!');
    reloadData();
    setTimeout(() => setFeedback(''), 4000);
  };

  // Upload de Anexo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    let categoria: AnexoProntuario['categoria'] = 'Exame Laboratorial';
    const lower = file.name.toLowerCase();
    if (lower.includes('ecg') || lower.includes('eletro')) categoria = 'Eletrocardiograma (ECG)';
    else if (lower.includes('laudo') || lower.includes('raio') || lower.includes('tc') || lower.includes('ressonancia') || lower.includes('ultra')) categoria = 'Laudo de Imagem';
    else if (lower.includes('foto') || lower.includes('lesao') || lower.includes('pele') || lower.endsWith('.jpg') || lower.endsWith('.png')) categoria = 'Foto Clínica / Lesão';
    else if (lower.includes('termo') || lower.includes('consentimento')) categoria = 'Documento / Termo';

    setNovoAnexo({
      nome_arquivo: file.name,
      categoria,
      observacoes: '',
      tamanho_formatado: sizeStr
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
    setFeedback('Documento anexado com sucesso ao prontuário do paciente!');
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

  return (
    <div className="space-y-6">
      {/* CABEÇALHO COM IDENTIFICAÇÃO E PAPEL DO USUÁRIO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Prontuário Eletrônico do Paciente (PEP)
            </span>
            <span className="text-xs text-stone-400">•</span>
            {canAccessSoap ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={12} /> Acesso Clínico Liberado (Médica / Admin)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Lock size={12} /> Perfil Recepção: Sigilo Médico Ativo (SOAP Oculto)
              </span>
            )}
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Gestão de Pacientes & Prontuários
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowNovoPacienteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Cadastrar Paciente</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* PAINEL DUPLO: LISTA DE PACIENTES + PRONTUÁRIO / FICHA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA DA ESQUERDA: LISTA DE PACIENTES */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col overflow-hidden max-h-[850px]">
          <div className="p-4 border-b border-stone-100 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, CPF ou telefone..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span>{filteredPacientes.length} paciente(s) cadastrado(s)</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredPacientes.map((p) => {
              const isSelected = selectedPaciente?.id === p.id;
              const totalAnexos = anexos.filter(a => a.paciente_id === p.id).length;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPaciente(p)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#1A3C34]/10 border-l-4 border-[#1A3C34]' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-stone-900 truncate">
                      {p.nome}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      #{p.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Phone size={11} className="text-stone-400" />
                      <span>{p.telefone}</span>
                    </span>
                    {totalAnexos > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                        <Paperclip size={10} /> {totalAnexos} anexo(s)
                      </span>
                    )}
                  </div>
                  {p.condicoes_cronicas && p.condicoes_cronicas.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.condicoes_cronicas.map((c, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 text-[9px] font-medium bg-[#C5A059]/15 text-[#8F7030] rounded"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUNA DA DIREITA: PRONTUÁRIO CLÍNICO OU PAINEL DA RECEPÇÃO */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPaciente ? (
            <div className="space-y-4">
              {/* FICHA RESUMO DO PACIENTE */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {selectedPaciente.nome}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      CPF: {selectedPaciente.cpf || 'Não informado'} • Nascimento: {selectedPaciente.data_nascimento || 'Não informado'} • Convênio: {selectedPaciente.convenio || 'Particular'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {canPrescribe ? (
                      <Link
                        to="/sistema/prescricoes"
                        className="px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B38F48] text-[#142E28] text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <FileText size={13} />
                        <span>Nova Prescrição</span>
                      </Link>
                    ) : (
                      <span 
                        title="Emissão de receitas restrita à médica"
                        className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-xs font-medium flex items-center gap-1 cursor-not-allowed"
                      >
                        <Lock size={12} />
                        <span>Prescrição (Médica)</span>
                      </span>
                    )}

                    {canIssueCertificates ? (
                      <Link
                        to="/sistema/atestados"
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Award size={13} />
                        <span>Emitir Atestado</span>
                      </Link>
                    ) : (
                      <span 
                        title="Atestados médicos restritos ao profissional"
                        className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-xs font-medium flex items-center gap-1 cursor-not-allowed"
                      >
                        <Lock size={12} />
                        <span>Atestado (Médico)</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handlePrintPEP}
                      title="Imprimir ou exportar prontuário em PDF"
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs transition-colors cursor-pointer"
                    >
                      <Printer size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Telefone</span>
                    <span className="font-medium text-stone-800">{selectedPaciente.telefone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">E-mail</span>
                    <span className="font-medium text-stone-800">{selectedPaciente.email || 'Não cadastrado'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Condições</span>
                    <span className="font-medium text-stone-800">
                      {selectedPaciente.condicoes_cronicas?.join(', ') || 'Nenhuma informada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Alergias</span>
                    <span className="font-medium text-rose-700 font-semibold">
                      {selectedPaciente.alergias?.join(', ') || 'Nega alergias'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SE O USUÁRIO FOR DA RECEPÇÃO (SEM PERMISSÃO CLÍNICA) -> BANNER DE SIGILO E PAINEL ADMINISTRATIVO */}
              {!canAccessSoap && (
                <div className="space-y-4">
                  <div className="p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
                      <ShieldAlert size={22} />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-xs text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                        <span>Sigilo Profissional & Proteção de Dados de Saúde</span>
                        <span className="text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-mono">CFM Res. 1.821 / LGPD Art. 11</span>
                      </h4>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Seu perfil ativo é <strong>{currentUser.nome} (Recepção)</strong>. Por determinação ética do Conselho Federal de Medicina (CFM) e da Lei Geral de Proteção de Dados (LGPD), as notas clínicas da metodologia SOAP (Subjetivo, Objetivo, Avaliação e Plano), hipóteses diagnósticas com código CID, prescrições de medicamentos e laudos de consultas são de acesso restrito e sigiloso à médica responsável (<strong>{DOCTOR_INFO.fullName}</strong>).
                      </p>
                      <p className="text-[11px] text-amber-700 font-medium pt-1">
                        A recepção tem acesso total ao cadastro, agenda de consultas, contatos e anexos administrativos.
                      </p>
                    </div>
                  </div>

                  {/* HISTÓRICO DE AGENDAMENTOS E ATENDIMENTOS (VISÍVEL PARA RECEPÇÃO) */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#1A3C34]" />
                        <h4 className="font-serif font-bold text-sm text-stone-800">
                          Histórico de Agendamentos & Presenças ({agendamentosDoPaciente.length})
                        </h4>
                      </div>
                      <Link 
                        to="/sistema" 
                        className="text-xs text-[#1A3C34] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Abrir na Agenda</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>

                    {agendamentosDoPaciente.length === 0 ? (
                      <div className="p-6 text-center text-stone-400 text-xs">
                        Nenhum agendamento registrado ainda para este paciente.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {agendamentosDoPaciente.map((ag) => (
                          <div
                            key={ag.id}
                            className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-semibold text-stone-900">
                                {ag.servico_nome || 'Consulta Médica'}
                              </div>
                              <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                                <span>{new Date(ag.data_inicio).toLocaleDateString('pt-BR')} às {new Date(ag.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>•</span>
                                <span>Profissional: {ag.profissional_nome}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                ag.status === 'Presenca' ? 'bg-emerald-100 text-emerald-800' :
                                ag.status === 'Agendado' ? 'bg-sky-100 text-sky-800' :
                                ag.status === 'Cancelado' ? 'bg-rose-100 text-rose-800' :
                                'bg-stone-200 text-stone-700'
                              }`}>
                                {ag.status}
                              </span>
                              <div className="text-[11px] text-stone-600 font-mono mt-1">
                                R$ {ag.valor_atendimento.toFixed(2)} ({ag.forma_pagamento})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SE O USUÁRIO TEM PERMISSÃO CLÍNICA (MÉDICA OU ADMIN) -> SOAP COMPLETO */}
              {canAccessSoap && (
                <>
                  {/* FORMULÁRIO DE NOVA EVOLUÇÃO SOAP */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <div className="flex items-center gap-2">
                        <HeartPulse size={16} className="text-[#1A3C34]" />
                        <h4 className="font-serif font-bold text-sm text-stone-800">
                          Registrar Nova Evolução Clínica (Metodologia SOAP)
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                        Registro Imutável CFM
                      </span>
                    </div>

                    <form onSubmit={handleAddEvolucao} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            S - Subjetivo (Queixa principal, história clínica, sintomas relatados)
                          </label>
                          <textarea
                            rows={3}
                            value={novaEvolucao.subjetivo}
                            onChange={(e) => setNovaEvolucao({ ...novaEvolucao, subjetivo: e.target.value })}
                            placeholder="Relato trazido pelo paciente sobre sua queixa, evolução dos sintomas, sono, hábitos..."
                            className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            O - Objetivo (Exame físico, PA, FC, Otoscopia, ausculta, IMC)
                          </label>
                          <textarea
                            rows={3}
                            value={novaEvolucao.objetivo}
                            onChange={(e) => setNovaEvolucao({ ...novaEvolucao, objetivo: e.target.value })}
                            placeholder="Achados do exame físico: PA 120/80 mmHg, FC 72 bpm, Otoscopia sem cerúmen obstrutivo..."
                            className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            A - Avaliação (Raciocínio clínico, hipóteses e diagnósticos)
                          </label>
                          <textarea
                            rows={3}
                            value={novaEvolucao.avaliacao}
                            onChange={(e) => setNovaEvolucao({ ...novaEvolucao, avaliacao: e.target.value })}
                            placeholder="Interpretação clínica, estabilidade de patologias prévias e raciocínio diagnóstico..."
                            className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-700 block mb-1">
                            P - Plano (Conduta, prescrições, pedidos de exame, retorno)
                          </label>
                          <textarea
                            rows={3}
                            value={novaEvolucao.plano}
                            onChange={(e) => setNovaEvolucao({ ...novaEvolucao, plano: e.target.value })}
                            placeholder="Plano terapêutico pactuado com o paciente, exames solicitados, orientações e prazo de retorno..."
                            className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        <CidAutocompleteInput
                          label="Diagnóstico de Conclusão / Hipótese (CID-10 & CID-11)"
                          value={novaEvolucao.diagnostico_cid}
                          onChange={(val) => setNovaEvolucao({ ...novaEvolucao, diagnostico_cid: val })}
                          placeholder="Digite código ou patologia (ex: I10, BA00, cerume, enxaqueca, diabetes, ansiedade)..."
                          helperText="Pesquisa instantânea médica no banco CID-10 e CID-11."
                          formatStyle="full"
                        />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-stone-500 italic">
                            O registro de evolução é assinado com o CRM da médica e preservado permanentemente.
                          </span>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 size={15} />
                            <span>Salvar Evolução no Prontuário</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* HISTÓRICO DE EVOLUÇÕES CLÍNICAS (COM ADENDOS E RETIFICAÇÃO IMUTÁVEL) */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <h4 className="font-serif font-bold text-sm text-stone-800 flex items-center gap-2">
                        <span>Histórico de Evoluções e Consultas</span>
                        <span className="text-xs font-mono font-normal text-stone-500">({prontuariosDoPaciente.length})</span>
                      </h4>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <ShieldCheck size={13} className="text-emerald-600" />
                        <span>Imutabilidade CFM Res. 1.821</span>
                      </span>
                    </div>

                    {prontuariosDoPaciente.length === 0 ? (
                      <div className="p-8 text-center text-stone-400 text-xs">
                        Nenhuma evolução clínica registrada ainda para este paciente.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {prontuariosDoPaciente.map((pr) => (
                          <div
                            key={pr.id}
                            className="p-4 bg-stone-50/90 rounded-xl border border-stone-200 space-y-3 text-xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200/60 pb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-stone-900">
                                  {pr.profissional_nome}
                                </span>
                                {pr.diagnostico_cid && (
                                  <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded text-[10px] font-mono font-bold">
                                    CID: {pr.diagnostico_cid}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-stone-500">
                                  {new Date(pr.created_at).toLocaleDateString('pt-BR')} às{' '}
                                  {new Date(pr.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenAdendoModal(pr)}
                                  className="text-[10px] font-semibold text-[#1A3C34] hover:text-[#142E28] bg-white px-2 py-1 rounded border border-stone-300 hover:border-[#1A3C34] transition-colors flex items-center gap-1 cursor-pointer"
                                  title="Adicionar adendo retificador sem substituir o registro original"
                                >
                                  <History size={11} />
                                  <span>+ Adendo CFM</span>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              {pr.subjetivo && (
                                <div>
                                  <strong className="text-stone-700 block text-[11px] font-bold">S (Subjetivo):</strong>
                                  <p className="text-stone-600 mt-0.5 leading-relaxed">{pr.subjetivo}</p>
                                </div>
                              )}
                              {pr.objetivo && (
                                <div>
                                  <strong className="text-stone-700 block text-[11px] font-bold">O (Objetivo):</strong>
                                  <p className="text-stone-600 mt-0.5 leading-relaxed">{pr.objetivo}</p>
                                </div>
                              )}
                              {pr.avaliacao && (
                                <div>
                                  <strong className="text-stone-700 block text-[11px] font-bold">A (Avaliação):</strong>
                                  <p className="text-stone-600 mt-0.5 leading-relaxed">{pr.avaliacao}</p>
                                </div>
                              )}
                              {pr.plano && (
                                <div>
                                  <strong className="text-stone-700 block text-[11px] font-bold">P (Plano):</strong>
                                  <p className="text-stone-600 mt-0.5 leading-relaxed">{pr.plano}</p>
                                </div>
                              )}
                            </div>

                            {/* HISTÓRICO DE ADENDOS RETIFICADORES DESTA EVOLUÇÃO */}
                            {pr.adendos && pr.adendos.length > 0 && (
                              <div className="mt-3 pt-2 border-t border-stone-200 space-y-2">
                                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1">
                                  <History size={11} /> Notas de Esclarecimento & Adendos Anexados ({pr.adendos.length})
                                </span>
                                {pr.adendos.map((ad) => (
                                  <div key={ad.id} className="p-2.5 rounded-lg bg-white border border-stone-200 text-[11px] space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                                      <span><strong>{ad.autor_nome}</strong> ({ad.autor_crm || 'Médica'})</span>
                                      <span>{new Date(ad.created_at).toLocaleDateString('pt-BR')} às {new Date(ad.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-stone-700">{ad.texto}</p>
                                    <div className="text-[10px] text-stone-400 italic">
                                      Motivo registrado: {ad.motivo_retificacao}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* SEÇÃO: ANEXOS DO PRONTUÁRIO (EXAMES, LAUDOS, ECG, FOTOS CLÍNICAS) */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-800 flex items-center gap-2">
                      <Paperclip size={16} className="text-[#1A3C34]" />
                      <span>Anexos do Prontuário — Exames, Laudos, ECG e Fotos</span>
                      <span className="text-xs font-mono font-normal text-stone-500">({anexosDoPaciente.length})</span>
                    </h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Armazenamento de PDFs laboratoriais, imagens de otoscopia, ECG de repouso e laudos externos.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNovoAnexoModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>+ Anexar Exame / Documento</span>
                  </button>
                </div>

                {anexosDoPaciente.length === 0 ? (
                  <div className="p-8 text-center text-stone-400 text-xs border border-dashed border-stone-200 rounded-xl space-y-2">
                    <FileQuestion size={24} className="mx-auto text-stone-300" />
                    <p>Nenhum documento ou exame anexado a este paciente.</p>
                    <p className="text-[11px] text-stone-400">
                      Clique em "+ Anexar Exame / Documento" para incluir PDF de laudo, imagem ou ECG.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {anexosDoPaciente.map((anx) => (
                      <div
                        key={anx.id}
                        className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors flex flex-col justify-between text-xs space-y-2"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {anx.categoria === 'Eletrocardiograma (ECG)' ? (
                                <Activity size={18} className="text-rose-600 shrink-0" />
                              ) : anx.categoria === 'Foto Clínica / Lesão' ? (
                                <ImageIcon size={18} className="text-emerald-600 shrink-0" />
                              ) : (
                                <FileText size={18} className="text-sky-600 shrink-0" />
                              )}
                              <span className="font-semibold text-stone-900 line-clamp-1">
                                {anx.nome_arquivo}
                              </span>
                            </div>
                            <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 shrink-0">
                              {anx.categoria}
                            </span>
                          </div>

                          {anx.observacoes && (
                            <p className="text-[11px] text-stone-600 mt-2 line-clamp-2 leading-relaxed">
                              {anx.observacoes}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-500">
                          <span>
                            {anx.tamanho_formatado} • {new Date(anx.data_upload).toLocaleDateString('pt-BR')}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setViewingAnexo(anx)}
                              className="text-[#1A3C34] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                              title="Visualizar documento"
                            >
                              <Eye size={12} />
                              <span>Ver</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAnexo(anx.id, anx.nome_arquivo)}
                              className="text-rose-600 hover:text-rose-700 cursor-pointer"
                              title="Remover anexo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-stone-400">
              Selecione um paciente na lista à esquerda para visualizar seu prontuário ou cadastro.
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO PACIENTE */}
      {showNovoPacienteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Cadastro de Novo Paciente
              </h3>
              <button 
                onClick={() => setShowNovoPacienteModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNovoPaciente} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={novoPaciente.nome}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                  placeholder="Ex: Carlos Roberto Alencar"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={novoPaciente.cpf}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={novoPaciente.telefone}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                    placeholder="(68) 99999-9999"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={novoPaciente.email}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={novoPaciente.data_nascimento}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, data_nascimento: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Condições Crônicas Conhecidas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={novoPaciente.condicoes_cronicas}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, condicoes_cronicas: e.target.value })}
                  placeholder="Ex: Hipertensão Arterial, Rinite, Diabetes Mellitus"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Alergias Conhecidas
                </label>
                <input
                  type="text"
                  value={novoPaciente.alergias}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, alergias: e.target.value })}
                  placeholder="Ex: Nega alergias ou Dipirona, AINEs"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNovoPacienteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white shadow-sm cursor-pointer"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR ADENDO / RETIFICAÇÃO (CFM RES. 1.821/2007) */}
      {showAdendoModal && selectedProntuarioForAdendo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Adicionar Nota de Esclarecimento / Adendo
                </h3>
                <p className="text-[11px] text-stone-500">
                  Resolução CFM 1.821/2007: O registro original não é apagado; o adendo é apensado cronologicamente.
                </p>
              </div>
              <button 
                onClick={() => setShowAdendoModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdendo} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Motivo da Retificação / Complemento *
                </label>
                <input
                  type="text"
                  required
                  value={adendoMotivo}
                  onChange={(e) => setAdendoMotivo(e.target.value)}
                  placeholder="Ex: Resultado de exame laboratorial recebido após o atendimento"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Texto do Adendo / Nota Clínica *
                </label>
                <textarea
                  rows={4}
                  required
                  value={adendoTexto}
                  onChange={(e) => setAdendoTexto(e.target.value)}
                  placeholder="Descreva o complemento técnico com clareza e fundamentação..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                <div><strong>Autor do Adendo:</strong> {currentUser.nome} ({currentUser.crm || DOCTOR_INFO.crm})</div>
                <div><strong>Data e Hora:</strong> {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdendoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white shadow-sm cursor-pointer"
                >
                  Gravar Adendo Permanente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOVO ANEXO NO PRONTUÁRIO */}
      {showNovoAnexoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Anexar Documento ao Prontuário
                </h3>
                <p className="text-[11px] text-stone-500">
                  Paciente: <strong>{selectedPaciente?.nome}</strong>
                </p>
              </div>
              <button 
                onClick={() => setShowNovoAnexoModal(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAnexo} className="space-y-3">
              {/* Seleção de Arquivo Físico / Drag & Drop */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-5 border-2 border-dashed border-[#1A3C34]/30 hover:border-[#1A3C34] rounded-2xl text-center bg-stone-50 hover:bg-stone-100/60 cursor-pointer transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".pdf,image/*,.doc,.docx"
                  className="hidden" 
                />
                <Upload size={24} className="mx-auto text-[#1A3C34] mb-1.5" />
                <span className="text-xs font-semibold text-stone-800 block">
                  {novoAnexo.nome_arquivo ? novoAnexo.nome_arquivo : 'Clique para selecionar arquivo do computador/celular'}
                </span>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Suporta PDF de exames, laudos, fotos de lesões/otoscopia, ECG e imagens (máx 15MB)
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome do Documento / Arquivo *
                </label>
                <input
                  type="text"
                  required
                  value={novoAnexo.nome_arquivo}
                  onChange={(e) => setNovoAnexo({ ...novoAnexo, nome_arquivo: e.target.value })}
                  placeholder="Ex: Hemograma_e_Colesterol_Fev2026.pdf"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Categoria do Documento
                  </label>
                  <select
                    value={novoAnexo.categoria}
                    onChange={(e) => setNovoAnexo({ ...novoAnexo, categoria: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34] bg-white cursor-pointer"
                  >
                    <option value="Exame Laboratorial">Exame Laboratorial (Sangue/Urina)</option>
                    <option value="Laudo de Imagem">Laudo de Imagem (RX/USG/TC/RM)</option>
                    <option value="Eletrocardiograma (ECG)">Eletrocardiograma (ECG)</option>
                    <option value="Foto Clínica / Lesão">Foto Clínica (Otoscopia / Lesão)</option>
                    <option value="Relatório Externo">Relatório Médico Externo</option>
                    <option value="Documento / Termo">Documento / Termo de Consentimento</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Tamanho Estimado
                  </label>
                  <input
                    type="text"
                    value={novoAnexo.tamanho_formatado}
                    onChange={(e) => setNovoAnexo({ ...novoAnexo, tamanho_formatado: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Observações Clínicas ou Achados Relevantes
                </label>
                <textarea
                  rows={2}
                  value={novoAnexo.observacoes}
                  onChange={(e) => setNovoAnexo({ ...novoAnexo, observacoes: e.target.value })}
                  placeholder="Ex: Hemoglobina 14.2 g/dL, colesterol LDL 98 mg/dL. Valores normais."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNovoAnexoModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white shadow-sm cursor-pointer"
                >
                  Salvar Anexo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VISUALIZADOR DE ANEXO (MODAL DE PREVIEW) */}
      {viewingAnexo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip size={18} className="text-[#1A3C34]" />
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {viewingAnexo.nome_arquivo}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    Categoria: <strong>{viewingAnexo.categoria}</strong> • {viewingAnexo.tamanho_formatado} • Upload em {new Date(viewingAnexo.data_upload).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingAnexo(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-8 bg-stone-50 rounded-xl border border-stone-200 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-[#1A3C34] shadow-xs">
                {viewingAnexo.categoria === 'Eletrocardiograma (ECG)' ? (
                  <Activity size={32} className="text-rose-600" />
                ) : viewingAnexo.categoria === 'Foto Clínica / Lesão' ? (
                  <ImageIcon size={32} className="text-emerald-600" />
                ) : (
                  <FileText size={32} className="text-[#1A3C34]" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-stone-800">{viewingAnexo.nome_arquivo}</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  {viewingAnexo.observacoes || 'Documento integrado ao prontuário médico sob sigilo profissional.'}
                </p>
                <p className="text-[10px] text-stone-400 mt-2">
                  Enviado por: {viewingAnexo.enviado_por}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  alert(`Download seguro simulado: Arquivo "${viewingAnexo.nome_arquivo}" descriptografado e baixado.`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold cursor-pointer"
              >
                <Download size={14} />
                <span>Baixar Cópia do Arquivo</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingAnexo(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
