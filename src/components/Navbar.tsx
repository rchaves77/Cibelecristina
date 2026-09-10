import React, { useState } from 'react';
import { Stethoscope, Calendar, Phone, MessageSquare, Menu, X, Shield, Lock } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onOpenAdmin, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Agendamento', href: '#agendamento' },
    { label: 'Convênios', href: '#convenios' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Blog & Saúde', href: '#blog' },
    { label: 'Dúvidas', href: '#faq' },
    { label: 'Contato', href: '#contato' }
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappDirectUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${encodeURIComponent('Olá Dra. Cibele Cristina! Gostaria de informações sobre agendamento de consulta.')}`;

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E5E1DA]">
      {/* Top emergency & quick info bar */}
      <div className="bg-[#1A3A36] text-[#DCE7E5] px-4 py-2 text-xs border-b border-[#2D5A54]/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span>
            <span className="text-[11px] uppercase tracking-widest font-medium">Atendimento Humanizado • Medicina de Família e Comunidade</span>
            <span className="hidden md:inline text-[#A0AEC0]">• CRM 3482 / AC</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${DOCTOR_PROFILE.phone.replace(/\D/g, '')}`}
              className="hover:text-white flex items-center gap-1.5 transition-colors text-xs"
            >
              <Phone className="w-3 h-3 text-[#4ADE80]" />
              <span>{DOCTOR_PROFILE.phone}</span>
            </a>
            <span className="text-[#2D5A54]">|</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#DCE7E5] hover:text-white flex items-center gap-1 transition-colors cursor-pointer text-xs"
              title="Área Administrativa (Dra. Cibele & Rômulo / ClienteBox)"
            >
              <Lock className="w-3 h-3 text-[#4ADE80]" />
              <span className="text-[11px] uppercase tracking-wider font-medium">Painel Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-lg bg-[#DCE7E5]/50 text-[#2D5A54] border border-[#DCE7E5] flex items-center justify-center group-hover:bg-[#DCE7E5] transition-colors">
              <Stethoscope className="w-5 h-5 text-[#2D5A54]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif italic text-[#2D5A54] leading-none group-hover:text-[#1A3A36] transition-colors">
                {DOCTOR_PROFILE.name}
              </span>
              <span className="text-[10px] uppercase tracking-widest mt-1 text-[#636E72] font-medium">
                {DOCTOR_PROFILE.specialty}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-7 text-[11px] uppercase tracking-widest font-semibold">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-[#2D5A54] border-b-2 border-[#2D5A54] pb-0.5'
                      : 'text-[#636E72] hover:text-[#2D5A54]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] uppercase tracking-wider font-semibold text-[#2D5A54] bg-[#DCE7E5]/40 hover:bg-[#DCE7E5] border border-[#DCE7E5] transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#2D5A54]" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] uppercase tracking-widest font-bold text-white bg-[#2D5A54] hover:bg-[#1A3A36] transition-all shadow-xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Agendar Consulta</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="sm:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider text-white bg-[#2D5A54]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#4ADE80]" />
              <span>Agendar</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2D3436] hover:text-[#2D5A54] hover:bg-[#DCE7E5]/30 focus:outline-hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#FDFCFB] border-b border-[#E5E1DA] px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="px-3 py-2 text-xs uppercase tracking-wider font-semibold text-[#4A5568] hover:bg-[#DCE7E5]/40 hover:text-[#2D5A54] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5E1DA] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white bg-[#2D5A54] hover:bg-[#1A3A36] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#4ADE80]" />
              <span>Agendar Consulta Online</span>
            </button>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg text-xs uppercase tracking-wider font-semibold text-[#2D5A54] bg-[#DCE7E5]/40 border border-[#DCE7E5] hover:bg-[#DCE7E5] flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#2D5A54]" />
              <span>Conversar no WhatsApp</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 rounded-lg text-xs uppercase tracking-wider font-semibold text-[#636E72] hover:text-[#1A3A36] hover:bg-[#DCE7E5]/30 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-[#2D5A54]" />
              <span>Acessar Painel Administrativo (CMS)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
