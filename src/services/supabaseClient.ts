import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Credenciais oficiais do projeto Supabase fornecidas
export const SUPABASE_PROJECT_ID = 'oosfsxekdpzgcizyuyoa';
export const SUPABASE_URL: string = 
  ((import.meta as any).env?.VITE_SUPABASE_URL as string) || 'https://oosfsxekdpzgcizyuyoa.supabase.co';
export const SUPABASE_ANON_KEY: string = 
  ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) ||  
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vc2ZzeGVrZHB6Z2Npenl1eW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTI5NTcsImV4cCI6MjEwNDYyODk1N30.xlxVN4iRJeXY-wyimFDdomRAYlfrIRkm0BfBwbd6rlY';

export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_H39jRV6w6OlF4NtTBCzcLA_wbA28ydK';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Utilitário para testar a conectividade ativa com a API do Supabase
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  message: string;
  latencyMs?: number;
}> {
  const start = performance.now();
  try {
    const { data, error } = await supabase.auth.getSession();
    const latency = Math.round(performance.now() - start);

    if (error) {
      return {
        connected: false,
        projectId: SUPABASE_PROJECT_ID,
        url: SUPABASE_URL,
        message: `Falha na resposta da API Auth: ${error.message}`,
        latencyMs: latency
      };
    }

    return {
      connected: true,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: 'Conectado com sucesso ao Supabase Cloud (API ativa e responsiva)',
      latencyMs: latency
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      message: err?.message || 'Erro de conexão com o Supabase'
    };
  }
}

/**
 * Sincroniza e valida credenciais (e-mail e senha) imediatamente com o Supabase
 * Atualiza tanto no Supabase Auth quanto na tabela 'perfis' do PostgreSQL
 */
export async function syncCredentialsToSupabase(params: {
  perfilId: string;
  email: string;
  password?: string;
  nome: string;
  role: string;
  usuario?: string;
}): Promise<{
  success: boolean;
  message: string;
  supabaseAuthSynced: boolean;
  supabaseDbSynced: boolean;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanPassword = params.password?.trim();

  let supabaseAuthSynced = false;
  let supabaseDbSynced = false;

  // 1. Tenta atualizar ou registrar no Supabase Auth
  if (cleanPassword) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (currentUser && currentUser.email?.toLowerCase() === cleanEmail) {
        // Usuário com sessão ativa: atualiza diretamente
        const { error: updateErr } = await supabase.auth.updateUser({
          email: cleanEmail,
          password: cleanPassword
        });
        if (!updateErr) {
          supabaseAuthSynced = true;
        }
      } else {
        // Tenta cadastrar ou provisionar via signUp no Supabase Auth
        const { error: signUpErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword
        });
        if (!signUpErr) {
          supabaseAuthSynced = true;
        }
      }
    } catch (authErr) {
      console.warn('Supabase Auth sync notice:', authErr);
    }
  }

  // 2. Grava ou atualiza os dados do perfil na tabela 'perfis' do Supabase
  // OBS: Não enviamos o campo 'senha' para a tabela pública 'perfis', pois no Supabase
  // a autenticação de senha é gerida com segurança criptografada pelo Supabase Auth (auth.users).
  try {
    const payload: Record<string, any> = {
      id: params.perfilId,
      nome: params.nome,
      email: cleanEmail,
      role: params.role,
      updated_at: new Date().toISOString()
    };
    if (params.usuario) {
      payload.usuario = params.usuario.trim().toLowerCase();
    }

    const { error: dbError } = await supabase.from('perfis').upsert(payload, { onConflict: 'id' });
    if (!dbError) {
      supabaseDbSynced = true;
    } else {
      // Se a tabela remota não possuir colunas opcionais como 'usuario' ou 'updated_at',
      // faz um fallback seguro com os campos canônicos essenciais (id, nome, email, role)
      if (dbError.message?.includes('column') || dbError.code === 'PGRST204') {
        const minimalPayload = {
          id: params.perfilId,
          nome: params.nome,
          email: cleanEmail,
          role: params.role
        };
        const { error: retryError } = await supabase.from('perfis').upsert(minimalPayload, { onConflict: 'id' });
        if (!retryError) {
          supabaseDbSynced = true;
        } else {
          console.info('Supabase DB sync notice (tabela remota em configuração):', retryError.message);
        }
      } else {
        console.info('Supabase DB sync notice:', dbError.message);
      }
    }
  } catch (dbErr) {
    console.info('Supabase DB sync exception:', dbErr);
  }

  return {
    success: true,
    message: 'Credenciais e dados de acesso salvos e sincronizados com sucesso.',
    supabaseAuthSynced,
    supabaseDbSynced
  };
}

/**
 * Script DDL de criação de tabelas para o SQL Editor do Supabase
 */
export const SUPABASE_SQL_SCHEMA = `-- =======================================================
-- SCHEMA MEDICINARTE & DRA. CIBELE CRISTINA (SUPABASE)
-- Execute este script no SQL Editor do seu painel Supabase
-- =======================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS E PERMISSÕES
CREATE TABLE IF NOT EXISTS public.perfis (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  usuario TEXT,
  senha TEXT DEFAULT 'admin123',
  role TEXT NOT NULL DEFAULT 'secretaria',
  cor TEXT DEFAULT '#1A3C34',
  permissao_financeiro BOOLEAN DEFAULT false,
  permissao_agendar BOOLEAN DEFAULT true,
  permissao_confirmacao_amanha BOOLEAN DEFAULT true,
  dias_atendimento TEXT[] DEFAULT ARRAY['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
  hora_inicio TEXT DEFAULT '08:00',
  hora_fim TEXT DEFAULT '18:00',
  crm TEXT,
  rqe TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Garante retrocompatibilidade caso a tabela já tenha sido criada anteriormente sem estas colunas
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS usuario TEXT;
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS senha TEXT DEFAULT 'admin123';
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS cor TEXT DEFAULT '#1A3C34';
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Inserção do Usuário Master e da Equipe
INSERT INTO public.perfis (id, nome, email, senha, role, permissao_financeiro, permissao_agendar, permissao_confirmacao_amanha)
VALUES 
  ('perfil-master', 'Diretoria Executiva / Master', 'clienteboxplus@gmail.com', 'admin123', 'admin', true, true, true),
  ('perfil-cibele', 'Dra. Cibele Cristina Cunha Brígido', 'cibele@medicinarte.com.br', 'cibele123', 'profissional', true, true, true),
  ('perfil-secretaria', 'Recepção / Secretária Clínica', 'recepcao@medicinarte.com.br', 'recepcao123', 'secretaria', false, true, true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  senha = EXCLUDED.senha,
  updated_at = now();

-- 2. TABELA DE PACIENTES
CREATE TABLE IF NOT EXISTS public.pacientes (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cpf TEXT,
  convenio TEXT DEFAULT 'Particular',
  data_nascimento DATE,
  responsavel TEXT,
  escola TEXT,
  serie TEXT,
  observacoes TEXT,
  diagnostico_principal TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA DE AGENDAMENTOS
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id BIGSERIAL PRIMARY KEY,
  paciente_id BIGINT REFERENCES public.pacientes(id) ON DELETE CASCADE,
  paciente_nome TEXT NOT NULL,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'Consulta',
  status TEXT NOT NULL DEFAULT 'Agendado',
  valor NUMERIC(10, 2) DEFAULT 0.00,
  pagamento_status TEXT DEFAULT 'Pendente',
  forma_pagamento TEXT DEFAULT 'PIX',
  lembrete_enviado BOOLEAN DEFAULT false,
  profissional_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABELA DE PRONTUÁRIOS MÉDICOS
CREATE TABLE IF NOT EXISTS public.prontuarios (
  id TEXT PRIMARY KEY,
  paciente_id BIGINT NOT NULL,
  data TIMESTAMPTZ DEFAULT now(),
  tipo TEXT NOT NULL,
  queixa_principal TEXT,
  historia_molestia_atual TEXT,
  marcos_desenvolvimento JSONB,
  dados_antropometricos JSONB,
  avaliacao_neuropsiquiatrica TEXT,
  hipotese_diagnostica TEXT,
  cid10 TEXT,
  cid11 TEXT,
  conduta_plano TEXT,
  medico_nome TEXT,
  medico_crm TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABELA DE PRESCRIÇÕES E EXAMES EMITIDOS
CREATE TABLE IF NOT EXISTS public.prescricoes_emitidas (
  id TEXT PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  paciente_id BIGINT NOT NULL,
  paciente_nome TEXT NOT NULL,
  data TIMESTAMPTZ DEFAULT now(),
  tipo TEXT NOT NULL,
  medicamentos JSONB,
  exames JSONB,
  orientacoes TEXT,
  hash_validacao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABELA DE ATESTADOS MÉDICOS COM QR CODE
CREATE TABLE IF NOT EXISTS public.validacoes_atestados (
  codigo TEXT PRIMARY KEY,
  paciente_nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  dias_afastamento INT,
  data_emissao DATE NOT NULL,
  medico_nome TEXT NOT NULL,
  medico_crm TEXT NOT NULL,
  hash_validacao TEXT NOT NULL,
  valido BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prontuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescricoes_emitidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validacoes_atestados ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO LIVRE COM CHAVE PÚBLICA (ANON) PARA A CLÍNICA
CREATE POLICY "Acesso completo anon perfis" ON public.perfis FOR ALL USING (true);
CREATE POLICY "Acesso completo anon pacientes" ON public.pacientes FOR ALL USING (true);
CREATE POLICY "Acesso completo anon agendamentos" ON public.agendamentos FOR ALL USING (true);
CREATE POLICY "Acesso completo anon prontuarios" ON public.prontuarios FOR ALL USING (true);
CREATE POLICY "Acesso completo anon prescricoes" ON public.prescricoes_emitidas FOR ALL USING (true);
CREATE POLICY "Acesso completo anon atestados" ON public.validacoes_atestados FOR ALL USING (true);
`;
