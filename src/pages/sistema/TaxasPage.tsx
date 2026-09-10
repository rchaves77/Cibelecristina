import React, { useState } from 'react';
import {
  CreditCard,
  Calculator,
  Percent,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy
} from 'lucide-react';

interface TaxaOpcao {
  modalidade: string;
  taxaPercentual: number;
  tipo: 'pix' | 'debito' | 'credito';
}

export const TaxasPage: React.FC = () => {
  const [valorBase, setValorBase] = useState<number>(280);
  const [estrategia, setEstrategia] = useState<'repassar' | 'absorver'>('repassar');
  const [copied, setCopied] = useState(false);

  // Configuração padrão de taxas de maquininhas médicas
  const [taxas, setTaxas] = useState<TaxaOpcao[]>([
    { modalidade: 'Pix à Vista', taxaPercentual: 0.0, tipo: 'pix' },
    { modalidade: 'Cartão de Débito', taxaPercentual: 1.49, tipo: 'debito' },
    { modalidade: 'Cartão de Crédito à Vista (1x)', taxaPercentual: 3.19, tipo: 'credito' },
    { modalidade: 'Cartão de Crédito (2x)', taxaPercentual: 4.89, tipo: 'credito' },
    { modalidade: 'Cartão de Crédito (3x)', taxaPercentual: 5.89, tipo: 'credito' },
    { modalidade: 'Cartão de Crédito (6x)', taxaPercentual: 8.49, tipo: 'credito' },
    { modalidade: 'Cartão de Crédito (12x)', taxaPercentual: 13.99, tipo: 'credito' },
  ]);

  const handleUpdateTaxa = (index: number, novaTaxa: number) => {
    const clone = [...taxas];
    clone[index].taxaPercentual = novaTaxa;
    setTaxas(clone);
  };

  // Cálculos matemáticos:
  // Repassar: Valor Cobrado = Valor Base / (1 - (taxa / 100)) -> Garante que após desconto da operadora a clínica receba exatamente o valorBase
  // Absorver: Valor Cobrado = Valor Base; Valor Líquido = Valor Base * (1 - (taxa / 100))
  const simulacoes = taxas.map((t) => {
    const rate = t.taxaPercentual / 100;
    if (estrategia === 'repassar') {
      const valorCobrado = rate === 1 ? valorBase : valorBase / (1 - rate);
      const taxaRetida = valorCobrado - valorBase;
      const valorLiquido = valorBase;
      return {
        ...t,
        valorCobrado,
        taxaRetida,
        valorLiquido
      };
    } else {
      const valorCobrado = valorBase;
      const taxaRetida = valorBase * rate;
      const valorLiquido = valorBase - taxaRetida;
      return {
        ...t,
        valorCobrado,
        taxaRetida,
        valorLiquido
      };
    }
  });

  const handleCopySummary = () => {
    let text = `*SIMULAÇÃO DE VALORES E PARCELAMENTO*\n`;
    text += `Valor da Consulta/Procedimento: R$ ${valorBase.toFixed(2)}\n\n`;
    simulacoes.forEach((s) => {
      text += `• ${s.modalidade}: R$ ${s.valorCobrado.toFixed(2)}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Módulo Financeiro Inteligente
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Gestão de Maquininha & Gateway</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Simulador de Repasse e Absorção de Taxas
          </h2>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
        >
          {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Copiado p/ WhatsApp!' : 'Copiar Simulação'}</span>
        </button>
      </div>

      {/* PAINEL DE CONTROLE DA SIMULAÇÃO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* VALOR BASE */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Valor Base Desejado (Líquido)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-stone-400 text-sm font-bold">R$</span>
            <input
              type="number"
              min={10}
              step={10}
              value={valorBase}
              onChange={(e) => setValorBase(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2.5 text-xl font-bold font-serif text-stone-900 rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
            />
          </div>
          <span className="text-[11px] text-stone-400 block">
            Valor líquido que você deseja receber pela consulta.
          </span>
        </div>

        {/* ESTRATÉGIA DE TAXAS */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Estratégia de Cobrança
          </label>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setEstrategia('repassar')}
              className={`p-3 rounded-xl border text-left transition-all ${
                estrategia === 'repassar'
                  ? 'border-[#1A3C34] bg-[#1A3C34]/5 ring-1 ring-[#1A3C34]'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <span className="font-semibold text-xs text-stone-900 block">
                Repassar Taxa ao Paciente (Cálculo por Dentro)
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                O paciente paga a taxa da maquininha e você recebe exatamente os <strong>R$ {valorBase.toFixed(2)}</strong> líquidos.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEstrategia('absorver')}
              className={`p-3 rounded-xl border text-left transition-all ${
                estrategia === 'absorver'
                  ? 'border-[#1A3C34] bg-[#1A3C34]/5 ring-1 ring-[#1A3C34]'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50'
              }`}
            >
              <span className="font-semibold text-xs text-stone-900 block">
                Absorver Taxa pela Clínica
              </span>
              <span className="text-[11px] text-stone-500 block mt-0.5">
                O valor cobrado do paciente permanece fixo em <strong>R$ {valorBase.toFixed(2)}</strong> e a clínica desconta a taxa do lucro.
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* TABELA DE SIMULAÇÃO INTELIGENTE */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator size={18} className="text-[#C5A059]" />
            <h3 className="font-serif font-bold text-base text-stone-800">
              Grade de Modalidades e Parcelas
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {estrategia === 'repassar' ? 'Repasse calculado com taxa compensada' : 'Absorção direta'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-bold">Modalidade</th>
                <th className="py-3 px-4 font-bold text-center">Taxa Operadora (%)</th>
                <th className="py-3 px-4 font-bold text-right">Valor ao Paciente</th>
                <th className="py-3 px-4 font-bold text-right">Desconto Maquininha</th>
                <th className="py-3 px-4 font-bold text-right">Líquido para Dra. Cibele</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {simulacoes.map((sim, index) => (
                <tr key={index} className="hover:bg-[#FBFBF9] transition-colors">
                  <td className="py-3 px-4 font-semibold text-stone-900">
                    {sim.modalidade}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-lg border border-stone-200">
                      <input
                        type="number"
                        step="0.01"
                        value={sim.taxaPercentual}
                        onChange={(e) => handleUpdateTaxa(index, Number(e.target.value))}
                        className="w-14 bg-transparent text-center font-mono font-bold text-xs focus:outline-none text-stone-800"
                      />
                      <span className="text-[10px] text-stone-500">%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right font-serif font-bold text-sm text-stone-900">
                    R$ {sim.valorCobrado.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-stone-500">
                    - R$ {sim.taxaRetida.toFixed(2)}
                  </td>

                  <td className="py-3 px-4 text-right font-serif font-bold text-sm text-emerald-800">
                    R$ {sim.valorLiquido.toFixed(2)}
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
