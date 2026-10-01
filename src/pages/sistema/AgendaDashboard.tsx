import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CalendarDays,
  CalendarRange,
  List,
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
  Filter,
  Check,
  X,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Agendamento, AgendamentoStatus, Perfil } from '../../types/clinical';

export const AgendaDashboard: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeUser, setActiveUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [viewMode, setViewMode] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [filterSala, setFilterSala] = useState<number | 'todas'>('todas');
  
  // Modal de Detalhes / Edição Rápida de Agendamento
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);

  // Modal de Novo Agendamento
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

  // Helper de formatação de string YYYY-MM-DD local
  const toLocalDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = toLocalDateString(selectedDate);
  const todayStr = toLocalDateString(new Date());

  // Navegação de datas conforme o viewMode
  const handleNavigate = (direction: -1 | 1) => {
    const d = new Date(selectedDate);
    if (viewMode === 'dia') {
      d.setDate(d.getDate() + direction);
    } else if (viewMode === 'semana') {
      d.setDate(d.getDate() + direction * 7);
    } else if (viewMode === 'mes') {
      d.setMonth(d.getMonth() + direction);
    }
    setSelectedDate(d);
  };

  const handleGoToday = () => {
    setSelectedDate(new Date());
  };

  // Cálculo da Semana (Segunda a Domingo)
  const getWeekDays = (baseDate: Date): Date[] => {
    const current = new Date(baseDate);
    const day = current.getDay(); // 0 = Domingo, 1 = Segunda ...
    // Ajustar para que a semana comece na Segunda-feira (1). Se for Domingo (0), recua 6 dias
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDays = getWeekDays(selectedDate);
  const weekStartStr = toLocalDateString(weekDays[0]);
  const weekEndStr = toLocalDateString(weekDays[6]);

  // Cálculo da Grade Mensal
  const getMonthGridDays = (baseDate: Date): { date: Date; isCurrentMonth: boolean; dateStr: string }[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstDayIndex = firstDayOfMonth.getDay(); // 0 = Domingo
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const gridDays: { date: Date; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Dias do mês anterior para completar a primeira linha
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      gridDays.push({
        date: prevDate,
        isCurrentMonth: false,
        dateStr: toLocalDateString(prevDate)
      });
    }

    // Dias do mês atual
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const currDate = new Date(year, month, i);
      gridDays.push({
        date: currDate,
        isCurrentMonth: true,
        dateStr: toLocalDateString(currDate)
      });
    }

    // Dias do próximo mês para completar o grid (múltiplo de 7, totalizando 35 ou 42 células)
    const remaining = (7 - (gridDays.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      gridDays.push({
        date: nextDate,
        isCurrentMonth: false,
        dateStr: toLocalDateString(nextDate)
      });
    }

    return gridDays;
  };

  const monthGrid = getMonthGridDays(selectedDate);

  // Filtragem dos agendamentos pela sala
  const agendamentosFiltrados = agendamentos.filter((a) => {
    return filterSala === 'todas' || a.sala_id === filterSala;
  });

  // Agendamentos do dia selecionado
  const agendamentosDia = agendamentosFiltrados.filter((a) => {
    const aDateStr = toLocalDateString(new Date(a.data_inicio));
    return aDateStr === selectedDateStr;
  }).sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

  // Agendamentos do período atual para os cards estatísticos
  const agendamentosPeriodo = agendamentosFiltrados.filter((a) => {
    const aDateStr = toLocalDateString(new Date(a.data_inicio));
    if (viewMode === 'dia') {
      return aDateStr === selectedDateStr;
    } else if (viewMode === 'semana') {
      return aDateStr >= weekStartStr && aDateStr <= weekEndStr;
    } else {
      // Mês
      const aDate = new Date(a.data_inicio);
      return aDate.getFullYear() === selectedDate.getFullYear() && aDate.getMonth() === selectedDate.getMonth();
    }
  });

  const totalPeriodo = agendamentosPeriodo.length;
  const atendidosPeriodo = agendamentosPeriodo.filter(a => a.status === 'Presenca').length;
  const faltasPeriodo = agendamentosPeriodo.filter(a => a.status === 'Falta').length;
  const faturamentoPeriodo = agendamentosPeriodo
    .filter(a => a.status !== 'Cancelado')
    .reduce((acc, curr) => acc + curr.valor_atendimento, 0);

  // Abrir Modal para agendar em uma data específica
  const handleOpenNewAppointment = (targetDateStr?: string, defaultHour: string = '09:00') => {
    setErrorMessage('');
    setSuccessMessage('');
    setModalData({
      paciente_nome: '',
      paciente_telefone: '',
      data: targetDateStr || selectedDateStr,
      hora_inicio: defaultHour,
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
      paciente_id: 0,
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

    if (selectedAgendamento && selectedAgendamento.id === agendamentoId) {
      setSelectedAgendamento({ ...agend, status: newStatus });
    }

    reloadData();
  };

  const handleDeleteAgendamento = (agendamentoId: number) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;
    clinicalDb.deleteAgendamento(agendamentoId);
    setSelectedAgendamento(null);
    setSuccessMessage('Agendamento cancelado com sucesso.');
    setTimeout(() => setSuccessMessage(''), 4000);
    reloadData();
  };

  // Helper de visualização de título do cabeçalho de datas
  const renderDateTitle = () => {
    if (viewMode === 'dia') {
      return (
        <span className="capitalize">
          {selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      );
    } else if (viewMode === 'semana') {
      const dInicio = weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      const dFim = weekDays[6].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
      return (
        <span>
          Semana: <span className="text-stone-900 font-semibold">{dInicio}</span> a <span className="text-stone-900 font-semibold">{dFim}</span>
        </span>
      );
    } else {
      return (
        <span className="capitalize">
          {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </span>
      );
    }
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

        <div className="flex items-center gap-2.5">
          {/* SELETOR DE MODO DE VISUALIZAÇÃO: DIÁRIO | SEMANAL | MENSAL */}
          <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('dia')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'dia'
                  ? 'bg-[#1A3C34] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List size={14} />
              <span>Diário</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('semana')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'semana'
                  ? 'bg-[#1A3C34] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarRange size={14} />
              <span>Semanal</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('mes')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'mes'
                  ? 'bg-[#1A3C34] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarDays size={14} />
              <span>Mensal</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleOpenNewAppointment()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
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

      {/* CARDS DE RESUMO DO PERÍODO SELECIONADO (DIA / SEMANA / MÊS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
            Agendamentos ({viewMode === 'dia' ? 'Dia' : viewMode === 'semana' ? 'Semana' : 'Mês'})
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            {totalPeriodo}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Pacientes na grade</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-emerald-700 uppercase tracking-wider font-semibold block">
            Compareceram (Presença)
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            {atendidosPeriodo}
          </div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Com prontuário aberto</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-rose-700 uppercase tracking-wider font-semibold block">
            Faltas / Desistências
          </span>
          <div className="text-2xl font-serif font-bold text-rose-800 mt-1">
            {faltasPeriodo}
          </div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Horários liberados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold block">
            Faturamento Previsto
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            R$ {faturamentoPeriodo.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">Total no período</span>
        </div>
      </div>

      {/* BARRA DE CONTROLE DA DATA & FILTROS */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavigate(-1)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title={viewMode === 'dia' ? 'Dia anterior' : viewMode === 'semana' ? 'Semana anterior' : 'Mês anterior'}
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={handleGoToday}
            className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
          >
            Hoje
          </button>

          <button
            onClick={() => handleNavigate(1)}
            className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
            title={viewMode === 'dia' ? 'Próximo dia' : viewMode === 'semana' ? 'Próxima semana' : 'Próximo mês'}
          >
            <ChevronRight size={16} />
          </button>

          <div className="flex items-center gap-1.5 pl-2 font-serif font-bold text-base text-[#1A3C34]">
            <CalendarIcon size={18} className="text-[#C5A059] shrink-0" />
            {renderDateTitle()}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
            <Filter size={13} className="text-stone-500 ml-1.5" />
            <select
              value={filterSala}
              onChange={(e) => setFilterSala(e.target.value === 'todas' ? 'todas' : Number(e.target.value))}
              className="bg-transparent text-xs text-stone-700 focus:outline-none pr-2 font-medium cursor-pointer"
            >
              <option value="todas">Todas as Salas</option>
              <option value="1">Sala 01 (Principal)</option>
              <option value="2">Sala 02 (Procedimentos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MODO DIÁRIO: LISTA COMPLETA E DETALHADA                */}
      {/* ========================================================= */}
      {viewMode === 'dia' && (
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
              <p className="text-xs text-stone-400 mt-1 mb-4">
                Clique no botão abaixo para reservar um horário.
              </p>
              <button
                type="button"
                onClick={() => handleOpenNewAppointment(selectedDateStr)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold transition-all"
              >
                <Plus size={14} />
                <span>Agendar para este dia</span>
              </button>
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
                          <button
                            type="button"
                            onClick={() => setSelectedAgendamento(agend)}
                            className="font-semibold text-sm text-stone-900 hover:text-[#1A3C34] hover:underline text-left"
                          >
                            {agend.paciente_nome}
                          </button>
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
                      {/* WhatsApp Rápido */}
                      <a
                        href={`https://wa.me/55${agend.paciente_telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${agend.paciente_nome}! Aqui é da equipe da Dra. Cibele Cristina confirmando sua consulta de ${agend.servico_nome}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                        title="Abrir WhatsApp com o paciente"
                      >
                        <Send size={14} />
                      </a>

                      {/* Seletor de Status com Gatilho Automático */}
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
      )}

      {/* ========================================================= */}
      {/* 2. MODO SEMANAL: GRADE DE 7 COLUNAS (SEGUNDA A DOMINGO)    */}
      {/* ========================================================= */}
      {viewMode === 'semana' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-800">
                Visão Semanal de Consultas
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Clique em qualquer horário ou no botão "+" para agendar diretamente no dia.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Presença
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Agendado
              </span>
              <span className="flex items-center gap-1.5 text-stone-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Falta
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-stone-200">
            {weekDays.map((dayDate, idx) => {
              const dayStr = toLocalDateString(dayDate);
              const isToday = dayStr === todayStr;
              const isSelectedDay = dayStr === selectedDateStr;

              // Agendamentos deste dia específico da semana
              const dayAgendamentos = agendamentosFiltrados
                .filter(a => toLocalDateString(new Date(a.data_inicio)) === dayStr)
                .sort((a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime());

              const dayName = dayDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
              const dayNum = dayDate.getDate();

              return (
                <div
                  key={idx}
                  className={`min-h-[460px] flex flex-col p-2.5 transition-colors ${
                    isToday ? 'bg-emerald-50/20' : isSelectedDay ? 'bg-stone-50/70' : 'bg-white'
                  }`}
                >
                  {/* Cabeçalho do Dia */}
                  <div className="pb-2 mb-2 border-b border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                          isToday
                            ? 'bg-[#1A3C34] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {dayNum}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold text-stone-700 block leading-tight">
                          {dayName}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {dayAgendamentos.length} pac.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenNewAppointment(dayStr)}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                      title={`Novo agendamento em ${dayNum}/${dayDate.getMonth() + 1}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Lista de Atendimentos do Dia */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayAgendamentos.length === 0 ? (
                      <div
                        onClick={() => handleOpenNewAppointment(dayStr)}
                        className="h-28 border border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center text-center p-2 text-stone-400 hover:border-[#1A3C34]/40 hover:text-stone-600 hover:bg-stone-50/50 cursor-pointer transition-all"
                      >
                        <span className="text-[11px] font-medium">+ Livre</span>
                        <span className="text-[10px] opacity-75">Clique p/ agendar</span>
                      </div>
                    ) : (
                      dayAgendamentos.map((agend) => {
                        const hInicio = new Date(agend.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        const isPresenca = agend.status === 'Presenca';
                        const isFalta = agend.status === 'Falta';

                        return (
                          <div
                            key={agend.id}
                            onClick={() => setSelectedAgendamento(agend)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs hover:shadow-xs ${
                              isPresenca
                                ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300'
                                : isFalta
                                ? 'bg-rose-50/80 border-rose-200 hover:border-rose-300'
                                : 'bg-white border-stone-200 hover:border-[#1A3C34]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-[11px] text-stone-800 flex items-center gap-1">
                                <Clock size={11} className="text-stone-400" />
                                {hInicio}
                              </span>
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isPresenca
                                    ? 'bg-emerald-500'
                                    : isFalta
                                    ? 'bg-rose-500'
                                    : 'bg-amber-400'
                                }`}
                              />
                            </div>

                            <p className="font-semibold text-stone-900 truncate text-[11.5px]" title={agend.paciente_nome}>
                              {agend.paciente_nome}
                            </p>

                            <div className="flex items-center justify-between mt-1 text-[10px] text-stone-500">
                              <span className="truncate max-w-[80px]">
                                {agend.servico_nome || 'Consulta'}
                              </span>
                              <span className="font-medium text-stone-600">
                                S0{agend.sala_id}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODO MENSAL: GRADE CALENDÁRIO 7X5 COM PILLS E DIAS     */}
      {/* ========================================================= */}
      {viewMode === 'mes' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Cabeçalho dos Dias da Semana */}
            <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center text-xs font-bold text-stone-600 py-2.5">
              <span>DOM</span>
              <span>SEG</span>
              <span>TER</span>
              <span>QUA</span>
              <span>QUI</span>
              <span>SEX</span>
              <span>SÁB</span>
            </div>

            {/* Grid dos Dias do Mês */}
            <div className="grid grid-cols-7 divide-x divide-y divide-stone-100">
              {monthGrid.map((cell, idx) => {
                const isToday = cell.dateStr === todayStr;
                const isSelected = cell.dateStr === selectedDateStr;

                // Agendamentos deste dia
                const dayAgendamentos = agendamentosFiltrados.filter(
                  a => toLocalDateString(new Date(a.data_inicio)) === cell.dateStr
                );

                const hasAgendamentos = dayAgendamentos.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(cell.date)}
                    className={`min-h-[105px] p-2 flex flex-col justify-between transition-all cursor-pointer group ${
                      !cell.isCurrentMonth
                        ? 'bg-stone-50/40 text-stone-300'
                        : isSelected
                        ? 'bg-[#1A3C34]/5 ring-2 ring-inset ring-[#1A3C34]'
                        : isToday
                        ? 'bg-emerald-50/30'
                        : 'bg-white hover:bg-stone-50/80'
                    }`}
                  >
                    {/* Topo da Célula: Número do Dia e Botão + */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday
                            ? 'bg-[#1A3C34] text-white shadow-xs'
                            : isSelected
                            ? 'bg-[#C5A059] text-white'
                            : cell.isCurrentMonth
                            ? 'text-stone-800'
                            : 'text-stone-400'
                        }`}
                      >
                        {cell.date.getDate()}
                      </span>

                      <div className="flex items-center gap-1">
                        {hasAgendamentos && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-stone-200/80 text-stone-700">
                            {dayAgendamentos.length}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNewAppointment(cell.dateStr);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-opacity"
                          title="Agendar neste dia"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Chips de Agendamento (até 2 ou 3) */}
                    <div className="mt-1 space-y-1 flex-1 overflow-hidden">
                      {dayAgendamentos.slice(0, 2).map((agend) => {
                        const hInicio = new Date(agend.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        const isPresenca = agend.status === 'Presenca';
                        const isFalta = agend.status === 'Falta';

                        return (
                          <div
                            key={agend.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAgendamento(agend);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                              isPresenca
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : isFalta
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-[#1A3C34]/10 text-[#1A3C34] hover:bg-[#1A3C34]/20'
                            }`}
                            title={`${hInicio} - ${agend.paciente_nome} (${agend.servico_nome || 'Consulta'})`}
                          >
                            <span className="font-bold shrink-0">{hInicio}</span>
                            <span className="truncate">{agend.paciente_nome}</span>
                          </div>
                        );
                      })}

                      {dayAgendamentos.length > 2 && (
                        <div className="text-[9.5px] font-semibold text-stone-500 pl-1">
                          +{dayAgendamentos.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAINEL DETALHADO DO DIA SELECIONADO NO MÊS */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#C5A059]" />
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Agendamentos de{' '}
                  <span className="capitalize">
                    {selectedDate.toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('dia')}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
                >
                  Abrir no Modo Diário
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenNewAppointment(selectedDateStr)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold"
                >
                  <Plus size={14} />
                  <span>Novo Agendamento</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              {agendamentosDia.length === 0 ? (
                <p className="text-xs text-stone-500 py-3 text-center">
                  Nenhum atendimento marcado para este dia selecionado.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agendamentosDia.map((agend) => {
                    const hInicio = new Date(agend.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    const isPresenca = agend.status === 'Presenca';
                    const isFalta = agend.status === 'Falta';

                    return (
                      <div
                        key={agend.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                          isPresenca ? 'bg-emerald-50/40 border-emerald-200' : isFalta ? 'bg-rose-50/30 border-rose-200' : 'bg-stone-50/50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#1A3C34] block">
                              {hInicio} • Sala 0{agend.sala_id}
                            </span>
                            <h5 className="font-semibold text-stone-900 text-sm mt-0.5">
                              {agend.paciente_nome}
                            </h5>
                            <span className="text-[11px] text-stone-500 block">
                              {agend.servico_nome} • {agend.paciente_telefone}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPresenca
                                ? 'bg-emerald-100 text-emerald-800'
                                : isFalta
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {agend.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                          <button
                            type="button"
                            onClick={() => setSelectedAgendamento(agend)}
                            className="text-xs text-[#1A3C34] hover:underline font-semibold"
                          >
                            Ver detalhes
                          </button>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(agend.id, 'Presenca')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold"
                            >
                              Presença ✓
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(agend.id, 'Falta')}
                              className="px-2 py-1 rounded bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 text-[10px] font-semibold"
                            >
                              Falta
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE DETALHES RÁPIDOS DO AGENDAMENTO SELECIONADO      */}
      {/* ========================================================= */}
      {selectedAgendamento && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#1A3C34]/10 text-[#1A3C34] flex items-center justify-center font-bold text-xs">
                  S0{selectedAgendamento.sala_id}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                    {selectedAgendamento.paciente_nome}
                  </h3>
                  <span className="text-[11px] text-stone-500">
                    {selectedAgendamento.servico_nome}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgendamento(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-500">Data & Horário:</span>
                <span className="font-semibold text-stone-800">
                  {new Date(selectedAgendamento.data_inicio).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(selectedAgendamento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-500">Telefone / WhatsApp:</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-800">{selectedAgendamento.paciente_telefone}</span>
                  <a
                    href={`https://wa.me/55${selectedAgendamento.paciente_telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá, ${selectedAgendamento.paciente_nome}! Aqui é da equipe da Dra. Cibele Cristina confirmando sua consulta de ${selectedAgendamento.servico_nome}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    title="WhatsApp"
                  >
                    <Send size={12} />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-500">Valor & Pagamento:</span>
                <span className="font-semibold text-stone-800">
                  R$ {selectedAgendamento.valor_atendimento.toFixed(2)} ({selectedAgendamento.forma_pagamento})
                </span>
              </div>

              {selectedAgendamento.observacoes && (
                <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                  <span className="font-semibold block text-[11px] mb-0.5">Observações:</span>
                  <p className="italic">{selectedAgendamento.observacoes}</p>
                </div>
              )}

              {/* Status do Atendimento */}
              <div className="pt-2">
                <span className="text-stone-600 font-semibold block mb-1.5">Alterar Situação:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAgendamento.id, 'Agendado')}
                    className={`py-2 rounded-xl font-semibold text-center transition-all ${
                      selectedAgendamento.status === 'Agendado'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Agendado
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAgendamento.id, 'Presenca')}
                    className={`py-2 rounded-xl font-semibold text-center transition-all ${
                      selectedAgendamento.status === 'Presenca'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    Presença ✓
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedAgendamento.id, 'Falta')}
                    className={`py-2 rounded-xl font-semibold text-center transition-all ${
                      selectedAgendamento.status === 'Falta'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    Falta ✕
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteAgendamento(selectedAgendamento.id)}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-medium"
              >
                <Trash2 size={14} />
                <span>Cancelar Agendamento</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAgendamento(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE NOVO AGENDAMENTO COM VALIDAÇÃO DE GRADE E CHOQUE */}
      {/* ========================================================= */}
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
