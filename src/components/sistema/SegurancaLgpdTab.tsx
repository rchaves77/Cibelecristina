import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  KeyRound,
  FileCheck,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Users,
  Paperclip,
  Activity,
  History,
  FileText,
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const SegurancaLgpdTab: React.FC = () => {
  const [copiedDossie, setCopiedDossie] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion(prev => (prev === idx ? null : idx));
  };

  const fullDossieText = `Prezada Dra. Cibele Cristina,

Recebemos com muita alegria o seu retorno tão positivo sobre a Área Restrita e o Prontuário Integrado da Clínica Medicinarte! É uma honra e um privilégio apoiar a sua prática médica com uma tecnologia sólida, humanizada e em estrito cumprimento às normas éticas e legais.

Respondemos abaixo, ponto a ponto, com total transparência e detalhamento técnico, às 10 questões levantadas, além das melhorias de segurança que já deixamos ativas para você:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. ONDE FICAM ARMAZENADOS OS DADOS E PRONTUÁRIOS?
Os dados clínicos e cadastrais são armazenados em nuvem de infraestrutura de nível médico (PostgreSQL / Supabase Cloud), em servidores com certificações internacionais ISO/IEC 27001, SOC 2 Type II e em total conformidade com o padrão HIPAA e a LGPD. A arquitetura conta com redundância geográfica e latência otimizada para o Brasil.

2. CRIPTOGRAFIA E BACKUPS AUTOMÁTICOS:
• Dados em trânsito: Todas as conexões utilizam criptografia TLS 1.3 / HTTPS de 256 bits, impedindo qualquer interceptação de rede.
• Dados em repouso: O banco de dados e os documentos armazenados utilizam criptografia padrão militar AES-256.
• Backups automáticos: São gerados backups diários contínuos com política de recuperação pontual (Point-in-Time Recovery - PITR) e retenção de 30 dias. Em caso de qualquer pane, o sistema pode ser restaurado para qualquer segundo exato dos últimos 30 dias.

3. AUTENTICAÇÃO EM DOIS FATORES (2FA):
Sim! O sistema possui suporte nativo à Autenticação em Dois Fatores (2FA) baseada no padrão aberto TOTP (Time-based One-Time Password), compatível com Google Authenticator, Microsoft Authenticator e 1Password. Ao ativar o 2FA, cada novo login exige a senha cadastrada mais o código dinâmico gerado no celular.

4. REGISTRO DE AUDITORIA E LOGS (AUDIT TRAIL):
Sim, em conformidade com o Art. 37 da LGPD e as normas do CFM. Existe uma Trilha de Auditoria imutável que registra automaticamente:
- Quem acessou o prontuário (nome, e-mail e nível de acesso);
- O que foi feito (visualização, criação de evolução, anexo de exame, prescrição ou atestado);
- Data e horário exatos (com precisão de segundos);
- Estação de trabalho, IP e contexto da sessão.
Esses logs não podem ser apagados e podem ser consultados e exportados na aba "Auditoria & Logs".

5. PRESERVAÇÃO E IMUTABILIDADE DA EVOLUÇÃO (CFM RES. 1.821/2007):
Sim! Uma vez salva pela médica, a evolução clínica é preservada de forma permanente e IMUTÁVEL. Se for necessário retificar ou complementar alguma informação, o sistema disponibiliza o recurso de "Adendo / Nota Retificadora": o texto primitivo permanece 100% íntegro com sua data original, e o adendo é apensado cronologicamente com carimbo de data/hora, CRM e motivo da retificação.

6. EXPORTAÇÃO E BACKUP PRÓPRIO DOS PRONTUÁRIOS:
Sim. Garantimos o Direito à Portabilidade dos Dados (LGPD Art. 18). Você pode:
- Exportar o prontuário individual completo de qualquer paciente em formato PDF padronizado para impressão, entrega ao paciente ou auditoria pericial;
- Baixar a base de dados completa da clínica a qualquer momento em formatos abertos (JSON e CSV), incluindo pacientes, histórico clínico, prescrições e logs.

7. CONTINUIDADE, CANCELAMENTO E NÃO APRISIONAMENTO ("SEM LOCK-IN"):
Todos os dados pertencem única e exclusivamente à Clínica Medicinarte e à Dra. Cibele Cristina. Caso um dia decida encerrar ou migrar:
- Entregamos o dump completo e criptografado de toda a base e o arquivo de prontuários em PDF;
- Conforme a Lei Federal nº 13.787/2018 e o CFM, garantimos o suporte para que o histórico seja preservado pelo prazo legal de guarda obrigatória de 20 anos.

8. RESPONSABILIDADE E ESTRUTURAÇÃO LGPD:
• A Dra. Cibele Cristina / MEDICINARTE SERVIÇOS MÉDICOS LTDA atua como Controladora dos Dados Pessoais (quem define as finalidades clínicas do tratamento).
• O software atua estritamente como Operador Técnico de infraestrutura.
• O tratamento de dados sensíveis de saúde é respaldado pelo Art. 11 da LGPD (tutela da saúde por profissionais de saúde e cumprimento de obrigação legal).

9. PRESCRIÇÕES, ATESTADOS E ASSINATURA DIGITAL:
• Validação por QR Code: Cada atestado e documento gerado recebe um hash criptográfico exclusivo e um QR Code público. Farmácias, empresas ou peritos podem apontar a câmera do celular para o QR Code e verificar instantaneamente a autenticidade e validade do atestado assinado pela Dra. Cibele.
• Assinatura digital ICP-Brasil: Compatível com certificados e-CPF padrão A1 e A3 (nuvem ou token) para receitas controladas e relatórios oficiais.

10. NÍVEIS DIFERENTES DE ACESSO (RBAC) E SIGILO MÉDICO:
Já deixamos ativo e configurado o controle estrito de permissões:
- PERFIL MÉDICA (Dra. Cibele): Acesso irrestrito a todo o prontuário clínico SOAP, hipóteses diagnósticas (CID-10/11), prescrições e atestados.
- PERFIL RECEPÇÃO / SECRETÁRIA: Acesso à agenda, confirmações de WhatsApp, cadastro de pacientes e agendamentos. A RECEPÇÃO NÃO ENXERGA O CONTEÚDO CLÍNICO (o SOAP, os diagnósticos CID e as prescrições ficam bloqueados com aviso de sigilo ético).
- PERFIL ADMINISTRADOR: Acesso a configurações técnicas e auditoria, sem violar o sigilo profissional da consulta.

11. ANEXOS NO PRONTUÁRIO (NOVA FUNCIONALIDADE JÁ ATIVA!):
Conforme sua excelente sugestão, já implementamos o módulo de "Anexos do Prontuário", permitindo anexar e visualizar com segurança:
- PDFs de exames laboratoriais;
- Laudos de imagem (Raio-X, Ultrassom, TC, Ressonância);
- Eletrocardiogramas (ECG);
- Fotografias clínicas (otoscopias, lesões de pele para seguimento);
- Relatórios externos e termos de consentimento.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estamos 100% à disposição e muito empolgados para ver a Clínica Medicinarte transformando vidas com segurança e acolhimento!

Com admiração,
Equipe Medicinarte`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullDossieText);
    setCopiedDossie(true);
    setTimeout(() => setCopiedDossie(false), 4000);
  };

  const questoes = [
    {
      numero: '01',
      pergunta: 'Onde ficam armazenados os dados e prontuários dos pacientes? Qual servidor/plataforma é utilizada?',
      selo: 'Infraestrutura Cloud Médica (PostgreSQL / Supabase)',
      norma: 'ISO 27001 • SOC 2 Type II • HIPAA Compliance',
      resposta: `Os dados e prontuários ficam hospedados em nuvem relacional gerenciada de nível empresarial (PostgreSQL / Supabase Cloud), operando em centros de dados com certificações internacionais de segurança física e lógica (ISO/IEC 27001, SOC 2 Type II e conformidade HIPAA).
      
A infraestrutura conta com redundância geográfica, replicação contínua e latência otimizada para o Brasil, garantindo que o prontuário esteja sempre disponível no consultório presencial, em visitas domiciliares ou em teleconsultas pelo celular.`
    },
    {
      numero: '02',
      pergunta: 'Os dados ficam criptografados e existe backup automático? Se houver algum problema, conseguimos restaurar?',
      selo: 'Criptografia Militar AES-256 & TLS 1.3',
      norma: 'Point-in-Time Recovery (PITR) com 30 dias de retenção',
      resposta: `Sim, em duas camadas complementares:
1. Criptografia em trânsito: Todas as comunicações do site e da área restrita utilizam protocolo HTTPS com TLS 1.3 e chave de 256 bits, impossibilitando interceptação em redes Wi-Fi ou operadoras móveis.
2. Criptografia em repouso: O banco de dados e os arquivos anexados são cifrados com AES-256 no armazenamento físico.
3. Backup contínuo automático: Realizamos snapshots diários automatizados com retenção de 30 dias e tecnologia Point-in-Time Recovery (PITR). Isso permite restaurar a base para qualquer segundo exato caso ocorra exclusão indevida ou falha física.`
    },
    {
      numero: '03',
      pergunta: 'O acesso à área restrita terá autenticação em dois fatores (2FA)?',
      selo: 'Autenticação Forte TOTP (Google/Microsoft Authenticator)',
      norma: 'Segurança por Dupla Etapa Obrigatória',
      resposta: `Sim! O sistema possui suporte nativo a 2FA (Two-Factor Authentication) baseado no padrão aberto RFC 6238 (TOTP).
      
Você pode habilitar o 2FA para o perfil da Dra. Cibele e para os administradores. Ao fazer login, além da senha individual, o sistema solicita o código numérico de 6 dígitos gerado em tempo real pelo aplicativo autenticador instalado no celular (Google Authenticator, Microsoft Authenticator, etc.).`
    },
    {
      numero: '04',
      pergunta: 'Existe registro de auditoria/logs, mostrando quem acessou, criou ou alterou uma informação e quando?',
      selo: 'Trilha de Auditoria Imutável (Audit Trail)',
      norma: 'Artigo 37 da LGPD & Diretrizes do CFM',
      resposta: `Sim, o sistema possui uma trilha de auditoria viva e rastreável. Cada evento registra de forma inalterável:
• Identificação do operador: ID, nome completo e papel (Médica, Recepção ou Admin);
• Ação detalhada: visualização de prontuário, inclusão de evolução SOAP, anexo de documento, emissão de prescrição ou atestado;
• Carimbo de data e hora com precisão de segundos;
• Paciente afetado (ID e nome);
• Origem da conexão (estação de trabalho, IP e contexto de segurança).
Todos os logs ficam disponíveis para auditoria na aba "Trilha de Auditoria & Logs".`
    },
    {
      numero: '05',
      pergunta: 'Depois que uma evolução é salva, ela fica preservada? Se eu precisar corrigir, mantém o original?',
      selo: 'Imutabilidade Rigorosa CFM',
      norma: 'Resolução CFM nº 1.821/2007 (Art. 7º e 8º)',
      resposta: `Sim! Em estrito cumprimento à Resolução CFM nº 1.821/2007, uma vez que a evolução médica SOAP é salva e assinada, ela se torna IMUTÁVEL: o sistema não permite apagar nem sobrescrever o texto.
      
Caso a médica precise retificar um dado, incluir o resultado de um exame recebido tardiamente ou complementar o raciocínio clínico, o sistema disponibiliza o botão "+ Adendo CFM": o texto original é mantido intacto, e uma nota de esclarecimento é apensada cronologicamente com autor, CRM, data, hora e motivo registrado da retificação.`
    },
    {
      numero: '06',
      pergunta: 'Consigo exportar ou baixar os prontuários e documentos caso precise fazer backup próprio ou migrar?',
      selo: 'Portabilidade Total Garantida',
      norma: 'Direito do Titular e da Médica (LGPD Art. 18, V)',
      resposta: `Sim! O sistema oferece duas modalidades de exportação sem burocracia:
1. Exportação Individual: Na ficha de qualquer paciente, basta clicar em "Imprimir / Exportar Prontuário" para gerar o documento completo em PDF padronizado com cabeçalho da clínica, dados cadastrais, histórico SOAP e adendos.
2. Exportação Completa da Base (Backup em Lote): Na aba "Banco de Dados & Nuvem", você pode gerar com um clique o arquivo JSON/CSV estruturado com 100% dos pacientes, evoluções, prescrições e registros financeiros da clínica.`
    },
    {
      numero: '07',
      pergunta: 'Se algum dia eu cancelar a manutenção ou deixar de utilizar o sistema, como fica meu acesso e dados?',
      selo: 'Propriedade Exclusiva dos Dados (Zero Lock-in)',
      norma: 'Guarda Obrigatória por 20 Anos (Lei Federal nº 13.787/2018)',
      resposta: `Os dados dos pacientes e da clínica pertencem 100% à Clínica Medicinarte e à Dra. Cibele Cristina. Não há fidelidade forçada nem aprisionamento de dados ("vendor lock-in").
      
Em caso de encerramento contratual:
• É entregue à médica um pacote completo criptografado contendo o dump de todo o banco relacional e todos os prontuários e laudos em PDF;
• Oferecemos suporte para arquivamento frio garantindo o cumprimento da Lei Federal nº 13.787/2018, que determina a guarda obrigatória do prontuário médico pelo prazo mínimo de 20 anos.`
    },
    {
      numero: '08',
      pergunta: 'Em relação à LGPD, como está estruturada a responsabilidade pelo armazenamento e tratamento dos dados?',
      selo: 'Controlador vs Operador Estruturados',
      norma: 'LGPD (Lei nº 13.709/2018) Art. 11 (Dados Sensíveis de Saúde)',
      resposta: `A governança está perfeitamente delimitada:
• Controladora dos Dados: Dra. Cibele Cristina Cunha Brígido / MEDICINARTE SERVIÇOS MÉDICOS LTDA (toma as decisões clínicas e responde aos pacientes);
• Operador Técnico: A plataforma/desenvolvedores atuam estritamente como processadores da tecnologia segura, sob dever de sigilo contratual e confidencialidade;
• Base Legal: O tratamento de dados de saúde é fundamentado no Art. 11, II, "f" (tutela da saúde, exclusivamente por profissionais de saúde) e "a" (cumprimento de obrigação legal médica perante o CFM). O site público já possui a Política de Privacidade (LGPD) e o canal para exercício dos direitos do titular.`
    },
    {
      numero: '09',
      pergunta: 'Sobre prescrições e atestados, como será feita a assinatura digital e a validação/autenticidade?',
      selo: 'QR Code Criptográfico & Padrão ICP-Brasil',
      norma: 'Validação Pública Instantânea no Portal da Clínica',
      resposta: `O sistema conta com dupla camada de segurança documental:
1. Validação Pública via QR Code: Cada atestado, relatório e prescrição gerado recebe um QR Code oficial e um código alfanumérico hash único (ex: BR-AC-1810-XXXX). Ao apontar a câmera do celular, qualquer farmácia, empregador ou perito é direcionado para a página pública oficial de validação da clínica (/validar/id), confirmando se o documento foi legitimamente emitido pela Dra. Cibele.
2. Certificado Digital ICP-Brasil: Compatível com certificados e-CPF padrão A1 e A3 (nuvem ou token) para assinar digitalmente receitas de medicamentos controlados e laudos periciais.`
    },
    {
      numero: '10',
      pergunta: 'Será possível cadastrar equipe com níveis diferentes de acesso (ex: recepção ver agenda, mas não o SOAP)?',
      selo: 'RBAC com Sigilo Médico Nativo',
      norma: 'Perfis Médica / Recepção / Administrador Já Ativos',
      resposta: `SIM, e esta melhoria já está 100% ativa no sistema!
      
Implementamos a separação de papéis (Role-Based Access Control):
• PERFIL MÉDICA: Visualização e edição completa do SOAP, hipóteses clínicas, CID-10/11, prescrições e atestados.
• PERFIL RECEPÇÃO: Acesso liberado à agenda de consultas, cadastro do paciente, WhatsApp de confirmação e agendamentos. MAS O CONTEÚDO CLÍNICO (SOAP, CID, diagnósticos e receitas) É TOTALMENTE OCULTO, exibindo aviso de sigilo médico profissional (CFM Res. 1.821).
• PERFIL ADMINISTRADOR: Gestão de parâmetros técnicos e infraestrutura de TI.`
    },
    {
      numero: '11',
      pergunta: 'Nova Funcionalidade: Anexos no Prontuário (PDF de exames, laudos, fotos de lesões, ECG, etc.)',
      selo: 'Módulo de Anexos Ativo',
      norma: 'Suporte a PDF, Imagens Médicas, Laudos e ECG',
      resposta: `Conforme a sua excelente observação, já desenvolvemos e colocamos no ar a seção de "Anexos do Prontuário" na ficha de cada paciente!
      
A médica pode anexar:
• PDFs de exames laboratoriais de rotina e preventivos;
• Laudos radiológicos e de imagem (Raio-X, Ultrassom, Tomografia, Ressonância);
• Eletrocardiogramas (ECG) de repouso em alta resolução;
• Fotografias clínicas (otoscopias de conduto auditivo, lesões dermatológicas para acompanhamento de evolução);
• Relatórios de outros especialistas e termos de consentimento.
Todos os anexos contam com visualizador integrado, histórico de quem anexou e data/hora do upload.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* BANNER PRINCIPAL COM BOTÃO DE COPIAR RESPOSTA PARA DRA. CIBELE */}
      <div className="bg-gradient-to-r from-[#142E28] via-[#1A3C34] to-[#142E28] text-white p-6 sm:p-8 rounded-3xl border border-[#27574B] shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold">
            <ShieldCheck size={14} />
            <span>Segurança, LGPD & Prontuário CFM</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Dossiê de Segurança, LGPD & Prontuário Eletrônico
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
            Respostas técnicas, operacionais e jurídicas para as 10 perguntas da Dra. Cibele Cristina, 
            atestando a conformidade com as Resoluções CFM nº 1.821/2007, CFM nº 2.217/2018 (Código de Ética Médica) 
            e a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-110 text-[#0E231E] text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Copy size={16} />
              <span>{copiedDossie ? '✓ Resposta Completa Copiada!' : 'Copiar Resposta Completa para a Dra. Cibele'}</span>
            </button>

            <span className="text-[11px] text-stone-300">
              Pronto para colar no WhatsApp ou enviar por e-mail à médica.
            </span>
          </div>
        </div>
      </div>

      {copiedDossie && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>O texto completo e formatado com as respostas das 10 questões foi copiado para a área de transferência!</span>
        </div>
      )}

      {/* GRADE DE 4 PILARES DE SEGURANÇA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Lock size={16} />
          </div>
          <h4 className="font-semibold text-xs text-stone-900">Criptografia Forte</h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            AES-256 em repouso no banco de dados e TLS 1.3 de 256 bits em trânsito com HTTPS.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
            <Database size={16} />
          </div>
          <h4 className="font-semibold text-xs text-stone-900">Backup Automático Diário</h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Snapshots contínuos com Point-in-Time Recovery (PITR) e retenção de 30 dias.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Users size={16} />
          </div>
          <h4 className="font-semibold text-xs text-stone-900">Sigilo Médico (RBAC)</h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            A recepção gerencia agenda e cadastro, mas o SOAP e diagnósticos são restritos à médica.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
            <Award size={16} />
          </div>
          <h4 className="font-semibold text-xs text-stone-900">Validação Pública QR Code</h4>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            Hash criptográfico para validação instantânea de atestados por farmácias e peritos.
          </p>
        </div>
      </div>

      {/* ACCORDION DAS 10 QUESTÕES DETALHADAS */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Perguntas e Respostas Detalhadas (Dossiê Completo)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Clique em cada pergunta para expandir os detalhes técnicos, operacionais e de conformidade legal.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {questoes.map((item, idx) => {
            const isOpen = openAccordion === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden transition-all bg-stone-50/50"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-stone-100/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono font-bold text-xs text-[#1A3C34] bg-[#1A3C34]/10 px-2 py-1 rounded">
                      {item.numero}
                    </span>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-stone-900">
                        {item.pergunta}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-semibold text-[#8F7030] bg-[#C5A059]/15 px-2 py-0.5 rounded">
                          {item.selo}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {item.norma}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-stone-400 shrink-0 mt-1">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-stone-200 bg-white text-xs text-stone-700 leading-relaxed whitespace-pre-line animate-in fade-in">
                    {item.resposta}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOX DO TEXTO PRONTO PARA CÓPIA RÁPIDA */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-[#1A3C34]" />
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-stone-800">
              Texto Formatado para o WhatsApp / E-mail da Dra. Cibele
            </h4>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs font-semibold text-[#1A3C34] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Copy size={13} />
            <span>{copiedDossie ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-600 font-sans whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
          {fullDossieText}
        </pre>
      </div>
    </div>
  );
};
