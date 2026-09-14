import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Perfil } from '../../types/clinical';

interface PrimeiroAcessoModalProps {
  currentUser: Perfil;
  onSuccess: (updatedUser: Perfil) => void;
}

export const PrimeiroAcessoModal: React.FC<PrimeiroAcessoModalProps> = ({ currentUser, onSuccess }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!novaSenha.trim() || novaSenha.trim().length < 4) {
      setError('A nova senha deve possuir pelo menos 4 caracteres.');
      return;
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setError('A nova senha e a confirmação não correspondem.');
      return;
    }

    if (currentUser.senha && novaSenha.trim() === currentUser.senha) {
      setError('Por segurança, sua nova senha deve ser diferente da senha temporária inicial.');
      return;
    }

    setIsSaving(true);
    try {
      const updated = clinicalDb.alterarSenhaPrimeiroAcesso(currentUser.id, novaSenha.trim());
      setIsSaving(false);
      onSuccess(updated);
    } catch (err: any) {
      setIsSaving(false);
      setError(err.message || 'Erro ao salvar a nova senha.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E231E]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#142E28] border border-[#C5A059]/60 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-stone-100 animate-in fade-in zoom-in-95">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A3C34] border border-[#C5A059] text-[#C5A059] shadow-lg">
            <KeyRound size={28} />
          </div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
            Primeiro Acesso ao Sistema
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Olá, <strong className="text-white">{currentUser.nome}</strong>! Por motivos de segurança, você precisa redefinir sua senha inicial neste primeiro acesso para ativar sua conta.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Nova Senha Definitiva
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type={showSenha ? 'text' : 'password'}
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite sua nova senha"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#28574A] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white"
              >
                {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type={showConfirmar ? 'text' : 'password'}
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full pl-10 pr-10 py-2.5 bg-[#0D211C] border border-[#28574A] rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmar(!showConfirmar)}
                className="absolute right-3.5 top-2.5 text-stone-400 hover:text-white"
              >
                {showConfirmar ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-105 text-[#0E231E] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-75"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-[#0E231E] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Salvar Nova Senha & Entrar no Sistema</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-[#0D211C] border border-[#234E43] text-[11px] text-stone-400 text-center">
          🔒 Esta definição é obrigatória e ativará suas novas credenciais imediatamente no sistema.
        </div>

      </div>
    </div>
  );
};
