import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Clock,
  ArrowLeft,
  Lock,
  Search,
  Check
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { ValidacaoAtestado } from '../types/clinical';
import { DOCTOR_INFO } from '../data/medicinarteData';
import { supabase } from '../services/supabaseClient';

export const ValidarAtestadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const queryCodigo = searchParams.get('codigo') || searchParams.get('c') || id || '';

  const [codigoInput, setCodigoInput] = useState(queryCodigo);
  const [validacao, setValidacao] = useState<ValidacaoAtestado | null>(null);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const executarValidacao = async (chave: string) => {
    const clean = chave.trim();
    if (!clean) {
      setValidacao(null);
      setBuscou(false);
      return;
    }

    setCarregando(true);
    setBuscou(true);

    try {
      // 1. Busca no banco local clínico por ID ou por Hash
      const todas = clinicalDb.getValidacoes();
      const localFound = todas.find(v => 
        v.id.toLowerCase() === clean.toLowerCase() ||
        (v.hash_autenticidade && v.hash_autenticidade.toLowerCase() === clean.toLowerCase())
      );

      if (localFound) {
        setValidacao(localFound);
        setCarregando(false);
        return;
      }

      // 2. Busca na tabela do Supabase Cloud
      try {
        const { data: supaDoc } = await supabase
          .from('validacoes_atestados')
          .select('*')
          .or(`codigo.eq.${clean},hash_validacao.eq.${clean}`)
          .maybeSingle();

        if (supaDoc) {
          const docFormatado: ValidacaoAtestado = {
            id: supaDoc.codigo,
            paciente_nome: supaDoc.paciente_nome,
            profissional_nome: supaDoc.medico_nome || `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm} | ${DOCTOR_INFO.rqe})`,
            tipo_documento: (supaDoc.tipo as any) || 'Atestado Médico',
            conteudo_texto: `Atestado registrado com validade médica oficial. Afastamento: ${supaDoc.dias_afastamento || 0} dia(s).`,
            dias_afastamento: supaDoc.dias_afastamento,
            created_at: supaDoc.data_emissao || supaDoc.created_at || new Date().toISOString(),
            hash_autenticidade: supaDoc.hash_validacao || supaDoc.codigo
          };
          setValidacao(docFormatado);
          setCarregando(false);
          return;
        }
      } catch {
        // Segue
      }

      setValidacao(null);
    } catch {
      setValidacao(null);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    document.title = "Validador de Atestado & Documentos Médicos | Dra. Cibele Cristina";
    if (queryCodigo) {
      setCodigoInput(queryCodigo);
      executarValidacao(queryCodigo);
    }
  }, [queryCodigo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executarValidacao(codigoInput);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-stone-800 flex flex-col items-center justify-between p-4 sm:p-8 antialiased font-sans">
      
      <div className="w-full max-w-xl mx-auto my-auto py-6">
        {/* CABEÇALHO INSTITUCIONAL */}
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="Logo Dra. Cibele Cristina" 
            className="w-16 h-16 rounded-2xl object-contain bg-[#FAF8F5] p-1.5 shadow-md mb-3 border border-[#C5A059]/50 mx-auto"
          />
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
            {DOCTOR_INFO.fullName}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm} • {DOCTOR_INFO.rqe}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>Validador Oficial de Autenticidade de Documentos Médicos</span>
          </div>
        </div>

        {/* CAMPO DE CONSULTA / DIGITAÇÃO DE CÓDIGO */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-stone-200 mb-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="text-xs font-bold text-stone-700 block">
              Digite ou cole o Código Verificador / Hash do Documento:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                  placeholder="ex: BR-AC-1810-7F9B ou UUID"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#1A3C34] focus:ring-1 focus:ring-[#1A3C34] bg-stone-50/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={carregando}
                className="px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#132c26] text-white text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-75"
              >
                {carregando ? 'A validar...' : 'Validar'}
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              O código consta no rodapé do atestado, declaração ou receita impressa, próximo ao QR Code.
            </p>
          </form>
        </div>

        {/* RESULTADO DA VALIDAÇÃO */}
        {buscou && (
          <div>
            {validacao ? (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-200 space-y-6 animate-in fade-in">
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
                      Emitido e assinado digitalmente pelo consultório da Dra. Cibele Cristina.
                    </p>
                  </div>
                </div>

                {/* DADOS DO DOCUMENTO */}
                <div className="space-y-3 divide-y divide-stone-100 text-xs">
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

                  {validacao.dias_afastamento !== undefined && validacao.dias_afastamento > 0 && (
                    <div className="pt-2.5 flex items-center justify-between">
                      <span className="text-stone-500 font-medium">Período de Afastamento:</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {validacao.dias_afastamento} dia(s)
                      </span>
                    </div>
                  )}

                  {validacao.cid && (
                    <div className="pt-2.5 flex items-center justify-between">
                      <span className="text-stone-500 font-medium">CID-10 Registrado:</span>
                      <span className="font-mono font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
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
                {validacao.conteudo_texto && (
                  <div className="p-4 bg-[#FBFBF9] rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider block mb-1.5">
                      Teor Declaratório Registrado
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{validacao.conteudo_texto}"
                    </p>
                  </div>
                )}

                {/* NOTA JURÍDICA E LGPD */}
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <Lock size={13} className="shrink-0 text-emerald-700" />
                  <span>
                    Validação em conformidade com as resoluções do Conselho Federal de Medicina (CFM), ICP-Brasil e LGPD.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-md border border-amber-200 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                  <AlertCircle size={26} />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Documento Não Localizado
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  O código <code>{codigoInput}</code> não consta nos registros oficiais deste consultório. Verifique se o código ou link foi digitado corretamente ou contate o consultório da Dra. Cibele Cristina.
                </p>
              </div>
            )}
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

      <footer className="text-center text-[11px] text-stone-400 py-3">
        Medicinarte Serviços Médicos Ltda • CRM-AC 1810 | RQE 1078 • Rio Branco - AC
      </footer>
    </div>
  );
};
