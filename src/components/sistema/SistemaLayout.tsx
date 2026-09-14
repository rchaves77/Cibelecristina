import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  Award,
  CreditCard,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Globe,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Perfil } from '../../types/clinical';
import { DOCTOR_INFO } from '../../data/medicinarteData';
import { CidSearchModal } from '../common/CidSearchModal';

interface SistemaLayoutProps {
  children: React.ReactNode;
}

export const SistemaLayout: React.FC<SistemaLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Perfil>(clinicalDb.getActiveUser());
  const [perfis, setPerfis] = useState<Perfil[]>(clinicalDb.getPerfis());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmacoesAmanha, setConfirmacoesAmanha] = useState<any[]>([]);
  const [showConfirmacoesModal, setShowConfirmacoesModal] = useState(false);
  const [showCidModal, setShowCidModal] = useState(false);

  useEffect(() => {
    // Guarda de Rotas: Apenas usuários autenticados podem acessar o sistema
    if (!clinicalDb.isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    const user = clinicalDb.getActiveUser();
    setCurrentUser(user);
    setPerfis(clinicalDb.getPerfis());
    const amanhaList = clinicalDb.getAgendamentosConfirmacaoAmanha();
    setConfirmacoesAmanha(amanhaList);
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    clinicalDb.logout();
    navigate('/login', { replace: true });
  };

  const handleSwitchUser = (perfilId: string) => {
    const target = perfis.find(p => p.id === perfilId);
    if (target) {
      clinicalDb.setActiveUser(target);
      setCurrentUser(target);
    }
  };

  const navItems = [
    { label: 'Agenda & Calendário', path: '/sistema', icon: Calendar },
    { label: 'Pacientes & Prontuários', path: '/sistema/pacientes', icon: Users },
    { label: 'Prescrições & Exames', path: '/sistema/prescricoes', icon: FileText, highlight: true },
    { label: 'Atestados com QR Code', path: '/sistema/atestados', icon: Award },
    { label: 'Simulador de Taxas', path: '/sistema/taxas', icon: CreditCard },
    { label: 'Financeiro & Caixa', path: '/sistema/financeiro', icon: DollarSign },
    { label: 'Relatórios & Gráficos', path: '/sistema/relatorios', icon: BarChart3 },
    { label: 'Perfis & Acessos', path: '/sistema/permissoes', icon: ShieldCheck },
  ];

  // Se não estiver autenticado, não renderiza a casca do sistema
  if (!clinicalDb.isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9F6] text-stone-800 flex flex-col md:flex-row antialiased font-sans">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-[#142E28] text-white border-r border-[#1B3E36] shrink-0">
        {/* Header do Sistema com Identidade Visual */}
        <div className="p-4 border-b border-[#1D443B] flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Logo Dra. Cibele Cristina" 
            className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] p-0.5 border border-[#C5A059]/40 shadow-md shrink-0"
          />
          <div className="min-w-0">
            <h1 className="font-serif font-semibold text-sm tracking-wide text-white truncate">
              Dra. Cibele Cristina
            </h1>
            <p className="text-[11px] text-[#C5A059] font-medium tracking-tight truncate">
              {DOCTOR_INFO.crm} • {DOCTOR_INFO.rqe}
            </p>
          </div>
        </div>

        {/* Status do Usuário Ativo & Seletor Rápido de Papel */}
        <div className="p-3 bg-[#0E231E] border-b border-[#1B3E36]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
              Usuário Conectado
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ativo
            </span>
          </div>
          <select
            value={currentUser.id}
            onChange={(e) => handleSwitchUser(e.target.value)}
            className="w-full bg-[#183931] border border-[#275449] text-xs text-stone-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          >
            {perfis.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.role.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/sistema' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#C5A059] text-[#142E28] shadow-sm font-semibold'
                    : 'text-stone-300 hover:bg-[#1C3F36] hover:text-white'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#142E28]' : 'text-[#C5A059]'} />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#C5A059]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Acesso ao Site Oficial Público */}
        <div className="p-3 border-t border-[#1D443B] space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#1C3F36] hover:bg-[#234F44] text-stone-200 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-[#C5A059]" />
              <span>Ver Site Oficial</span>
            </div>
            <ChevronRight size={14} className="text-stone-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-stone-400 hover:text-rose-300 text-xs font-medium transition-colors"
          >
            <LogOut size={14} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE */}
      <header className="md:hidden flex items-center justify-between bg-[#142E28] text-white p-3 border-b border-[#1B3E36] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Logo Dra. Cibele Cristina" 
            className="w-8 h-8 rounded-lg object-contain bg-[#FAF8F5] p-0.5 border border-[#C5A059]/40 shrink-0"
          />
          <div>
            <h1 className="font-serif font-semibold text-xs text-white">Dra. Cibele Cristina</h1>
            <p className="text-[10px] text-[#C5A059]">{DOCTOR_INFO.crm}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {confirmacoesAmanha.length > 0 && (
            <button
              onClick={() => setShowConfirmacoesModal(true)}
              className="p-1.5 rounded-lg bg-[#1C3F36] text-[#C5A059] relative"
              title="Confirmações de amanhã"
            >
              <Bell size={17} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                {confirmacoesAmanha.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#1C3F36] text-stone-200"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* DRAWER MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-72 max-w-[80vw] h-full bg-[#142E28] text-white flex flex-col p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1D443B]">
              <span className="font-serif font-bold text-[#C5A059]">Sistema Clínico</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-stone-400">
                <X size={20} />
              </button>
            </div>

            <div className="py-2 border-b border-[#1D443B]">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1">Usuário</span>
              <select
                value={currentUser.id}
                onChange={(e) => handleSwitchUser(e.target.value)}
                className="w-full bg-[#183931] border border-[#275449] text-xs text-stone-200 rounded-lg p-2"
              >
                {perfis.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  (item.path !== '/sistema' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-[#C5A059] text-[#142E28] font-bold' : 'text-stone-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-[#1D443B] space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowCidModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1C3F36] text-stone-200 text-xs font-medium text-left"
              >
                <BookOpen size={15} className="text-[#C5A059]" />
                <span>Consultar CID-10 & CID-11</span>
              </button>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1C3F36] text-stone-200 text-xs font-medium"
              >
                <Globe size={15} className="text-[#C5A059]" />
                <span>Ver Site Oficial</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-stone-400 hover:text-rose-300 text-xs text-left cursor-pointer"
              >
                <LogOut size={14} />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL COM TOPBAR E CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* TOPBAR DESKTOP */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-stone-200 px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Ambiente de Gestão Integrada
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-600 font-medium">
              Consultório Médico & Saúde Comunitária
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão de Consulta Rápida CID-10 & CID-11 */}
            <button
              type="button"
              onClick={() => setShowCidModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1A3C34] text-stone-700 hover:text-white border border-stone-200 text-xs font-semibold transition-all group"
              title="Classificação Internacional de Doenças"
            >
              <BookOpen size={14} className="text-[#1A3C34] group-hover:text-[#C5A059] transition-colors" />
              <span>Consultar CID-10 & CID-11</span>
            </button>

            {/* Notificação de Confirmação Automática via WhatsApp */}
            <button
              type="button"
              onClick={() => setShowConfirmacoesModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-medium transition-colors"
            >
              <Bell size={14} className="text-emerald-700" />
              <span>Confirmações WhatsApp</span>
              {confirmacoesAmanha.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                  {confirmacoesAmanha.length} amanhã
                </span>
              )}
            </button>

            {/* Badge do Usuário */}
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <div className="w-7 h-7 rounded-full bg-[#1A3C34] text-white flex items-center justify-center text-xs font-bold">
                {currentUser.nome.charAt(0)}
              </div>
              <div className="text-left">
                <span className="block text-xs font-semibold text-stone-800 leading-tight">
                  {currentUser.nome.split(' ')[0]} {currentUser.nome.split(' ')[1] || ''}
                </span>
                <span className="block text-[10px] text-stone-500 capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MODAL DE CONFIRMAÇÕES WHATSAPP */}
        {showConfirmacoesModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900">
                      Disparo de Confirmação Automática
                    </h3>
                    <p className="text-xs text-stone-500">
                      Pacientes com consultas marcadas para o próximo dia útil
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowConfirmacoesModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 flex-1 overflow-y-auto space-y-3">
                {confirmacoesAmanha.length === 0 ? (
                  <div className="p-6 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    Nenhum paciente pendente de confirmação para amanhã.
                  </div>
                ) : (
                  confirmacoesAmanha.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-stone-50 hover:bg-emerald-50/50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-stone-900">
                            {item.agendamento.paciente_nome}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] bg-stone-200 text-stone-700 rounded font-medium">
                            {item.horaFormatada}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {item.agendamento.servico_nome} • {item.agendamento.paciente_telefone}
                        </p>
                      </div>

                      <a
                        href={item.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shrink-0 transition-colors shadow-sm"
                      >
                        <span>Enviar WhatsApp</span>
                      </a>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => setShowConfirmacoesModal(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA PÁGINA */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MODAL GLOBAL DE CONSULTA CID-10 & CID-11 */}
      <CidSearchModal
        isOpen={showCidModal}
        onClose={() => setShowCidModal(false)}
      />
    </div>
  );
};
