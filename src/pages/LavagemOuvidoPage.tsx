import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOCTOR_INFO } from '../data/medicinarteData';

export function LavagemOuvidoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Lavagem de Ouvido em Rio Branco - AC | Dra. Cibele Cristina";
    window.scrollTo(0, 0);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Lavagem de ouvido e remoção segura de cerúmen em Rio Branco - AC com a Dra. Cibele Cristina (CRM-AC 1810 | RQE 1078). Procedimento indolor com avaliação por otoscópio no Bairro Bosque.');
    }
  }, []);

  const faqs = [
    {
      q: "A lavagem de ouvido dói?",
      a: "Não! O procedimento é praticamente indolor quando realizado com a técnica correta e o preparo prévio adequado. Utilizamos água morna filtrada/estéril à temperatura corporal para evitar qualquer sensação de vertigem ou desconforto, proporcionando alívio imediato da sensação de tampão."
    },
    {
      q: "Preciso preparar o ouvido antes de comparecer ao consultório?",
      a: "Sim, é altamente recomendável. Muitas vezes a cera está ressecada e compactada contra as paredes do canal auditivo. A aplicação prévia de gotas ceruminolíticas por 3 a 5 dias antes do procedimento amolece a rolha, permitindo que a remoção seja rápida, suave e sem atrito no conduto."
    },
    {
      q: "Por que não devo usar cotonetes para tentar desentupir?",
      a: "O cotonete (haste flexível) tem diâmetro similar ao do canal do ouvido. Ao inseri-lo, a maior parte do cerúmen é empurrada ainda mais para o fundo, compactando-se contra a membrana timpânica. Além disso, há risco de ferimentos no conduto, infecções fúngicas e até perfuração do tímpano."
    },
    {
      q: "Crianças e idosos podem realizar a lavagem de ouvido?",
      a: "Sim. Em idosos, a produção de cera tende a ser mais seca, sendo uma causa muito frequente de perda auditiva reversível. Em crianças, realizamos avaliação cuidadosa e lúdica para certificar a colaboração e a ausência de otites ativas antes de qualquer intervenção."
    },
    {
      q: "O que acontece se a causa do ouvido tampado não for cera?",
      a: "Essa é a grande vantagem de realizar o procedimento com uma Médica de Família. Antes de qualquer irrigação, realizamos a otoscopia detalhada. Se o ouvido estiver tampado por sinusite, disfunção da tuba auditiva, otite média ou barotrauma, você receberá o diagnóstico correto e o tratamento medicamentoso apropriado, evitando procedimentos desnecessários."
    }
  ];

  const waBookingUrl = `https://wa.me/${DOCTOR_INFO.whatsappNumber}?text=${encodeURIComponent('Olá, Dra. Cibele! Gostaria de agendar uma avaliação e Lavagem de Ouvido no consultório em Rio Branco.')}`;

  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header com Navegação */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-brand" aria-label="Voltar para a página inicial">
            <div className="monogram-badge">
              <span className="monogram-text">CC</span>
            </div>
            <div className="brand-text">
              <span className="brand-name">{DOCTOR_INFO.name}</span>
              <span className="brand-subtitle">{DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm}</span>
            </div>
          </Link>

          <nav className="header-nav" aria-label="Navegação do Procedimento">
            <Link to="/" className="nav-link">← Início</Link>
            <a href="#procedimento" className="nav-link">O Procedimento</a>
            <a href="#preparo" className="nav-link">Preparo Prévio</a>
            <a href="#localizacao" className="nav-link">Localização</a>
            <a href="#faq" className="nav-link">Dúvidas Frequentes</a>
          </nav>

          <a 
            href={waBookingUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-gold header-cta"
            aria-label="Agendar Lavagem no WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
            </svg>
            <span>Agendar no WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section Específica para Lavagem de Ouvido */}
      <section className="hero-section" style={{ padding: '3.5rem 1.5rem 3rem' }}>
        <div className="hero-content" style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#F4EAD4', color: '#7A5B18', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.825rem', fontWeight: 700, border: '1px solid #C5A059', marginBottom: '1.25rem' }}>
            <span>📍 Procedimento Ambulatorial em Rio Branco - AC • Bairro Bosque</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--accent)', lineHeight: 1.2, marginBottom: '1.25rem' }}>
            Lavagem de Ouvido em Rio Branco - AC
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Alívio imediato da sensação de ouvido tapado, som abafado e perda auditiva causada por excesso de cerúmen. Procedimento médico seguro, higiênico e indolor realizado pela <strong>Dra. Cibele Cristina</strong> no consultório da Medicinarte.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <span style={{ background: '#FFF', border: '1px solid var(--border)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>✓ Avaliação Prévia com Otoscópio</span>
            <span style={{ background: '#FFF', border: '1px solid var(--border)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>✓ Técnica Suave com Água Morna</span>
            <span style={{ background: '#FFF', border: '1px solid var(--border)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>✓ Orientação de Preparo Prévio</span>
            <span style={{ background: '#FFF', border: '1px solid var(--border)', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>✓ CRM-AC 1810 | RQE 1078</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href={waBookingUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gold" 
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', boxShadow: '0 6px 20px rgba(197, 160, 89, 0.4)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
              </svg>
              <span>Agendar Avaliação no WhatsApp</span>
            </a>

            <a 
              href="#preparo" 
              className="btn-outline" 
              style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem' }}
            >
              Como Funciona o Preparo
            </a>
          </div>

        </div>
      </section>

      {/* Sintomas Comuns */}
      <section id="procedimento" className="section-wrap" style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-kicker">Quando Procurar Ajuda Médica?</span>
          <h2 className="section-title">Sintomas Típicos de Excesso de Cera no Ouvido</h2>
          <p className="section-desc">O cerúmen é essencial para proteger o ouvido de poeira e microrganismos. Porém, quando se acumula e forma uma rolha, os seguintes sinais costumam surgir:</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="pillar-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>👂</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 700 }}>Sensação de Ouvido Tampado</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Sensação incômoda de estar sob a água ou de pressão interna no conduto auditivo.</p>
          </div>

          <div className="pillar-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🏊</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 700 }}>Ouvido Entupido Pós-Banho</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Após banho de rio, piscina ou chuveiro, a água expande o cerúmen e obstrui completamente o canal.</p>
          </div>

          <div className="pillar-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🔈</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 700 }}>Som Abafado & Diminuição da Audição</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Dificuldade para ouvir conversas, assistir à televisão ou sensação de eco ao falar.</p>
          </div>

          <div className="pillar-card" style={{ padding: '1.75rem' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>🔔</div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--accent)', marginBottom: '0.5rem', fontWeight: 700 }}>Zumbido Suave ou Coceira</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Ruído constante de intensidade leve e coceira interna pelo atrito da cera seca.</p>
          </div>
        </div>
      </section>

      {/* O Perigo do Cotonete e Como é o Procedimento Seguro */}
      <section style={{ background: '#FAF8F5', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: '#FEE2E2', color: '#991B1B', padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⚠️ Alerta Médico Importante
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', color: 'var(--accent)', lineHeight: 1.3, marginBottom: '1rem' }}>
                Por que você nunca deve tentar retirar a cera com cotonetes?
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Ao introduzir cotonetes ou grampos no ouvido, você atua como um êmbolo de seringa: uma pequena parte do cerúmen sai, mas <strong>a grande maioria é empurrada para o fundo</strong>, compactando-se contra a membrana do tímpano.
              </p>
              <ul style={{ fontSize: '0.9rem', color: '#2D3E38', lineHeight: 1.8, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                <li>Risco de perfuração timpânica irreversível.</li>
                <li>Ferimentos na pele sensível do conduto e dor aguda.</li>
                <li>Proliferação de bactérias e fungos (otite externa comum no clima do Acre).</li>
              </ul>
            </div>

            <div style={{ background: '#FFF', border: '2px solid #C5A059', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 24px rgba(197, 160, 89, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold-dark)', fontWeight: 800, marginBottom: '0.5rem' }}>
                <span>★ A Abordagem Médica Segura</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '1rem', fontWeight: 700 }}>
                Como a Dra. Cibele realiza a remoção em consultório
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                <strong>1. Otoscopia Diagnóstica:</strong> Avaliação visual de toda a anatomia do canal e verificação da integridade do tímpano.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                <strong>2. Lavagem com Água Morna:</strong> Irrigação suave com água na temperatura exata do corpo (37°C), evitando tonturas.
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                <strong>3. Inspeção Final e Alívio:</strong> Reavaliação imediata para confirmar que o canal está totalmente livre e limpo.
              </p>
              <a 
                href={waBookingUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-gold" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.95rem' }}
              >
                Agendar Lavagem em Rio Branco
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Preparo Prévio com Ceruminolítico */}
      <section id="preparo" className="section-wrap" style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ background: '#F4F6F4', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem 2rem' }}>
          <span className="section-kicker" style={{ color: 'var(--accent-gold-dark)' }}>Passo Crucial para o Sucesso</span>
          <h2 className="section-title" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
            O Preparo Prévio em Casa
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Para que a lavagem de ouvido seja <strong>completamente rápida, suave e sem incômodo</strong>, a rolha de cerúmen precisa ser previamente hidratada e amolecida.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>1. Contato Inicial no WhatsApp</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Ao agendar, informe seus sintomas para receber a orientação prévia adequada.
              </p>
            </div>

            <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>2. Aplicação de Gotas Ceruminolíticas</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Pingar as gotas recomendadas por 3 a 5 dias antes da data marcada para amolecer o cerúmen.
              </p>
            </div>

            <div style={{ background: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '0.25rem' }}>3. Procedimento Rápido no Bosque</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                No consultório, a lavagem ocorre de forma fluida, sem dor e com resultado imediato.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <a 
              href={waBookingUrl}
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-gold" 
              style={{ display: 'inline-flex', padding: '0.8rem 1.75rem' }}
            >
              Tirar Dúvidas sobre o Preparo no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Localização em Rio Branco */}
      <section id="localizacao" style={{ background: '#FFFFFF', padding: '3.5rem 1.5rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <span className="section-kicker">Atendimento Presencial no Acre</span>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Consultório Médico no Bairro Bosque — Rio Branco / AC
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Localizado com fácil acesso, estacionamento e ambiente acolhedor.
          </p>

          <div style={{ background: '#F8F9FA', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', display: 'inline-block', maxWidth: '600px', width: '100%', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
              MEDICINARTE SERVIÇOS MÉDICOS LTDA
            </p>
            <p style={{ fontSize: '0.95rem', color: '#2D3E38', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              📍 <strong>Rua Antunes de Alencar, 152 — Bairro Bosque</strong><br />
              Rio Branco - AC • CEP: 69900-364
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              CRM-AC PJ 258 • Diretora Técnica: Dra. Cibele Cristina (CRM-AC 1810 | RQE 1078)
            </p>
            <a 
              href={DOCTOR_INFO.googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>Abrir Rota no Google Maps ↗</span>
            </a>
          </div>

        </div>
      </section>

      {/* FAQ Específico */}
      <section id="faq" className="section-wrap" style={{ maxWidth: '850px', margin: '0 auto', padding: '3.5rem 1.5rem' }}>
        <div className="section-head" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="section-kicker">Tire suas dúvidas</span>
          <h2 className="section-title">Perguntas Frequentes sobre Lavagem Otológica</h2>
        </div>

        <div className="faq-list">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <button 
                  type="button" 
                  className="faq-question" 
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{f.q}</span>
                  <span className="faq-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ background: 'var(--accent)', color: '#FFFFFF', padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: '#FFFFFF', marginBottom: '1rem' }}>
            Recupere o Conforto e a Clareza da sua Audição
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#DCE7E5', lineHeight: 1.7, marginBottom: '2rem' }}>
            Agende sua avaliação médica para remoção de cerúmen com a Dra. Cibele Cristina no Bairro Bosque em Rio Branco.
          </p>
          <a 
            href={waBookingUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-gold" 
            style={{ padding: '1rem 2.25rem', fontSize: '1.1rem', boxShadow: '0 6px 20px rgba(0,0,0,0.3)' }}
          >
            Falar com a Dra. Cibele no WhatsApp
          </a>
        </div>
      </section>

      {/* Rodapé Técnico & Ético */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div className="monogram-badge" style={{ width: '36px', height: '36px' }}>
                <span className="monogram-text" style={{ fontSize: '0.85rem' }}>CC</span>
              </div>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 700 }}>
                MEDICINARTE
              </span>
            </div>
            <p>
              <strong>{DOCTOR_INFO.name} — Médica de Família e Comunidade</strong><br />
              {DOCTOR_INFO.crm} | {DOCTOR_INFO.rqe}
            </p>
            <p style={{ fontSize: '0.825rem', color: '#95ACA2', lineHeight: 1.5 }}>
              <strong>MEDICINARTE SERVIÇOS MÉDICOS LTDA</strong><br />
              Registro no CRM: CRM-AC PJ 258<br />
              Diretora Técnica Médica: Dra. Cibele Cristina — CRM-AC 1810 / RQE 1078
            </p>
            <p style={{ fontSize: '0.8rem', color: '#849E93', marginTop: '0.75rem' }}>
              Tratamento de dados em conformidade com a LGPD e sigilo ético profissional.
            </p>
          </div>

          <div className="footer-col">
            <h5>Navegação</h5>
            <Link to="/">Página Inicial do Site</Link>
            <Link to="/#servicos">Todos os Serviços</Link>
            <Link to="/#conteudos-saude">Blog de Saúde</Link>
            <Link to="/privacidade">Política de Privacidade (LGPD)</Link>
          </div>

          <div className="footer-col">
            <h5>Localização & Contato</h5>
            <p>
              <a 
                href={DOCTOR_INFO.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ display: 'inline', color: '#FFFFFF', textDecoration: 'underline', textUnderlineOffset: '3px' }} 
                title="Abrir no Google Maps"
              >
                Rua Antunes de Alencar, 152<br />
                Bairro Bosque — Rio Branco/AC<br />
                CEP: 69900-364 ↗
              </a>
            </p>
            <p>
              <a 
                href={waBookingUrl}
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
          <p>&copy; {new Date().getFullYear()} MEDICINARTE SERVIÇOS MÉDICOS LTDA • Dra. Cibele Cristina (CRM-AC 1810 | RQE 1078). Procedimento ambulatorial realizado com embasamento científico e observância às normas do CFM.</p>
        </div>
      </footer>

    </div>
  );
}
