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
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, Prontuario } from '../../types/clinical';
import { CidAutocompleteInput } from '../../components/common/CidAutocompleteInput';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const PacientesProntuariosPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

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
  const [feedback, setFeedback] = useState('');

  const reloadData = () => {
    const list = clinicalDb.getPacientes();
    setPacientes(list);
    setProntuarios(clinicalDb.getProntuarios());
    if (list.length > 0 && !selectedPaciente) {
      setSelectedPaciente(list[0]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const filteredPacientes = pacientes.filter(p =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cpf && p.cpf.includes(searchTerm)) ||
    (p.telefone && p.telefone.includes(searchTerm))
  );

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
    if (!selectedPaciente) return;

    clinicalDb.saveProntuario({
      paciente_id: selectedPaciente.id,
      profissional_nome: DOCTOR_INFO.fullName,
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

    setFeedback('Nova evolução clínica registrada no prontuário!');
    reloadData();
    setTimeout(() => setFeedback(''), 4000);
  };

  const prontuariosDoPaciente = selectedPaciente
    ? prontuarios.filter(pr => pr.paciente_id === selectedPaciente.id)
    : [];

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Prontuário Eletrônico do Paciente (PEP)
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Histórico de Consultas & Metodologia SOAP</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Gestão de Pacientes & Prontuários
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowNovoPacienteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus size={16} />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* PAINEL DUPLO: LISTA DE PACIENTES + PRONTUÁRIO SELECIONADO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA DA ESQUERDA: LISTA DE PACIENTES */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col overflow-hidden max-h-[800px]">
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
              <span>{filteredPacientes.length} paciente(s)</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {filteredPacientes.map((p) => {
              const isSelected = selectedPaciente?.id === p.id;
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
                  <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                    <Phone size={11} className="text-stone-400" />
                    <span>{p.telefone}</span>
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

        {/* COLUNA DA DIREITA: PRONTUÁRIO CLÍNICO DETALHADO */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPaciente ? (
            <div className="space-y-4">
              {/* FICHA DO PACIENTE */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {selectedPaciente.nome}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      CPF: {selectedPaciente.cpf || 'Não informado'} • Nascimento: {selectedPaciente.data_nascimento || 'Não informado'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/sistema/prescricoes"
                      className="px-3 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B38F48] text-[#142E28] text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <FileText size={13} />
                      <span>Nova Prescrição</span>
                    </Link>

                    <Link
                      to="/sistema/atestados"
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Award size={13} />
                      <span>Emitir Atestado</span>
                    </Link>
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

              {/* FORMULÁRIO DE NOVA EVOLUÇÃO SOAP */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <HeartPulse size={16} className="text-[#1A3C34]" />
                  <h4 className="font-serif font-bold text-sm text-stone-800">
                    Registrar Nova Evolução Clínica (Metodologia SOAP)
                  </h4>
                </div>

                <form onSubmit={handleAddEvolucao} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        S - Subjetivo (Queixa principal, sintomas relatados)
                      </label>
                      <textarea
                        rows={2}
                        value={novaEvolucao.subjetivo}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, subjetivo: e.target.value })}
                        placeholder="Relato do paciente..."
                        className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        O - Objetivo (Exame físico, PA, FC, Otoscopia)
                      </label>
                      <textarea
                        rows={2}
                        value={novaEvolucao.objetivo}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, objetivo: e.target.value })}
                        placeholder="Achados clínicos e sinais vitais..."
                        className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        A - Avaliação (Hipótese diagnóstica, raciocínio)
                      </label>
                      <textarea
                        rows={2}
                        value={novaEvolucao.avaliacao}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, avaliacao: e.target.value })}
                        placeholder="Diagnóstico clínico..."
                        className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-stone-700 block mb-1">
                        P - Plano (Conduta, medicamentos, exames, retorno)
                      </label>
                      <textarea
                        rows={2}
                        value={novaEvolucao.plano}
                        onChange={(e) => setNovaEvolucao({ ...novaEvolucao, plano: e.target.value })}
                        placeholder="Plano terapêutico..."
                        className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <CidAutocompleteInput
                      label="Diagnóstico de Hipótese / Conclusão (CID-10 & CID-11)"
                      value={novaEvolucao.diagnostico_cid}
                      onChange={(val) => setNovaEvolucao({ ...novaEvolucao, diagnostico_cid: val })}
                      placeholder="Digite o código ou nome (ex: I10, BA00, cerume, febre, ansiedade, diabetes)..."
                      helperText="Pesquisa instantânea ao digitar as primeiras letras do código ou patologia."
                      formatStyle="full"
                    />

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 size={15} />
                        <span>Salvar Evolução no Prontuário</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* HISTÓRICO DE EVOLUÇÕES CLÍNICAS */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <h4 className="font-serif font-bold text-sm text-stone-800">
                    Histórico de Evoluções e Consultas ({prontuariosDoPaciente.length})
                  </h4>
                  <span className="text-[11px] text-stone-400">
                    Registros permanentes
                  </span>
                </div>

                {prontuariosDoPaciente.length === 0 ? (
                  <div className="p-8 text-center text-stone-400 text-xs">
                    Nenhuma evolução clínica registrada ainda para este paciente.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prontuariosDoPaciente.map((pr) => (
                      <div
                        key={pr.id}
                        className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900">
                              {pr.profissional_nome}
                            </span>
                            {pr.diagnostico_cid && (
                              <span className="px-1.5 py-0.5 bg-stone-200 text-stone-700 rounded text-[10px] font-mono font-bold">
                                CID: {pr.diagnostico_cid}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500">
                            {new Date(pr.created_at).toLocaleDateString('pt-BR')} às{' '}
                            {new Date(pr.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {pr.subjetivo && (
                            <div>
                              <strong className="text-stone-700 block text-[11px]">S (Subjetivo):</strong>
                              <p className="text-stone-600 mt-0.5">{pr.subjetivo}</p>
                            </div>
                          )}
                          {pr.objetivo && (
                            <div>
                              <strong className="text-stone-700 block text-[11px]">O (Objetivo):</strong>
                              <p className="text-stone-600 mt-0.5">{pr.objetivo}</p>
                            </div>
                          )}
                          {pr.avaliacao && (
                            <div>
                              <strong className="text-stone-700 block text-[11px]">A (Avaliação):</strong>
                              <p className="text-stone-600 mt-0.5">{pr.avaliacao}</p>
                            </div>
                          )}
                          {pr.plano && (
                            <div>
                              <strong className="text-stone-700 block text-[11px]">P (Plano):</strong>
                              <p className="text-stone-600 mt-0.5">{pr.plano}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-stone-400">
              Selecione um paciente para visualizar o prontuário.
            </div>
          )}
        </div>
      </div>

      {/* MODAL NOVO PACIENTE */}
      {showNovoPacienteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-4">
              Cadastro de Paciente
            </h3>

            <form onSubmit={handleSaveNovoPaciente} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome Completo *
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
                  Condições Crônicas (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={novoPaciente.condicoes_cronicas}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, condicoes_cronicas: e.target.value })}
                  placeholder="Ex: Hipertensão, Rinite alérgica"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Alergias Medicamentosas / Alimentares
                </label>
                <input
                  type="text"
                  value={novoPaciente.alergias}
                  onChange={(e) => setNovoPaciente({ ...novoPaciente, alergias: e.target.value })}
                  placeholder="Ex: Dipirona, Penicilina"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNovoPacienteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white shadow-sm"
                >
                  Salvar Paciente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
