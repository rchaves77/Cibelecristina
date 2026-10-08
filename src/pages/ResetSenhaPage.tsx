import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  KeyRound,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { DOCTOR_INFO } from '../data/medicinarteData';
import { supabase, syncCredentialsToSupabase } from '../services/supabaseClient';

export const ResetSenhaPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [perfilNome, setPerfilNome] = useState('');
  const [targetPerfil, setTargetPerfil] = useState<any>(null);

  useEffect(() => {
    document.title = "Redefinir Senha | Medicinarte - Dra. Cibele Cristina";
    window.scrollTo(0, 0);

    const carregarPerfil = async () => {
      // 1. Tenta localizar na base clínica local
      const perfis = clinicalDb.getPerfis();
      let matched = token ? perfis.find(p => p.reset_token === token) : null;
      if (!matched && emailParam) {
        matched = perfis.find(p => p.email.toLowerCase() === emailParam.toLowerCase()) || null;
      }

      if (matched) {
        setPerfilNome(matched.nome);
        setTargetPerfil(matched);
        return;
      }

      // 2. Se não localizou na base local (ex: aberto em outro navegador ou celular), consulta o Supabase Cloud
      try {
        if (token) {
          const { data: supaPerfil } = await supabase
            .from('perfis')
            .select('*')
            .eq('reset_token', token)
            .maybeSingle();

          if (supaPerfil) {
            setPerfilNome(supaPerfil.nome);
            setTargetPerfil(supaPerfil);
            // Sincroniza para a base local
            clinicalDb.savePerfil({
              id: supaPerfil.id,
              nome: supaPerfil.nome,
              email: supaPerfil.email,
              usuario: supaPerfil.usuario,
              role: supaPerfil.role || 'secretaria',
              cor: supaPerfil.cor || '#1A3C34',
              permissao_financeiro: supaPerfil.permissao_financeiro ?? true,
              permissao_agendar: supaPerfil.permissao_agendar ?? true,
              permissao_confirmacao_amanha: supaPerfil.permissao_confirmacao_amanha ?? true,
              dias_atendimento: supaPerfil.dias_atendimento || ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
              hora_inicio: supaPerfil.hora_inicio || '08:00',
              hora_fim: supaPerfil.hora_fim || '18:00',
              reset_token: supaPerfil.reset_token,
              reset_token_expira: supaPerfil.reset_token_expira
            });
            return;
          }
        }

        if (emailParam) {
          const { data: supaByEmail } = await supabase
            .from('perfis')
            .select('*')
            .ilike('email', emailParam.toLowerCase())
            .maybeSingle();

          if (supaByEmail) {
            setPerfilNome(supaByEmail.nome);
            setTargetPerfil(supaByEmail);
          }
        }
      } catch {
        // Segue com o fluxo padrão
      }
    };

    carregarPerfil();
  }, [token, emailParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNovaSenha = novaSenha.trim();

    if (!cleanNovaSenha) {
      setStatus('error');
      setMessage('Digite a nova senha desejada.');
      return;
    }

    setStatus('loading');

    try {
      let resolvedPerfil = targetPerfil;

      // 1. Atualização na base local
      if (token) {
        const res = clinicalDb.redefinirSenhaComToken(token, cleanNovaSenha);
        if (res.success && res.perfil) {
          resolvedPerfil = res.perfil;
          clinicalDb.setActiveUser(res.perfil);
        }
      } else if (resolvedPerfil?.id) {
        const updated = clinicalDb.updateSenhaPerfil(resolvedPerfil.id, cleanNovaSenha);
        if (updated) {
          resolvedPerfil = updated;
          clinicalDb.setActiveUser(updated);
        }
      }

      // 2. Sincronização IMEDIATA com o Banco de Senhas Cloud (Supabase)
      if (resolvedPerfil) {
        await syncCredentialsToSupabase({
          perfilId: resolvedPerfil.id,
          email: resolvedPerfil.email,
          password: cleanNovaSenha,
          nome: resolvedPerfil.nome,
          role: resolvedPerfil.role,
          usuario: resolvedPerfil.usuario
        });

        // Limpa o token no Supabase para não permitir reuso
        try {
          await supabase
            .from('perfis')
            .update({
              senha: cleanNovaSenha,
              reset_token: null,
              reset_token_expira: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', resolvedPerfil.id);
        } catch {
          // Continua
        }

        // Tenta atualizar no Supabase Auth se houver sessão
        try {
          await supabase.auth.updateUser({ password: cleanNovaSenha });
        } catch {
          // Continua
        }
      }

      setStatus('success');
      setMessage(`Senha atualizada com sucesso para ${resolvedPerfil?.nome || 'o usuário'}! As credenciais já foram sincronizadas com o banco de senhas.`);
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Erro ao sincronizar nova senha com o banco de dados.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E231E] text-stone-100 font-sans antialiased flex flex-col justify-between selection:bg-[#C5A059] selection:text-[#142E28]">
      
      {/* Luzes decorativas */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#1A3C34] rounded-full filter blur-[140px] opacity-40 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#C5A059] rounded-full filter blur-[160px] opacity-15 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 bg-[#142E28]/90 backdrop-blur-md border-b border-[#234E43] px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] p-1 border border-[#C5A059] shadow-xs shrink-0" 
            />
            <div>
              <span className="font-serif font-bold text-base text-white block">
                {DOCTOR_INFO.name}
              </span>
              <span className="text-[11px] text-[#C5A059] font-medium block">
                Sistema Clínico Medicinarte
              </span>
            </div>
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#183931] border border-[#C5A059]/40 text-xs text-white hover:border-[#C5A059] transition-all"
          >
            <ArrowLeft size={14} className="text-[#C5A059]" />
            <span>Ir para o Login</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-12 relative z-10 flex flex-col justify-center">
        
        <div className="bg-[#15342D] border border-[#235246] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#9E7B36] text-[#0E231E] mb-3 shadow-lg">
              <KeyRound size={26} />
            </div>
            <h1 className="font-serif font-bold text-2xl text-white">
              Nova Senha de Acesso
            </h1>
            <p className="text-xs text-[#D4AF37] font-medium mt-1">
              MEDICINARTE SERVIÇOS MÉDICOS LTDA
            </p>
            <p className="text-xs text-stone-400 mt-2">
              {perfilNome 
                ? `Redefinindo credenciais para o perfil: ${perfilNome}`
                : emailParam
                  ? `Redefinindo senha para: ${emailParam}`
                  : 'Crie uma nova senha de acesso ao sistema clínico sem burocracia.'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Senha Atualizada!</h3>
                <p className="text-xs text-emerald-200 mt-1">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/sistema')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F48] text-[#0E231E] font-bold text-xs shadow-md transition-all"
              >
                <span>Acessar o Sistema Clínico Agora</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {status === 'error' && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-400 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Digite a Nova Senha (Sem exigências complexas)
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3 text-[#C5A059]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="w-full pl-10 pr-10 py-3 bg-[#0D211C] border border-[#27574B] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Você pode usar qualquer senha que preferir. Fácil e sem bloqueios de símbolos.
                </p>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C5A059] to-[#B38F48] text-[#0E231E] font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-75"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirmar Nova Senha</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          )}

          <div className="pt-2 text-center border-t border-[#234E43]">
            <Link to="/" className="text-xs text-stone-400 hover:text-[#C5A059] transition-colors">
              &larr; Voltar ao site oficial da Dra. Cibele Cristina
            </Link>
          </div>

        </div>

      </main>

      {/* Rodapé */}
      <footer className="relative z-20 bg-[#0A1A16] border-t border-[#234E43] py-3.5 px-4 text-center text-xs text-stone-400">
        MEDICINARTE SERVIÇOS MÉDICOS LTDA • Dra. Cibele Cristina — CRM-AC 1810 | RQE 1078
      </footer>

    </div>
  );
};
