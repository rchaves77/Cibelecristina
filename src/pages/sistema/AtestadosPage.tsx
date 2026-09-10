import React, { useState, useEffect } from 'react';
import {
  Award,
  FileCheck,
  Download,
  QrCode,
  ShieldCheck,
  Clock,
  User,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, ValidacaoAtestado } from '../../types/clinical';
import { SignatureCanvas } from '../../components/SignatureCanvas';
import { CidAutocompleteInput } from '../../components/common/CidAutocompleteInput';
import { generateAtestadoPdf } from '../../utils/pdfGenerator';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const AtestadosPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [validacoesRecentes, setValidacoesRecentes] = useState<ValidacaoAtestado[]>([]);

  const [selectedPacienteId, setSelectedPacienteId] = useState<number>(0);
  const [pacienteAvulsoNome, setPacienteAvulsoNome] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<ValidacaoAtestado['tipo_documento']>('Atestado Médico');
  const [diasAfastamento, setDiasAfastamento] = useState<number>(1);
  const [cid, setCid] = useState('');
  const [conteudoTexto, setConteudoTexto] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState('');

  const [emitindo, setEmitindo] = useState(false);
  const [ultimoEmitido, setUltimoEmitido] = useState<ValidacaoAtestado | null>(null);

  useEffect(() => {
    const pList = clinicalDb.getPacientes();
    setPacientes(pList);
    if (pList.length > 0) setSelectedPacienteId(pList[0].id);
    setValidacoesRecentes(clinicalDb.getValidacoes());
  }, []);

  const getNomePacienteFinal = () => {
    if (pacienteAvulsoNome.trim()) return pacienteAvulsoNome.trim();
    const p = pacientes.find(item => item.id === selectedPacienteId);
    return p ? p.nome : 'Paciente Sob Cuidados';
  };

  const handleEmitirAtestado = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmitindo(true);

    const nomePaciente = getNomePacienteFinal();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let textoFinal = conteudoTexto.trim();
    if (!textoFinal) {
      if (tipoDocumento === 'Declaração de Comparecimento') {
        textoFinal = `Declaro para os devidos fins que o(a) paciente ${nomePaciente} compareceu ao consultório médico nesta data, das ${horaAtual} horas, para realização de consulta clínica e avaliação de saúde.`;
      } else {
        textoFinal = `Atesto para os devidos fins que o(a) paciente ${nomePaciente} esteve sob meus cuidados profissionais na data de ${dataAtual}, devendo permanecer em repouso e afastado(a) de suas atividades laborais/escolares por ${diasAfastamento} dia(s) a partir desta data para recuperação de sua saúde.`;
      }
    }

    // 1. Cria validação no banco com UUID
    const novaValidacao = clinicalDb.createValidacao({
      paciente_nome: nomePaciente,
      profissional_nome: `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm} | ${DOCTOR_INFO.rqe})`,
      tipo_documento: tipoDocumento,
      conteudo_texto: textoFinal,
      dias_afastamento: diasAfastamento,
      cid: cid.trim() || undefined
    });

    // 2. Renderiza PDF e faz download com QR Code
    try {
      await generateAtestadoPdf({
        validacao: novaValidacao,
        signatureDataUrl: signatureDataUrl || undefined,
        baseUrl: window.location.origin
      });

      setUltimoEmitido(novaValidacao);
      setValidacoesRecentes(clinicalDb.getValidacoes());
    } catch (err) {
      console.error(err);
      alert('Erro ao emitir atestado em PDF.');
    } finally {
      setEmitindo(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              Assinatura Touchscreen & QR Code
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Validação Pública Antifraude</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Emissão de Atestados Médicos e Laudos
          </h2>
        </div>

        {ultimoEmitido && (
          <div className="inline-flex items-center gap-2 p-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Último emitido: <strong>{ultimoEmitido.hash_autenticidade}</strong></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* FORMULÁRIO PRINCIPAL DE EMISSÃO */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <form onSubmit={handleEmitirAtestado} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                >
                  <option value="Atestado Médico">Atestado Médico (Afastamento)</option>
                  <option value="Declaração de Comparecimento">Declaração de Comparecimento</option>
                  <option value="Laudo Médico">Laudo Médico Pericial</option>
                  <option value="Relatório de Saúde">Relatório de Acompanhamento</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Paciente Cadastrado
                </label>
                <select
                  value={selectedPacienteId}
                  onChange={(e) => {
                    setSelectedPacienteId(Number(e.target.value));
                    setPacienteAvulsoNome('');
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                >
                  <option value={0}>-- Ou digitar abaixo --</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.telefone})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Ou Nome Completo do Paciente (Avulso)
              </label>
              <input
                type="text"
                value={pacienteAvulsoNome}
                onChange={(e) => setPacienteAvulsoNome(e.target.value)}
                placeholder="Ex: Maria Eduarda Silva"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>

            {tipoDocumento === 'Atestado Médico' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Dias de Afastamento
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={diasAfastamento}
                    onChange={(e) => setDiasAfastamento(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <CidAutocompleteInput
                    label="Diagnóstico CID-10 & CID-11"
                    value={cid}
                    onChange={(val) => setCid(val)}
                    placeholder="Digite letras ou código (ex: I10, BA00, gripe, cerume)..."
                    helperText="Conforme Resolução CFM 1.658/2002, registro sob consentimento do paciente."
                    formatStyle="full"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Texto Declaratório (Deixe em branco para usar o texto padrão oficial)
              </label>
              <textarea
                rows={4}
                value={conteudoTexto}
                onChange={(e) => setConteudoTexto(e.target.value)}
                placeholder="Texto personalizado ou justificativa clínica do afastamento..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>

            {/* ASSINATURA DIGITAL TOUCHSCREEN / MOUSE */}
            <div className="pt-2">
              <SignatureCanvas
                label="Assinatura da Médica (Touchscreen / Mouse)"
                onSave={(dataUrl) => setSignatureDataUrl(dataUrl)}
              />
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={emitindo}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
              >
                <Download size={16} />
                <span>{emitindo ? 'Gerando Documento e QR Code...' : 'Emitir Atestado com QR Code (PDF)'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* COLUNA DIREITA: HISTÓRICO DE VALIDAÇÕES RECENTES */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
              <ShieldCheck size={18} className="text-[#C5A059]" />
              <h3 className="font-serif font-bold text-sm text-stone-800">
                Atestados Emitidos & QR Codes
              </h3>
            </div>
            <p className="text-[11px] text-stone-500">
              Documentos registrados com chave pública para validação de empresas e instituições.
            </p>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {validacoesRecentes.map((val) => {
                const dateStr = new Date(val.created_at).toLocaleDateString('pt-BR');
                return (
                  <div
                    key={val.id}
                    className="p-3 bg-stone-50 hover:bg-emerald-50/50 rounded-xl border border-stone-200 space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-[#1A3C34] tracking-wider">
                        {val.tipo_documento}
                      </span>
                      <span className="text-[10px] text-stone-400">{dateStr}</span>
                    </div>
                    <div className="font-semibold text-xs text-stone-900 truncate">
                      {val.paciente_nome}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      Código: {val.hash_autenticidade}
                    </div>
                    <div className="pt-1.5 flex justify-end">
                      <a
                        href={`/validar/${val.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#C5A059] hover:underline font-medium"
                      >
                        <span>Página Pública de Validação</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
