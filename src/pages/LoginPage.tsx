import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  UserCheck,
  KeyRound
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { DOCTOR_INFO } from '../data/medicinarteData';
import { supabase, dispatchResetEmail } from '../services/supabaseClient';
import { Perfil } from '../types/clinical';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.from || '/sistema';

  const [activeSession, setActiveSession] = useState<Perfil | null>(() => {
    return clinicalDb.isAuthenticated() ? clinicalDb.getActiveUser() : null;
  });

  // Credenciais de entrada
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Controlo de fluxo: 'login' ou 'primeiro_acesso'
  const [etapa, setEtapa] = useState<'login' | 'primeiro_acesso'>('login');
  const [perfilUtilizador, setPerfilUtilizador] = useState<any>(null);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Modal informativo "Esqueceu-se da palavra-passe?"
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    document.title = "Acesso Seguro ao Sistema Clínico | Dra. Cibele Cristina";
    window.scrollTo(0, 0);
  }, []);

  // 1. Converte o nome de utilizador no e-mail correspondente
  const normalizarEmail = (input: string): string => {
    const valor = input.trim().toLowerCase();
    if (valor.includes('@')) {
      return valor;
    }
    if (valor === 'clientebox' || valor === 'clienteboxplus') {
      return 'clienteboxplus@gmail.com';
    }
    if (valor === 'cibele' || valor === 'cibelemed') {
      return 'cibele@medicinarte.com.br';
    }
    if (valor === 'recepcao' || valor === 'secretaria') {
      return 'recepcao@medicinarte.com.br';
    }
    if (valor === 'admin' || valor === 'cibeleadm') {
      return 'admin@medicinarte.com.br';
    }
    return `${valor}@sistema.local`;
  };

  // 2. Encaminha para o ecrã correspondente ao cargo
  const redirecionarPorCargo = (cargo?: string) => {
    const c = (cargo || '').toLowerCase();
    switch (c) {
      case 'superadmin':
        navigate('/painel-master', { replace: true });
        break;
      case 'administrador':
      case 'admin':
        navigate('/painel-admin', { replace: true });
        break;
      case 'medico':
      case 'profissional':
        navigate('/atendimento-medico', { replace: true });
        break;
      default:
        navigate(returnTo || '/painel', { replace: true });
    }
  };

  // 3. Processa o início de sessão com Supabase e Fallback Clínico Integrado
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErro('Por favor, informe seu nome de utilizador ou e-mail.');
      return;
    }

    if (!cleanPassword) {
      setErro('Por favor, informe sua palavra-passe.');
      return;
    }

    setCarregando(true);

    try {
      const emailInterno = normalizarEmail(cleanUsername);

      // 3.1. Tentativa via Supabase Auth
      let authUser: any = null;
      let perfil: any = null;

      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: emailInterno,
          password: cleanPassword,
        });

        if (!authError && authData?.user) {
          authUser = authData.user;
          // Consulta o perfil associado ao utilizador no Supabase
          const { data: perfilData } = await supabase
            .from('perfis')
            .select('*')
            .or(`id.eq.${authData.user.id},email.eq.${emailInterno}`)
            .maybeSingle();

          if (perfilData) {
            perfil = perfilData;
          }
        }
      } catch {
        // Segue para fallback
      }

      // 3.2. Se não logou no Supabase Auth ou perfil não veio, consulta tabela perfis diretamente
      if (!perfil) {
        try {
          const { data: supaPerfis } = await supabase
            .from('perfis')
            .select('*')
            .or(`usuario.eq.${cleanUsername.toLowerCase()},email.eq.${emailInterno}`)
            .maybeSingle();

          if (supaPerfis && supaPerfis.senha === cleanPassword) {
            perfil = supaPerfis;
          }
        } catch {
          // Segue
        }
      }

      // 3.3. Fallback no banco clínico local da clínica
      if (!perfil) {
        const localAuth = clinicalDb.login(cleanUsername, cleanPassword);
        if (localAuth.success && localAuth.user) {
          perfil = localAuth.user;
        }
      }

      // Se nenhum autenticou
      if (!perfil) {
        throw new Error('Utilizador ou palavra-passe inválidos.');
      }

      // Normaliza cargo/role
      const cargo = perfil.cargo || perfil.role || 'admin';
      const isPrimeiroAcesso = Boolean(perfil.primeiro_acesso);

      // Salva a sessão autenticada no banco clínico do sistema
      const sessionPerfil: Perfil = {
        id: perfil.id || `perfil-${Date.now()}`,
        nome: perfil.nome || cleanUsername,
        email: perfil.email || emailInterno,
        usuario: perfil.usuario || cleanUsername.toLowerCase(),
        role: (cargo === 'superadmin' || cargo === 'administrador') ? 'admin' : (cargo === 'medico' ? 'profissional' : (cargo as any) || 'admin'),
        cor: perfil.cor || '#142E28',
        permissao_financeiro: perfil.permissao_financeiro ?? true,
        permissao_agendar: perfil.permissao_agendar ?? true,
        permissao_confirmacao_amanha: perfil.permissao_confirmacao_amanha ?? true,
        dias_atendimento: perfil.dias_atendimento || ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
        hora_inicio: perfil.hora_inicio || '08:00',
        hora_fim: perfil.hora_fim || '18:00',
        senha: cleanPassword,
        primeiro_acesso: isPrimeiroAcesso
      };

      clinicalDb.savePerfil(sessionPerfil);
      clinicalDb.setAuthenticatedSession(sessionPerfil);

      // 3.4. Verifica se é o primeiro acesso
      if (isPrimeiroAcesso) {
        setPerfilUtilizador({ ...perfil, cargo });
        setEtapa('primeiro_acesso');
      } else {
        redirecionarPorCargo(cargo);
      }
    } catch (err: any) {
      setErro(err.message || 'Utilizador ou palavra-passe inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  // 4. Define a nova palavra-passe definitiva (Primeiro Acesso)
  const handleDefinirNovaSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (novaSenha.length < 6) {
      setErro('A nova palavra-passe deve conter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      setErro('As palavras-passe não coincidem.');
      return;
    }

    setCarregando(true);

    try {
      // 4.1. Atualiza a palavra-passe no Supabase Auth
      try {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          password: novaSenha,
        });
        if (updateAuthError) {
          console.warn('Supabase Auth update aviso:', updateAuthError.message);
        }
      } catch (authErr) {
        console.warn('Supabase Auth exception:', authErr);
      }

      // 4.2. Atualiza a flag de primeiro acesso e senha na tabela de perfis
      if (perfilUtilizador?.id) {
        try {
          await supabase
            .from('perfis')
            .update({ primeiro_acesso: false, senha: novaSenha })
            .eq('id', perfilUtilizador.id);
        } catch {
          // Segue
        }

        // 4.3. Atualiza no banco clínico local
        clinicalDb.updateSenhaPerfil(perfilUtilizador.id, novaSenha);
        const localPerfil = clinicalDb.getPerfis().find(p => p.id === perfilUtilizador.id);
        if (localPerfil) {
          localPerfil.primeiro_acesso = false;
          clinicalDb.savePerfil(localPerfil);
          clinicalDb.setAuthenticatedSession(localPerfil);
        }
      }

      // Concluído: reencaminha para o painel correspondente
      redirecionarPorCargo(perfilUtilizador?.cargo || perfilUtilizador?.role);
    } catch (err: any) {
      setErro(err.message || 'Erro ao guardar nova palavra-passe.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E231E] text-stone-100 font-sans antialiased flex flex-col justify-between selection:bg-[#C5A059] selection:text-[#142E28]">
      
      {/* Luzes decorativas sutis de fundo */}
      <div className="fixed top-[-10%] right-[-5%] w-[450px] h-[450px] bg-[#1A3C34] rounded-full filter blur-[140px] opacity-35 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[450px] h-[450px] bg-[#C5A059] rounded-full filter blur-[160px] opacity-10 pointer-events-none" />

      {/* Topo Limpo e Institucional */}
      <header className="relative z-20 border-b border-[#1E4339] bg-[#0E231E]/80 backdrop-blur-md px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] p-1 border border-[#C5A059]/60 shadow-xs shrink-0" 
            />
            <div>
              <span className="font-serif font-semibold text-sm text-white block leading-tight">
                {DOCTOR_INFO.name}
              </span>
              <span className="text-[11px] text-stone-400 block leading-tight">
                {DOCTOR_INFO.crm} • {DOCTOR_INFO.rqe}
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2A5A4D] bg-[#142E28] hover:bg-[#1A3C34] text-xs text-stone-200 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="text-[#C5A059]" />
            <span>Voltar ao site</span>
          </Link>
        </div>
      </header>

      {/* Área Central: Card de Autenticação Estrita */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-10 sm:py-14 relative z-10 flex flex-col justify-center">
        
        <div className="bg-[#142E28] border border-[#234E43] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Identificação do Sistema */}
          <div className="text-center space-y-1.5">
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              className="w-16 h-16 rounded-2xl object-contain bg-[#FAF8F5] p-1.5 border border-[#C5A059]/60 shadow-md mx-auto mb-2" 
            />
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
              {etapa === 'login' ? 'Acessar Sistema' : 'Primeiro Acesso'}
            </h1>
            {etapa === 'primeiro_acesso' && (
              <p className="text-xs text-stone-400">
                Olá, {perfilUtilizador?.nome || 'colaborador'}. Defina a sua palavra-passe definitiva para continuar.
              </p>
            )}
          </div>

          {/* Mensagem de Erro com Alto Contraste */}
          {erro && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{erro}</span>
            </div>
          )}

          {/* Banner de Sessão Ativa Prévia (se houver) */}
          {activeSession && etapa === 'login' && (
            <div className="p-3.5 rounded-xl bg-[#1A3C34] border border-[#C5A059]/60 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-stone-200">
                    Sessão ativa: <strong className="text-white">{activeSession.nome}</strong>
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0D211C] text-[#C5A059] border border-[#C5A059]/30 uppercase font-semibold">
                  {activeSession.role}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => redirecionarPorCargo(activeSession.role)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#C5A059] hover:bg-[#b08e4c] text-[#0E231E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all"
                >
                  <span>Continuar no Sistema</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clinicalDb.logout();
                    setActiveSession(null);
                    setUsername('');
                    setPassword('');
                  }}
                  className="py-2 px-3 rounded-lg bg-red-950/70 hover:bg-red-900/90 border border-red-500/40 text-red-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}

          {/* FLUXO 1: ETAPA LOGIN */}
          {etapa === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  Nome de acesso
                </label>
                <div className="relative">
                  <UserCheck size={15} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  Palavra-passe
                </label>

                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                    aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Opções abaixo dos campos de login: Lembrar e Esqueceu-se da palavra-passe */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#28574A] bg-[#0D211C] text-[#C5A059] focus:ring-0"
                  />
                  <span>Lembrar dispositivo</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#C5A059] hover:underline cursor-pointer font-medium"
                >
                  Esqueceu-se da palavra-passe?
                </button>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-105 text-[#0E231E] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-75"
              >
                {carregando ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
                    <span>A autenticar...</span>
                  </div>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

            </form>
          ) : (
            /* FLUXO 2: ETAPA PRIMEIRO ACESSO */
            <form onSubmit={handleDefinirNovaSenha} className="space-y-4 animate-in fade-in">
              
              <div className="p-3 rounded-xl bg-[#0D211C] border border-[#245246] text-xs text-stone-300">
                Olá, <strong className="text-white">{perfilUtilizador?.nome}</strong>. Defina a sua palavra-passe definitiva para continuar com segurança.
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  Nova Palavra-passe <span className="text-[10px] text-stone-400">(Mínimo de 6 caracteres)</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type={showNovaSenha ? 'text' : 'password'}
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNovaSenha(!showNovaSenha)}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                  >
                    {showNovaSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-300 block mb-1.5">
                  Confirmar Nova Palavra-passe
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
                  <input
                    type={showConfirmarNovaSenha ? 'text' : 'password'}
                    required
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Repita a nova palavra-passe"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmarNovaSenha(!showConfirmarNovaSenha)}
                    className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmarNovaSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEtapa('login')}
                  className="px-4 py-2.5 rounded-xl border border-[#245246] bg-[#0D211C] hover:bg-[#1A3C34] text-stone-300 text-xs font-medium transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={carregando}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-105 text-[#0E231E] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-75"
                >
                  {carregando ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
                      <span>A guardar...</span>
                    </div>
                  ) : (
                    <>
                      <span>Guardar e Entrar</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Aviso de Segurança & Orientação a Pacientes */}
          <div className="pt-4 border-t border-[#1E4339] space-y-2 text-center">
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Ambiente protegido com criptografia de ponta a ponta. Tentativas de acesso não autorizadas são registradas para auditoria médica e segurança.
            </p>
            <p className="text-[11px] text-stone-400">
              É paciente e deseja agendar consulta?{' '}
              <Link to="/" className="text-[#C5A059] hover:underline font-medium">
                Acesse o site principal
              </Link>
            </p>
          </div>

        </div>

      </main>

      {/* Rodapé Institucional */}
      <footer className="relative z-20 border-t border-[#1E4339] bg-[#0A1A16] py-3.5 px-4 text-center text-xs text-stone-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <span>Medicinarte Serviços Médicos Ltda • CRM-AC PJ 258</span>
          <span>Dra. Cibele Cristina — CRM-AC 1810 | RQE 1078</span>
        </div>
      </footer>

      {/* Modal Informativo: Esqueceu-se da palavra-passe? */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#142E28] border border-[#2D5A4D] rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#1A3C34] border border-[#C5A059]/50 flex items-center justify-center text-[#C5A059] shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white">
                  Redefinição de Credenciais
                </h3>
                <span className="text-[11px] text-[#C5A059] font-medium block">
                  Acesso Restrito aos Colaboradores
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D211C] border border-[#234E43] text-xs text-stone-200 leading-relaxed space-y-2.5">
              <p className="font-medium text-white">
                Por motivos de segurança e por utilizar um acesso interno, por favor contacte a administração da clínica para redefinir as suas credenciais de acesso.
              </p>
              <p className="text-[11px] text-stone-400">
                A administração da clínica ou a coordenação médica possui autorização no painel administrativo para gerar uma nova senha temporária imediata para o seu perfil.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <a
                href={`https://wa.me/5568999847113?text=${encodeURIComponent('Olá! Sou colaborador do consultório e solicito à administração a redefinição da minha palavra-passe de acesso ao sistema.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-[#0A1A16] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Contactar Administração</span>
              </a>

              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="py-2.5 px-4 rounded-xl border border-[#2D5A4D] bg-[#0E231E] hover:bg-[#1A3C34] text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Compreendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
