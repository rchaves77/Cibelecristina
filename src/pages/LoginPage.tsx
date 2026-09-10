import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Stethoscope, Users } from 'lucide-react';
import { clinicalDb } from '../services/clinicalDatabase';
import { DOCTOR_INFO } from '../data/medicinarteData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('dra.cibele@medicinarte.com.br');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  const perfis = clinicalDb.getPerfis();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Procura o perfil pelo email ou padrão
    const matched = perfis.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      clinicalDb.setActiveUser(matched);
    } else {
      clinicalDb.setActiveUser(perfis[0]);
    }
    navigate('/sistema');
  };

  const handleQuickLogin = (perfilId: string) => {
    const target = perfis.find(p => p.id === perfilId);
    if (target) {
      clinicalDb.setActiveUser(target);
      navigate('/sistema');
    }
  };

  return (
    <div className="min-h-screen bg-[#142E28] flex flex-col justify-center items-center p-4 sm:p-6 text-stone-100 font-sans antialiased relative overflow-hidden">
      {/* Detalhe de fundo sutil */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D443B] rounded-full filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059] rounded-full filter blur-3xl opacity-10 pointer-events-none" />

      <div className="w-full max-w-md bg-[#183931] border border-[#235044] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* CABEÇALHO */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C5A059] text-[#142E28] font-serif font-bold text-2xl shadow-lg mb-3">
            CC
          </div>
          <h1 className="font-serif font-bold text-2xl text-white">
            {DOCTOR_INFO.fullName}
          </h1>
          <p className="text-xs text-[#C5A059] font-medium tracking-wide mt-1">
            {DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm}
          </p>
          <p className="text-[11px] text-stone-400 mt-2">
            Acesso Restrito ao Sistema de Gestão Clínica e Prontuários
          </p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              E-mail Profissional
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#0E231E] border border-[#275449] rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                placeholder="seu.email@medicinarte.com.br"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-3 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#0E231E] border border-[#275449] rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C5A059] hover:bg-[#B38F48] text-[#142E28] text-xs font-bold transition-all shadow-md mt-2"
          >
            <span>Entrar no Sistema</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* ATALHOS RÁPIDOS DE DEMONSTRAÇÃO */}
        <div className="pt-3 border-t border-[#235044] space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block text-center">
            Acesso Rápido por Perfil:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('perfil-cibele')}
              className="p-2.5 rounded-xl bg-[#0E231E] hover:bg-[#133029] border border-[#275449] text-left transition-colors flex items-center gap-2"
            >
              <Stethoscope size={15} className="text-[#C5A059] shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block truncate">Dra. Cibele</span>
                <span className="text-[9px] text-stone-400 block">Médica Titular</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('perfil-recepcao')}
              className="p-2.5 rounded-xl bg-[#0E231E] hover:bg-[#133029] border border-[#275449] text-left transition-colors flex items-center gap-2"
            >
              <Users size={15} className="text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-white block truncate">Recepção</span>
                <span className="text-[9px] text-stone-400 block">Atendimento</span>
              </div>
            </button>
          </div>
        </div>

        {/* VOLTAR AO SITE */}
        <div className="text-center pt-1">
          <Link
            to="/"
            className="text-xs text-stone-400 hover:text-[#C5A059] transition-colors"
          >
            &larr; Voltar ao site oficial da Dra. Cibele
          </Link>
        </div>
      </div>
    </div>
  );
};
