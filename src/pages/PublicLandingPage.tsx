import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DOCTOR_INFO, 
  PILLARS, 
  SERVICES, 
  ARTICLES, 
  FEATURED_HIGHLIGHTS,
  OFFICE_PROCEDURES,
  FAQ_ITEMS, 
  ArticleData,
  BlogCategoryKey
} from '../data/medicinarteData';
import { 
  trackWhatsAppClick, 
  trackAppointmentSubmission, 
  trackArticleView, 
  trackProcedureInteraction 
} from '../utils/analytics';

interface ModalContent {
  category: string;
  title: string;
  fullHtml: string;
  serviceKey?: string;
  servicePrompt?: string;
}

export function PublicLandingPage() {
  const [selectedArticle, setSelectedArticle] = useState<ModalContent | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryKey>('todas');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formName, setFormName] = useState('');
  const [formService, setFormService] = useState('Consulta Médica');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const currentYear = new Date().getFullYear();

  const categories: { key: BlogCategoryKey; label: string; count: number }[] = [
    { key: 'todas', label: 'Todos os Artigos', count: ARTICLES.length },
    { key: 'saude-adulto', label: 'Saúde do Adulto', count: ARTICLES.filter(a => a.categoryKey === 'saude-adulto').length },
    { key: 'saude-mulher', label: 'Saúde da Mulher', count: ARTICLES.filter(a => a.categoryKey === 'saude-mulher').length },
    { key: 'saude-crianca', label: 'Saúde da Criança', count: ARTICLES.filter(a => a.categoryKey === 'saude-crianca').length },
    { key: 'saude-idoso', label: 'Saúde do Idoso', count: ARTICLES.filter(a => a.categoryKey === 'saude-idoso').length },
    { key: 'prevencao', label: 'Prevenção', count: ARTICLES.filter(a => a.categoryKey === 'prevencao').length },
    { key: 'ouvido', label: 'Ouvido', count: ARTICLES.filter(a => a.categoryKey === 'ouvido').length },
  ];

  const displayedArticles = selectedCategory === 'todas'
    ? ARTICLES
    : ARTICLES.filter(a => a.categoryKey === selectedCategory);

  // Listener para botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll para o topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Alternar exibição de todos os artigos
  const toggleAllArticles = () => {
    setShowAllArticles(prev => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          const el = document.getElementById('todos-artigos');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 60);
      } else {
        const el = document.getElementById('conteudos-saude');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      return next;
    });
  };

  // Close modal or mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  const openArticleModal = (article: ModalContent & { id?: string }) => {
    setSelectedArticle(article);
    trackArticleView({
      articleId: article.id || article.title,
      title: article.title,
      category: article.category
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formName.trim();
    if (!trimmedName) {
      setFormError('Por favor, digite seu nome completo para continuar.');
      const inputEl = document.getElementById('userName');
      if (inputEl) {
        inputEl.focus();
      }
      return;
    }

    setFormError('');
    setFormSuccess(true);

    // Mensagem com o nome e o serviço captados para enviar à Dra. Cibele
    const message = `Olá, Dra. Cibele! Meu nome é ${trimmedName} e gostaria de agendar o serviço de ${formService}. Poderia me informar os horários disponíveis?`;
    const url = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Mensuração no Analytics
    trackAppointmentSubmission({ service: formService, source: 'formulario_contato', nameProvided: true });
    trackWhatsAppClick({ location: 'formulario_contato', service: formService, label: 'Agendar Agora no WhatsApp', url });

    // Abertura única em nova aba sem disparar redirecionamento duplo
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] text-[#192723]">
      
      {/* Barra Oficial de Conformidade Ética CFM */}
      <div className="compliance-bar" role="region" aria-label="Identificação Profissional">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-3 gap-y-1 text-[11px] sm:text-xs">
          <span className="font-semibold text-white tracking-wide">
            {DOCTOR_INFO.fullName || DOCTOR_INFO.name}
          </span>
          <span className="text-[#C5A059]">•</span>
          <span className="text-stone-300">Médica ({DOCTOR_INFO.crm})</span>
          <span className="text-[#C5A059]">•</span>
          <span className="text-stone-300">Especialista em {DOCTOR_INFO.specialty} ({DOCTOR_INFO.rqe})</span>
          <span className="text-[#C5A059] hidden sm:inline">•</span>
          <span className="text-stone-300 hidden sm:inline">{DOCTOR_INFO.clinicCrmPj}</span>
        </div>
      </div>

      {/* Header Fixo de Navegação */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#inicio" className="brand-wrap" aria-label={`Página Inicial - ${DOCTOR_INFO.name}`}>
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] p-0.5 border border-[#C5A059]/40 shadow-sm shrink-0"
            />
            <div className="brand-titles">
              <span className="brand-name">
                Dra. Cibele Cristina
              </span>
              <span className="brand-sub">
                {DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm}
              </span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="header-nav" aria-label="Navegação Principal">
            <a href="#sobre" className="nav-link">Sobre</a>
            <a href="#servicos" className="nav-link">Serviços</a>
            <a href="#procedimentos" className="nav-link" onClick={() => trackProcedureInteraction({ procedureName: 'Seção de Procedimentos', source: 'header_nav' })}>
              Procedimentos
            </a>
            <Link 
              to="/lavagem-de-ouvido-rio-branco" 
              className="nav-link text-[#9E7B36] font-semibold hover:text-[#7A5E26]"
              onClick={() => trackProcedureInteraction({ procedureName: 'Lavagem de Ouvido', source: 'header_link_lavagem' })}
            >
              Lavagem de Ouvido
            </Link>
            <a href="#conteudos-saude" className="nav-link">Blog</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#contato" className="nav-link">Contato</a>
          </nav>

          {/* Botões de Ação Desktop */}
          <div className="header-desktop-actions">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#28574A] text-stone-700 hover:text-[#1A3C34] hover:border-[#C5A059] hover:bg-stone-50 text-xs font-semibold transition-all"
              title="Acesso Seguro ao Sistema Clínico"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C5A059]">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Área Restrita</span>
            </Link>
            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar uma Teleconsulta.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline-gold" 
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }} 
              title="Agendar Teleconsulta Online"
              onClick={() => trackWhatsAppClick({ location: 'header_teleconsulta', service: 'Teleconsulta', label: 'Botão Teleconsulta Header' })}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>Teleconsulta</span>
            </a>
            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, gostaria de agendar uma consulta com a Dra. Cibele Cristina.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gold" 
              aria-label="Agendar via WhatsApp"
              style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
              onClick={() => trackWhatsAppClick({ location: 'header_agendar', service: 'Consulta Médica', label: 'Botão Agendar Consulta Header' })}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Agendar Consulta</span>
            </a>
          </div>

          {/* Botão Sanduíche Mobile (3 Barrinhas) */}
          <button
            type="button"
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu de navegação"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-drawer"
          >
            <span className="hamburger-icon">
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </span>
          </button>
        </div>
      </header>

      {/* Backdrop do Menu Mobile */}
      <div 
        className={`mobile-menu-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Gaveta / Menu Sanduíche Mobile */}
      <aside 
        id="mobile-drawer"
        className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Menu Mobile de Navegação"
      >
        <div className="drawer-header">
          <div className="drawer-brand">
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              className="w-9 h-9 rounded-lg object-contain bg-[#FAF8F5] p-0.5 border border-[#C5A059]/40 shrink-0"
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--accent)', lineHeight: 1.2 }}>
                Dra. Cibele Cristina
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {DOCTOR_INFO.specialty}
              </div>
            </div>
          </div>

          <button 
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>

        <div className="drawer-content">
          <div>
            <div className="drawer-nav-section-title">Navegação</div>
            <nav className="drawer-nav-list" aria-label="Links do Menu Mobile">
              <a 
                href="#inicio" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>Início</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <a 
                href="#sobre" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Sobre a Médica</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <a 
                href="#servicos" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                  <span>Serviços Médicos</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <a 
                href="#procedimentos" 
                className="drawer-nav-link"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  trackProcedureInteraction({ procedureName: 'Seção de Procedimentos', source: 'drawer_link' });
                }}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <span>Procedimentos em Consultório</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <Link 
                to="/lavagem-de-ouvido-rio-branco" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ color: 'var(--accent-gold-dark)', fontWeight: 600 }}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                  <span>Lavagem de Ouvido (Rio Branco)</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </Link>

              <a 
                href="#conteudos-saude" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>Blog Clínico (Destaques & Artigos)</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <a 
                href="#faq" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Dúvidas Frequentes (FAQ)</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>

              <a 
                href="#contato" 
                className="drawer-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="drawer-nav-link-left">
                  <svg className="drawer-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Contato & Localização</span>
                </span>
                <span className="drawer-nav-arrow">&rarr;</span>
              </a>
            </nav>
          </div>

          {/* Botões de Ação Direta no Drawer */}
          <div className="drawer-actions">
            <div className="drawer-nav-section-title" style={{ paddingLeft: 0 }}>Atendimento Rápido</div>
            <Link
              to="/login"
              className="btn-outline-gold"
              style={{ width: '100%', marginBottom: '0.6rem', textAlign: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Área Restrita / Login da Equipe</span>
            </Link>
            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, gostaria de agendar uma consulta com a Dra. Cibele Cristina.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gold" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Agendar Consulta</span>
            </a>

            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar uma Teleconsulta.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline-gold" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              <span>Agendar Teleconsulta</span>
            </a>
          </div>
        </div>

        {/* Rodapé Interno do Drawer */}
        <div className="drawer-footer-info">
          <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>
            {DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}
          </div>
          <div style={{ marginBottom: '0.35rem' }}>
            WhatsApp: <strong>{DOCTOR_INFO.phone}</strong>
          </div>
          <a 
            href={DOCTOR_INFO.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-gold-dark)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
          >
            <span>Bosque — Rio Branco/AC</span>
            <span>➔ Ver no Maps</span>
          </a>
        </div>
      </aside>

      {/* Hero Section */}
      <section id="inicio" className="hero-wrap">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge-tag">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-gold)' }}></span>
              Gente como a gente • Cuidado próximo, humanizado e resolutivo
            </div>
            <h1 className="hero-title">
              Cuidado médico próximo,
              <span>individualizado e baseado em evidências.</span>
            </h1>
            <p className="hero-sub">
              Atendimento médico acolhedor e descomplicado para você e sua família, unindo competência técnica, escuta sincera e simplicidade no dia a dia.
            </p>

            {/* Princípio Diagnóstico e Tempo Dedicado */}
            <div className="duration-statement">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--accent-gold-dark)' }} aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <strong>Diagnóstico com Cuidado:</strong> Uma escuta atenta e uma história clínica detalhada são fundamentais para uma avaliação diagnóstica de qualidade.
            </div>

            <div className="hero-actions">
              <a 
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar um atendimento.')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold"
                onClick={() => trackWhatsAppClick({ location: 'hero_cta', service: 'Consulta Geral', label: 'Agendar Atendimento Hero' })}
              >
                Agendar Atendimento
              </a>
              <a href="#servicos" className="btn-outline-gold">
                Conhecer Serviços
              </a>
            </div>
          </div>

          <div className="hero-image-card">
            <div className="hero-image-wrapper">
              <img 
                src={DOCTOR_INFO.doctorImage} 
                alt="Dra. Cibele Cristina — Médica de Família e Comunidade" 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DOCTOR_INFO.doctorImageFallback;
                }}
              />
            </div>
            <div className="gold-floating-seal">
              <strong>{DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}</strong>
              Especialista em {DOCTOR_INFO.specialty}
            </div>
          </div>
        </div>
      </section>

      {/* Pilares de Cuidado */}
      <section className="section-wrap">
        <div className="section-head">
          <span className="section-kicker">Acolhimento & Simplicidade</span>
          <h2 className="section-title">O que define o nosso cuidado?</h2>
          <p className="section-desc">
            Uma prática médica que não fragmenta o ser humano em partes isoladas. Cuidado próximo, individualizado e baseado em evidências, com respeito ao que você sente e vive.
          </p>
        </div>

        <div className="pillars-grid">
          {/* Pilar 1 */}
          <div className="pillar-card">
            <div className="pillar-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h3>Cuidado Biopsicossocial</h3>
            <p>A saúde vai além do biológico. Analisamos seus hábitos, seu ambiente familiar, seu contexto emocional e profissional para orientar decisões terapêuticas.</p>
          </div>

          {/* Pilar 2 */}
          <div className="pillar-card">
            <div className="pillar-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v8"></path>
                <path d="M8 12h8"></path>
              </svg>
            </div>
            <h3>Prevenção baseada em evidências</h3>
            <p>Solicitação prudente de exames e condutas com base científica sólida, protegendo você de excessos diagnósticos e intervenções desnecessárias.</p>
          </div>

          {/* Pilar 3 */}
          <div className="pillar-card">
            <div className="pillar-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Longitudinalidade & Vínculo</h3>
            <p>Um médico que conhece a sua história ao longo dos anos coordena melhor o seu plano de saúde, tornando as decisões mais assertivas e acolhedoras.</p>
          </div>

          {/* Pilar 4 */}
          <div className="pillar-card">
            <div className="pillar-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>Plano Individualizado</h3>
            <p>Metas pactuadas em conjunto. Você participa ativamente do planejamento do seu próprio bem-estar, com metas reais e sustentáveis no dia a dia.</p>
          </div>
        </div>
      </section>

      {/* Serviços Médicos */}
      <section id="servicos" className="section-wrap" style={{ background: '#F4F6F4', borderRadius: '24px', padding: '4.5rem 2rem' }}>
        <div className="section-head">
          <span className="section-kicker">Cuidado Integral</span>
          <h2 className="section-title">Serviços Médicos</h2>
          <p className="section-desc">Atendimento humanizado e descomplicado, planejado para acolher suas necessidades com clareza, afeto e embasamento científico.</p>
        </div>

        <div className="services-grid">
          {SERVICES.map((srv) => {
            let waAction = 'uma Consulta Médica';
            let btnLabel = 'Agendar Consulta Presencial';

            if (srv.id === 'checkup') {
              waAction = 'um Check-up Individualizado';
              btnLabel = 'Agendar Check-up Individualizado';
            } else if (srv.id === 'cronicos') {
              waAction = 'um acompanhamento de Doenças Crônicas';
              btnLabel = 'Agendar Acompanhamento';
            } else if (srv.id === 'lavagem') {
              waAction = 'uma Lavagem Otológica';
              btnLabel = 'Agendar Lavagem Otológica';
            } else if (srv.id === 'teleconsulta') {
              waAction = 'uma Teleconsulta';
              btnLabel = 'Agendar Consulta Online';
            } else if (srv.id === 'domiciliar') {
              waAction = 'solicitar uma Visita Domiciliar';
              btnLabel = 'Solicitar Visita Domiciliar';
            }

            const waMsg = `Olá, Dra. Cibele! Gostaria de agendar ${waAction}. Poderia me informar a disponibilidade de horários?`;
            const waUrl = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;

            if (srv.isFeatured) {
              return (
                <div 
                  key={srv.id}
                  className="service-card" 
                  style={{ border: '2px solid var(--accent-gold)', background: '#FAF9F5', boxShadow: '0 10px 28px rgba(197, 160, 89, 0.2)' }}
                >
                  <div>
                    <div className="service-tag" style={{ background: '#F4EAD4', color: '#7A5B18', borderColor: 'var(--accent-gold)' }}>
                      {srv.tag}
                    </div>
                    <h3 className="service-title" style={{ color: 'var(--accent)' }}>
                      {srv.title}
                    </h3>
                    <p className="service-desc" style={{ color: '#2D3E38' }}>
                      {srv.desc}
                    </p>
                    <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem' }}>
                      <Link 
                        to="/lavagem-de-ouvido-rio-branco" 
                        style={{ fontSize: '0.85rem', color: 'var(--accent-gold-dark)', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        onClick={() => trackProcedureInteraction({ procedureName: 'Lavagem de Ouvido', source: 'service_featured_link' })}
                      >
                        Página completa sobre Lavagem de Ouvido em Rio Branco &rarr;
                      </Link>
                    </div>
                  </div>
                  <a 
                    href={waUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="service-link" 
                    style={{ color: 'var(--accent-gold-dark)', fontWeight: 700 }} 
                    aria-label={`${btnLabel} via WhatsApp`}
                    onClick={() => trackWhatsAppClick({ location: 'service_card_featured', service: srv.title, label: btnLabel, url: waUrl })}
                  >
                    {btnLabel} &rarr;
                  </a>
                </div>
              );
            }

            return (
              <div key={srv.id} className="service-card">
                <div>
                  <div className="service-tag">{srv.tag}</div>
                  <h3 className="service-title">{srv.title}</h3>
                  <p className="service-desc">{srv.desc}</p>
                </div>
                <a 
                  href={waUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="service-link" 
                  aria-label={`${btnLabel} via WhatsApp`}
                  onClick={() => trackWhatsAppClick({ location: 'service_card', service: srv.title, label: btnLabel, url: waUrl })}
                >
                  {btnLabel} &rarr;
                </a>
              </div>
            );
          })}
        </div>

        {/* Nota Discreta sobre Política de Retorno Médico (Conforme solicitado por Cibele) */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #DCE3DE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '0.95rem' }}>ℹ️</span>
            <span>
              <strong>Política de Retorno Médico:</strong> Quando houver indicação clínica de retorno para avaliação de exames ou reavaliação de conduta, as orientações, prazos e condições são combinados diretamente durante a consulta.
            </span>
          </div>
          <a 
            href="#faq" 
            style={{ color: 'var(--accent-gold-dark)', textDecoration: 'underline', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            Ver nas Perguntas Frequentes &darr;
          </a>
        </div>
      </section>

      {/* Seção de Procedimentos em Consultório */}
      <section id="procedimentos" className="section-wrap" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
        <div className="section-head">
          <span className="section-kicker">Prática Ambulatorial Resolutiva</span>
          <h2 className="section-title">Procedimentos em Consultório</h2>
          <p className="section-desc">
            Além do atendimento clínico integral, realizamos procedimentos médicos ambulatoriais no Bairro Bosque, sempre mediante avaliação clínica e indicação médica prévia.
          </p>
        </div>

        <div className="procedures-grid">
          {OFFICE_PROCEDURES.map((proc) => {
            const waUrl = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(proc.whatsappMessage)}`;
            return (
              <div key={proc.id} className="procedure-card">
                <div>
                  <span className="procedure-badge">{proc.badge}</span>
                  <h3 className="procedure-title">{proc.title}</h3>
                  <p className="procedure-desc">{proc.summary}</p>
                  
                  <div className="procedure-indications">
                    <div className="procedure-indications-title">Indicações Clínicas Comuns</div>
                    <ul>
                      {proc.indications.map((ind, i) => (
                        <li key={i}>{ind}</li>
                      ))}
                    </ul>
                  </div>

                  {proc.externalLink && (
                    <div style={{ marginBottom: '1rem' }}>
                      <Link 
                        to={proc.externalLink}
                        onClick={() => trackProcedureInteraction({ procedureName: proc.title, source: 'procedure_card_link' })}
                        style={{ fontSize: '0.85rem', color: 'var(--accent-gold-dark)', textDecoration: 'underline', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        {proc.externalLinkText || 'Saiba mais →'}
                      </Link>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <a 
                    href={waUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-gold" 
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.65rem 1rem' }}
                    onClick={() => {
                      trackWhatsAppClick({ location: 'procedure_card', service: proc.title, label: proc.ctaText, url: waUrl });
                      trackProcedureInteraction({ procedureName: proc.title, source: 'procedure_whatsapp_btn' });
                    }}
                  >
                    <span>{proc.ctaText}</span>
                    <span>&rarr;</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner de Segurança e Ética Médica CFM */}
        <div className="procedure-ethical-banner">
          <span style={{ fontSize: '1.25rem', color: 'var(--accent-gold-dark)', flexShrink: 0 }}>🛡️</span>
          <div>
            <strong>Critério Clínico e Segurança do Paciente:</strong> Em estrito respeito às diretrizes do CFM, nenhum procedimento é realizado sem consulta médica prévia. A realização de artrocentese, infiltração articular ou lavagem otológica depende de indicação clínica precisa e exame físico prévio realizado pela Dra. Cibele Cristina.
          </div>
        </div>
      </section>

      {/* Sobre a Médica */}
      <section id="sobre" className="about-wrap">
        <div className="section-wrap">
          <div className="about-grid">
            <div className="about-image-wrapper">
              <img 
                src={DOCTOR_INFO.doctorImage} 
                alt={`Dra. Cibele Cristina - Especialista em ${DOCTOR_INFO.specialty}`} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DOCTOR_INFO.doctorImageFallback;
                }}
              />
            </div>

            <div className="about-bio">
              <span className="section-kicker">Sobre a Médica</span>
              <h2 className="section-title">DRA. CIBELE CRISTINA</h2>
              
              <div className="about-creds" style={{ marginBottom: '1.25rem' }}>
                <span className="cred-chip">{DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}</span>
                <span className="cred-chip">Especialista em {DOCTOR_INFO.specialty}</span>
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 700, fontStyle: 'italic', marginBottom: '0.85rem' }}>
                Formação e experiência profissional
              </h4>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.65 }}>
                Graduada em Medicina em Cádiz, Espanha, a Dra. Cibele Cristina construiu parte de sua trajetória profissional na Espanha e em Portugal, vivenciando diferentes realidades e formas de cuidado em saúde.
              </p>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.65 }}>
                No Brasil, atua no Sistema Único de Saúde (SUS) desde 2013, acumulando mais de uma década de experiência no cuidado de pessoas e famílias em diferentes contextos e fases da vida.
              </p>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.65 }}>
                Especialista em Medicina de Família e Comunidade, sua prática une a experiência adquirida ao longo dos anos a um cuidado próximo, individualizado e baseado em evidências — da prevenção e diagnóstico ao tratamento e acompanhamento contínuo da saúde.
              </p>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.65 }}>
                Acredita que uma boa medicina começa pela escuta. Por isso, cada consulta é conduzida com acolhimento, clareza e respeito à realidade de cada paciente.
              </p>

              <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '0.35rem', lineHeight: 1.5 }}>
                Mais do que tratar doenças, seu propósito é cuidar de pessoas.
              </p>

              <p style={{ color: 'var(--accent-gold-dark)', fontWeight: 700, fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.75rem' }}>
                Gente como a gente.
              </p>

              <a 
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, gostaria de agendar uma consulta com a Dra. Cibele.')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold"
                onClick={() => trackWhatsAppClick({ location: 'about_section', service: 'Consulta Médica', label: 'Conversar com a Equipe Sobre' })}
              >
                Conversar com a Equipe no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdos para Cuidar Melhor da sua Saúde (3 Destaques na Home) */}
      <section id="conteudos-saude" className="featured-blog-section">
        <div className="section-wrap" style={{ paddingTop: '4.5rem', paddingBottom: '4rem' }}>
          <div className="section-head">
            <span className="section-kicker">Educação Médica & Prevenção</span>
            <h2 className="section-title" style={{ letterSpacing: '-0.01em' }}>CONTEÚDOS PARA CUIDAR MELHOR DA SUA SAÚDE</h2>
            <p className="section-desc">Informação médica clara e confiável para você e sua família.</p>
          </div>

          {/* OS 3 DESTAQUES (ÚNICOS VISÍVEIS NA HOME) */}
          <div className="featured-grid">
            {FEATURED_HIGHLIGHTS.map((hl) => {
              const waUrl = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(hl.whatsappText)}`;

              return (
                <div 
                  key={hl.id} 
                  className={`featured-card ${hl.isPrimary ? 'primary-highlight' : ''}`}
                  style={hl.procedureHighlight ? { borderColor: 'var(--accent-gold)', boxShadow: '0 10px 24px rgba(197, 160, 89, 0.16)' } : undefined}
                >
                  <div 
                    className="article-media" 
                    onClick={() => openArticleModal({
                      id: hl.id,
                      category: hl.category,
                      title: hl.modalTitle,
                      fullHtml: hl.fullHtml,
                      serviceKey: hl.serviceKey,
                      servicePrompt: hl.servicePrompt
                    })} 
                    role="button" 
                    tabIndex={0} 
                    aria-label={`Abrir artigo ${hl.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        openArticleModal({
                          id: hl.id,
                          category: hl.category,
                          title: hl.modalTitle,
                          fullHtml: hl.fullHtml,
                          serviceKey: hl.serviceKey,
                          servicePrompt: hl.servicePrompt
                        });
                      }
                    }}
                  >
                    <img src={hl.image} alt={hl.alt} loading="lazy" />
                    <span className="article-badge-overlay">{hl.badgeOverlay}</span>
                  </div>

                  <div className="featured-card-content">
                    <div>
                      <div className={`featured-badge ${hl.badgeClass}`}>
                        <span>{hl.badge}</span>
                      </div>
                      <h3 className="featured-title">{hl.title}</h3>
                      <p className="featured-desc">{hl.desc}</p>
                    </div>

                    <div>
                      <div className="author-pill">
                        <img 
                          src={DOCTOR_INFO.doctorImage} 
                          alt={DOCTOR_INFO.name} 
                          className="author-avatar"
                          loading="lazy"
                        />
                        <div className="author-info">
                          <span className="author-name">{DOCTOR_INFO.name}</span>
                          <span className="author-role">{DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}</span>
                        </div>
                      </div>

                      <div className="featured-actions">
                        <a 
                          href={waUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="featured-btn-wa"
                          onClick={() => trackWhatsAppClick({ location: 'featured_article_cta', service: hl.servicePrompt || hl.title, label: hl.whatsappCta, url: waUrl })}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                          </svg>
                          <span>{hl.whatsappCta}</span>
                        </a>
                        <button 
                          type="button" 
                          className="featured-btn-read" 
                          onClick={() => openArticleModal({
                            id: hl.id,
                            category: hl.category,
                            title: hl.modalTitle,
                            fullHtml: hl.fullHtml,
                            serviceKey: hl.serviceKey,
                            servicePrompt: hl.servicePrompt
                          })}
                        >
                          Ler orientação completa &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÃO QUE REVELA TODOS OS DEMAIS ARTIGOS */}
          <div className="featured-footer-cta">
            <button 
              type="button" 
              id="toggleArticlesBtn" 
              className="view-all-link" 
              onClick={toggleAllArticles}
              aria-expanded={showAllArticles}
              aria-controls="todos-artigos"
            >
              <span>{showAllArticles ? 'Ocultar artigos adicionais ↑' : 'Ver todos os artigos →'}</span>
            </button>
            <span id="toggleArticlesNote" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {showAllArticles 
                ? 'Exibindo artigos organizados por categorias clínicas. Clique para recolher.'
                : 'Clique para explorar a biblioteca completa com artigos categorizados (Adulto, Mulher, Criança, Idoso, Prevenção, Ouvido).'}
            </span>
          </div>
        </div>
      </section>

      {/* SEÇÃO COM OS ARTIGOS COMPLEMENTARES CATEGORIZADOS */}
      <section 
        id="todos-artigos" 
        className={`section-wrap ${showAllArticles ? 'is-visible' : ''}`}
        style={{ display: showAllArticles ? 'block' : 'none' }}
      >
        <div className="section-head" style={{ marginTop: '1.5rem' }}>
          <span className="section-kicker">Biblioteca Clínica de Orientações</span>
          <h2 className="section-title">Artigos e Orientações Médicas</h2>
          <p className="section-desc">Conteúdos organizados por fases da vida e áreas de cuidado: Saúde do Adulto, Mulher, Criança, Idoso, Prevenção baseada em evidências e Ouvido.</p>
        </div>

        {/* Barra de Filtros de Categorias */}
        <div className="category-filter-bar" role="tablist" aria-label="Filtrar artigos por categoria">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                className={`cat-filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
                role="tab"
                aria-selected={isActive}
              >
                <span>{cat.label}</span>
                <span className="cat-count-badge">{cat.count}</span>
              </button>
            );
          })}
        </div>

        <div className="articles-grid">
          {displayedArticles.map((artigo) => (
            <article key={artigo.id} className="article-card" data-category={artigo.categoryKey}>
              <div 
                className="article-media" 
                onClick={() => openArticleModal(artigo)} 
                role="button" 
                tabIndex={0} 
                aria-label={`Abrir artigo ${artigo.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') openArticleModal(artigo); }}
              >
                <img 
                  src={artigo.image} 
                  alt={artigo.alt} 
                  loading="lazy" 
                  decoding="async"
                />
                <span className="article-badge-overlay">{artigo.badgeOverlay}</span>
              </div>
              <div className="article-header">
                <span className="article-category">{artigo.category}</span>
                <h3 className="article-title">{artigo.title}</h3>
              </div>
              <div className="article-body">
                <p>{artigo.summary}</p>
              </div>
              <div className="article-cta-strip">
                <a 
                  href={artigo.ctaBookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-book-link"
                  onClick={() => trackWhatsAppClick({ location: 'article_card_cta', service: artigo.servicePrompt || artigo.title, label: artigo.ctaBookText, url: artigo.ctaBookUrl })}
                >
                  <span>{artigo.ctaBookText}</span>
                </a>
              </div>
              <div className="article-footer">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{artigo.readTime}</span>
                <button 
                  type="button" 
                  className="article-read-btn" 
                  onClick={() => openArticleModal(artigo)}
                >
                  Ler artigo completo &rarr;
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ - Dúvidas Frequentes */}
      <section id="faq" className="section-wrap" style={{ background: '#FAFBF9', borderTop: '1px solid var(--border)' }}>
        <div className="section-head">
          <span className="section-kicker">Tire suas Dúvidas</span>
          <h2 className="section-title">Perguntas Frequentes</h2>
          <p className="section-desc">Transparência e clareza sobre o processo de atendimento e acompanhamento clínico.</p>
        </div>

        <div className="faq-container">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div key={item.id} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <button 
                  className="faq-question" 
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(item.id)}
                  type="button"
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">+</span>
                </button>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contato & Localização */}
      <section id="contato" className="section-wrap">
        <div className="contact-card-box">
          
          {/* Painel Esquerdo */}
          <div className="contact-info-panel">
            <div>
              <h3>Atendimento e Localização</h3>
              <p>Entre em contato para agendar seu atendimento presencial, domiciliar ou teleconsulta.</p>
              
              <div className="contact-detail-row">
                <div className="contact-icon-box" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <h4>Endereço (Clique para abrir rota)</h4>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.15rem', marginBottom: '0.25rem' }}>
                    Clínica Medicinarte
                  </div>
                  <a 
                    href={DOCTOR_INFO.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="map-interactive-link" 
                    title="Abrir localização da Clínica Medicinarte no Google Maps e iniciar rota"
                  >
                    Rua Antunes de Alencar, 152 – Bosque<br />
                    Rio Branco / AC &nbsp;<span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>➔ Ver no Maps</span>
                  </a>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="contact-icon-box" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-detail-text">
                  <h4>WhatsApp Oficial</h4>
                  <span>{DOCTOR_INFO.phone}</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#A4BCB3', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.25rem' }}>
              Atendimento mediante agendamento prévio.
            </div>
          </div>

          {/* Painel Direito: Formulário com Redirecionamento Direto */}
          <div className="contact-action-panel">
            <div className="booking-callout">
              <img 
                src="/logo.png" 
                alt="Logo Dra. Cibele Cristina" 
                className="w-14 h-14 rounded-2xl object-contain bg-[#FAF8F5] p-1 border border-[#C5A059]/40 shadow-sm mx-auto mb-4 block"
              />
              <h4 id="inicie-plano">Inicie seu plano de cuidado</h4>
              <p style={{ marginBottom: '1.25rem' }}>
                Selecione o serviço e informe seu nome para abrir o WhatsApp com mensagem pré-preenchida.
              </p>

              <form onSubmit={handleFormSubmit} style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label htmlFor="userName" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text)' }}>
                    Seu Nome Completo <span style={{ color: '#C53030' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    id="userName" 
                    name="userName" 
                    required
                    placeholder="Digite seu nome completo (ex: Maria da Silva)" 
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (formError) setFormError('');
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 0.9rem', 
                      border: formError ? '1.5px solid #E53E3E' : '1px solid var(--border)', 
                      borderRadius: '8px', 
                      fontSize: '0.95rem', 
                      fontFamily: 'inherit', 
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {formError && (
                    <span style={{ display: 'block', color: '#C53030', fontSize: '0.78rem', marginTop: '0.3rem', fontWeight: 500 }}>
                      {formError}
                    </span>
                  )}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="userService" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text)' }}>
                    Serviço Desejado <span style={{ color: '#C53030' }}>*</span>
                  </label>
                  <select 
                    id="userService" 
                    name="userService" 
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 0.9rem', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem', fontFamily: 'inherit', background: '#FFF', boxSizing: 'border-box' }}
                  >
                    <option value="Consulta Médica">Consulta Médica Presencial</option>
                    <option value="Check-up Individualizado">Check-up Individualizado</option>
                    <option value="Doenças Crônicas">Acompanhamento de Doenças Crônicas</option>
                    <option value="Lavagem Otológica">Lavagem Otológica (Remoção de Cerúmen)</option>
                    <option value="Artrocentese Articular">Artrocentese Articular (sob indicação médica)</option>
                    <option value="Infiltração Articular">Infiltração Articular / Periarticular (sob indicação médica)</option>
                    <option value="Teleconsulta">Teleconsulta por Vídeo</option>
                    <option value="Visita Domiciliar">Visita Domiciliar em Rio Branco</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  id="submitBtn" 
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(197, 160, 89, 0.35)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                  </svg>
                  <span>Agendar Agora no WhatsApp</span>
                </button>

                {/* Mensagem de Sucesso Instantânea */}
                {formSuccess && (
                  <div 
                    id="formSuccessAlert" 
                    style={{ marginTop: '0.85rem', padding: '0.75rem 1rem', borderRadius: '8px', background: '#E8F5E9', border: '1px solid #A5D6A7', color: '#1B5E20', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600 }}
                  >
                    ✓ WhatsApp aberto com seu nome e serviço pré-preenchidos! Basta tocar em Enviar.
                  </div>
                )}

                {/* Conformidade LGPD/Privacidade */}
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '0.85rem', textAlign: 'center' }}>
                  Tratamento de dados em conformidade com a LGPD e sigilo ético profissional. Conheça nossa <Link to="/privacidade" style={{ color: 'var(--accent-gold-dark)', textDecoration: 'underline' }}>Política de Privacidade</Link>.
                </p>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Ou fale direto:</span>
                <a 
                  href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de informações sobre atendimento.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
                  onClick={() => trackWhatsAppClick({ location: 'form_direct_call', service: 'Consulta Geral', label: 'Telefone Direto' })}
                >
                  {DOCTOR_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Leitura de Artigos */}
      {selectedArticle && (
        <div 
          id="articleModal" 
          className="article-modal active" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === 'articleModal') {
              setSelectedArticle(null);
            }
          }}
        >
          <div className="modal-content-card">
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedArticle(null)} 
              aria-label="Fechar artigo"
              type="button"
            >
              &times;
            </button>
            <div className="article-category">{selectedArticle.category}</div>
            <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {selectedArticle.title}
            </h3>
            <div 
              style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem' }}
              dangerouslySetInnerHTML={{ __html: selectedArticle.fullHtml }}
            />
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', background: '#FAFBF9', padding: '1.25rem', borderRadius: '12px' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--accent)', fontSize: '0.95rem' }}>
                  Precisa de orientação ou atendimento?
                </strong>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  A Dra. Cibele Cristina está pronta para acolher você e sua família.
                </span>
              </div>
              <a 
                id="modalWhatsAppLink"
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(`Olá, Dra. Cibele! Li o artigo "${selectedArticle.title}" e gostaria de agendar um atendimento de ${selectedArticle.servicePrompt ? selectedArticle.servicePrompt : (selectedArticle.serviceKey || 'atendimento')}.`)}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold" 
                style={{ fontSize: '0.875rem', padding: '0.6rem 1.15rem' }}
                onClick={() => trackWhatsAppClick({ location: 'article_modal', service: selectedArticle.servicePrompt || selectedArticle.title, label: 'Agendar pelo WhatsApp no Modal' })}
              >
                Agendar pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Botão Voltar ao Topo da Página */}
      <button
        type="button"
        id="backToTopBtn"
        className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>

      {/* Botão Flutuante de WhatsApp Oficial (Ativação 1 Clique) */}
      <a 
        href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de tirar uma dúvida e agendar uma consulta.')}`}
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float-btn" 
        aria-label="Falar com a Dra. Cibele no WhatsApp" 
        title="Falar com a Dra. Cibele no WhatsApp"
        onClick={() => trackWhatsAppClick({ location: 'floating_button', service: 'Consulta Geral', label: 'Botão Flutuante de WhatsApp' })}
      >
        <span className="whatsapp-float-badge">Online</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
        </svg>
      </a>

      {/* Rodapé Oficial com 4 Colunas */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img 
                src="/logo.png" 
                alt="Logo Dra. Cibele Cristina" 
                className="w-10 h-10 rounded-xl object-contain bg-[#FAF8F5] p-0.5 border border-[#C5A059]/40 shrink-0"
              />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                {DOCTOR_INFO.name}
              </span>
            </div>
            <p>
              <strong>{DOCTOR_INFO.name} — Médica de Família e Comunidade</strong><br />
              {DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}
            </p>
            <p style={{ fontSize: '0.825rem', color: '#95ACA2', lineHeight: 1.5, marginTop: '0.4rem' }}>
              <strong>MEDICINARTE SERVIÇOS MÉDICOS LTDA</strong><br />
              Registro no CRM: CRM-AC PJ 258<br />
              Dra. Cibele Cristina — CRM-AC 1810 / RQE 1078
            </p>
            <p style={{ fontSize: '0.78rem', color: '#849E93', marginTop: '0.6rem' }}>
              Tratamento ético e seguro de dados em conformidade com a LGPD e o Código de Ética Médica.
            </p>
          </div>

          <div className="footer-col">
            <h5>Serviços & Procedimentos</h5>
            <a href="#servicos">Consulta Médica</a>
            <a href="#servicos">Check-up Individualizado</a>
            <a href="#servicos">Doenças Crônicas</a>
            <a href="#procedimentos" onClick={() => trackProcedureInteraction({ procedureName: 'Procedimentos em Consultório', source: 'footer_link' })}>
              Procedimentos em Consultório
            </a>
            <Link 
              to="/lavagem-de-ouvido-rio-branco" 
              style={{ color: 'var(--accent-gold)', fontWeight: 600 }}
              onClick={() => trackProcedureInteraction({ procedureName: 'Lavagem de Ouvido', source: 'footer_link_lavagem' })}
            >
              Lavagem de Ouvido em Rio Branco ↗
            </Link>
            <a href="#servicos">Teleconsulta (Brasil)</a>
            <a href="#servicos">Visita Domiciliar em Rio Branco</a>
            <Link to="/privacidade" style={{ marginTop: '0.6rem', color: '#95ACA2', textDecoration: 'underline', fontSize: '0.85rem' }}>
              Política de Privacidade (LGPD)
            </Link>
          </div>

          <div className="footer-col">
            <h5>Navegação</h5>
            <a href="#sobre">Sobre a Médica</a>
            <a href="#servicos">Serviços Clínicos</a>
            <a href="#procedimentos">Procedimentos</a>
            <a href="#conteudos-saude">Conteúdos & Blog de Saúde</a>
            <a href="#faq">Perguntas Frequentes</a>
            <a href="#contato">Agendamento</a>
            <Link to="/privacidade">Canal de Privacidade</Link>
            <Link to="/login" style={{ color: '#C5A059', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🔒</span>
              <span>Área Restrita / Login da Equipe</span>
            </Link>
          </div>

          <div className="footer-col">
            <h5>Localização & Contato</h5>
            <p>
              <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                Clínica Medicinarte
              </strong>
              <a 
                href={DOCTOR_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'inline', color: '#FFFFFF', textDecoration: 'underline', textUnderlineOffset: '3px' }} 
                title="Abrir rota no Google Maps"
              >
                Rua Antunes de Alencar, 152<br />
                Bairro Bosque — Rio Branco/AC<br />
                CEP: 69900-364 ↗
              </a>
            </p>
            <p>
              <a 
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar um atendimento.')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--accent-gold)', fontWeight: 600 }}
                onClick={() => trackWhatsAppClick({ location: 'footer_whatsapp', service: 'Consulta Geral', label: 'WhatsApp Rodapé' })}
              >
                WhatsApp: {DOCTOR_INFO.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MEDICINARTE SERVIÇOS MÉDICOS LTDA • Dra. Cibele Cristina (CRM-AC 1810 | RQE 1078). Informações em conformidade com as diretrizes do Conselho Federal de Medicina (CFM) e Lei Geral de Proteção de Dados (LGPD).</p>
        </div>
      </footer>

    </div>
  );
}
