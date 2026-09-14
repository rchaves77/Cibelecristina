import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Stethoscope, 
  Users,
  Shield
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { DOCTOR_INFO } from '../data/medicinarteData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('cibele@medicinarte.com.br');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Esqueci minha senha
  const [showForgotBox, setShowForgotBox] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ type: 'success' | 'error'; message: string; link?: string } | null>(null);

  const perfis = clinicalDb.getPerfis();

  useEffect(() => {
    document.title = "Acesso ao Sistema Clínico | Dra. Cibele Cristina";
    window.scrollTo(0, 0);
  }, []);

  const handleSendForgotEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = forgotEmail.trim() || email.trim();
    if (!targetEmail) {
      setForgotStatus({ type: 'error', message: 'Informe o endereço de e-mail cadastrado.' });
      return;
    }

    const res = clinicalDb.gerarResetSenha(targetEmail);
    if (res.success && res.perfil) {
      setForgotStatus({
        type: 'success',
        message: `Link de redefinição enviado para ${res.perfil.email}.`,
        link: res.link
      });
    } else {
      setForgotStatus({
        type: 'error',
        message: 'Endereço de e-mail não localizado no cadastro.'
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Informe o e-mail cadastrado.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const perfisAtualizados = clinicalDb.getPerfis();
      const matched = perfisAtualizados.find(p => p.email.toLowerCase() === email.toLowerCase());
      
      if (matched && matched.senha && password.trim() && password !== '••••••••' && password !== matched.senha) {
        setIsLoading(false);
        setError('Senha incorreta. Verifique suas credenciais ou solicite a redefinição.');
        return;
      }

      if (matched) {
        clinicalDb.setActiveUser(matched);
      } else {
        clinicalDb.setActiveUser(perfisAtualizados[0]);
      }
      setIsLoading(false);
      navigate('/sistema');
    }, 400);
  };

  const handleQuickLogin = (perfilId: string) => {
    setIsLoading(true);
    const target = perfis.find(p => p.id === perfilId);
    
    if (target) {
      setEmail(target.email);
      setPassword('••••••••');
      clinicalDb.setActiveUser(target);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/sistema');
      }, 300);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E231E] text-stone-100 font-sans antialiased flex flex-col justify-between selection:bg-[#C5A059] selection:text-[#142E28]">
      
      {/* Luzes decorativas sutis de fundo */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#1A3C34] rounded-full filter blur-[140px] opacity-35 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#C5A059] rounded-full filter blur-[160px] opacity-10 pointer-events-none" />

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

          {/* Botão de retorno direto ao site principal */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2A5A4D] bg-[#142E28] hover:bg-[#1A3C34] text-xs text-stone-200 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} className="text-[#C5A059]" />
            <span>Voltar ao site</span>
          </Link>
        </div>
      </header>

      {/* Área Central: Card de Login Focado e Clean */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 relative z-10 flex flex-col justify-center">
        
        <div className="bg-[#142E28] border border-[#234E43] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Identificação do Sistema */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1A3C34] border border-[#C5A059]/40 text-[#C5A059] mb-2 shadow-sm">
              <Shield size={22} />
            </div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Sistema Clínico
            </h1>
            <p className="text-xs text-stone-400">
              Prontuário eletrônico e gestão do consultório
            </p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulário Principal */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="text-xs font-medium text-stone-300 block mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@medicinarte.com.br"
                  className="w-full pl-10 pr-3 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
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
                  className="text-[11px] text-[#C5A059] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#245246] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white"
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
                  Redefinir senha de acesso
                </p>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Informe seu e-mail para receber o link seguro de alteração:
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={email || "seu.email@medicinarte.com.br"}
                    className="flex-1 bg-[#142E28] border border-[#28574A] rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={handleSendForgotEmail}
                    className="px-3 py-2 bg-[#1A3C34] hover:bg-[#204a40] border border-[#C5A059]/40 text-[#C5A059] hover:text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Enviar
                  </button>
                </div>

                {forgotStatus && (
                  <div
                    className={`p-2.5 rounded-lg text-[11px] ${
                      forgotStatus.type === 'success'
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/60 border border-red-500/40 text-red-200'
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
                <span>Lembrar meu acesso</span>
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
                  <span>Entrar</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>

          {/* Atalho Simples para a Equipe Interna */}
          <div className="pt-4 border-t border-[#1E4339] space-y-2">
            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block text-center">
              Acesso da equipe:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('perfil-cibele')}
                className="p-2 rounded-lg bg-[#0D211C] hover:bg-[#112923] border border-[#204a40] hover:border-[#C5A059]/60 text-left transition-colors flex items-center gap-2"
              >
                <Stethoscope size={14} className="text-[#C5A059] shrink-0" />
                <span className="text-xs text-stone-200 truncate">Dra. Cibele</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('perfil-secretaria')}
                className="p-2 rounded-lg bg-[#0D211C] hover:bg-[#112923] border border-[#204a40] hover:border-[#C5A059]/60 text-left transition-colors flex items-center gap-2"
              >
                <Users size={14} className="text-[#C5A059] shrink-0" />
                <span className="text-xs text-stone-200 truncate">Recepção</span>
              </button>
            </div>
          </div>

          {/* Orientação Discreta para Pacientes */}
          <div className="pt-2 text-center border-t border-[#1E4339]/60">
            <p className="text-[11px] text-stone-400">
              Procura agendamento de consultas?{' '}
              <Link to="/" className="text-[#C5A059] hover:underline font-medium">
                Acesse a página inicial
              </Link>
            </p>
          </div>

        </div>

      </main>

      {/* Rodapé Limpo e Institucional */}
      <footer className="relative z-20 border-t border-[#1E4339] bg-[#0A1A16] py-3.5 px-4 text-center text-xs text-stone-400">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <span>Medicinarte Serviços Médicos Ltda • CRM-AC PJ 258</span>
          <span>Dra. Cibele Cristina — CRM-AC 1810 | RQE 1078</span>
        </div>
      </footer>

    </div>
  );
};
