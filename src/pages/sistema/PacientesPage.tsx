import React, { useState, useEffect } from 'react';
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
  Eye,
  Trash2,
  Activity,
  X,
  Stethoscope,
  Filter,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, Perfil } from '../../types/clinical';

export const PacientesPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterConvenio, setFilterConvenio] = useState<string>('Todos');
  const [feedback, setFeedback] = useState('');

  // Modal Novo Paciente
  const [showNovoPacienteModal, setShowNovoPacienteModal] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState<{
    nome: string;
    cpf: string;
    telefone: string;
    email: string;
    data_nascimento: string;
    convenio: string;
    condicoes_cronicas: string;
    alergias: string;
  }>({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    convenio: 'Particular',
    condicoes_cronicas: '',
    alergias: ''
  });

  const reloadData = () => {
    setCurrentUser(clinicalDb.getActiveUser());
    setPacientes(clinicalDb.getPacientes());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const filteredPacientes = pacientes.filter(p => {
    const matchSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.cpf && p.cpf.includes(searchTerm)) ||
      (p.telefone && p.telefone.includes(searchTerm)) ||
      (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchConvenio =
      filterConvenio === 'Todos' ||
      (p.convenio && p.convenio.toLowerCase() === filterConvenio.toLowerCase());

    return matchSearch && matchConvenio;
  });

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
      convenio: novoPaciente.convenio || 'Particular',
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
      convenio: 'Particular',
      condicoes_cronicas: '',
      alergias: ''
    });

    setFeedback(`Paciente ${p.nome} cadastrado com sucesso! Redirecionando para o prontuário...`);
    reloadData();

    // Navega diretamente para o prontuário do novo paciente
    setTimeout(() => {
      navigate(`/sistema/prontuario/${p.id}`);
    }, 1200);
  };

  const handleOpenProntuario = (pacienteId: number) => {
    navigate(`/sistema/prontuario/${pacienteId}`);
  };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const totalAnexosCount = clinicalDb.getAnexos().length;
  const totalEvolucoesCount = clinicalDb.getProntuarios().length;

  return (
    <div className="space-y-6 antialiased">
      {/* CABEÇALHO DO PAINEL DE PACIENTES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#1A3C34]/10 text-[#1A3C34]">
              Módulo de Gestão Clinica e Cadastro
            </span>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">
              Base de Dados Unificada Medicinarte
            </span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-stone-900 tracking-tight">
            Pacientes
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Selecione um paciente para abrir sua página exclusiva de Prontuário Eletrônico (PEP)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNovoPacienteModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
        >
          <UserPlus size={18} />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {feedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* METRICAS RAPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C34]/10 text-[#1A3C34] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
              Total de Pacientes
            </span>
            <span className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
              {pacientes.length}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C5A059]/15 text-[#8F7030] flex items-center justify-center shrink-0">
            <Stethoscope size={22} />
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
              Evoluções Gravadas
            </span>
            <span className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
              {totalEvolucoesCount}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Paperclip size={22} />
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
              Anexos / Laudos / Fotos
            </span>
            <span className="text-2xl font-bold font-serif text-stone-900 tabular-nums">
              {totalAnexosCount}
            </span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider block">
              Sigilo LGPD & CFM
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              100% Criptografado
            </span>
          </div>
        </div>
      </div>

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF, telefone ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter size={14} className="text-stone-400 shrink-0" />
          <span className="text-xs text-stone-500 font-medium shrink-0">Convênio:</span>
          {['Todos', 'Particular', 'Unimed', 'Bradesco'].map((conv) => (
            <button
              key={conv}
              type="button"
              onClick={() => setFilterConvenio(conv)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                filterConvenio === conv
                  ? 'bg-[#1A3C34] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {conv}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA E CARDS DE PACIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPacientes.map((p) => {
          const age = calculateAge(p.data_nascimento);
          const pAnexos = clinicalDb.getAnexos().filter(a => a.paciente_id === p.id);
          const pEvolucoes = clinicalDb.getProntuarios().filter(pr => pr.paciente_id === p.id);

          return (
            <div
              key={p.id}
              onClick={() => handleOpenProntuario(p.id)}
              className="group bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs hover:shadow-md hover:border-[#1A3C34]/40 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1A3C34] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                      {p.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-[#1A3C34] transition-colors line-clamp-1">
                        {p.nome}
                      </h3>
                      <p className="text-[11px] text-stone-400 font-mono">
                        ID: #{p.id} {age !== null ? `• ${age} anos` : ''}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C5A059]/15 text-[#8F7030]">
                    {p.convenio || 'Particular'}
                  </span>
                </div>

                {/* DADOS DE CONTATO */}
                <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  {p.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-stone-400 shrink-0" />
                      <span>{p.telefone}</span>
                    </div>
                  )}
                  {p.email && (
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={13} className="text-stone-400 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>
                  )}
                  {p.cpf && (
                    <div className="flex items-center gap-2">
                      <FileText size={13} className="text-stone-400 shrink-0" />
                      <span className="font-mono text-[11px]">CPF: {p.cpf}</span>
                    </div>
                  )}
                </div>

                {/* TAGS DE ALERTAS & CONDICOES */}
                {((p.alergias && p.alergias.length > 0) || (p.condicoes_cronicas && p.condicoes_cronicas.length > 0)) && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.alergias?.map((al, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200"
                      >
                        ⚠️ Alergia: {al}
                      </span>
                    ))}
                    {p.condicoes_cronicas?.map((cond, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#C5A059]/15 text-[#8F7030]"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER DO CARD DO PACIENTE */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Stethoscope size={13} className="text-[#1A3C34]" />
                    <span>{pEvolucoes.length} evolução(ões)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Paperclip size={13} className="text-stone-400" />
                    <span>{pAnexos.length} anexo(s)</span>
                  </span>
                </div>

                <div className="inline-flex items-center gap-1 text-[#1A3C34] font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Abrir Prontuário</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          );
        })}

        {filteredPacientes.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
            <Users size={40} className="mx-auto text-stone-300" />
            <h3 className="font-serif font-bold text-lg text-stone-800">
              Nenhum paciente encontrado
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Não encontramos nenhum paciente correspondente à busca "{searchTerm}". Você pode cadastrar um novo paciente no botão acima.
            </p>
          </div>
        )}
      </div>

      {/* MODAL NOVO PACIENTE */}
      {showNovoPacienteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1A3C34] text-white flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Cadastrar Novo Paciente
                  </h3>
                  <p className="text-xs text-stone-500">
                    Preencha os dados cadastrais do paciente para criação de prontuário
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNovoPacienteModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNovoPaciente} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={novoPaciente.nome}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                  placeholder="ex: Maria da Silva Albuquerque"
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">CPF</label>
                  <input
                    type="text"
                    value={novoPaciente.cpf}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={novoPaciente.telefone}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                    placeholder="(68) 99999-0000"
                    className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">E-mail</label>
                  <input
                    type="email"
                    value={novoPaciente.email}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                    placeholder="paciente@email.com"
                    className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Data de Nascimento</label>
                  <input
                    type="date"
                    value={novoPaciente.data_nascimento}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, data_nascimento: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Convênio</label>
                <select
                  value={novoPaciente.convenio}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, convenio: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                >
                  <option value="Particular">Particular</option>
                  <option value="Unimed">Unimed</option>
                  <option value="Bradesco Saúde">Bradesco Saúde</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Condições Crônicas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={novoPaciente.condicoes_cronicas}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, condicoes_cronicas: e.target.value })}
                  placeholder="ex: Hipertensão, Diabetes tipo 2, Enxaqueca"
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">
                  Alergias Conocidas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={novoPaciente.alergias}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, alergias: e.target.value })}
                  placeholder="ex: Dipirona, Penicilina, Frutos do mar"
                  className="w-full p-2.5 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowNovoPacienteModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Salvar e Abrir Prontuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
