import React, { useState, useEffect } from 'react';
import {
  Award,
  Download,
  QrCode,
  ShieldCheck,
  Clock,
  Printer,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  FileCheck,
  Calendar,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Paciente, ValidacaoAtestado } from '../../types/clinical';
import { SignatureCanvas } from '../SignatureCanvas';
import { CidAutocompleteInput } from '../common/CidAutocompleteInput';
import { resolveCidString } from '../../data/cidDatabase';
import { generateAtestadoPdf } from '../../utils/pdfGenerator';
import { DOCTOR_INFO } from '../../data/medicinarteData';

interface EmbeddedAtestadoSectionProps {
  paciente: Paciente;
  canIssueCertificates: boolean;
  atestadosDoPaciente: ValidacaoAtestado[];
  onAtestadoSaved: () => void;
}

export type ModeloAtestado =
  | 'Atestado Médico de Afastamento'
  | 'Declaração de Comparecimento'
  | 'Atestado Médico para Acompanhante'
  | 'Atestado de Aptidão Física'
  | 'Laudo Médico';

export const EmbeddedAtestadoSection: React.FC<EmbeddedAtestadoSectionProps> = ({
  paciente,
  canIssueCertificates,
  atestadosDoPaciente,
  onAtestadoSaved
}) => {
  const [modelo, setModelo] = useState<ModeloAtestado>('Atestado Médico de Afastamento');
  const [isFormOpen, setIsFormOpen] = useState(true);

  // Campos específicos: Afastamento do Paciente
  const [diasAfastamento, setDiasAfastamento] = useState<number>(2);
  const [dataInicioAfastamento, setDataInicioAfastamento] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [cid, setCid] = useState('');
  const [autorizaCid, setAutorizaCid] = useState(false);

  // Campos específicos: Comparecimento
  const [dataComparecimento, setDataComparecimento] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [horarioChegada, setHorarioChegada] = useState<string>('09:00');
  const [horarioSaida, setHorarioSaida] = useState<string>('10:30');
  const [nomeAcompanhante, setNomeAcompanhante] = useState<string>('');

  // Campos específicos: Atestado / Declaração para Acompanhante
  const [cpfAcompanhante, setCpfAcompanhante] = useState<string>('');
  const [parentescoAcompanhante, setParentescoAcompanhante] = useState<string>('Mãe');
  const [subtipoAcompanhante, setSubtipoAcompanhante] = useState<'afastamento' | 'comparecimento'>('afastamento');
  const [diasAfastamentoAcomp, setDiasAfastamentoAcomp] = useState<number>(1);

  // Campos específicos: Aptidão Física
  const [finalidadeAptidao, setFinalidadeAptidao] = useState<string>(
    'prática de exercícios físicos regulares e musculação em academia'
  );

  // Preview em Tempo Real Editável
  const [previewTexto, setPreviewTexto] = useState<string>('');
  const [userHasEditedPreview, setUserHasEditedPreview] = useState(false);

  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [isEmitindo, setIsEmitindo] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Formatação de data em pt-BR
  const formatDateBR = (isoStr: string) => {
    if (!isoStr) return new Date().toLocaleDateString('pt-BR');
    const [year, month, day] = isoStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Atualização em tempo real do texto do preview com base nos parâmetros
  useEffect(() => {
    if (userHasEditedPreview) return; // Preserva edição manual do médico se houver

    const dataFormatada = formatDateBR(dataInicioAfastamento);
    const dataCompFormatada = formatDateBR(dataComparecimento);

    if (modelo === 'Atestado Médico de Afastamento') {
      const cidTexto = autorizaCid && cid.trim()
        ? ` Diagnóstico / CID-10: ${resolveCidString(cid.trim())} (exibição expressamente autorizada pelo(a) paciente).`
        : '';

      const diasPlural = diasAfastamento === 1 ? '1 (um) dia' : `${diasAfastamento} (${diasAfastamento}) dias`;

      setPreviewTexto(
        `Atesto para os devidos fins que o(a) paciente ${paciente.nome}, inscrito(a) no CPF sob nº ${paciente.cpf || 'não informado'}, esteve sob meus cuidados médicos profissionais nesta data, devendo permanecer em repouso e afastado(a) de suas atividades laborais e/ou escolares por ${diasPlural}, a partir de ${dataFormatada}, para tratamento e recuperação de sua saúde.${cidTexto}`
      );
    } else if (modelo === 'Declaração de Comparecimento') {
      const acompTexto = nomeAcompanhante.trim()
        ? `, acompanhado(a) por ${nomeAcompanhante.trim()}`
        : '';

      setPreviewTexto(
        `Declaro para os devidos fins trabalhistas e escolares que o(a) paciente ${paciente.nome}, CPF: ${paciente.cpf || 'não informado'}, compareceu a este consultório médico em ${dataCompFormatada}, no período das ${horarioChegada} às ${horarioSaida} horas${acompTexto}, para realização de consulta médica ambulatorial.`
      );
    } else if (modelo === 'Atestado Médico para Acompanhante') {
      const vinculo = parentescoAcompanhante.trim() ? ` (${parentescoAcompanhante.trim()})` : '';
      const nomeAcomp = nomeAcompanhante.trim() || 'ACOMPANHANTE';
      const cpfAcomp = cpfAcompanhante.trim() || 'não informado';

      if (subtipoAcompanhante === 'afastamento') {
        const diasAcompPlural = diasAfastamentoAcomp === 1 ? '1 (um) dia' : `${diasAfastamentoAcomp} (${diasAfastamentoAcomp}) dias`;
        setPreviewTexto(
          `Atesto para os devidos fins legais, trabalhistas e previdenciários (Art. 473 da CLT e resoluções do CFM) que o(a) Sr.(a) ${nomeAcomp}, inscrito(a) no CPF sob nº ${cpfAcomp}${vinculo}, esteve presente prestando assistência e cuidados indispensáveis ao(à) paciente ${paciente.nome}, CPF: ${paciente.cpf || 'não informado'}, nesta data, devendo permanecer afastado(a) de suas atividades laborais por ${diasAcompPlural}, a partir de ${dataFormatada}, para prestar suporte integral e acompanhar o tratamento e recuperação de saúde do(a) paciente sob seus cuidados.`
        );
      } else {
        setPreviewTexto(
          `Declaro para os devidos fins trabalhistas e escolares (Art. 473 da CLT) que o(a) Sr.(a) ${nomeAcomp}, inscrito(a) no CPF sob nº ${cpfAcomp}${vinculo}, esteve presente neste consultório médico em ${dataCompFormatada}, no período das ${horarioChegada} às ${horarioSaida} horas, prestando acompanhamento presencial ao(à) paciente ${paciente.nome}, CPF: ${paciente.cpf || 'não informado'}, durante a realização de consulta médica ambulatorial e procedimentos de saúde.`
        );
      }
    } else if (modelo === 'Atestado de Aptidão Física') {
      setPreviewTexto(
        `Atesto para os devidos fins que examinei clinicamente nesta data o(a) paciente ${paciente.nome}, CPF: ${paciente.cpf || 'não informado'}, encontrando-se hígido(a) e apto(a), do ponto de vista clínico e cardiovascular no momento deste exame, para a ${finalidadeAptidao}. Validade recomendada: 12 (doze) meses.`
      );
    } else {
      setPreviewTexto(
        `Laudo Médico: Atesto que o(a) paciente ${paciente.nome} encontra-se em acompanhamento médico ambulatorial nesta clínica, apresentando estabilidade clínica e seguindo plano terapêutico individualizado.`
      );
    }
  }, [
    modelo,
    diasAfastamento,
    dataInicioAfastamento,
    cid,
    autorizaCid,
    dataComparecimento,
    horarioChegada,
    horarioSaida,
    nomeAcompanhante,
    cpfAcompanhante,
    parentescoAcompanhante,
    subtipoAcompanhante,
    diasAfastamentoAcomp,
    finalidadeAptidao,
    paciente.nome,
    paciente.cpf,
    userHasEditedPreview
  ]);

  const handleSelectModelo = (m: ModeloAtestado) => {
    setModelo(m);
    setUserHasEditedPreview(false);
  };

  const handleEmitirAtestado = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canIssueCertificates) return;

    if (!previewTexto.trim()) {
      alert('O texto do documento não pode estar vazio.');
      return;
    }

    setIsEmitindo(true);
    try {
      const tipoMapeado: ValidacaoAtestado['tipo_documento'] =
        modelo === 'Declaração de Comparecimento'
          ? 'Declaração de Comparecimento'
          : modelo === 'Atestado Médico para Acompanhante'
          ? 'Atestado Médico para Acompanhante'
          : modelo === 'Laudo Médico'
          ? 'Laudo Médico'
          : 'Atestado Médico';

      // 1. Cria validação no banco clínico com hash e QR Code
      const diasAfastamentoFinal =
        modelo === 'Atestado Médico de Afastamento'
          ? diasAfastamento
          : modelo === 'Atestado Médico para Acompanhante' && subtipoAcompanhante === 'afastamento'
          ? diasAfastamentoAcomp
          : undefined;

      const novaValidacao = clinicalDb.createValidacao({
        paciente_nome: paciente.nome,
        profissional_nome: `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm} | ${DOCTOR_INFO.rqe})`,
        tipo_documento: tipoMapeado,
        conteudo_texto: previewTexto.trim(),
        dias_afastamento: diasAfastamentoFinal,
        cid: (autorizaCid && cid.trim()) ? resolveCidString(cid.trim()) : undefined
      });

      // 2. Registra na auditoria
      clinicalDb.logAuditoria({
        usuario_id: DOCTOR_INFO.crm,
        usuario_nome: DOCTOR_INFO.fullName,
        role: 'profissional',
        acao: 'EMISSAO_ATESTADO',
        detalhes: `Emissão de ${modelo} para o paciente ${paciente.nome}. Código: ${novaValidacao.hash_autenticidade}`,
        paciente_id: paciente.id,
        paciente_nome: paciente.nome
      });

      // 3. Renderiza PDF e baixa com QR Code público
      await generateAtestadoPdf({
        validacao: novaValidacao,
        signatureDataUrl: signatureDataUrl || undefined,
        baseUrl: window.location.origin
      });

      setFeedback('Atestado/Declaração emitido com sucesso! PDF com QR Code de autenticidade gerado.');
      setTimeout(() => setFeedback(null), 5000);
      onAtestadoSaved();
    } catch (err) {
      console.error(err);
      alert('Erro ao emitir documento.');
    } finally {
      setIsEmitindo(false);
    }
  };

  const handleReimprimirPdf = async (val: ValidacaoAtestado) => {
    try {
      await generateAtestadoPdf({
        validacao: val,
        baseUrl: window.location.origin
      });
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar PDF do atestado.');
    }
  };

  return (
    <div id="secao-atestados" className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#C5A059] text-[#0E231E] flex items-center justify-center font-bold shadow-xs">
            <Award size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                Passo 3 do Atendimento
              </span>
            </div>
            <h2 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              ATESTADOS MÉDICOS, DECLARAÇÕES & LAUDOS (COM VALIDAÇÃO QR CODE)
            </h2>
            <p className="text-xs text-stone-500">
              Emissão rápida com modelos oficiais (Afastamento, Comparecimento e Aptidão Física)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            {isFormOpen ? 'Ocultar / Recolher' : '+ Abrir Gerador'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* FORMULÁRIO DE EMISSÃO DIRETA NO ATENDIMENTO */}
      {isFormOpen && canIssueCertificates && (
        <div className="space-y-5 bg-stone-50/80 p-5 rounded-2xl border border-stone-200">
          {/* SELETOR DE MODELOS */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              Selecione o Modelo de Documento:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {(
                [
                  'Atestado Médico de Afastamento',
                  'Declaração de Comparecimento',
                  'Atestado Médico para Acompanhante',
                  'Atestado de Aptidão Física',
                  'Laudo Médico'
                ] as const
              ).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleSelectModelo(m)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all text-left flex flex-col justify-between cursor-pointer border ${
                    modelo === m
                      ? 'bg-[#1A3C34] text-white border-[#1A3C34] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>{m}</span>
                  <span className={`text-[10px] font-normal mt-1 ${modelo === m ? 'text-emerald-200' : 'text-stone-400'}`}>
                    {m === 'Atestado Médico de Afastamento' && 'Repouso, dias e CID'}
                    {m === 'Declaração de Comparecimento' && 'Horários e paciente'}
                    {m === 'Atestado Médico para Acompanhante' && 'CLT, familiar e cuidador'}
                    {m === 'Atestado de Aptidão Física' && 'Academia e esportes'}
                    {m === 'Laudo Médico' && 'Relatório circunstanciado'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS DO MODELO ESCOLHIDO */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-4">
            {/* MODELO 1: ATESTADO DE AFASTAMENTO */}
            {modelo === 'Atestado Médico de Afastamento' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Quantidade de Dias:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={diasAfastamento}
                        onChange={(e) => {
                          setDiasAfastamento(Math.max(1, parseInt(e.target.value) || 1));
                          setUserHasEditedPreview(false);
                        }}
                        className="w-20 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-bold text-center focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      />
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 5, 7, 14].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setDiasAfastamento(d);
                              setUserHasEditedPreview(false);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              diasAfastamento === d
                                ? 'bg-[#1A3C34] text-white border-[#1A3C34]'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            {d}d
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Data de Início do Afastamento:
                    </label>
                    <input
                      type="date"
                      value={dataInicioAfastamento}
                      onChange={(e) => {
                        setDataInicioAfastamento(e.target.value);
                        setUserHasEditedPreview(false);
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      CID-10 (Opcional):
                    </label>
                    <CidAutocompleteInput
                      value={cid}
                      onChange={(val) => {
                        setCid(val);
                        setUserHasEditedPreview(false);
                      }}
                      placeholder="Buscar código ou doença (ex: J00, K04)..."
                    />
                  </div>
                </div>

                {/* CHECKBOX DE AUTORIZAÇÃO DO CID (CFM / LGPD) */}
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autorizaCid}
                      onChange={(e) => {
                        setAutorizaCid(e.target.checked);
                        setUserHasEditedPreview(false);
                      }}
                      className="rounded border-amber-400 text-[#1A3C34] focus:ring-0 mt-0.5"
                    />
                    <span className="text-amber-900 font-medium">
                      <strong>Autorizo a exibição do diagnóstico CID-10 no atestado</strong> (em cumprimento à Resolução CFM nº 1.658/2002 e LGPD, a inclusão do CID exige anuência expressa do paciente).
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* MODELO 2: DECLARAÇÃO DE COMPARECIMENTO */}
            {modelo === 'Declaração de Comparecimento' && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Data do Comparecimento:
                  </label>
                  <input
                    type="date"
                    value={dataComparecimento}
                    onChange={(e) => {
                      setDataComparecimento(e.target.value);
                      setUserHasEditedPreview(false);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Horário de Chegada:
                  </label>
                  <input
                    type="time"
                    value={horarioChegada}
                    onChange={(e) => {
                      setHorarioChegada(e.target.value);
                      setUserHasEditedPreview(false);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Horário de Saída:
                  </label>
                  <input
                    type="time"
                    value={horarioSaida}
                    onChange={(e) => {
                      setHorarioSaida(e.target.value);
                      setUserHasEditedPreview(false);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Nome do Acompanhante (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Maria Silva (Mãe)"
                    value={nomeAcompanhante}
                    onChange={(e) => {
                      setNomeAcompanhante(e.target.value);
                      setUserHasEditedPreview(false);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                  />
                </div>
              </div>
            )}

            {/* MODELO: ATESTADO MÉDICO PARA O ACOMPANHANTE */}
            {modelo === 'Atestado Médico para Acompanhante' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSubtipoAcompanhante('afastamento');
                      setUserHasEditedPreview(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subtipoAcompanhante === 'afastamento'
                        ? 'bg-[#1A3C34] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Afastamento do Trabalho (Licença / Art. 473 CLT)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSubtipoAcompanhante('comparecimento');
                      setUserHasEditedPreview(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subtipoAcompanhante === 'comparecimento'
                        ? 'bg-[#1A3C34] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Declaração de Comparecimento / Horários
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Nome Completo do Acompanhante:
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Rômulo Chaves da Silva"
                      value={nomeAcompanhante}
                      onChange={(e) => {
                        setNomeAcompanhante(e.target.value);
                        setUserHasEditedPreview(false);
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      CPF do Acompanhante (ou RG):
                    </label>
                    <input
                      type="text"
                      placeholder="ex: 123.456.789-00"
                      value={cpfAcompanhante}
                      onChange={(e) => {
                        setCpfAcompanhante(e.target.value);
                        setUserHasEditedPreview(false);
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Grau de Parentesco / Vínculo:
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Mãe, Pai, Cônjuge, Filho(a), Cuidador(a)"
                      value={parentescoAcompanhante}
                      onChange={(e) => {
                        setParentescoAcompanhante(e.target.value);
                        setUserHasEditedPreview(false);
                      }}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                    />
                  </div>
                </div>

                {subtipoAcompanhante === 'afastamento' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Dias de Afastamento para o Acompanhante:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={diasAfastamentoAcomp}
                          onChange={(e) => {
                            setDiasAfastamentoAcomp(Math.max(1, parseInt(e.target.value) || 1));
                            setUserHasEditedPreview(false);
                          }}
                          className="w-20 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-bold text-center focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 5, 7].map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setDiasAfastamentoAcomp(d);
                                setUserHasEditedPreview(false);
                              }}
                              className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                diasAfastamentoAcomp === d
                                  ? 'bg-[#1A3C34] text-white border-[#1A3C34]'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {d}d
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Data de Início do Afastamento:
                      </label>
                      <input
                        type="date"
                        value={dataInicioAfastamento}
                        onChange={(e) => {
                          setDataInicioAfastamento(e.target.value);
                          setUserHasEditedPreview(false);
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Data do Comparecimento:
                      </label>
                      <input
                        type="date"
                        value={dataComparecimento}
                        onChange={(e) => {
                          setDataComparecimento(e.target.value);
                          setUserHasEditedPreview(false);
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Horário de Chegada:
                      </label>
                      <input
                        type="time"
                        value={horarioChegada}
                        onChange={(e) => {
                          setHorarioChegada(e.target.value);
                          setUserHasEditedPreview(false);
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Horário de Saída:
                      </label>
                      <input
                        type="time"
                        value={horarioSaida}
                        onChange={(e) => {
                          setHorarioSaida(e.target.value);
                          setUserHasEditedPreview(false);
                        }}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODELO 3: APTIDÃO FÍSICA */}
            {modelo === 'Atestado de Aptidão Física' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Finalidade da Avaliação Física / Prática Desportiva:
                </label>
                <input
                  type="text"
                  value={finalidadeAptidao}
                  onChange={(e) => {
                    setFinalidadeAptidao(e.target.value);
                    setUserHasEditedPreview(false);
                  }}
                  placeholder="ex: prática de musculação em academia, corridas e atividades aeróbicas regulares"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
                />
              </div>
            )}
          </div>

          {/* PREVIEW EM TEMPO REAL EDITÁVEL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#C5A059]" />
                <span>Preview em Tempo Real (Texto Oficial do Documento - Editável):</span>
              </label>

              {userHasEditedPreview && (
                <button
                  type="button"
                  onClick={() => setUserHasEditedPreview(false)}
                  className="text-[11px] text-[#1A3C34] hover:underline font-semibold"
                >
                  Restaurar Texto Padrão Automático
                </button>
              )}
            </div>

            <textarea
              rows={4}
              required
              value={previewTexto}
              onChange={(e) => {
                setPreviewTexto(e.target.value);
                setUserHasEditedPreview(true);
              }}
              className="w-full p-4 bg-white border border-stone-300 rounded-2xl text-xs text-stone-900 font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] resize-y shadow-2xs"
            />
          </div>

          {/* ASSINATURA DIGITALIZADA OPCIONAL */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowSignatureCanvas(!showSignatureCanvas)}
              className="text-xs font-bold text-[#1A3C34] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showSignatureCanvas ? 'Ocultar Assinatura Manual' : '✍️ Adicionar Assinatura Desenhada na Tela (Opcional)'}</span>
            </button>

            {showSignatureCanvas && (
              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-2xs max-w-md">
                <SignatureCanvas
                  onSave={(dataUrl) => {
                    setSignatureDataUrl(dataUrl);
                    setFeedback('Assinatura gravada para inclusão no PDF!');
                    setTimeout(() => setFeedback(null), 2500);
                  }}
                  height={140}
                  label="Desenhe a assinatura com o dedo ou mouse:"
                />
              </div>
            )}
          </div>

          {/* BOTÕES DE EMISSÃO */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <QrCode size={16} className="text-[#1A3C34]" />
              <span>Gera QR Code público de validação e código verificador CFM.</span>
            </div>

            <button
              type="button"
              onClick={() => handleEmitirAtestado()}
              disabled={isEmitindo}
              className="px-6 py-2.5 rounded-2xl bg-[#C5A059] hover:bg-[#b08e4c] text-[#0E231E] text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-98 disabled:opacity-75"
            >
              {isEmitindo ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
                  <span>Gerando PDF com QR Code...</span>
                </>
              ) : (
                <>
                  <Printer size={16} />
                  <span>Gerar PDF / Imprimir Documento</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* HISTÓRICO DE ATESTADOS DESTE PACIENTE */}
      <div className="space-y-3 pt-2">
        <h3 className="font-bold text-xs text-stone-700 uppercase tracking-wider flex items-center gap-2">
          <Clock size={14} className="text-stone-400" />
          <span>Atestados e Declarações Emitidos ({atestadosDoPaciente.length})</span>
        </h3>

        {atestadosDoPaciente.length > 0 ? (
          <div className="space-y-2.5">
            {atestadosDoPaciente.map((at) => (
              <div
                key={at.id}
                className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {at.tipo_documento}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                      {at.hash_autenticidade || (at as any).hash_verificador || at.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {new Date(at.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                    {at.conteudo_texto}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/validar/${at.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    title="Verificar autenticidade na página do validador"
                  >
                    <ExternalLink size={12} />
                    <span>Validar QR Code</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleReimprimirPdf(at)}
                    className="px-3 py-1 rounded-xl bg-[#1A3C34] hover:bg-[#122b25] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    title="Baixar PDF do atestado"
                  >
                    <Download size={12} />
                    <span>Baixar PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">
            Nenhum atestado ou declaração emitido anteriormente para este paciente.
          </p>
        )}
      </div>
    </div>
  );
};
