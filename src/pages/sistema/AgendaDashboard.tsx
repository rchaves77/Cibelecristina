import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  Filter
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Agendamento, AgendamentoStatus, Perfil } from '../../types/clinical';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const AgendaDashboard: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeUser, setActiveUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'lista'>('dia');
  const [filterSala, setFilterSala] = useState<number | 'todas'>('todas');
  
  // Modal de Agendamento
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    id?: number;
    paciente_nome: string;
    paciente_telefone: string;
    data: string; // YYYY-MM-DD
    hora_inicio: string; // HH:mm
    duracao: string; // "45"
    sala_id: number;
    servico_nome: string;
    valor_atendimento: number;
    forma_pagamento: 'Pix' | 'Dinheiro' | 'Cartão' | 'Transferência';
    observacoes: string;
  }>({
    paciente_nome: '',
    paciente_telefone: '',
    data: new Date().toISOString().split('T')[0],
    hora_inicio: '09:00',
    duracao: '45',
    sala_id: 1,
    servico_nome: 'Consulta Médica',
    valor_atendimento: 280,
    forma_pagamento: 'Pix',
    observacoes: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const reloadData = () => {
    setAgendamentos(clinicalDb.getAgendamentos());
    setActiveUser(clinicalDb.getActiveUser());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Filtragem de agendamentos para o dia selecionado
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const agendamentosDia = agendamentos.filter((a) => {
    const aDate = new Date(a.data_inicio).toISOString().split('T')[0];
    const matchDate = aDate === selectedDateStr;
    const matchSala = filterSala === 'todas' || a.sala_id === filterSala;
    return matchDate && matchSala;
  }).sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

  // Estatísticas do dia
  const totalAgendados = agendamentosDia.length;
  const atendidos = agendamentosDia.filter(a => a.status === 'Presenca').length;
  const faltas = agendamentosDia.filter(a => a.status === 'Falta').length;
  const faturamentoDia = agendamentosDia
    .filter(a => a.status !== 'Cancelado')
    .reduce((acc, curr) => acc + curr.valor_atendimento, 0);

  // Navegação de datas
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d);
  };

  const handleOpenNewAppointment = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setModalData({
      paciente_nome: '',
      paciente_telefone: '',
      data: selectedDateStr,
      hora_inicio: '09:00',
      duracao: '45',
      sala_id: 1,
      servico_nome: 'Consulta Médica',
      valor_atendimento: 280,
      forma_pagamento: 'Pix',
      observacoes: ''
    });
    setShowModal(true);
  };

  const handleSaveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!modalData.paciente_nome.trim()) {
      setErrorMessage('Informe o nome do paciente.');
      return;
    }

    const [h, m] = modalData.hora_inicio.split(':').map(Number);
    const durMin = parseInt(modalData.duracao, 10) || 45;

    const dataInicio = new Date(`${modalData.data}T00:00:00`);
    dataInicio.setHours(h, m, 0, 0);

    const dataFim = new Date(dataInicio.getTime() + durMin * 60000);

    const result = clinicalDb.saveAgendamento({
      id: modalData.id,
      sala_id: modalData.sala_id,
      profissional_nome: activeUser.nome,
      paciente_nome: modalData.paciente_nome.trim(),
      paciente_id: 0, // Será preenchido automaticamente pela regra de auto-cadastro
      paciente_telefone: modalData.paciente_telefone || '(68) 98103-4408',
      data_inicio: dataInicio.toISOString(),
      data_fim: dataFim.toISOString(),
      duracao: modalData.duracao,
      status: 'Agendado',
      valor_atendimento: Number(modalData.valor_atendimento) || 280,
      forma_pagamento: modalData.forma_pagamento,
      servico_nome: modalData.servico_nome,
      observacoes: modalData.observacoes
    });

    if (!result.success) {
      setErrorMessage(result.error || 'Erro ao salvar agendamento.');
      return;
    }

    setShowModal(false);
    setSuccessMessage('Agendamento salvo com sucesso!');
    reloadData();
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleStatusChange = (agendamentoId: number, newStatus: AgendamentoStatus) => {
    const agend = agendamentos.find(a => a.id === agendamentoId);
    if (!agend) return;

    clinicalDb.saveAgendamento({
      ...agend,
      status: newStatus
    });

    if (newStatus === 'Presenca') {
      setSuccessMessage(`Presença confirmada para ${agend.paciente_nome}! Registro clínico criado automaticamente no Prontuário.`);
      setTimeout(() => setSuccessMessage(''), 5000);
    }

    reloadData();
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Gestão de Consultório
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">
              Grade Horária: {activeUser.hora_inicio} às {activeUser.hora_fim} ({activeUser.dias_atendimento.join(', ')})
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Agenda Operacional & Atendimentos
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenNewAppointment}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus size={16} />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* ALERTAS DE SUCESSO / ERRO */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* CARDS DE RESUMO DO DIA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
            Agendamentos Hoje
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {totalAgendados}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Pacientes na grade</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-emerald-700 uppercase tracking-wider font-semibold block">
            Compareceram (Presença)
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            {atendidos}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Com prontuário aberto</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-rose-700 uppercase tracking-wider font-semibold block">
            Faltas / Desistências
          </span>
          <div className="text-2xl font-serif font-bold text-rose-800 mt-1">
            {faltas}
          </div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Horários liberados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold block">
            Faturamento Previsto
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            R$ {faturamentoDia.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Total de atendimentos</span>
        </div>
      </div>

      {/* BARRA DE CONTROLE DA DATA & FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Dia anterior"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
          >
            Hoje
          </button>

          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title="Próximo dia"
          >
            <ChevronRight size={16} />
          </button>

          <div className="flex items-center gap-1.5 pl-2 font-serif font-bold text-base text-[#1A3C34]">
            <CalendarIcon size={18} className="text-[#C5A059]" />
            <span>
              {selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
            <Filter size={13} className="text-stone-500 ml-1.5" />
            <select
              value={filterSala}
              onChange={(e) => setFilterSala(e.target.value === 'todas' ? 'todas' : Number(e.target.value))}
              className="bg-transparent text-xs text-stone-700 focus:outline-none pr-2 font-medium"
            >
              <option value="todas">Todas as Salas</option>
              <option value="1">Sala 01 (Principal)</option>
              <option value="2">Sala 02 (Procedimentos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTA DE AGENDAMENTOS DO DIA */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-stone-800">
            Escala de Atendimentos
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {agendamentosDia.length} agendamento(s) para este dia
          </span>
        </div>

        {agendamentosDia.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarIcon size={36} className="mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-medium text-stone-600">
              Nenhum agendamento cadastrado para esta data.
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Clique em "+ Novo Agendamento" para reservar um horário.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {agendamentosDia.map((agend) => {
              const hInicio = new Date(agend.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              const hFim = new Date(agend.data_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

              const isPresenca = agend.status === 'Presenca';
              const isFalta = agend.status === 'Falta';

              return (
                <div
                  key={agend.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isPresenca ? 'bg-emerald-50/40' : isFalta ? 'bg-rose-50/30' : 'hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Horário */}
                    <div className="w-20 text-center py-2 px-1 bg-stone-100 rounded-xl border border-stone-200 shrink-0">
                      <span className="text-xs font-bold text-stone-800 block">{hInicio}</span>
                      <span className="text-[10px] text-stone-500 block">até {hFim}</span>
                    </div>

                    {/* Dados do Paciente e Consulta */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm text-stone-900">
                          {agend.paciente_nome}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#C5A059]/15 text-[#8F7030]">
                          Sala 0{agend.sala_id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600">
                          {agend.servico_nome || 'Consulta'}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-stone-500 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-stone-400" />
                          {agend.paciente_telefone}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} className="text-stone-400" />
                          R$ {agend.valor_atendimento.toFixed(2)} ({agend.forma_pagamento})
                        </span>
                      </div>

                      {agend.observacoes && (
                        <p className="text-[11px] text-stone-500 mt-1 italic">
                          Obs: {agend.observacoes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações e Mudança de Status */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {/* Botão de WhatsApp Rápido */}
                    <a
                      href={`https://wa.me/55${agend.paciente_telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${agend.paciente_nome}! Aqui é da equipe da Dra. Cibele Cristina confirmando sua consulta de ${agend.servico_nome}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                      title="Abrir WhatsApp com o paciente"
                    >
                      <Send size={14} />
                    </a>

                    {/* Seletor de Status com Gatilho de Evolução Clínica Automática */}
                    <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(agend.id, 'Agendado')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          agend.status === 'Agendado' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Agendado
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(agend.id, 'Presenca')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          isPresenca ? 'bg-emerald-600 text-white shadow-xs font-semibold' : 'text-stone-500 hover:text-emerald-700'
                        }`}
                        title="Marcar presença e abrir evolução clínica no prontuário"
                      >
                        Presença ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(agend.id, 'Falta')}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                          isFalta ? 'bg-rose-600 text-white shadow-xs font-semibold' : 'text-stone-500 hover:text-rose-700'
                        }`}
                      >
                        Falta ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE NOVO AGENDAMENTO COM VALIDAÇÃO DE GRADE E CHOQUE */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Novo Agendamento de Consulta
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveAppointment} className="mt-4 space-y-3.5 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome Completo do Paciente *
                </label>
                <input
                  type="text"
                  required
                  value={modalData.paciente_nome}
                  onChange={(e) => setModalData({ ...modalData, paciente_nome: e.target.value })}
                  placeholder="Ex: Ana Maria da Silva"
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  * Pacientes não cadastrados previamente serão registrados automaticamente no banco.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={modalData.paciente_telefone}
                    onChange={(e) => setModalData({ ...modalData, paciente_telefone: e.target.value })}
                    placeholder="(68) 99999-9999"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Serviço Desejado
                  </label>
                  <select
                    value={modalData.servico_nome}
                    onChange={(e) => setModalData({ ...modalData, servico_nome: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  >
                    <option value="Consulta Médica">Consulta Médica</option>
                    <option value="Lavagem Otológica">Lavagem Otológica</option>
                    <option value="Check-up">Check-up Preventivo</option>
                    <option value="Doenças Crônicas">Acompanhamento Crônicos</option>
                    <option value="Telemedicina">Telemedicina</option>
                    <option value="Visita Domiciliar">Visita Domiciliar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={modalData.data}
                    onChange={(e) => setModalData({ ...modalData, data: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Início
                  </label>
                  <input
                    type="time"
                    required
                    value={modalData.hora_inicio}
                    onChange={(e) => setModalData({ ...modalData, hora_inicio: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Duração
                  </label>
                  <select
                    value={modalData.duracao}
                    onChange={(e) => setModalData({ ...modalData, duracao: e.target.value })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  >
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Sala
                  </label>
                  <select
                    value={modalData.sala_id}
                    onChange={(e) => setModalData({ ...modalData, sala_id: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  >
                    <option value={1}>Sala 01</option>
                    <option value={2}>Sala 02</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    value={modalData.valor_atendimento}
                    onChange={(e) => setModalData({ ...modalData, valor_atendimento: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Pagamento
                  </label>
                  <select
                    value={modalData.forma_pagamento}
                    onChange={(e) => setModalData({ ...modalData, forma_pagamento: e.target.value as any })}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  >
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Observações Clínicas / Queixa Inicial
                </label>
                <textarea
                  rows={2}
                  value={modalData.observacoes}
                  onChange={(e) => setModalData({ ...modalData, observacoes: e.target.value })}
                  placeholder="Ex: Queixa de dor de garganta há 3 dias..."
                  className="w-full text-xs p-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1A3C34] hover:bg-[#142E28] text-white shadow-sm"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
