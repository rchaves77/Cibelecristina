import {
  Perfil,
  Paciente,
  Agendamento,
  ProntuarioRegistro,
  ValidacaoAtestado,
  PrescricaoTemplate,
  PrescricaoEmitida,
  School,
  SchoolStudent,
  NeuroAlert,
  AuditoriaMapeamento,
  AlertaSobrecarga,
  DespesaOuReceita,
  AgendamentoStatus,
  GoogleSearchConsoleConfig
} from '../types/clinical';
import { DOCTOR_INFO } from '../data/medicinarteData';

// Chaves de Armazenamento Local
const STORAGE_KEYS = {
  PERFIS: 'cibele_db_perfis_v1',
  PACIENTES: 'cibele_db_pacientes_v1',
  AGENDAMENTOS: 'cibele_db_agendamentos_v1',
  PRONTUARIOS: 'cibele_db_prontuarios_v1',
  VALIDACOES: 'cibele_db_validacoes_v1',
  TEMPLATES_PRESCRICAO: 'cibele_db_templates_prescricao_v1',
  PRESCRICOES_EMITIDAS: 'cibele_db_prescricoes_emitidas_v1',
  SCHOOLS: 'cibele_db_schools_v1',
  SCHOOL_STUDENTS: 'cibele_db_school_students_v1',
  NEURO_ALERTS: 'cibele_db_neuro_alerts_v1',
  AUDITORIAS: 'cibele_db_auditorias_v1',
  ALERTAS_SOBRECARGA: 'cibele_db_alertas_sobrecarga_v1',
  FINANCEIRO: 'cibele_db_financeiro_v1',
  SESSION: 'cibele_db_active_user_v1',
  AUTH_STATE: 'cibele_db_is_authenticated_v1',
  GSC: 'cibele_db_gsc_v1'
};

// Seed Inicial de Perfis
const INITIAL_PERFIS: Perfil[] = [
  {
    id: 'perfil-master',
    nome: 'Diretoria Executiva / Master',
    email: 'clienteboxplus@gmail.com',
    role: 'admin',
    cor: '#142E28',
    permissao_financeiro: true,
    permissao_agendar: true,
    permissao_confirmacao_amanha: true,
    dias_atendimento: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
    hora_inicio: '07:00',
    hora_fim: '22:00',
    senha: 'admin123'
  },
  {
    id: 'perfil-cibele',
    nome: 'Dra. Cibele Cristina Cunha Brígido',
    email: 'cibele@medicinarte.com.br',
    role: 'profissional',
    cor: '#1A3C34', // Verde Floresta Oficial
    permissao_financeiro: true,
    permissao_agendar: true,
    permissao_confirmacao_amanha: true,
    dias_atendimento: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
    hora_inicio: '08:00',
    hora_fim: '18:00',
    crm: DOCTOR_INFO.crm,
    rqe: DOCTOR_INFO.rqe,
    senha: 'cibele123'
  },
  {
    id: 'perfil-secretaria',
    nome: 'Recepção / Secretária Clínica',
    email: 'recepcao@medicinarte.com.br',
    role: 'secretaria',
    cor: '#C5A059', // Ouro Suave Oficial
    permissao_financeiro: false,
    permissao_agendar: true,
    permissao_confirmacao_amanha: true,
    dias_atendimento: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
    hora_inicio: '08:00',
    hora_fim: '18:00',
    senha: 'recepcao123'
  },
  {
    id: 'perfil-admin',
    nome: 'Administrador de Sistema (TI / Gestão)',
    email: 'admin@medicinarte.com.br',
    role: 'admin',
    cor: '#2D3748',
    permissao_financeiro: true,
    permissao_agendar: true,
    permissao_confirmacao_amanha: true,
    dias_atendimento: ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'],
    hora_inicio: '07:00',
    hora_fim: '20:00',
    senha: 'admin123'
  }
];

// Seed Inicial de Pacientes
const INITIAL_PACIENTES: Paciente[] = [
  {
    id: 1,
    nome: 'Maria da Silva Albuquerque',
    telefone: '(68) 99201-1122',
    convenio: 'Particular',
    cpf: '123.456.789-00',
    data_nascimento: '1982-04-14',
    email: 'maria.silva@email.com',
    observacoes: 'Acompanhamento preventivo e queixa de zumbido recente no ouvido esquerdo.',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 2,
    nome: 'João Paulo de Oliveira',
    telefone: '(68) 98402-3344',
    convenio: 'Particular',
    cpf: '234.567.890-11',
    data_nascimento: '1975-09-20',
    email: 'joao.oliveira@email.com',
    observacoes: 'Hipertensão arterial sistêmica leve em controle dietético.',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 3,
    nome: 'Ana Carolina Mendes Bastos',
    telefone: '(68) 99911-5566',
    convenio: 'Particular',
    cpf: '345.678.901-22',
    data_nascimento: '1990-11-05',
    email: 'ana.mendes@email.com',
    observacoes: 'Check-up anual racional e plano de introdução de atividade física.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 4,
    nome: 'Carlos Eduardo Nogueira',
    telefone: '(68) 98112-7788',
    convenio: 'Particular',
    cpf: '456.789.012-33',
    data_nascimento: '1963-02-18',
    email: 'carlos.nogueira@email.com',
    observacoes: 'Diabetes Mellitus tipo 2 e acompanhamento lipídico trimestral.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 5,
    nome: 'Helena Vasconcelos Soares (5 anos)',
    telefone: '(68) 99988-2233',
    convenio: 'Particular',
    cpf: '567.890.123-44',
    data_nascimento: '2021-06-12',
    email: 'pais.helena@email.com',
    observacoes: 'Puericultura e acompanhamento de marcos do desenvolvimento infantil.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

// Helper para datas relativas
function getIsoDate(offsetDays: number, hour: number, minute: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// Seed Inicial de Agendamentos
const INITIAL_AGENDAMENTOS: Agendamento[] = [
  {
    id: 101,
    sala_id: 1,
    profissional_nome: 'Dra. Cibele Cristina',
    paciente_nome: 'Maria da Silva Albuquerque',
    paciente_id: 1,
    paciente_telefone: '(68) 99201-1122',
    data_inicio: getIsoDate(0, 9, 0),
    data_fim: getIsoDate(0, 9, 45),
    duracao: '45',
    status: 'Presenca',
    valor_atendimento: 280,
    forma_pagamento: 'Pix',
    servico_nome: 'Lavagem Otológica',
    observacoes: 'Sensação de ouvido tampado após banho de piscina.'
  },
  {
    id: 102,
    sala_id: 1,
    profissional_nome: 'Dra. Cibele Cristina',
    paciente_nome: 'João Paulo de Oliveira',
    paciente_id: 2,
    paciente_telefone: '(68) 98402-3344',
    data_inicio: getIsoDate(0, 11, 0),
    data_fim: getIsoDate(0, 11, 45),
    duracao: '45',
    status: 'Agendado',
    valor_atendimento: 280,
    forma_pagamento: 'Cartão',
    servico_nome: 'Consulta Médica',
    observacoes: 'Retorno com mapa pressórico.'
  },
  {
    id: 103,
    sala_id: 1,
    profissional_nome: 'Dra. Cibele Cristina',
    paciente_nome: 'Ana Carolina Mendes Bastos',
    paciente_id: 3,
    paciente_telefone: '(68) 99911-5566',
    data_inicio: getIsoDate(1, 14, 0), // Amanhã
    data_fim: getIsoDate(1, 14, 45),
    duracao: '45',
    status: 'Agendado',
    valor_atendimento: 320,
    forma_pagamento: 'Pix',
    servico_nome: 'Check-up',
    observacoes: 'Check-up preventivo individualizado.'
  },
  {
    id: 104,
    sala_id: 1,
    profissional_nome: 'Dra. Cibele Cristina',
    paciente_nome: 'Carlos Eduardo Nogueira',
    paciente_id: 4,
    paciente_telefone: '(68) 98112-7788',
    data_inicio: getIsoDate(1, 16, 0), // Amanhã
    data_fim: getIsoDate(1, 16, 45),
    duracao: '45',
    status: 'Agendado',
    valor_atendimento: 280,
    forma_pagamento: 'Cartão',
    servico_nome: 'Doenças Crônicas',
    observacoes: 'Avaliação de exames laboratoriais (glicemia, HbA1c).'
  }
];

// Seed Inicial de Prontuários
const INITIAL_PRONTUARIOS: ProntuarioRegistro[] = [
  {
    id: 1,
    paciente_id: 1,
    tipo_registro: 'Procedimento',
    profissional_nome: 'Dra. Cibele Cristina',
    descricao: 'Realizada otoscopia bilateral. Identificado cerúmen impactado em conduto auditivo externo esquerdo. Procedida a lavagem otológica com soro fisiológico morno sob técnica asséptica e suave. Remoção completa da rolha ceruminosa. Membrana timpânica íntegra e translúcida. Paciente relata alívio auditivo imediato.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 2,
    paciente_id: 2,
    tipo_registro: 'Anamnese',
    profissional_nome: 'Dra. Cibele Cristina',
    descricao: 'Paciente comparece para acompanhamento de PA. Relata boa adesão à redução do sal na dieta e caminhadas 3x por semana. PA aferida em consultório: 125x82 mmHg. Sem queixas de cefaleia ou tontura. Mantido plano terapêutico não-farmacológico com reforço motivacional.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

// Seed Inicial de Templates de Prescrições (Padrões de preenchimento e receitas da Dra. Cibele)
const INITIAL_PRESCRICAO_TEMPLATES: PrescricaoTemplate[] = [
  {
    id: 'tmpl-lavagem-otologica',
    titulo: '👂 Preparo Pré-Lavagem Otológica (Ceruminolítico)',
    categoria: 'Lavagem Otológica',
    itens: [
      {
        id: 'i-1',
        tipo: 'medicamento',
        nome: 'Cerumin gotas otológicas (Hidroxiquinolina + Trietanolamina)',
        posologia_ou_instrucao: 'Instilar 3 a 5 gotas no ouvido acometido, 3 vezes ao dia, durante 3 a 5 dias antes do procedimento.',
        quantidade: '1 frasco (10ml)',
        via: 'Otológica'
      },
      {
        id: 'i-2',
        tipo: 'orientacao',
        nome: 'Cuidados de Aplicação',
        posologia_ou_instrucao: 'Permanecer deitado com o ouvido afetado para cima por 5 minutos após pingar as gotas. Não introduzir hastes flexíveis (cotonetes).'
      }
    ],
    observacoes_padrao: 'Retornar no dia agendado para realização segura da remoção de cerúmen em consultório.',
    created_at: new Date().toISOString()
  },
  {
    id: 'tmpl-checkup-racional',
    titulo: '🩺 Check-up Preventivo Racional (Adulto)',
    categoria: 'Check-up Racional',
    itens: [
      {
        id: 'i-3',
        tipo: 'exame',
        nome: 'Hemograma Completo com Contagem de Plaquetas',
        posologia_ou_instrucao: 'Jejum recomendado de 8 horas.',
        quantidade: '1'
      },
      {
        id: 'i-4',
        tipo: 'exame',
        nome: 'Glicemia de Jejum + Hemoglobina Glicada (HbA1c)',
        posologia_ou_instrucao: 'Avaliação do metabolismo glicêmico e rastreio de pré-diabetes.',
        quantidade: '1'
      },
      {
        id: 'i-5',
        tipo: 'exame',
        nome: 'Perfil Lipídico Completo (Colesterol Total, HDL, LDL, Não-HDL, Triglicerídeos)',
        posologia_ou_instrucao: 'Avaliação de risco cardiovascular individual.',
        quantidade: '1'
      },
      {
        id: 'i-6',
        tipo: 'exame',
        nome: 'Creatinina Sérica + Taxa de Filtração Glomerular Estimada (TFGe)',
        posologia_ou_instrucao: 'Avaliação basal da função renal.',
        quantidade: '1'
      },
      {
        id: 'i-7',
        tipo: 'exame',
        nome: 'EAS / Urina Tipo 1',
        posologia_ou_instrucao: 'Primeira urina da manhã, jato médio.',
        quantidade: '1'
      }
    ],
    observacoes_padrao: 'Exames solicitados de acordo com os critérios de medicina baseada em evidências, sem sobrecarga ou exames desnecessários.',
    created_at: new Date().toISOString()
  },
  {
    id: 'tmpl-hipertensao',
    titulo: '❤️ Acompanhamento de Hipertensão Arterial (Inicial)',
    categoria: 'Doenças Crônicas',
    itens: [
      {
        id: 'i-8',
        tipo: 'medicamento',
        nome: 'Losartana Potássica 50mg',
        posologia_ou_instrucao: 'Tomar 1 comprimido por via oral pela manhã, todos os dias no mesmo horário.',
        quantidade: '60 comprimidos',
        via: 'Oral'
      },
      {
        id: 'i-9',
        tipo: 'orientacao',
        nome: 'Monitoramento Domiciliar da Pressão Arterial (MRPA)',
        posologia_ou_instrucao: 'Aferir a PA pela manhã em repouso e no final da tarde por 5 dias consecutivos e anotar em diário.'
      }
    ],
    observacoes_padrao: 'Manter ingesta hídrica regular, redução moderada de sódio e atividade física regular.',
    created_at: new Date().toISOString()
  },
  {
    id: 'tmpl-ansiedade-sono',
    titulo: '🧠 Higiene do Sono & Manejo de Tensão',
    categoria: 'Saúde Mental',
    itens: [
      {
        id: 'i-10',
        tipo: 'medicamento',
        nome: 'Passiflora incarnata 500mg',
        posologia_ou_instrucao: 'Tomar 1 cápsula à noite, 1 hora antes de deitar.',
        quantidade: '30 cápsulas',
        via: 'Oral'
      },
      {
        id: 'i-11',
        tipo: 'orientacao',
        nome: 'Protocolo de Higiene do Sono',
        posologia_ou_instrucao: 'Desligar telas e luzes fortes 45 minutos antes de dormir; evitar café/estimulantes após as 15h; quarto escuro e silencioso.'
      }
    ],
    observacoes_padrao: 'Reavaliação clínica em 30 dias para monitoramento da qualidade do sono e bem-estar.',
    created_at: new Date().toISOString()
  }
];

// Seed Inicial de Validações de Atestados
const INITIAL_VALIDACOES: ValidacaoAtestado[] = [
  {
    id: 'a7b3c291-8841-4cf1-9b17-09fca9876543',
    paciente_nome: 'Maria da Silva Albuquerque',
    profissional_nome: 'Dra. Cibele Cristina Cunha Brígido (CRM-AC 1810 / RQE 1078)',
    tipo_documento: 'Declaração de Comparecimento',
    conteudo_texto: 'Declaro para os devidos fins que a paciente esteve sob cuidados médicos nesta data das 09:00 às 09:45 para realização de procedimento eletivo.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    hash_autenticidade: 'BR-AC-1810-7F9B'
  }
];

// Seed Escolar
const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-bosque',
    name: 'Colégio Integrado do Bosque',
    pdi_used: 12,
    pdi_limit: 25,
    contact_person: 'Coord. Pedagogica Larissa',
    contact_email: 'pedagogico@colegiodobosque.com.br'
  },
  {
    id: 'sch-floresta',
    name: 'Escola Floresta Viva - Educação Infantil',
    pdi_used: 6,
    pdi_limit: 15,
    contact_person: 'Diretora Silvia Mendes',
    contact_email: 'diretoria@florestaviva.com.br'
  }
];

const INITIAL_STUDENTS: SchoolStudent[] = [
  { id: 'st-1', school_id: 'sch-bosque', name: 'Lucas Gabriel Miranda', grade: '3º Ano Fundamental', status: 'Em Acompanhamento' },
  { id: 'st-2', school_id: 'sch-bosque', name: 'Beatriz Vasconcelos', grade: '4º Ano Fundamental', status: 'Ativo' },
  { id: 'st-3', school_id: 'sch-floresta', name: 'Enzo Valentim', grade: 'Infantil 5', status: 'Em Acompanhamento' }
];

const INITIAL_NEURO_ALERTS: NeuroAlert[] = [
  {
    id: 'nal-1',
    school_id: 'sch-bosque',
    student_id: 'st-1',
    student_name: 'Lucas Gabriel Miranda',
    sinal_desatencao: true,
    sinal_hiperatividade: true,
    sinal_dificuldade_leitura: false,
    sinal_isolamento_social: false,
    status: 'Intervenção Planejada',
    observacoes: 'Professor relatou dispersão acentuada nas aulas de matemática e dificuldade em permanecer sentado.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: 'nal-2',
    school_id: 'sch-floresta',
    student_id: 'st-3',
    student_name: 'Enzo Valentim',
    sinal_desatencao: false,
    sinal_hiperatividade: false,
    sinal_dificuldade_leitura: false,
    sinal_isolamento_social: true,
    status: 'Novo',
    observacoes: 'Dificuldade de integração nos momentos recreativos e choro frequente na entrada.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Seed Corporativo
const INITIAL_AUDITORIAS: AuditoriaMapeamento[] = [
  {
    id: 'aud-1',
    company_id: 'comp-acre-tech',
    company_name: 'AcreTech Soluções Digitais',
    setor: 'Desenvolvimento e Suporte Técnico',
    total_colaboradores: 45,
    indice_risco: 'Moderado',
    created_at: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    id: 'aud-2',
    company_id: 'comp-bio-norte',
    company_name: 'BioNorte Logística Hospitalar',
    setor: 'Operações e Logística',
    total_colaboradores: 80,
    indice_risco: 'Baixo',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString()
  }
];

const INITIAL_SOBRECARGAS: AlertaSobrecarga[] = [
  {
    id: 'sob-1',
    company_id: 'comp-acre-tech',
    company_name: 'AcreTech Soluções Digitais',
    colaborador_nome: 'Colaborador #412',
    setor: 'Suporte N2',
    nivel_estresse_autoavaliado: 8,
    sintoma_exaustao_mental: true,
    sintoma_perda_foco: true,
    sintoma_insonia: true,
    status: 'Encaminhado para Acolhimento',
    data: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: 'sob-2',
    company_id: 'comp-acre-tech',
    company_name: 'AcreTech Soluções Digitais',
    colaborador_nome: 'Colaborador #218',
    setor: 'Desenvolvimento',
    nivel_estresse_autoavaliado: 7,
    sintoma_exaustao_mental: true,
    sintoma_perda_foco: false,
    sintoma_insonia: true,
    status: 'Alerta Ativo',
    data: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// Seed Financeiro
const INITIAL_FINANCEIRO: DespesaOuReceita[] = [
  {
    id: 'fin-1',
    descricao: 'Consulta Presencial - Maria da Silva',
    categoria: 'Procedimento',
    tipo: 'Receita',
    valor: 280,
    data: new Date(Date.now() - 2 * 86400000).toISOString(),
    forma_pagamento: 'Pix',
    status: 'Liquidado'
  },
  {
    id: 'fin-2',
    descricao: 'Check-up Racional - Ana Carolina',
    categoria: 'Consulta',
    tipo: 'Receita',
    valor: 320,
    data: new Date(Date.now() - 1 * 86400000).toISOString(),
    forma_pagamento: 'Cartão',
    status: 'Liquidado'
  },
  {
    id: 'fin-3',
    descricao: 'Aquisição de Luvas e Espéculos Otológicos Descartáveis',
    categoria: 'Materiais Médicos',
    tipo: 'Despesa',
    valor: 145.5,
    data: new Date(Date.now() - 5 * 86400000).toISOString(),
    forma_pagamento: 'Pix',
    status: 'Liquidado'
  },
  {
    id: 'fin-4',
    descricao: 'Taxa de Manutenção e Prontuário Digital em Nuvem',
    categoria: 'Software',
    tipo: 'Despesa',
    valor: 190,
    data: new Date(Date.now() - 10 * 86400000).toISOString(),
    forma_pagamento: 'Pix',
    status: 'Liquidado'
  }
];

// Classe Principal do Banco Clínico com regras de negócio
class ClinicalDatabaseService {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
    } catch (err) {
      console.error(`Erro ao carregar dados da chave ${key}:`, err);
    }
    // Salvar fallback inicial
    this.setStorage(key, fallback);
    return fallback;
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Erro ao persistir dados na chave ${key}:`, err);
    }
  }

  // --- SESSÃO E AUTENTICAÇÃO DO USUÁRIO ---
  isAuthenticated(): boolean {
    const isAuth = this.getStorage<boolean>(STORAGE_KEYS.AUTH_STATE, false);
    const active = this.getStorage<Perfil | null>(STORAGE_KEYS.SESSION, null);
    return isAuth === true && active !== null;
  }

  getActiveUser(): Perfil {
    const user = this.getStorage<Perfil | null>(STORAGE_KEYS.SESSION, null);
    if (user) return user;
    const perfis = this.getPerfis();
    return perfis[0];
  }

  setActiveUser(perfil: Perfil): void {
    this.setStorage(STORAGE_KEYS.SESSION, perfil);
  }

  login(email: string, senha: string): { success: boolean; message?: string; user?: Perfil } {
    const perfis = this.getPerfis();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSenha = senha.trim();

    if (!cleanEmail) {
      return { success: false, message: 'Por favor, informe seu e-mail cadastrado.' };
    }

    if (!cleanSenha) {
      return { success: false, message: 'Por favor, informe sua senha de acesso.' };
    }

    // Busca perfil exatamente pelo email cadastrado (case-insensitive)
    const matched = perfis.find(p => p.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return {
        success: false,
        message: 'Acesso negado: Este e-mail não possui cadastro ou autorização no sistema.'
      };
    }

    // Validação estrita de senha
    const senhaCadastrada = matched.senha || 'admin123';
    if (cleanSenha !== senhaCadastrada) {
      return {
        success: false,
        message: 'Senha incorreta. Verifique suas credenciais ou solicite a redefinição.'
      };
    }

    // Autenticação com sucesso
    this.setStorage(STORAGE_KEYS.AUTH_STATE, true);
    this.setStorage(STORAGE_KEYS.SESSION, matched);

    return {
      success: true,
      user: matched
    };
  }

  logout(): void {
    this.setStorage(STORAGE_KEYS.AUTH_STATE, false);
    this.setStorage(STORAGE_KEYS.SESSION, null);
  }

  getPerfis(): Perfil[] {
    const list = this.getStorage<Perfil[]>(STORAGE_KEYS.PERFIS, INITIAL_PERFIS);
    // Assegura que o perfil master clienteboxplus@gmail.com e outros essenciais estejam sempre salvos
    let modified = false;
    for (const init of INITIAL_PERFIS) {
      const exists = list.some(p => p.email.toLowerCase() === init.email.toLowerCase());
      if (!exists) {
        list.unshift(init);
        modified = true;
      }
    }
    if (modified) {
      this.setStorage(STORAGE_KEYS.PERFIS, list);
    }
    return list;
  }

  updatePerfil(updated: Perfil): void {
    const perfis = this.getPerfis();
    const idx = perfis.findIndex(p => p.id === updated.id);
    if (idx !== -1) {
      perfis[idx] = updated;
    } else {
      perfis.push(updated);
    }
    this.setStorage(STORAGE_KEYS.PERFIS, perfis);
  }

  savePerfil(updated: Perfil): void {
    this.updatePerfil(updated);
  }

  updateSenhaPerfil(perfilId: string, novaSenha: string): Perfil | null {
    const perfis = this.getPerfis();
    const idx = perfis.findIndex(p => p.id === perfilId);
    if (idx === -1) return null;

    perfis[idx] = {
      ...perfis[idx],
      senha: novaSenha,
      senha_alterada_em: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.PERFIS, perfis);

    // Se o usuário ativo for esse perfil, atualiza a sessão
    const active = this.getActiveUser();
    if (active && active.id === perfilId) {
      this.setActiveUser(perfis[idx]);
    }

    return perfis[idx];
  }

  gerarResetSenha(emailOuId: string): { success: boolean; token: string; link: string; perfil?: Perfil; mensagemPreview: string } {
    const perfis = this.getPerfis();
    const cleanQuery = emailOuId.trim().toLowerCase();
    const idx = perfis.findIndex(p => p.id === emailOuId || p.email.toLowerCase() === cleanQuery);
    
    if (idx === -1) {
      return {
        success: false,
        token: '',
        link: '',
        mensagemPreview: 'Perfil não localizado no sistema Medicinarte.'
      };
    }

    const token = 'rst_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const expira = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas

    perfis[idx] = {
      ...perfis[idx],
      reset_token: token,
      reset_token_expira: expira
    };
    this.setStorage(STORAGE_KEYS.PERFIS, perfis);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dracibelecristina.med.br';
    const link = `${baseUrl}/reset-senha?token=${token}&email=${encodeURIComponent(perfis[idx].email)}`;

    const mensagemPreview = `Olá, ${perfis[idx].nome}.\n\nRecebemos uma solicitação para redefinir a sua senha de acesso ao Sistema Clínico Medicinarte da Dra. Cibele Cristina.\n\nPara cadastrar sua nova senha com segurança, clique no link abaixo (válido por 24 horas):\n${link}\n\nSe você não solicitou esta redefinição, por favor ignore este aviso ou informe a Diretoria Técnica.\n\nMEDICINARTE SERVIÇOS MÉDICOS LTDA\nDiretora Técnica: Dra. Cibele Cristina — CRM-AC 1810 | RQE 1078`;

    return {
      success: true,
      token,
      link,
      perfil: perfis[idx],
      mensagemPreview
    };
  }

  redefinirSenhaComToken(token: string, novaSenha: string): { success: boolean; message: string; perfil?: Perfil } {
    const perfis = this.getPerfis();
    const idx = perfis.findIndex(p => p.reset_token === token);
    
    if (idx === -1) {
      return { success: false, message: 'Link de redefinição inválido ou já utilizado.' };
    }

    const perfil = perfis[idx];
    if (perfil.reset_token_expira && new Date(perfil.reset_token_expira).getTime() < Date.now()) {
      return { success: false, message: 'Este link de redefinição expirou (validade de 24 horas). Solicite um novo link.' };
    }

    perfis[idx] = {
      ...perfil,
      senha: novaSenha,
      senha_alterada_em: new Date().toISOString(),
      reset_token: undefined,
      reset_token_expira: undefined
    };
    this.setStorage(STORAGE_KEYS.PERFIS, perfis);

    return { success: true, message: `Senha de ${perfil.nome} alterada com sucesso!`, perfil: perfis[idx] };
  }

  getGoogleSearchConsoleConfig(): GoogleSearchConsoleConfig {
    const defaultConfig: GoogleSearchConsoleConfig = {
      token: 'google-site-verification=cibele_rio_branco_medicinarte_gsc',
      htmlFileName: 'google-site-verification.html',
      sitemapUrl: 'https://dracibelecristina.med.br/sitemap.xml',
      propriedadeUrl: 'https://dracibelecristina.med.br',
      status: 'configurado',
      ultimaAtualizacao: new Date().toISOString()
    };
    return this.getStorage<GoogleSearchConsoleConfig>(STORAGE_KEYS.GSC, defaultConfig);
  }

  saveGoogleSearchConsoleConfig(token: string, htmlFileName?: string): GoogleSearchConsoleConfig {
    const cleanToken = token.trim();
    const current = this.getGoogleSearchConsoleConfig();
    const updated: GoogleSearchConsoleConfig = {
      ...current,
      token: cleanToken,
      htmlFileName: htmlFileName ? htmlFileName.trim() : current.htmlFileName,
      status: cleanToken.length > 5 ? 'configurado' : 'pendente',
      ultimaAtualizacao: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.GSC, updated);

    // Atualiza dinamicamente a meta tag no DOM
    if (typeof document !== 'undefined') {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', cleanToken);
    }

    return updated;
  }

  // --- PACIENTES ---
  getPacientes(): Paciente[] {
    return this.getStorage<Paciente[]>(STORAGE_KEYS.PACIENTES, INITIAL_PACIENTES);
  }

  getPacienteById(id: number): Paciente | undefined {
    return this.getPacientes().find(p => p.id === id);
  }

  createPaciente(paciente: Omit<Paciente, 'id' | 'created_at'>): Paciente {
    return this.savePaciente(paciente);
  }

  savePaciente(paciente: Omit<Paciente, 'id' | 'created_at'> & { id?: number }): Paciente {
    const pacientes = this.getPacientes();
    if (paciente.id) {
      const idx = pacientes.findIndex(p => p.id === paciente.id);
      if (idx !== -1) {
        pacientes[idx] = { ...pacientes[idx], ...paciente };
        this.setStorage(STORAGE_KEYS.PACIENTES, pacientes);
        return pacientes[idx];
      }
    }
    // Novo paciente
    const newId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
    const newPaciente: Paciente = {
      ...paciente,
      id: newId,
      created_at: new Date().toISOString()
    };
    pacientes.unshift(newPaciente);
    this.setStorage(STORAGE_KEYS.PACIENTES, pacientes);
    return newPaciente;
  }

  // REGRA DE NEGÓCIO 1: Auto-cadastro de Pacientes no Agendamento
  getOrCreatePacienteByName(nome: string, telefone: string = ''): Paciente {
    const cleanName = nome.trim();
    const pacientes = this.getPacientes();
    const existing = pacientes.find(p => p.nome.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      if (telefone && !existing.telefone) {
        existing.telefone = telefone;
        this.savePaciente(existing);
      }
      return existing;
    }
    // Cria automaticamente
    return this.savePaciente({
      nome: cleanName,
      telefone: telefone || '(68) 98103-4408',
      convenio: 'Particular',
      observacoes: 'Cadastrado automaticamente via agendamento'
    });
  }

  // --- AGENDAMENTOS & AGENDA ---
  getAgendamentos(): Agendamento[] {
    return this.getStorage<Agendamento[]>(STORAGE_KEYS.AGENDAMENTOS, INITIAL_AGENDAMENTOS);
  }

  // REGRA DE NEGÓCIO 2: Validação de Grade Horária do Profissional
  validarGradeHoraria(dataInicio: Date, dataFim: Date, profissional: Perfil): { valido: boolean; motivo?: string } {
    // 1. Validar Dia da Semana
    const diasSemanaMap = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    const diaSemana = diasSemanaMap[dataInicio.getDay()];
    if (!profissional.dias_atendimento.includes(diaSemana)) {
      return {
        valido: false,
        motivo: `O profissional ${profissional.nome} não atende em dias de ${diaSemana}. Dias autorizados: ${profissional.dias_atendimento.join(', ')}.`
      };
    }

    // 2. Validar Faixa de Horário (hora_inicio e hora_fim)
    const [startH, startM] = profissional.hora_inicio.split(':').map(Number);
    const [endH, endM] = profissional.hora_fim.split(':').map(Number);

    const minutosInicioGrade = startH * 60 + startM;
    const minutosFimGrade = endH * 60 + endM;

    const minutosAgendInicio = dataInicio.getHours() * 60 + dataInicio.getMinutes();
    const minutosAgendFim = dataFim.getHours() * 60 + dataFim.getMinutes();

    if (minutosAgendInicio < minutosInicioGrade || minutosAgendFim > minutosFimGrade) {
      return {
        valido: false,
        motivo: `Horário fora da grade autorizada (${profissional.hora_inicio} às ${profissional.hora_fim}).`
      };
    }

    return { valido: true };
  }

  // REGRA DE NEGÓCIO 3: Restrição para evitar choque de horário (no_profissional_overlap)
  verificarChoqueHorario(
    dataInicio: Date,
    dataFim: Date,
    profissionalNome: string,
    salaId: number,
    ignoreAgendamentoId?: number
  ): { conflito: boolean; mensagem?: string } {
    const agendamentos = this.getAgendamentos();

    for (const a of agendamentos) {
      if (a.id === ignoreAgendamentoId || a.status === 'Cancelado') continue;

      const aInicio = new Date(a.data_inicio);
      const aFim = new Date(a.data_fim);

      // Houve sobreposição de tempo?
      const sobreposicao = (dataInicio < aFim && dataFim > aInicio);

      if (sobreposicao) {
        if (a.profissional_nome === profissionalNome) {
          return {
            conflito: true,
            mensagem: `Choque de horário: ${profissionalNome} já possui agendamento com ${a.paciente_nome} entre ${aInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} e ${aFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
          };
        }
        if (a.sala_id === salaId) {
          return {
            conflito: true,
            mensagem: `Choque de sala: A Sala ${salaId} já está reservada entre ${aInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} e ${aFim.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
          };
        }
      }
    }

    return { conflito: false };
  }

  // Criar ou Salvar Agendamento com todas as regras
  saveAgendamento(agendamento: Omit<Agendamento, 'id'> & { id?: number }): { success: boolean; agendamento?: Agendamento; error?: string } {
    const inicio = new Date(agendamento.data_inicio);
    const fim = new Date(agendamento.data_fim);

    // 1. Auto-cadastro de paciente se necessário
    const paciente = this.getOrCreatePacienteByName(agendamento.paciente_nome, agendamento.paciente_telefone);
    agendamento.paciente_id = paciente.id;
    agendamento.paciente_nome = paciente.nome;
    agendamento.paciente_telefone = paciente.telefone;

    // 2. Localizar perfil do profissional
    const perfis = this.getPerfis();
    const profPerfil = perfis.find(p => p.nome.includes('Cibele') || p.nome === agendamento.profissional_nome) || perfis[0];

    // 3. Validação de grade horária
    const gradeCheck = this.validarGradeHoraria(inicio, fim, profPerfil);
    if (!gradeCheck.valido) {
      return { success: false, error: gradeCheck.motivo };
    }

    // 4. Validação de choque de horário (no_profissional_overlap)
    const choqueCheck = this.verificarChoqueHorario(
      inicio,
      fim,
      agendamento.profissional_nome,
      agendamento.sala_id,
      agendamento.id
    );
    if (choqueCheck.conflito) {
      return { success: false, error: choqueCheck.mensagem };
    }

    // Persistir
    const agendamentos = this.getAgendamentos();
    let saved: Agendamento;

    if (agendamento.id) {
      const idx = agendamentos.findIndex(a => a.id === agendamento.id);
      if (idx !== -1) {
        const oldStatus = agendamentos[idx].status;
        saved = { ...agendamentos[idx], ...agendamento };
        agendamentos[idx] = saved;
        this.setStorage(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

        // REGRA DE NEGÓCIO 4: Se o status mudou para 'Presenca', aciona evolução clínica automática
        if (oldStatus !== 'Presenca' && saved.status === 'Presenca') {
          this.triggerEvolucaoAutomatica(saved);
        }

        return { success: true, agendamento: saved };
      }
    }

    const newId = agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 101;
    saved = { ...agendamento, id: newId };
    agendamentos.push(saved);
    this.setStorage(STORAGE_KEYS.AGENDAMENTOS, agendamentos);

    if (saved.status === 'Presenca') {
      this.triggerEvolucaoAutomatica(saved);
    }

    return { success: true, agendamento: saved };
  }

  // REGRA DE NEGÓCIO 4: Evolução Clínica Automática por Comparecimento
  private triggerEvolucaoAutomatica(agendamento: Agendamento): void {
    const dataFormatada = new Date(agendamento.data_inicio).toLocaleDateString('pt-BR');
    const horaFormatada = new Date(agendamento.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const descricaoPadrao = `[REGISTRO DE ATENDIMENTO - EVOLUÇÃO CLÍNICA]\nData: ${dataFormatada} | Horário: ${horaFormatada}\nProfissional: ${agendamento.profissional_nome}\nLocal: Sala ${agendamento.sala_id} - Atendimento Clínico Presencial\nServiço: ${agendamento.servico_nome || 'Consulta Médica'}\nForma de Pagamento: ${agendamento.forma_pagamento} (R$ ${agendamento.valor_atendimento.toFixed(2)})\n\nQueixa Principal & Evolução:\nPaciente compareceu ao atendimento no horário agendado. Realizada escuta ativa e exame físico direcionado. Conduta pactuada em conjunto com plano de cuidado por escrito.`;

    const prontuarios = this.getProntuarios();
    const newProntuarioId = prontuarios.length > 0 ? Math.max(...prontuarios.map(p => p.id)) + 1 : 1;

    const novoRegistro: ProntuarioRegistro = {
      id: newProntuarioId,
      paciente_id: agendamento.paciente_id,
      tipo_registro: 'Evolução',
      descricao: descricaoPadrao,
      profissional_nome: agendamento.profissional_nome,
      created_at: new Date().toISOString()
    };

    prontuarios.unshift(novoRegistro);
    this.setStorage(STORAGE_KEYS.PRONTUARIOS, prontuarios);
  }

  // REGRA DE NEGÓCIO 5: Confirmação Automática via WhatsApp para amanhã (ou segunda-feira se for sexta-feira)
  getAgendamentosConfirmacaoAmanha(): { agendamento: Agendamento; dataFormatada: string; horaFormatada: string; whatsappUrl: string }[] {
    const agendamentos = this.getAgendamentos();
    const hoje = new Date();
    const diaHoje = hoje.getDay(); // 0 = Domingo, 5 = Sexta

    // Se hoje for sexta-feira (5), confirma segunda-feira (+3 dias); caso contrário amanhã (+1 dia)
    const diasOffset = diaHoje === 5 ? 3 : 1;
    const alvo = new Date();
    alvo.setDate(hoje.getDate() + diasOffset);
    const alvoAno = alvo.getFullYear();
    const alvoMes = alvo.getMonth();
    const alvoDia = alvo.getDate();

    const resultados: { agendamento: Agendamento; dataFormatada: string; horaFormatada: string; whatsappUrl: string }[] = [];

    for (const a of agendamentos) {
      if (a.status !== 'Agendado') continue;
      const d = new Date(a.data_inicio);
      if (d.getFullYear() === alvoAno && d.getMonth() === alvoMes && d.getDate() === alvoDia) {
        const dataFormatada = d.toLocaleDateString('pt-BR');
        const horaFormatada = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        // Mensagem cordial e elegante no padrão da Dra. Cibele
        const mensagem = `Olá, ${a.paciente_nome}! Aqui é da equipe da Dra. Cibele Cristina. Confirmamos a sua consulta de ${a.servico_nome || 'Consulta Médica'} agendada para ${dataFormatada} às ${horaFormatada} no nosso consultório (Bosque, Rio Branco/AC). Por gentileza, responda com *1 para CONFIRMAR* ou envie uma mensagem caso precise reagendar. Muito obrigado!`;
        
        // Limpar telefone para padrão internacional
        const foneLimpo = a.paciente_telefone.replace(/\D/g, '');
        const foneFinal = foneLimpo.startsWith('55') ? foneLimpo : `55${foneLimpo}`;
        const whatsappUrl = `https://wa.me/${foneFinal}?text=${encodeURIComponent(mensagem)}`;

        resultados.push({
          agendamento: a,
          dataFormatada,
          horaFormatada,
          whatsappUrl
        });
      }
    }

    return resultados;
  }

  // --- PRONTUÁRIOS ---
  getProntuarios(): ProntuarioRegistro[] {
    return this.getStorage<ProntuarioRegistro[]>(STORAGE_KEYS.PRONTUARIOS, INITIAL_PRONTUARIOS);
  }

  getProntuariosByPaciente(pacienteId: number): ProntuarioRegistro[] {
    return this.getProntuarios().filter(p => p.paciente_id === pacienteId);
  }

  saveProntuario(registro: Omit<ProntuarioRegistro, 'id' | 'created_at'> & { id?: number }): ProntuarioRegistro {
    const prontuarios = this.getProntuarios();
    if (registro.id) {
      const idx = prontuarios.findIndex(p => p.id === registro.id);
      if (idx !== -1) {
        prontuarios[idx] = { ...prontuarios[idx], ...registro };
        this.setStorage(STORAGE_KEYS.PRONTUARIOS, prontuarios);
        return prontuarios[idx];
      }
    }
    const newId = prontuarios.length > 0 ? Math.max(...prontuarios.map(p => p.id)) + 1 : 1;
    const novo: ProntuarioRegistro = {
      ...registro,
      id: newId,
      created_at: new Date().toISOString()
    };
    prontuarios.unshift(novo);
    this.setStorage(STORAGE_KEYS.PRONTUARIOS, prontuarios);
    return novo;
  }

  // --- TEMPLATES DE PRESCRIÇÃO (PADRÕES DE PREENCHIMENTO OU RECEITAS DA DRA. CIBELE) ---
  getPrescricaoTemplates(): PrescricaoTemplate[] {
    return this.getStorage<PrescricaoTemplate[]>(STORAGE_KEYS.TEMPLATES_PRESCRICAO, INITIAL_PRESCRICAO_TEMPLATES);
  }

  savePrescricaoTemplate(template: Omit<PrescricaoTemplate, 'id' | 'created_at'> & { id?: string }): PrescricaoTemplate {
    const templates = this.getPrescricaoTemplates();
    if (template.id) {
      const idx = templates.findIndex(t => t.id === template.id);
      if (idx !== -1) {
        templates[idx] = { ...templates[idx], ...template };
        this.setStorage(STORAGE_KEYS.TEMPLATES_PRESCRICAO, templates);
        return templates[idx];
      }
    }
    const newId = `tmpl-${Date.now()}`;
    const novo: PrescricaoTemplate = {
      ...template,
      id: newId,
      created_at: new Date().toISOString()
    };
    templates.unshift(novo);
    this.setStorage(STORAGE_KEYS.TEMPLATES_PRESCRICAO, templates);
    return novo;
  }

  deletePrescricaoTemplate(id: string): void {
    const templates = this.getPrescricaoTemplates().filter(t => t.id !== id);
    this.setStorage(STORAGE_KEYS.TEMPLATES_PRESCRICAO, templates);
  }

  // Prescrições Emitidas
  getPrescricoesEmitidas(): PrescricaoEmitida[] {
    return this.getStorage<PrescricaoEmitida[]>(STORAGE_KEYS.PRESCRICOES_EMITIDAS, []);
  }

  savePrescricaoEmitida(prescricao: Omit<PrescricaoEmitida, 'id' | 'created_at'>): PrescricaoEmitida {
    const emitidas = this.getPrescricoesEmitidas();
    const nova: PrescricaoEmitida = {
      ...prescricao,
      id: `presc-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    emitidas.unshift(nova);
    this.setStorage(STORAGE_KEYS.PRESCRICOES_EMITIDAS, emitidas);
    return nova;
  }

  // --- VALIDAÇÃO PÚBLICA DE ATESTADOS & QR CODE ---
  getValidacoes(): ValidacaoAtestado[] {
    return this.getStorage<ValidacaoAtestado[]>(STORAGE_KEYS.VALIDACOES, INITIAL_VALIDACOES);
  }

  getValidacaoById(id: string): ValidacaoAtestado | undefined {
    return this.getValidacoes().find(v => v.id.toLowerCase() === id.toLowerCase());
  }

  createValidacao(params: {
    paciente_nome: string;
    profissional_nome?: string;
    tipo_documento: ValidacaoAtestado['tipo_documento'];
    conteudo_texto: string;
    dias_afastamento?: number;
    cid?: string;
  }): ValidacaoAtestado {
    const id = crypto.randomUUID ? crypto.randomUUID() : `val-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const hash = `BR-AC-${DOCTOR_INFO.crm.replace(/\D/g, '')}-${id.substring(0, 4).toUpperCase()}`;

    const nova: ValidacaoAtestado = {
      id,
      paciente_nome: params.paciente_nome,
      profissional_nome: params.profissional_nome || `${DOCTOR_INFO.fullName} (${DOCTOR_INFO.crm} | ${DOCTOR_INFO.rqe})`,
      tipo_documento: params.tipo_documento,
      conteudo_texto: params.conteudo_texto,
      dias_afastamento: params.dias_afastamento,
      cid: params.cid,
      created_at: new Date().toISOString(),
      hash_autenticidade: hash
    };

    const validacoes = this.getValidacoes();
    validacoes.unshift(nova);
    this.setStorage(STORAGE_KEYS.VALIDACOES, validacoes);
    return nova;
  }

  // --- MÓDULOS B2B (ESCOLAR & CORPORATIVO) ---
  getSchools(): School[] {
    return this.getStorage<School[]>(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS);
  }

  getStudents(schoolId?: string): SchoolStudent[] {
    const list = this.getStorage<SchoolStudent[]>(STORAGE_KEYS.SCHOOL_STUDENTS, INITIAL_STUDENTS);
    return schoolId ? list.filter(s => s.school_id === schoolId) : list;
  }

  getNeuroAlerts(schoolId?: string): NeuroAlert[] {
    const list = this.getStorage<NeuroAlert[]>(STORAGE_KEYS.NEURO_ALERTS, INITIAL_NEURO_ALERTS);
    return schoolId ? list.filter(n => n.school_id === schoolId) : list;
  }

  saveNeuroAlert(alert: Omit<NeuroAlert, 'id' | 'created_at'>): NeuroAlert {
    const list = this.getNeuroAlerts();
    const novo: NeuroAlert = {
      ...alert,
      id: `nal-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    list.unshift(novo);
    this.setStorage(STORAGE_KEYS.NEURO_ALERTS, list);
    return novo;
  }

  getAuditorias(): AuditoriaMapeamento[] {
    return this.getStorage<AuditoriaMapeamento[]>(STORAGE_KEYS.AUDITORIAS, INITIAL_AUDITORIAS);
  }

  getAlertasSobrecarga(): AlertaSobrecarga[] {
    return this.getStorage<AlertaSobrecarga[]>(STORAGE_KEYS.ALERTAS_SOBRECARGA, INITIAL_SOBRECARGAS);
  }

  saveAlertaSobrecarga(alerta: Omit<AlertaSobrecarga, 'id' | 'data'>): AlertaSobrecarga {
    const list = this.getAlertasSobrecarga();
    const novo: AlertaSobrecarga = {
      ...alerta,
      id: `sob-${Date.now()}`,
      data: new Date().toISOString()
    };
    list.unshift(novo);
    this.setStorage(STORAGE_KEYS.ALERTAS_SOBRECARGA, list);
    return novo;
  }

  // --- FINANCEIRO & FLUXO DE CAIXA ---
  getFinanceiro(): DespesaOuReceita[] {
    return this.getStorage<DespesaOuReceita[]>(STORAGE_KEYS.FINANCEIRO, INITIAL_FINANCEIRO);
  }

  saveLancamentoFinanceiro(lancamento: Omit<DespesaOuReceita, 'id'>): DespesaOuReceita {
    const list = this.getFinanceiro();
    const novo: DespesaOuReceita = {
      ...lancamento,
      id: `fin-${Date.now()}`
    };
    list.unshift(novo);
    this.setStorage(STORAGE_KEYS.FINANCEIRO, list);
    return novo;
  }
}

export const clinicalDb = new ClinicalDatabaseService();
