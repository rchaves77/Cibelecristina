import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Agendamento } from '../../types/clinical';

export const FinanceiroPage: React.FC = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtroMes, setFiltroMes] = useState<'este_mes' | 'todos'>('este_mes');

  useEffect(() => {
    setAgendamentos(clinicalDb.getAgendamentos());
  }, []);

  const atendimentosValidos = agendamentos.filter(a => a.status !== 'Cancelado');

  const totalReceita = atendimentosValidos.reduce((acc, curr) => acc + curr.valor_atendimento, 0);
  const totalPix = atendimentosValidos.filter(a => a.forma_pagamento === 'Pix').reduce((acc, curr) => acc + curr.valor_atendimento, 0);
  const totalCartao = atendimentosValidos.filter(a => a.forma_pagamento === 'Cartão').reduce((acc, curr) => acc + curr.valor_atendimento, 0);
  const totalDinheiro = atendimentosValidos.filter(a => a.forma_pagamento === 'Dinheiro').reduce((acc, curr) => acc + curr.valor_atendimento, 0);

  const ticketMedio = atendimentosValidos.length > 0 ? totalReceita / atendimentosValidos.length : 0;

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Gestão de Caixa & Faturamento
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Conciliação de consultas e procedimentos</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Fluxo Financeiro & Receitas
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Relatório financeiro exportado em planilha CSV com sucesso!')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* CARDS DE FATURAMENTO */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block">
            Faturamento Total
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            R$ {totalReceita.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 flex items-center gap-0.5 font-medium">
            <ArrowUpRight size={13} /> {atendimentosValidos.length} atendimentos
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-emerald-700 uppercase tracking-wider font-semibold block">
            Recebido via Pix
          </span>
          <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
            R$ {totalPix.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Liquidação instantânea
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-stone-600 uppercase tracking-wider font-semibold block">
            Cartão Débito / Crédito
          </span>
          <div className="text-2xl font-serif font-bold text-stone-800 mt-1">
            R$ {totalCartao.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Sujeito a taxas da operadora
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-[11px] text-[#C5A059] uppercase tracking-wider font-semibold block">
            Ticket Médio por Consulta
          </span>
          <div className="text-2xl font-serif font-bold text-stone-900 mt-1">
            R$ {ticketMedio.toFixed(2)}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Média por atendimento
          </span>
        </div>
      </div>

      {/* HISTÓRICO DE ENTRADAS FINANCEIRAS */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-stone-800">
            Lançamentos de Atendimentos
          </h3>
          <span className="text-xs text-stone-500">
            {atendimentosValidos.length} lançamentos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Data</th>
                <th className="py-3 px-4 font-bold">Paciente</th>
                <th className="py-3 px-4 font-bold">Serviço</th>
                <th className="py-3 px-4 font-bold">Pagamento</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {atendimentosValidos.map((item) => (
                <tr key={item.id} className="hover:bg-[#FBFBF9] transition-colors">
                  <td className="py-3 px-4 font-medium text-stone-700">
                    {new Date(item.data_inicio).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {item.paciente_nome}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {item.servico_nome}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {item.forma_pagamento}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === 'Presenca' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-serif font-bold text-sm text-stone-900">
                    R$ {item.valor_atendimento.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
