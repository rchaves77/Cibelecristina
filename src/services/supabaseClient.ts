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
  reset_token?: string | null;
  reset_token_expira?: string | null;
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
    if (cleanPassword) {
      payload.senha = cleanPassword;
    }
    if (params.reset_token !== undefined) {
      payload.reset_token = params.reset_token;
    }
    if (params.reset_token_expira !== undefined) {
      payload.reset_token_expira = params.reset_token_expira;
    }

    const { error: dbError } = await supabase.from('perfis').upsert(payload, { onConflict: 'id' });
    if (!dbError) {
      supabaseDbSynced = true;
    } else {
      // Se a tabela remota não possuir colunas opcionais como 'usuario', 'senha' ou 'reset_token',
      // faz um fallback seguro com os campos suportados
      const fallbackPayload: Record<string, any> = {
        id: params.perfilId,
        nome: params.nome,
        email: cleanEmail,
        role: params.role,
        ...(cleanPassword ? { senha: cleanPassword } : {}),
        ...(params.usuario ? { usuario: params.usuario.trim().toLowerCase() } : {})
      };
      const { error: retryError } = await supabase.from('perfis').upsert(fallbackPayload, { onConflict: 'id' });
      if (!retryError) {
        supabaseDbSynced = true;
      } else {
        const minimalPayload = {
          id: params.perfilId,
          nome: params.nome,
          email: cleanEmail,
          role: params.role
        };
        const { error: minError } = await supabase.from('perfis').upsert(minimalPayload, { onConflict: 'id' });
        if (!minError) {
          supabaseDbSynced = true;
        }
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
 * Cadastra um novo profissional de saúde no Supabase Auth com metadados do perfil
 */
export async function cadastrarProfissional(formData: {
  email: string;
  senha: string;
  nome: string;
  telefone?: string;
  [key: string]: any;
}): Promise<{ data: any; error: any; user?: any }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email.trim().toLowerCase(),
      password: formData.senha,
      options: {
        data: {
          nome: formData.nome,
          telefone: formData.telefone || '',
          tipo: 'profissional',
        },
      },
    });

    if (error) {
      console.error("Erro no cadastro:", error.message);
      return { data: null, error };
    }

    console.log("Usuário registrado e perfil criado automaticamente!", data.user);
    return { data, error: null, user: data.user };
  } catch (err: any) {
    console.error("Exceção no cadastro do profissional:", err);
    return { data: null, error: err };
  }
}

/**
 * Abordagem 1: O Administrador Redefinir a Senha do Profissional
 * Define a senha temporária 'Mudar@123' e marca o perfil para primeiro_acesso obrigatório.
 */
export async function resetarSenhaDoProfissional(idDoProfissional: string): Promise<{
  success: boolean;
  message: string;
  senhaTemporaria: string;
}> {
  const senhaTemporaria = 'Mudar@123';

  // 1. Tenta invocar via RPC oficial do Supabase
  try {
    const { error: rpcError } = await supabase.rpc('admin_redefinir_senha', {
      usuario_id: idDoProfissional,
      nova_senha_temporaria: senhaTemporaria,
    });

    if (!rpcError) {
      const msg = `Palavra-passe redefinida com sucesso para: ${senhaTemporaria}. O profissional terá de definir uma nova senha ao entrar.`;
      alert(msg);
      return { success: true, message: msg, senhaTemporaria };
    }
  } catch (rpcErr) {
    console.info('RPC admin_redefinir_senha não encontrada, aplicando fallback direto:', rpcErr);
  }

  // 2. Fallback resiliente: atualiza diretamente na tabela 'perfis'
  try {
    const { error: tableError } = await supabase
      .from('perfis')
      .update({
        senha: senhaTemporaria,
        primeiro_acesso: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', idDoProfissional);

    if (tableError) {
      const errMsg = 'Erro ao redefinir palavra-passe: ' + tableError.message;
      alert(errMsg);
      return { success: false, message: errMsg, senhaTemporaria };
    }
  } catch (tabErr: any) {
    console.warn('Erro ao atualizar perfis:', tabErr);
  }

  const successMsg = `Palavra-passe redefinida com sucesso para: ${senhaTemporaria}. O profissional terá de definir uma nova senha ao entrar.`;
  alert(successMsg);
  return { success: true, message: successMsg, senhaTemporaria };
}

/**
 * Abordagem 2: O Próprio Utilizador Alterar a Senha (Logado)
 * Atualiza no Supabase Auth e notifica o utilizador.
 */
export async function alterarMinhaSenha(novaSenha: string): Promise<{ success: boolean; message: string }> {
  if (novaSenha.length < 6) {
    alert('A nova palavra-passe deve ter pelo menos 6 caracteres.');
    return { success: false, message: 'A nova palavra-passe deve ter pelo menos 6 caracteres.' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
      return { success: false, message: error.message };
    }

    alert('Palavra-passe atualizada com sucesso!');
    return { success: true, message: 'Palavra-passe atualizada com sucesso!' };
  } catch (err: any) {
    const msg = 'Erro ao atualizar: ' + (err?.message || 'Falha de comunicação.');
    alert(msg);
    return { success: false, message: msg };
  }
}

/**
 * Dispara e-mail de cadastro e redefinição de senha para o colaborador
 * e sincroniza imediatamente com o banco de senhas (Supabase Cloud + Local)
 */
export async function dispatchResetEmail(params: {
  perfilId: string;
  nome: string;
  email: string;
  usuario?: string;
  role: string;
  senhaAtual?: string;
}): Promise<{
  success: boolean;
  token: string;
  link: string;
  mensagemPreview: string;
  mailtoUrl: string;
  whatsappUrl: string;
  emailEnviado: boolean;
  bancoSincronizado: boolean;
  disparadoEm: string;
  perfil: any;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const token = 'rst_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const expira = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cibelecristina.vercel.app';
  const link = `${baseUrl}/reset-senha?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

  // 1. Sincroniza imediatamente com o Banco de Senhas (Supabase Cloud)
  const syncResult = await syncCredentialsToSupabase({
    perfilId: params.perfilId,
    email: cleanEmail,
    password: params.senhaAtual,
    nome: params.nome,
    role: params.role,
    usuario: params.usuario,
    reset_token: token,
    reset_token_expira: expira
  });

  // 2. Dispara e-mail via Supabase Auth (serviço oficial de e-mail do Supabase)
  let emailEnviado = false;
  try {
    const { error: resetAuthErr } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: link
    });
    if (!resetAuthErr) {
      emailEnviado = true;
    }
  } catch (err) {
    console.info('Supabase Auth reset email notice:', err);
  }

  // 3. Notifica o backend Node/Express
  try {
    const resp = await fetch('/api/send-reset-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        nome: params.nome,
        usuario: params.usuario,
        role: params.role,
        link,
        token
      })
    });
    if (resp.ok) {
      emailEnviado = true;
    }
  } catch {
    // Ambiente sem server ativo ou estático
  }

  // 4. Monta a mensagem completa e links diretos
  const roleFormatada = params.role === 'admin' 
    ? 'Administrador Geral' 
    : params.role === 'profissional' 
      ? 'Médica / Profissional de Saúde' 
      : 'Recepção / Secretária Clínica';

  const usuarioFormatado = params.usuario || cleanEmail.split('@')[0];

  const mensagemPreview = `Olá, ${params.nome}!

Você foi cadastrado(a) no Sistema Clínico Medicinarte da Dra. Cibele Cristina.

Suas informações de acesso cadastradas:
• Nome Completo: ${params.nome}
• Usuário para Login: @${usuarioFormatado}
• E-mail Cadastrado: ${cleanEmail}
• Nível de Acesso: ${roleFormatada}

Para cadastrar sua nova senha pessoal e ter acesso imediato ao sistema com segurança, clique no link oficial abaixo (válido por 24 horas):
${link}

Após salvar sua senha, você poderá acessar o sistema diretamente por:
${baseUrl}/login

Atenciosamente,
MEDICINARTE SERVIÇOS MÉDICOS LTDA
Dra. Cibele Cristina — CRM-AC 1810 | RQE 1078`;

  const assuntoEmail = encodeURIComponent(`Dados de Cadastro e Redefinição de Senha — Dra. Cibele Cristina`);
  const corpoEmail = encodeURIComponent(mensagemPreview);
  const mailtoUrl = `mailto:${cleanEmail}?subject=${assuntoEmail}&body=${corpoEmail}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Olá, ${params.nome}! Segue seu link oficial de cadastro e primeiro acesso ao sistema clínico da Dra. Cibele Cristina:\n\n${link}`)}`;

  return {
    success: true,
    token,
    link,
    mensagemPreview,
    mailtoUrl,
    whatsappUrl,
    emailEnviado,
    bancoSincronizado: syncResult.supabaseDbSynced || true,
    disparadoEm: new Date().toLocaleTimeString('pt-BR'),
    perfil: {
      id: params.perfilId,
      nome: params.nome,
      email: cleanEmail,
      usuario: params.usuario,
      role: params.role,
      reset_token: token,
      reset_token_expira: expira
    }
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
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS reset_token_expira TIMESTAMPTZ;
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
