import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Perfil } from '../../types/clinical';

export const PermissoesPage: React.FC = () => {
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);
  const [feedback, setFeedback] = useState('');

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    const list = clinicalDb.getPerfis();
    setPerfis(list);
    if (list.length > 0) setSelectedPerfil(list[0]);
  }, []);

  const handleToggleDia = (dia: string) => {
    if (!selectedPerfil) return;
    const current = selectedPerfil.dias_atendimento || [];
    const updated = current.includes(dia)
      ? current.filter(d => d !== dia)
      : [...current, dia];
    setSelectedPerfil({ ...selectedPerfil, dias_atendimento: updated });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfil) return;

    clinicalDb.savePerfil(selectedPerfil);
    setPerfis(clinicalDb.getPerfis());
    setFeedback(`Configurações de grade horária salvas para ${selectedPerfil.nome}!`);
    setTimeout(() => setFeedback(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
            Controle de Acesso & Grade Horária
          </span>
          <span className="text-xs text-stone-400">•</span>
          <span className="text-xs text-stone-500">Regras de agendamento e papéis de usuário</span>
        </div>
        <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
          Usuários, Permissões & Grade de Atendimento
        </h2>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LISTA DE PERFIS */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3">
          <h3 className="font-serif font-bold text-sm text-stone-800 border-b border-stone-100 pb-2">
            Colaboradores Cadastrados
          </h3>

          <div className="space-y-2">
            {perfis.map((p) => {
              const isSelected = selectedPerfil?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPerfil(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#1A3C34] bg-[#1A3C34]/5 shadow-xs font-semibold'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-900">{p.nome}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#C5A059]/20 text-[#8F7030]">
                      {p.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    {p.email}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EDITOR DE GRADE HORÁRIA E PERMISSÕES DO PERFIL SELECIONADO */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
          {selectedPerfil ? (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Configuração da Grade de {selectedPerfil.nome}
                  </h3>
                  <p className="text-xs text-stone-500">
                    O sistema bloqueará automaticamente agendamentos fora deste horário ou em dias não selecionados.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Horário de Início dos Atendimentos
                  </label>
                  <input
                    type="time"
                    value={selectedPerfil.hora_inicio || '08:00'}
                    onChange={(e) => setSelectedPerfil({ ...selectedPerfil, hora_inicio: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Horário de Término dos Atendimentos
                  </label>
                  <input
                    type="time"
                    value={selectedPerfil.hora_fim || '18:00'}
                    onChange={(e) => setSelectedPerfil({ ...selectedPerfil, hora_fim: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-2">
                  Dias de Atendimento Permitidos
                </label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map((dia) => {
                    const active = selectedPerfil.dias_atendimento?.includes(dia);
                    return (
                      <button
                        key={dia}
                        type="button"
                        onClick={() => handleToggleDia(dia)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          active
                            ? 'bg-[#1A3C34] text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {dia} {active ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Save size={15} />
                  <span>Salvar Grade & Permissões</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center text-stone-400 p-8">
              Selecione um usuário para editar a grade horária.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
