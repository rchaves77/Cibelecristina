import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { DOCTOR_INFO } from '../data/medicinarteData';
import { supabase, SUPABASE_PROJECT_ID } from '../services/supabaseClient';
import { Perfil } from '../types/clinical';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as any)?.from || '/sistema';

  const [activeSession, setActiveSession] = useState<Perfil | null>(() => {
    return clinicalDb.isAuthenticated() ? clinicalDb.getActiveUser() : null;
  });

  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Esqueci minha senha
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  useEffect(() => {
    document.title = "Acesso ao Sistema Clínico | Dra. Cibele Cristina";
    window.scrollTo(0, 0);
  }, []);

  const handleSendForgotEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = forgotEmail.trim() || identificador.trim();
    if (!targetEmail) {
      setForgotStatus({ type: 'error', message: 'Informe o endereço de e-mail cadastrado.' });
      return;
    }

    const res = clinicalDb.gerarResetSenha(targetEmail);
    if (res.success && res.perfil) {
      setForgotStatus({
        type: 'success',
        message: `Link de redefinição gerado e enviado para ${res.perfil.email}.`,
        link: res.link
      });
    } else {
      setForgotStatus({
        type: 'error',
        message: 'Endereço de e-mail não localizado no cadastro de usuários.'
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = identificador.trim();
    const cleanPassword = password.trim();

    if (!cleanInput) {
      setError('Por favor, informe seu usuário ou e-mail cadastrado.');
      return;
    }

    if (!cleanPassword) {
      setError('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tenta autenticação direta pelo serviço clínico que aceita usuário ou e-mail
      const localResult = clinicalDb.login(cleanInput, cleanPassword);

      if (localResult.success && localResult.user) {
        // Tenta sincronizar autenticação no Supabase em segundo plano se tiver e-mail
        if (localResult.user.email) {
          try {
            await supabase.auth.signInWithPassword({
              email: localResult.user.email,
              password: cleanPassword
            });
          } catch {
            // Segue normalmente com a sessão autenticada
          }
        }

        setIsLoading(false);
        navigate(returnTo, { replace: true });
        return;
      }

      // 2. Se o usuário digitou e-mail ou não bateu localmente, tenta verificar no Supabase Cloud
      const isEmail = cleanInput.includes('@');
      let targetEmail = isEmail ? cleanInput.toLowerCase() : null;

      if (!targetEmail) {
        // Tenta buscar o e-mail na tabela perfis do Supabase pelo campo 'usuario'
        try {
          const { data: supaUser } = await supabase
            .from('perfis')
            .select('*')
            .eq('usuario', cleanInput.toLowerCase())
            .maybeSingle();

          if (supaUser && supaUser.email) {
            targetEmail = supaUser.email;
            if (supaUser.senha === cleanPassword) {
              const matched = {
                id: supaUser.id || `perfil-${cleanInput.toLowerCase()}`,
                nome: supaUser.nome || cleanInput,
                email: supaUser.email,
                usuario: supaUser.usuario || cleanInput.toLowerCase(),
                role: (supaUser.role as any) || 'admin',
                cor: supaUser.cor || '#142E28',
                permissao_financeiro: supaUser.permissao_financeiro ?? true,
                permissao_agendar: supaUser.permissao_agendar ?? true,
                permissao_confirmacao_amanha: supaUser.permissao_confirmacao_amanha ?? true,
                dias_atendimento: supaUser.dias_atendimento || ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
                hora_inicio: supaUser.hora_inicio || '08:00',
                hora_fim: supaUser.hora_fim || '18:00',
                senha: cleanPassword
              };
              clinicalDb.savePerfil(matched);
              clinicalDb.setAuthenticatedSession(matched);
              setIsLoading(false);
              navigate(returnTo, { replace: true });
              return;
            }
          }
        } catch {
          // Segue adiante
        }
      }

      if (targetEmail) {
        try {
          const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
            email: targetEmail,
            password: cleanPassword
          });

          if (!supaErr && supaData?.user) {
            const perfis = clinicalDb.getPerfis();
            const matched = perfis.find(p => p.email.toLowerCase() === targetEmail) || {
              id: 'perfil-master',
              nome: targetEmail === 'clienteboxplus@gmail.com' ? 'Diretoria Executiva / Master' : 'Usuário Autenticado',
              email: targetEmail,
              usuario: cleanInput.includes('@') ? undefined : cleanInput.toLowerCase(),
              role: 'admin' as const,
              cor: '#142E28',
              permissao_financeiro: true,
              permissao_agendar: true,
              permissao_confirmacao_amanha: true,
              dias_atendimento: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
              hora_inicio: '08:00',
              hora_fim: '18:00'
            };
            clinicalDb.setAuthenticatedSession(matched);
            setIsLoading(false);
            navigate(returnTo, { replace: true });
            return;
          }
        } catch {
          // Continua
        }
      }

      // Se não autenticou em nenhuma tentativa
      setIsLoading(false);
      setError(localResult.message || 'Usuário ou senha incorretos. Verifique suas credenciais.');
    } catch {
      const fallback = clinicalDb.login(cleanInput, cleanPassword);
      setIsLoading(false);
      if (fallback.success) {
        navigate(returnTo, { replace: true });
      } else {
        setError(fallback.message || 'Credenciais inválidas.');
      }
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
            <div className="w-9 h-9 rounded-lg bg-[#142E28] border border-[#C5A059]/60 flex items-center justify-center font-serif font-bold text-xs text-[#C5A059]">
              CC
            </div>
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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A3C34] border border-[#C5A059]/40 text-[#C5A059] mb-2 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Acesso ao Sistema Clínico
            </h1>
            <p className="text-xs text-stone-400">
              Ambiente restrito a profissionais e colaboradores autorizados
            </p>
          </div>

          {/* Aviso de Redirecionamento de Área Restrita */}
          {location.state?.from && !activeSession && (
            <div className="p-3 rounded-xl bg-[#1A3C34]/90 border border-[#C5A059]/50 text-stone-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <Lock size={16} className="text-[#C5A059] shrink-0" />
              <span>Esta página é de acesso exclusivo da equipe. Faça login para continuar.</span>
            </div>
          )}

          {/* Banner de Sessão Ativa */}
          {activeSession && (
            <div className="p-3.5 rounded-xl bg-[#1A3C34] border border-[#C5A059]/60 space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-stone-200">
                    Sessão conectada: <strong className="text-white">{activeSession.nome}</strong>
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0D211C] text-[#C5A059] border border-[#C5A059]/30 uppercase font-semibold">
                  {activeSession.role}
                </span>
              </div>
              <div className="text-[11px] text-stone-400 truncate">
                {activeSession.email}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(returnTo)}
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
                    setIdentificador('');
                    setPassword('');
                  }}
                  className="py-2 px-3 rounded-lg bg-red-950/70 hover:bg-red-900/90 border border-red-500/40 text-red-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}

          {/* Mensagem de Erro com Alto Contraste */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1.5">
                Usuário de Acesso <span className="text-[10px] text-stone-400 font-normal">(ou e-mail cadastrado)</span>
              </label>
              <div className="relative">
                <UserCheck size={15} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={identificador}
                  onChange={(e) => setIdentificador(e.target.value)}
                  placeholder="ex: admin, cibele, recepcao"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotBox(!showForgotBox);
                    setForgotStatus(null);
                  }}
                  className="text-[11px] text-[#C5A059] hover:underline cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
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

            {/* Painel Discreto de Redefinição de Senha */}
            {showForgotBox && (
              <div className="p-3.5 rounded-xl bg-[#0D211C] border border-[#28574A] space-y-2.5 animate-in fade-in">
                <p className="text-xs text-stone-300 font-medium">
                  Recuperação de Acesso
                </p>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Informe o seu e-mail cadastrado para receber o link seguro de redefinição:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={identificador.includes('@') ? identificador : "seu.email@exemplo.com"}
                    className="flex-1 bg-[#142E28] border border-[#28574A] rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleSendForgotEmail}
                    className="px-3 py-2 bg-[#1A3C34] hover:bg-[#204a40] border border-[#C5A059]/40 text-[#C5A059] hover:text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Enviar Link
                  </button>
                </div>

                {forgotStatus && (
                  <div
                    className={`p-2.5 rounded-lg text-[11px] ${
                      forgotStatus.type === 'success'
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/70 border border-red-500/40 text-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium">
                      {forgotStatus.type === 'success' ? (
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle size={13} className="text-red-400 shrink-0" />
                      )}
                      <span>{forgotStatus.message}</span>
                    </div>

                    {forgotStatus.link && (
                      <div className="mt-1.5 pt-1.5 border-t border-emerald-800/40">
                        <Link
                          to={forgotStatus.link.replace(/^https?:\/\/[^\/]+/, '')}
                          className="text-[#C5A059] hover:underline font-semibold"
                        >
                          Definir nova senha agora &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#28574A] bg-[#0D211C] text-[#C5A059] focus:ring-0"
                />
                <span>Manter conectado neste dispositivo</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-105 text-[#0E231E] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            {/* Acesso Rápido com 1 clique para usuários pré-cadastrados */}
            <div className="pt-2 border-t border-[#1D463C] space-y-2">
              <span className="text-[11px] text-stone-400 block text-center font-medium">
                Ou selecione um usuário para preenchimento rápido:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const perfis = clinicalDb.getPerfis();
                    const p = perfis.find(x => x.id === 'perfil-master');
                    setIdentificador(p?.usuario || 'admin');
                    setPassword(p?.senha || 'admin123');
                    setError('');
                  }}
                  className="p-2 rounded-xl bg-[#0D211C] hover:bg-[#1A3C34] border border-[#245246] hover:border-[#C5A059]/50 text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-[#C5A059] truncate font-mono">@admin</div>
                  <div className="text-[10px] text-stone-400 truncate">Coordenação / TI</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const perfis = clinicalDb.getPerfis();
                    const p = perfis.find(x => x.id === 'perfil-cibele');
                    setIdentificador(p?.usuario || 'cibele');
                    setPassword(p?.senha || 'cibele123');
                    setError('');
                  }}
                  className="p-2 rounded-xl bg-[#0D211C] hover:bg-[#1A3C34] border border-[#245246] hover:border-emerald-500/50 text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-emerald-400 truncate font-mono">@cibele</div>
                  <div className="text-[10px] text-stone-400 truncate">Dra. Cibele Cristina</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const perfis = clinicalDb.getPerfis();
                    const p = perfis.find(x => x.id === 'perfil-secretaria');
                    setIdentificador(p?.usuario || 'recepcao');
                    setPassword(p?.senha || 'recepcao123');
                    setError('');
                  }}
                  className="p-2 rounded-xl bg-[#0D211C] hover:bg-[#1A3C34] border border-[#245246] hover:border-sky-500/50 text-left transition-all cursor-pointer"
                >
                  <div className="text-[11px] font-semibold text-sky-400 truncate font-mono">@recepcao</div>
                  <div className="text-[10px] text-stone-400 truncate">Atendimento</div>
                </button>
              </div>
            </div>

          </form>

          {/* Aviso de Segurança & Orientação a Pacientes */}
          <div className="pt-4 border-t border-[#1E4339] space-y-2 text-center">
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Ambiente protegido. Tentativas de acesso não autorizadas são registradas para auditoria médica e segurança.
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

    </div>
  );
};
