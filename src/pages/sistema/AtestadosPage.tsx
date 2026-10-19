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
import { resolveCidString } from '../../data/cidDatabase';
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

  // Campos de Acompanhante
  const [nomeAcompanhante, setNomeAcompanhante] = useState('');
  const [cpfAcompanhante, setCpfAcompanhante] = useState('');
  const [parentescoAcompanhante, setParentescoAcompanhante] = useState('Mãe');
  const [horarioChegada, setHorarioChegada] = useState('08:30');
  const [horarioSaida, setHorarioSaida] = useState('10:00');

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

  const isAcompAfastamento = tipoDocumento === 'Atestado Médico para Acompanhante' || tipoDocumento === 'Atestado de Acompanhamento de Doente';
  const isAcompComparecimento = tipoDocumento === 'Declaração de Comparecimento de Acompanhante';
  const isAcompanhante = isAcompAfastamento || isAcompComparecimento;

  const gerarTextoPadrao = () => {
    const nomePaciente = getNomePacienteFinal();
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const vinculo = parentescoAcompanhante.trim() ? ` (${parentescoAcompanhante.trim()})` : '';
    const acompNome = nomeAcompanhante.trim() || 'ACOMPANHANTE';
    const acompCpf = cpfAcompanhante.trim() ? `, portador(a) do CPF nº ${cpfAcompanhante.trim()}` : '';
    const cidStr = cid.trim() ? ` CID-10 do(a) paciente: ${resolveCidString(cid.trim())}.` : '';

    if (isAcompAfastamento) {
      const diasStr = diasAfastamento === 1 ? '1 (um) dia' : `${diasAfastamento} (${diasAfastamento}) dias`;
      return `Atesto para os devidos fins legais, trabalhistas e previdenciários (Art. 473 da CLT e resoluções do CFM) que o(a) Sr.(a) ${acompNome}${acompCpf}${vinculo}, esteve presente prestando assistência e cuidados indispensáveis ao(à) paciente ${nomePaciente} nesta data, devendo permanecer afastado(a) de suas atividades laborais por ${diasStr}, a partir de ${dataAtual}, para prestar suporte integral e acompanhar o tratamento e recuperação de saúde do(a) paciente sob seus cuidados.${cidStr}`;
    }

    if (isAcompComparecimento) {
      return `Declaro para os devidos fins trabalhistas e escolares (Art. 473 da CLT) que o(a) Sr.(a) ${acompNome}${acompCpf}${vinculo}, esteve presente neste consultório médico em ${dataAtual}, no período das ${horarioChegada} às ${horarioSaida} horas, prestando acompanhamento presencial ao(à) paciente ${nomePaciente}, durante a realização de consulta médica ambulatorial e procedimentos de saúde.`;
    }

    if (tipoDocumento === 'Declaração de Comparecimento') {
      return `Declaro para os devidos fins trabalhistas e escolares que o(a) paciente ${nomePaciente} compareceu ao consultório médico nesta data (${dataAtual}), no período das ${horarioChegada} às ${horarioSaida} horas, para realização de consulta clínica e avaliação de saúde.`;
    }

    const diasStr = diasAfastamento === 1 ? '1 (um) dia' : `${diasAfastamento} (${diasAfastamento}) dias`;
    return `Atesto para os devidos fins que o(a) paciente ${nomePaciente} esteve sob meus cuidados profissionais na data de ${dataAtual}, devendo permanecer em repouso e afastado(a) de suas atividades laborais/escolares por ${diasStr} a partir desta data para recuperação de sua saúde.${cidStr}`;
  };

  const handleEmitirAtestado = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmitindo(true);

    const nomePaciente = getNomePacienteFinal();
    let textoFinal = conteudoTexto.trim() || gerarTextoPadrao();

    // 1. Cria validação no banco com UUID
    const novaValidacao = clinicalDb.createValidacao({
      paciente_nome: nomePaciente,
      profissional_nome: `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm} | ${DOCTOR_INFO.rqe})`,
      tipo_documento: tipoDocumento,
      conteudo_texto: textoFinal,
      dias_afastamento: (tipoDocumento === 'Atestado Médico' || isAcompAfastamento) ? diasAfastamento : undefined,
      cid: cid.trim() ? resolveCidString(cid.trim()) : undefined
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
            Emissão de Atestados Médicos, Acompanhante e Laudos
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
                  onChange={(e) => {
                    const novoTipo = e.target.value as any;
                    setTipoDocumento(novoTipo);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34] bg-stone-50/50 font-medium"
                >
                  <optgroup label="Atestados do Paciente">
                    <option value="Atestado Médico">Atestado Médico (Afastamento do Paciente)</option>
                    <option value="Declaração de Comparecimento">Declaração de Comparecimento (Paciente)</option>
                  </optgroup>
                  <optgroup label="Documentos para o Acompanhante (CLT Art. 473)">
                    <option value="Atestado Médico para Acompanhante">Atestado Médico para Acompanhante (Afastamento do Familiar)</option>
                    <option value="Declaração de Comparecimento de Acompanhante">Declaração de Comparecimento do Acompanhante (Horas)</option>
                  </optgroup>
                  <optgroup label="Laudos e Relatórios">
                    <option value="Laudo Médico">Laudo Médico Pericial</option>
                    <option value="Relatório de Saúde">Relatório de Saúde</option>
                  </optgroup>
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
                  <option value={0}>-- Ou digitar paciente avulso abaixo --</option>
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
                Nome Completo do Paciente {selectedPacienteId > 0 ? '(Selecionado acima)' : '(Avulso)'}
              </label>
              <input
                type="text"
                value={pacienteAvulsoNome}
                onChange={(e) => setPacienteAvulsoNome(e.target.value)}
                placeholder="Ex: Maria Eduarda Silva"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
            </div>

            {/* SEÇÃO DEDICADA DO ACOMPANHANTE */}
            {isAcompanhante && (
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    👥 Dados do Acompanhante (Resguardado pela CLT Art. 473)
                  </span>
                  <span className="text-[11px] text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    {isAcompAfastamento ? 'Afastamento Laboral' : 'Horas de Consulta'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                      Nome Completo do Acompanhante *
                    </label>
                    <input
                      type="text"
                      value={nomeAcompanhante}
                      onChange={(e) => setNomeAcompanhante(e.target.value)}
                      placeholder="Ex: Carlos Eduardo de Oliveira"
                      className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-1 focus:ring-emerald-700"
                      required={isAcompanhante}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                      CPF do Acompanhante
                    </label>
                    <input
                      type="text"
                      value={cpfAcompanhante}
                      onChange={(e) => setCpfAcompanhante(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                      Grau de Parentesco / Vínculo
                    </label>
                    <select
                      value={parentescoAcompanhante}
                      onChange={(e) => setParentescoAcompanhante(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-1 focus:ring-emerald-700"
                    >
                      <option value="Mãe">Mãe</option>
                      <option value="Pai">Pai</option>
                      <option value="Cônjuge / Companheiro(a)">Cônjuge / Companheiro(a)</option>
                      <option value="Filho(a)">Filho(a)</option>
                      <option value="Irmão(ã)">Irmão(ã)</option>
                      <option value="Avô / Avó">Avô / Avó</option>
                      <option value="Tio(a)">Tio(a)</option>
                      <option value="Cuidador(a) Legal">Cuidador(a) Legal</option>
                      <option value="Responsável">Responsável</option>
                      <option value="Acompanhante">Outro Vínculo</option>
                    </select>
                  </div>

                  {isAcompAfastamento ? (
                    <div>
                      <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                        Dias de Afastamento do Acompanhante
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={diasAfastamento}
                        onChange={(e) => setDiasAfastamento(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border border-emerald-300 bg-white focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                          Entrada
                        </label>
                        <input
                          type="time"
                          value={horarioChegada}
                          onChange={(e) => setHorarioChegada(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-emerald-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-emerald-900 block mb-1">
                          Saída
                        </label>
                        <input
                          type="time"
                          value={horarioSaida}
                          onChange={(e) => setHorarioSaida(e.target.value)}
                          className="w-full text-xs p-2 rounded-xl border border-emerald-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELEÇÃO DE DIAS E CID PARA ATESTADO MÉDICO PADRÃO */}
            {tipoDocumento === 'Atestado Médico' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Dias de Afastamento do Paciente
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
                    label="Diagnóstico CID-10 (Paciente)"
                    value={cid}
                    onChange={(val) => setCid(val)}
                    placeholder="Digite código sem ponto (ex: k041, j00) ou patologia..."
                    helperText="Conforme Resolução CFM 1.658/2002, sob consentimento."
                    formatStyle="full"
                  />
                </div>
              </div>
            )}

            {/* COMPARECIMENTO NORMAL DO PACIENTE */}
            {tipoDocumento === 'Declaração de Comparecimento' && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Horário de Chegada
                  </label>
                  <input
                    type="time"
                    value={horarioChegada}
                    onChange={(e) => setHorarioChegada(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Horário de Saída
                  </label>
                  <input
                    type="time"
                    value={horarioSaida}
                    onChange={(e) => setHorarioSaida(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 block">
                  Texto Declaratório do Documento
                </label>
                <button
                  type="button"
                  onClick={() => setConteudoTexto(gerarTextoPadrao())}
                  className="text-[11px] text-[#1A3C34] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>⚡ Carregar texto padrão oficial</span>
                </button>
              </div>
              <textarea
                rows={4}
                value={conteudoTexto}
                onChange={(e) => setConteudoTexto(e.target.value)}
                placeholder={gerarTextoPadrao()}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
              />
              <span className="text-[10px] text-stone-500 block mt-0.5">
                * Se mantido em branco, o texto padrão gerado automaticamente acima será utilizado na impressão do PDF oficial.
              </span>
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
                <span>{emitindo ? 'Gerando Documento e QR Code...' : 'Emitir Documento com QR Code (PDF)'}</span>
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
