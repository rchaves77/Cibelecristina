import React, { useState, useMemo } from 'react';
import {
  History,
  HeartPulse,
  FileText,
  Award,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Eye,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Prontuario, PrescricaoEmitida, ValidacaoAtestado, AnexoProntuario } from '../../types/clinical';
import { DOCTOR_INFO } from '../../data/medicinarteData';

interface LinearTimelineAtendimentosProps {
  prontuarios: Prontuario[];
  prescricoes: PrescricaoEmitida[];
  atestados: ValidacaoAtestado[];
  anexos: AnexoProntuario[];
  canAccessSoap: boolean;
  onOpenAdendoModal: (prontuario: Prontuario) => void;
  onRepetirPrescricao?: (presc: PrescricaoEmitida) => void;
  onReimprimirPrescricao?: (presc: PrescricaoEmitida) => void;
  onReimprimirAtestado?: (at: ValidacaoAtestado) => void;
  onViewAnexo?: (anx: AnexoProntuario) => void;
}

export type TimelineFilter = 'todos' | 'evolucao' | 'prescricao' | 'atestado' | 'anexo';

export const LinearTimelineAtendimentos: React.FC<LinearTimelineAtendimentosProps> = ({
  prontuarios,
  prescricoes,
  atestados,
  anexos,
  canAccessSoap,
  onOpenAdendoModal,
  onRepetirPrescricao,
  onReimprimirPrescricao,
  onReimprimirAtestado,
  onViewAnexo
}) => {
  const [filtro, setFiltro] = useState<TimelineFilter>('todos');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Unifica e ordena cronologicamente (reversa: mais recente para mais antigo)
  const timelineEvents = useMemo(() => {
    const list: Array<{
      id: string;
      rawDate: string;
      tipo: 'evolucao' | 'prescricao' | 'atestado' | 'anexo';
      dados: any;
    }> = [];

    prontuarios.forEach((p) => {
      list.push({
        id: `evol-${p.id}`,
        rawDate: (p as any).data_hora || p.created_at || new Date().toISOString(),
        tipo: 'evolucao',
        dados: p
      });
    });

    prescricoes.forEach((pr) => {
      list.push({
        id: `presc-${pr.id}`,
        rawDate: pr.created_at || new Date().toISOString(),
        tipo: 'prescricao',
        dados: pr
      });
    });

    atestados.forEach((at) => {
      list.push({
        id: `atest-${at.id}`,
        rawDate: at.created_at || new Date().toISOString(),
        tipo: 'atestado',
        dados: at
      });
    });

    anexos.forEach((anx) => {
      list.push({
        id: `anx-${anx.id}`,
        rawDate: anx.data_upload || new Date().toISOString(),
        tipo: 'anexo',
        dados: anx
      });
    });

    return list.sort(
      (a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
    );
  }, [prontuarios, prescricoes, atestados, anexos]);

  const filteredEvents = useMemo(() => {
    if (filtro === 'todos') return timelineEvents;
    return timelineEvents.filter((item) => item.tipo === filtro);
  }, [timelineEvents, filtro]);

  return (
    <div id="secao-historico" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#1A3C34] text-white flex items-center justify-center font-bold shadow-xs">
            <History size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                Passo 5 do Atendimento
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              HISTÓRICO INTEGRADO DE ATENDIMENTOS PASSADOS (TIMELINE VERTICAL)
            </h2>
            <p className="text-xs text-stone-500">
              Linha do tempo cronológica com evoluções SOAP, receitas emitidas, atestados e exames anexados
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shrink-0">
          <ShieldCheck size={14} /> Imutabilidade CFM Res. 1.821
        </span>
      </div>

      {/* FILTROS DA TIMELINE */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-stone-500 text-[11px] mr-1 flex items-center gap-1">
            <Filter size={12} /> Filtrar:
          </span>
          {[
            { key: 'todos', label: `Todos (${timelineEvents.length})` },
            { key: 'evolucao', label: `Evoluções SOAP (${prontuarios.length})` },
            { key: 'prescricao', label: `Receitas (${prescricoes.length})` },
            { key: 'atestado', label: `Atestados (${atestados.length})` },
            { key: 'anexo', label: `Exames (${anexos.length})` }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFiltro(tab.key as TimelineFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filtro === tab.key
                  ? 'bg-[#1A3C34] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            const allExpanded: Record<string, boolean> = {};
            filteredEvents.forEach((ev) => {
              allExpanded[ev.id] = true;
            });
            setExpandedIds(allExpanded);
          }}
          className="text-xs text-[#1A3C34] hover:underline font-semibold cursor-pointer"
        >
          Expandir Todos
        </button>
      </div>

      {/* LINHA DO TEMPO VERTICAL */}
      {filteredEvents.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {filteredEvents.map((ev) => {
            const isExpanded = !!expandedIds[ev.id];
            const dataObj = new Date(ev.rawDate);
            const dataStr = dataObj.toLocaleDateString('pt-BR');
            const horaStr = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={ev.id} className="relative group">
                {/* MARCADOR NA LINHA DO TEMPO */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-xs ${
                    ev.tipo === 'evolucao'
                      ? 'bg-[#1A3C34] text-white'
                      : ev.tipo === 'prescricao'
                      ? 'bg-emerald-700 text-white'
                      : ev.tipo === 'atestado'
                      ? 'bg-[#C5A059] text-[#0E231E]'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {ev.tipo === 'evolucao' && <HeartPulse size={12} />}
                  {ev.tipo === 'prescricao' && <FileText size={12} />}
                  {ev.tipo === 'atestado' && <Award size={12} />}
                  {ev.tipo === 'anexo' && <Paperclip size={12} />}
                </div>

                {/* CARD DO EVENTO */}
                <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-3 hover:border-stone-300 transition-all shadow-2xs">
                  {/* CABEÇALHO DO CARD */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          ev.tipo === 'evolucao'
                            ? 'bg-emerald-100 text-emerald-900'
                            : ev.tipo === 'prescricao'
                            ? 'bg-teal-100 text-teal-900'
                            : ev.tipo === 'atestado'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {ev.tipo === 'evolucao' && '🩺 Evolução Clínica SOAP'}
                        {ev.tipo === 'prescricao' && '📄 Prescrição / Receituário'}
                        {ev.tipo === 'atestado' && '📜 Atestado / Declaração'}
                        {ev.tipo === 'anexo' && '📎 Anexo / Exame'}
                      </span>

                      <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                        <Calendar size={12} className="text-stone-400" />
                        {dataStr} às {horaStr}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {ev.tipo === 'evolucao' && canAccessSoap && (
                        <button
                          type="button"
                          onClick={() => onOpenAdendoModal(ev.dados)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A3C34] bg-white border border-[#1A3C34]/30 px-2.5 py-1 rounded-xl hover:bg-[#1A3C34] hover:text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          <History size={12} />
                          <span>+ Adendo CFM</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleExpand(ev.id)}
                        className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer rounded-lg"
                        title={isExpanded ? 'Recolher' : 'Expandir'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* CONTEÚDO ESPECÍFICO DE CADA TIPO */}

                  {/* 1. EVOLUÇÃO SOAP */}
                  {ev.tipo === 'evolucao' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="font-semibold text-stone-800">
                          Responsável: {ev.dados.profissional_nome || DOCTOR_INFO.fullName}
                        </span>
                        {ev.dados.diagnostico_cid && (
                          <span className="px-2 py-0.5 rounded-lg bg-[#C5A059]/20 text-[#8F7030] font-bold font-mono">
                            CID-10: {ev.dados.diagnostico_cid}
                          </span>
                        )}
                      </div>

                      {canAccessSoap ? (
                        <>
                          <div className={`space-y-2 text-xs ${!isExpanded ? 'line-clamp-3' : ''}`}>
                            {ev.dados.subjetivo && (
                              <p className="text-stone-700">
                                <strong className="text-stone-900">S: </strong>
                                {ev.dados.subjetivo}
                              </p>
                            )}
                            {isExpanded && (
                              <>
                                {ev.dados.objetivo && (
                                  <p className="text-stone-700">
                                    <strong className="text-stone-900">O: </strong>
                                    {ev.dados.objetivo}
                                  </p>
                                )}
                                {ev.dados.avaliacao && (
                                  <p className="text-stone-700">
                                    <strong className="text-stone-900">A: </strong>
                                    {ev.dados.avaliacao}
                                  </p>
                                )}
                                {ev.dados.plano && (
                                  <p className="text-stone-700">
                                    <strong className="text-stone-900">P: </strong>
                                    {ev.dados.plano}
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          {/* Adendos CFM */}
                          {ev.dados.adendos && ev.dados.adendos.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-amber-200 text-xs bg-amber-50 p-2.5 rounded-xl space-y-1">
                              <span className="text-[10px] font-bold text-amber-900 uppercase">
                                Retificações / Adendos CFM ({ev.dados.adendos.length})
                              </span>
                              {ev.dados.adendos.map((ad: any, i: number) => (
                                <p key={i} className="text-stone-800 text-[11px]">
                                  • {ad.texto} <span className="text-stone-400">({ad.autor_nome})</span>
                                </p>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-stone-500 italic">
                          Dados clínicos em sigilo médico (Resolução CFM 1.821).
                        </p>
                      )}
                    </div>
                  )}

                  {/* 2. RECEITA MÉDICA */}
                  {ev.tipo === 'prescricao' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800">
                          {ev.dados.tipo} ({ev.dados.itens?.length || 0} itens)
                        </span>
                        <div className="flex items-center gap-2">
                          {onRepetirPrescricao && (
                            <button
                              type="button"
                              onClick={() => onRepetirPrescricao(ev.dados)}
                              className="px-2 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Copiar itens para o receituário do atendimento atual"
                            >
                              <Copy size={11} /> Repetir
                            </button>
                          )}
                          {onReimprimirPrescricao && (
                            <button
                              type="button"
                              onClick={() => onReimprimirPrescricao(ev.dados)}
                              className="px-2.5 py-1 rounded-lg bg-[#1A3C34] text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Download size={11} /> Baixar PDF
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        {ev.dados.itens?.map((it: any, idx: number) => (
                          <div key={idx} className="p-2 bg-white rounded-xl border border-stone-200/70 text-stone-800">
                            <span className="font-bold text-stone-900">{it.nome}</span>
                            {it.quantidade && <span className="text-stone-500 ml-1.5">({it.quantidade})</span>}
                            {it.via && <span className="text-emerald-800 font-semibold ml-1.5">[Via {it.via}]</span>}
                            {isExpanded && it.posologia_ou_instrucao && (
                              <p className="text-stone-600 mt-1 pl-2 border-l-2 border-emerald-600 text-[11px]">
                                {it.posologia_ou_instrucao}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {isExpanded && ev.dados.observacoes && (
                        <p className="text-xs text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200">
                          Obs: {ev.dados.observacoes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 3. ATESTADO */}
                  {ev.tipo === 'atestado' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-800">
                          {ev.dados.tipo_documento}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/validar/${ev.dados.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 shadow-2xs"
                          >
                            <ExternalLink size={11} /> Validar QR
                          </a>
                          {onReimprimirAtestado && (
                            <button
                              type="button"
                              onClick={() => onReimprimirAtestado(ev.dados)}
                              className="px-2.5 py-1 rounded-lg bg-[#C5A059] text-[#0E231E] text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Download size={11} /> Baixar PDF
                            </button>
                          )}
                        </div>
                      </div>

                      <p className={`text-xs text-stone-700 font-serif ${!isExpanded ? 'line-clamp-2' : ''}`}>
                        {ev.dados.conteudo_texto}
                      </p>

                      <div className="flex items-center gap-3 text-[10px] text-stone-400 font-mono">
                        <span>Código: {ev.dados.hash_autenticidade || ev.dados.id.slice(0, 8).toUpperCase()}</span>
                        {ev.dados.cid && <span>CID: {ev.dados.cid}</span>}
                      </div>
                    </div>
                  )}

                  {/* 4. ANEXO */}
                  {ev.tipo === 'anexo' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{ev.dados.nome_arquivo}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-stone-200 text-stone-700 font-semibold">
                            {ev.dados.categoria}
                          </span>
                        </div>

                        {onViewAnexo && (
                          <button
                            type="button"
                            onClick={() => onViewAnexo(ev.dados)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1A3C34] hover:underline cursor-pointer"
                          >
                            <Eye size={12} /> Ver Anexo
                          </button>
                        )}
                      </div>

                      {ev.dados.observacoes && (
                        <p className="text-xs text-stone-600">{ev.dados.observacoes}</p>
                      )}

                      <span className="text-[10px] text-stone-400 font-mono block">
                        Tamanho: {ev.dados.tamanho_formatado || '450 KB'}
                      </span>
                    </div>
                  )}

                  {/* BOTÃO EXPANDIR / RECOLHER CARD */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => toggleExpand(ev.id)}
                      className="text-[11px] text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Recolher detalhes' : 'Ver conteúdo completo'}</span>
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-stone-400 text-xs italic bg-stone-50 rounded-2xl border border-stone-200">
          Nenhum registro clínico, receita ou documento encontrado para o filtro selecionado.
        </div>
      )}
    </div>
  );
};
