import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';

export const RelatoriosPage: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);

  useEffect(() => {
    setAgendamentos(clinicalDb.getAgendamentos());
  }, []);

  // Dados para Gráfico de Serviços
  const servicosCount: Record<string, number> = {};
  agendamentos.forEach((a) => {
    const s = a.servico_nome || 'Consulta';
    servicosCount[s] = (servicosCount[s] || 0) + 1;
  });

  const servicosData = Object.entries(servicosCount).map(([name, total]) => ({
    name,
    total
  }));

  // Dados para Gráfico de Comparecimento (Presença vs Falta vs Agendado)
  const statusCount = {
    Presenca: agendamentos.filter(a => a.status === 'Presenca').length,
    Agendado: agendamentos.filter(a => a.status === 'Agendado').length,
    Falta: agendamentos.filter(a => a.status === 'Falta').length,
  };

  const statusData = [
    { name: 'Presença Confirmada', value: statusCount.Presenca, color: '#1A3C34' },
    { name: 'Aguardando Atendimento', value: statusCount.Agendado, color: '#C5A059' },
    { name: 'Faltas / Desistências', value: statusCount.Falta, color: '#E11D48' },
  ];

  // Dados de Forma de Pagamento
  const pagamentoCount: Record<string, number> = {};
  agendamentos.forEach((a) => {
    const p = a.forma_pagamento || 'Pix';
    pagamentoCount[p] = (pagamentoCount[p] || 0) + a.valor_atendimento;
  });

  const pagamentoData = Object.entries(pagamentoCount).map(([name, valor]) => ({
    name,
    valor
  }));

  const COLORS = ['#1A3C34', '#C5A059', '#3B82F6', '#10B981'];

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C5A059]/15 text-[#8F7030]">
            Business Intelligence Clínico
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500">Métricas de fidelização e adesão terapêutica</span>
        </div>
        <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
          Indicadores de Desempenho & Estatísticas
        </h2>
      </div>

      {/* GRÁFICOS ANALÍTICOS COM RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1: ATENDIMENTOS POR TIPO DE SERVIÇO */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-stone-800">
            Distribuição de Atendimentos por Especialidade / Procedimento
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicosData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#1A3C34" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO 2: TAXA DE COMPARECIMENTO (PIE CHART) */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-sm text-stone-800">
            Adesão de Pacientes: Presenças vs Faltas
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GRÁFICO 3: RECEITA POR FORMA DE PAGAMENTO */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-sm text-stone-800">
          Receita Gerada por Forma de Pagamento (R$)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pagamentoData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Valor']} />
              <Bar dataKey="valor" fill="#C5A059" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
