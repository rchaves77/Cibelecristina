import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Clock,
  Building,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { ValidacaoAtestado } from '../types/clinical';
import { DOCTOR_INFO } from '../data/medicinarteData';

export const ValidarAtestadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [validacao, setValidacao] = useState<ValidacaoAtestado | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (id) {
      const found = clinicalDb.getValidacaoById(id);
      setValidacao(found || null);
    }
    setChecked(true);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-stone-800 flex flex-col items-center justify-center p-4 sm:p-6 antialiased font-sans">
      <div className="w-full max-w-xl">
        {/* CABEÇALHO INSTITUCIONAL */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A3C34] text-[#C5A059] font-serif font-bold text-2xl shadow-md mb-3">
            CC
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            {DOCTOR_INFO.fullName}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm} • {DOCTOR_INFO.rqe}
          </p>
          <p className="text-[11px] text-[#C5A059] font-medium mt-0.5">
            Portal Oficial de Validação de Autenticidade de Documentos Médicos
          </p>
        </div>

        {/* CARD PRINCIPAL DE VALIDAÇÃO */}
        {checked && validacao ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-200 space-y-6 animate-in fade-in">
            {/* SELO DE SUCESSO */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                  Documento Médico Autêntico & Válido
                </h3>
                <p className="text-xs text-emerald-700">
                  Emitido oficialmente pelo consultório da Dra. Cibele Cristina.
                </p>
              </div>
            </div>

            {/* DADOS DO DOCUMENTO */}
            <div className="space-y-3.5 divide-y divide-stone-100 text-xs">
              <div className="pt-1 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Tipo de Documento:</span>
                <span className="font-bold text-stone-900 text-sm">
                  {validacao.tipo_documento}
                </span>
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Nome do(a) Paciente:</span>
                <span className="font-bold text-stone-900 text-sm">
                  {validacao.paciente_nome}
                </span>
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Profissional Emissor(a):</span>
                <span className="font-semibold text-stone-800 text-right">
                  {validacao.profissional_nome}
                </span>
              </div>

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Data e Hora de Emissão:</span>
                <span className="font-medium text-stone-800">
                  {new Date(validacao.created_at).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(validacao.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {validacao.dias_afastamento && (
                <div className="pt-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">Período de Afastamento:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {validacao.dias_afastamento} dia(s)
                  </span>
                </div>
              )}

              {validacao.cid && (
                <div className="pt-2.5 flex items-center justify-between">
                  <span className="text-stone-500 font-medium">CID-10 Informado:</span>
                  <span className="font-mono font-semibold text-stone-800">
                    {validacao.cid}
                  </span>
                </div>
              )}

              <div className="pt-2.5 flex items-center justify-between">
                <span className="text-stone-500 font-medium">Código de Autenticação:</span>
                <span className="font-mono font-bold text-[#1A3C34] bg-stone-100 px-2 py-0.5 rounded">
                  {validacao.hash_autenticidade}
                </span>
              </div>
            </div>

            {/* TEOR DO DOCUMENTO */}
            <div className="p-4 bg-[#FBFBF9] rounded-xl border border-stone-200">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1.5">
                Teor Declaratório Registrado
              </span>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                "{validacao.conteudo_texto}"
              </p>
            </div>

            {/* NOTA JURÍDICA E LGPD */}
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <Lock size={13} className="shrink-0" />
              <span>
                Validação em conformidade com as resoluções do Conselho Federal de Medicina (CFM) e LGPD.
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-stone-200 text-center space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertCircle size={26} />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Documento Não Encontrado
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              O identificador <code>{id}</code> não consta nos registros oficiais deste consultório. Verifique se o link foi digitado corretamente ou contate o consultório da Dra. Cibele Cristina.
            </p>
          </div>
        )}

        {/* RODAPÉ COM RETORNO */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar à página inicial da Dra. Cibele Cristina</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
