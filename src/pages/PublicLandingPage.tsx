import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DOCTOR_INFO, 
  PILLARS, 
  SERVICES, 
  ARTICLES, 
  FEATURED_HIGHLIGHTS,
  FAQ_ITEMS, 
  ArticleData 
} from '../data/medicinarteData';

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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [formName, setFormName] = useState('');
  const [formService, setFormService] = useState('Consulta Médica');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const currentYear = new Date().getFullYear();

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
    const message = `Olá Dra. Cibele! Gostaria de agendar um ${formService}. Meu nome completo é: ${trimmedName} e tenho interesse no serviço de: ${formService}.`;
    const url = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Redirecionamento instantâneo dentro do evento de clique para prevenir bloqueio por popup blocker
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAF8] text-[#192723]">
      
      {/* Barra Oficial de Conformidade Ética CFM */}
      <div className="compliance-bar" role="region" aria-label="Identificação Profissional">
        <strong>{DOCTOR_INFO.name}</strong> — Médica, {DOCTOR_INFO.crm} | Especialista em {DOCTOR_INFO.specialty}, {DOCTOR_INFO.rqe}
      </div>

      {/* Header Fixo de Navegação */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#inicio" className="brand-wrap" aria-label={`Página Inicial - ${DOCTOR_INFO.name}`}>
            <div className="monogram-badge" aria-hidden="true">
              <span className="monogram-text">CC</span>
              <svg className="monogram-heart" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div className="brand-titles">
              <span className="brand-name">
                <span className="dr-prefix">{DOCTOR_INFO.prefix}</span>Cibele Cristina
              </span>
              <span className="brand-sub">{DOCTOR_INFO.specialty}</span>
            </div>
          </a>

          {/* Navegação Desktop */}
          <nav className="header-nav" aria-label="Navegação Principal">
            <a href="#sobre" className="nav-link">Sobre</a>
            <a href="#servicos" className="nav-link">Serviços</a>
            <a href="#conteudos-saude" className="nav-link">Blog</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#contato" className="nav-link">Contato</a>
          </nav>

          {/* Botões de Ação Desktop */}
          <div className="header-desktop-actions">
            <Link
              to="/sistema"
              className="btn-outline-gold"
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.95rem' }}
              title="Acessar Sistema de Gestão Clínica"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Sistema Clínico
            </Link>
            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar uma Teleconsulta.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline-gold" 
              style={{ fontSize: '0.85rem', padding: '0.55rem 0.95rem' }} 
              title="Agendar Teleconsulta Online"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Teleconsulta
            </a>
            <a 
              href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, gostaria de agendar uma consulta com a Dra. Cibele Cristina.')}`}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gold" 
              aria-label="Agendar via WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
            <div className="monogram-badge" style={{ width: '38px', height: '38px' }} aria-hidden="true">
              <span className="monogram-text" style={{ fontSize: '0.9rem' }}>CC</span>
              <svg className="monogram-heart" viewBox="0 0 24 24" style={{ width: '7px', height: '7px' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
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
              to="/sistema"
              className="btn-outline-gold"
              style={{ width: '100%', marginBottom: '0.6rem', textAlign: 'center', justifyContent: 'center' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Acessar Sistema Clínico
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
            <h3>Prevenção Racional</h3>
            <p>Solicitação prudente de exames e tratamentos baseados em evidências sólidas, protegendo você de excessos diagnósticos e intervenções desnecessárias.</p>
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
              waAction = 'um Check-up';
              btnLabel = 'Agendar Check-up Racional';
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

            const waMsg = `Olá Dra. Cibele! Gostaria de agendar ${waAction}. Tenho interesse no serviço de: ${srv.title}. Poderia me informar a disponibilidade de horários?`;
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
                  </div>
                  <a 
                    href={waUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="service-link" 
                    style={{ color: 'var(--accent-gold-dark)', fontWeight: 700 }} 
                    aria-label={`${btnLabel} via WhatsApp`}
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
                >
                  {btnLabel} &rarr;
                </a>
              </div>
            );
          })}
        </div>

        {/* Regra de Retorno Padronizada Transparente */}
        <div style={{ marginTop: '2.5rem', background: '#FFFFFF', border: '1.5px dashed var(--accent-gold)', borderRadius: '16px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FAF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-gold-dark)', fontSize: '1.3rem', flexShrink: 0 }}>
              ℹ️
            </div>
            <div>
              <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--accent)', fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                Política Transparente sobre Retorno Médico
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Quando houver indicação clínica de retorno para avaliação de exames solicitados ou reavaliação de conduta, as orientações, prazos e condições serão combinados com total clareza durante o atendimento.
              </p>
            </div>
          </div>
          <a 
            href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá Dra. Cibele! Gostaria de tirar uma dúvida sobre os serviços médicos.')}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-outline-gold" 
            style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
          >
            Tirar Dúvida no WhatsApp
          </a>
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
              <span className="section-kicker">Trajetória Profissional</span>
              <h2 className="section-title">Dra. Cibele Cristina</h2>
              
              <div className="about-creds">
                <span className="cred-chip">{DOCTOR_INFO.crm}</span>
                <span className="cred-chip">{DOCTOR_INFO.rqe}</span>
                <span className="cred-chip">Especialista em {DOCTOR_INFO.specialty}</span>
              </div>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                A Dra. Cibele Cristina acredita que uma boa medicina começa com simplicidade, acolhimento e escuta sincera. Seu trabalho é guiado pelo lema de ser <em>gente como a gente</em>: uma médica próxima, presente e dedicada a entender a realidade de cada paciente e família.
              </p>

              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Como especialista em Medicina de Família e Comunidade, oferece um cuidado médico próximo, individualizado e baseado em evidências, orientando desde a prevenção no dia a dia até o acompanhamento contínuo de condições de saúde ao longo dos anos.
              </p>

              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Aqui você encontra um espaço onde suas dúvidas são ouvidas com calma e respeito. Sem palavras difíceis ou distanciamento: apenas cuidado competente, humanizado e focado no que realmente melhora o seu bem-estar.
              </p>

              <a 
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, gostaria de agendar uma conversa com a Dra. Cibele.')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold"
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
                    onClick={() => setSelectedArticle({
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
                        setSelectedArticle({
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
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
                          </svg>
                          <span>{hl.whatsappCta}</span>
                        </a>
                        <button 
                          type="button" 
                          className="featured-btn-read" 
                          onClick={() => setSelectedArticle({
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
                ? 'Exibindo todos os 18 artigos do ecossistema médico. Clique para recolher.'
                : 'Clique para abrir a grade completa com os outros 15 artigos (totalizando 18 do ecossistema)'}
            </span>
          </div>
        </div>
      </section>

      {/* SEÇÃO COM OS 15 ARTIGOS COMPLEMENTARES (OCULTA POR PADRÃO, ABRE NO MESMO LINK/PÁGINA) */}
      <section 
        id="todos-artigos" 
        className={`section-wrap ${showAllArticles ? 'is-visible' : ''}`}
        style={{ display: showAllArticles ? 'block' : 'none' }}
      >
        <div className="section-head" style={{ marginTop: '1.5rem' }}>
          <span className="section-kicker">Ecossistema Completo • 18 Artigos</span>
          <h2 className="section-title">Biblioteca Clínica & Artigos Complementares</h2>
          <p className="section-desc">Conversas acolhedoras, claras e resolutivas sobre Lavagem Otológica, audição, prevenção, cuidados na infância e terceira idade.</p>
        </div>

        <div className="articles-grid">
          {ARTICLES.map((artigo) => (
            <article key={artigo.id} className="article-card">
              <div 
                className="article-media" 
                onClick={() => setSelectedArticle(artigo)} 
                role="button" 
                tabIndex={0} 
                aria-label={`Abrir artigo ${artigo.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedArticle(artigo); }}
              >
                <img 
                  src={artigo.image} 
                  alt={artigo.alt} 
                  loading="lazy" 
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
                >
                  <span>{artigo.ctaBookText}</span>
                </a>
              </div>
              <div className="article-footer">
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{artigo.readTime}</span>
                <button 
                  type="button" 
                  className="article-read-btn" 
                  onClick={() => setSelectedArticle(artigo)}
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
                  <a 
                    href={DOCTOR_INFO.googleMapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="map-interactive-link" 
                    title="Abrir localização no Google Maps e iniciar rota"
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
              <div className="monogram-badge" style={{ margin: '0 auto 1.25rem', width: '52px', height: '52px' }}>
                <span className="monogram-text" style={{ fontSize: '1.2rem' }}>CC</span>
                <svg className="monogram-heart" viewBox="0 0 24 24" style={{ width: '10px', height: '10px' }}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
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
                    <option value="Consulta Médica">Consulta Médica</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Doenças Crônicas">Doenças Crônicas</option>
                    <option value="Lavagem Otológica">Lavagem Otológica (Procedimento em Destaque)</option>
                    <option value="Teleconsulta">Teleconsulta</option>
                    <option value="Visita Domiciliar">Visita Domiciliar</option>
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
                  Seus dados serão tratados com total confidencialidade e utilizados exclusivamente para agendamento médico, conforme a LGPD.
                </p>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Ou fale direto:</span>
                <a 
                  href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de informações sobre atendimento.')}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div className="monogram-badge" style={{ width: '36px', height: '36px' }}>
                <span className="monogram-text" style={{ fontSize: '0.85rem' }}>CC</span>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                {DOCTOR_INFO.name}
              </span>
            </div>
            <p>
              <strong>{DOCTOR_INFO.name} — Médica, {DOCTOR_INFO.crm} | Especialista em {DOCTOR_INFO.specialty}, {DOCTOR_INFO.rqe}.</strong>
            </p>
            <p style={{ fontSize: '0.825rem', color: '#95ACA2' }}>
              Compromisso ético com a saúde integral, respeito à autonomia do paciente e prática baseada nas melhores evidências científicas.
            </p>
          </div>

          <div className="footer-col">
            <h5>Serviços</h5>
            <a href="#servicos">Consulta Médica</a>
            <a href="#servicos">Check-up</a>
            <a href="#servicos">Doenças Crônicas</a>
            <a href="#servicos">Lavagem Otológica</a>
            <a href="#servicos">Teleconsulta</a>
            <a href="#servicos">Visita Domiciliar</a>
          </div>

          <div className="footer-col">
            <h5>Navegação</h5>
            <a href="#sobre">Sobre a Médica</a>
            <a href="#servicos">Serviços Clínicos</a>
            <a href="#conteudos-saude">Conteúdos & Blog de Saúde</a>
            <a href="#faq">Perguntas Frequentes</a>
            <a href="#contato">Agendamento</a>
          </div>

          <div className="footer-col">
            <h5>Localização</h5>
            <p>
              <a 
                href={DOCTOR_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'inline', color: '#FFFFFF', textDecoration: 'underline', textUnderlineOffset: '3px' }} 
                title="Abrir rota no Google Maps"
              >
                Rua Antunes de Alencar, 152<br />
                Bairro Bosque — Rio Branco/AC ↗
              </a>
            </p>
            <p>
              <a 
                href={`https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele. Gostaria de agendar um atendimento.')}`}
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: 'var(--accent-gold)', fontWeight: 600 }}
              >
                WhatsApp: {DOCTOR_INFO.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} {DOCTOR_INFO.name}. Todos os direitos reservados. Informações em conformidade com as diretrizes do Conselho Federal de Medicina (CFM).</p>
        </div>
      </footer>

    </div>
  );
}
