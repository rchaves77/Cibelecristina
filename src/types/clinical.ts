export type UserRole = 'admin' | 'secretaria' | 'profissional';

export interface Perfil {
  id: string;
  nome: string;
  usuario?: string; // Nome de usuário para login simples (ex: "admin", "cibele", "recepcao")
  email: string;
  role: UserRole;
  cor: string;
  permissao_financeiro: boolean;
  permissao_agendar: boolean;
  permissao_confirmacao_amanha: boolean;
  dias_atendimento: string[]; // e.g. ["SEG", "TER", "QUA", "QUI", "SEX"]
  hora_inicio: string; // "08:00"
  hora_fim: string; // "18:00"
  escola_id?: string | null;
  crm?: string;
  rqe?: string;
  senha?: string;
  senha_alterada_em?: string;
  reset_token?: string;
  reset_token_expira?: string;
}

export interface GoogleSearchConsoleConfig {
  token: string;
  htmlFileName?: string;
  sitemapUrl: string;
  status: 'configurado' | 'pendente';
  ultimaAtualizacao?: string;
  propriedadeUrl: string;
}

export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  convenio?: string; // "Particular", "Unimed", etc.
  observacoes?: string;
  condicoes_cronicas?: string;
  alergias?: string;
  cpf?: string;
  data_nascimento?: string;
  email?: string;
  endereco?: string;
  created_at: string;
}

export type AgendamentoStatus = 'Agendado' | 'Presenca' | 'Falta' | 'Cancelado';

export interface Agendamento {
  id: number;
  sala_id: number;
  profissional_nome: string;
  paciente_nome: string;
  paciente_id: number;
  paciente_telefone: string;
  data_inicio: string; // ISO string
  data_fim: string; // ISO string
  duracao: string; // e.g. "45" ou "60"
  status: AgendamentoStatus;
  valor_atendimento: number;
  forma_pagamento: 'Pix' | 'Dinheiro' | 'Cartão' | 'Transferência';
  assinatura_url?: string;
  servico_nome?: string;
  observacoes?: string;
}

export interface ProntuarioRegistro {
  id: number;
  paciente_id: number;
  tipo_registro?: 'Sessão' | 'Anamnese' | 'Evolução' | 'Retorno' | 'Procedimento';
  descricao?: string;
  profissional_nome: string;
  subjetivo?: string;
  objetivo?: string;
  avaliacao?: string;
  plano?: string;
  diagnostico_cid?: string;
  historico?: Record<string, any>;
  created_at: string;
}

export type Prontuario = ProntuarioRegistro;

export interface ValidacaoAtestado {
  id: string; // UUID
  paciente_nome: string;
  profissional_nome: string;
  tipo_documento: 'Atestado Médico' | 'Declaração de Comparecimento' | 'Laudo Médico' | 'Relatório de Saúde';
  dias_afastamento?: number;
  cid?: string;
  conteudo_texto: string;
  created_at: string;
  hash_autenticidade: string;
}

export interface PrescricaoItem {
  id: string;
  tipo: 'medicamento' | 'exame' | 'orientacao';
  nome: string;
  posologia_ou_instrucao: string;
  quantidade?: string;
  via?: string; // "Oral", "Tópico", "Nasal", "Otológico", etc.
}

export interface PrescricaoTemplate {
  id: string;
  titulo: string;
  categoria: 'Check-up Racional' | 'Lavagem Otológica' | 'Doenças Crônicas' | 'Saúde Mental' | 'Geral';
  itens: PrescricaoItem[];
  observacoes_padrao: string;
  created_at: string;
}

export interface PrescricaoEmitida {
  id: string;
  paciente_id: number;
  paciente_nome: string;
  profissional_nome: string;
  tipo: 'Receita Médica' | 'Pedido de Exames' | 'Plano de Cuidado';
  itens: PrescricaoItem[];
  observacoes: string;
  created_at: string;
}

// B2B Escolar
export interface School {
  id: string;
  name: string;
  pdi_used: number;
  pdi_limit: number;
  contact_person: string;
  contact_email: string;
}

export interface SchoolStudent {
  id: string;
  school_id: string;
  name: string;
  grade: string;
  status: 'Ativo' | 'Em Acompanhamento' | 'PDI Concluído';
  observacoes?: string;
}

export interface NeuroAlert {
  id: string;
  school_id: string;
  student_id: string;
  student_name: string;
  sinal_desatencao: boolean;
  sinal_hiperatividade: boolean;
  sinal_dificuldade_leitura: boolean;
  sinal_isolamento_social: boolean;
  status: 'Novo' | 'Em Triagem' | 'Intervenção Planejada' | 'Resolvido';
  observacoes: string;
  created_at: string;
}

// B2B Corporativo
export interface AuditoriaMapeamento {
  id: string;
  company_id: string;
  company_name: string;
  setor: string;
  total_colaboradores: number;
  indice_risco: 'Baixo' | 'Moderado' | 'Alto' | 'Crítico';
  created_at: string;
}

export interface AlertaSobrecarga {
  id: string;
  company_id: string;
  company_name: string;
  colaborador_nome: string;
  setor: string;
  nivel_estresse_autoavaliado: number; // 1 a 10
  sintoma_exaustao_mental: boolean;
  sintoma_perda_foco: boolean;
  sintoma_insonia: boolean;
  status: 'Alerta Ativo' | 'Encaminhado para Acolhimento' | 'Estabilizado';
  data: string;
}

// Financeiro
export interface DespesaOuReceita {
  id: string;
  descricao: string;
  categoria: 'Consulta' | 'Procedimento' | 'Aluguel' | 'Materiais Médicos' | 'Impostos' | 'Software' | 'Repasse Profissional' | 'Outros';
  tipo: 'Receita' | 'Despesa' | 'Repasse';
  valor: number;
  data: string;
  forma_pagamento: string;
  status: 'Liquidado' | 'Pendente';
}

// Taxas Maquininhas
export interface TaxaConfig {
  maquininha: 'InfinitePay' | 'Ton';
  modalidade: 'debito' | 'credito_vista' | 'credito_2x' | 'credito_6x' | 'credito_12x';
  bandeira: 'Mastercard/Visa' | 'Elo';
  taxa_percentual: number;
}
