import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DOCTOR_INFO } from '../data/medicinarteData';

export function PrivacidadePage() {
  useEffect(() => {
    document.title = "Política de Privacidade (LGPD) | Dra. Cibele Cristina - Medicinarte";
    window.scrollTo(0, 0);

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Política de Privacidade e Proteção de Dados da Medicinarte Serviços Médicos Ltda e Dra. Cibele Cristina. Diretrizes de conformidade com a LGPD e Código de Ética Médica do CFM.');
    }
  }, []);

  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-brand" aria-label="Voltar para a página inicial">
            <img 
              src="/logo.png" 
              alt="Logo Dra. Cibele Cristina" 
              style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'contain', backgroundColor: '#FAF8F5', padding: '3px', border: '1px solid rgba(197, 160, 89, 0.4)' }}
            />
            <div className="brand-text">
              <span className="brand-name">{DOCTOR_INFO.name}</span>
              <span className="brand-subtitle">{DOCTOR_INFO.specialty} • {DOCTOR_INFO.crm}</span>
            </div>
          </Link>

          <nav className="header-nav" aria-label="Navegação da Política">
            <Link to="/" className="nav-link">← Voltar ao Início</Link>
            <Link to="/lavagem-de-ouvido-rio-branco" className="nav-link">Lavagem de Ouvido</Link>
            <a href="#contato-dpo" className="nav-link">Canal de Privacidade</a>
          </nav>
        </div>
      </header>

      {/* Conteúdo Principal da Política */}
      <main style={{ flex: 1, padding: '3.5rem 1.5rem', background: '#FAF9F6' }}>
        <article style={{ maxWidth: '820px', margin: '0 auto', background: '#FFFFFF', padding: 'clamp(1.5rem, 5vw, 3.5rem)', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          
          <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', pb: '1.5rem', paddingBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transparência & Conformidade Regulatória
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', color: 'var(--accent)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
              Política de Privacidade e Proteção de Dados (LGPD)
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              MEDICINARTE SERVIÇOS MÉDICOS LTDA • CRM-AC PJ 258<br />
              Dra. Cibele Cristina Cunha Brígido — CRM-AC 1810 / RQE 1078<br />
              Última atualização: Setembro de 2026
            </p>
          </div>

          <div style={{ color: '#2D3E38', fontSize: '0.975rem', lineHeight: 1.8 }} className="privacy-body">
            
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                1. Compromisso Ético e Enquadramento Legal
              </h2>
              <p>
                A <strong>MEDICINARTE SERVIÇOS MÉDICOS LTDA</strong>, sob responsabilidade técnica da médica especialista em Medicina de Família e Comunidade <strong>Dra. Cibele Cristina</strong>, tem como pilar fundamental o respeito à dignidade humana, a confidencialidade das informações clínicas e a privacidade dos seus pacientes e usuários.
              </p>
              <p>
                Esta política foi elaborada em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 — LGPD)</strong>, o Marco Civil da Internet (Lei nº 12.965/2014) e as normas deontológicas emitidas pelo <strong>Conselho Federal de Medicina (CFM)</strong> e pelo Conselho Regional de Medicina do Estado do Acre (CRM-AC).
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                2. Dados Coletados e Finalidades do Tratamento
              </h2>
              <p>
                Em consonância com o princípio da necessidade e minimização de dados (Art. 6º, III da LGPD), coletamos apenas as informações estritamente indispensáveis para o agendamento e a prestação do cuidado em saúde:
              </p>
              <ul style={{ paddingLeft: '1.5rem', margin: '0.75rem 0' }}>
                <li>
                  <strong>Dados Cadastrais de Contato (Formulário e WhatsApp):</strong> Nome completo, número de telefone/WhatsApp e serviço de interesse. Finalidade: identificação inicial, contato receptivo, confirmação de horário de consulta e orientações de preparo pré-atendimento.
                </li>
                <li>
                  <strong>Dados Pessoais Sensíveis de Saúde (Consulta Médica):</strong> Histórico de saúde, queixas clínicas, exames complementares, diagnósticos e registros de prontuário. Finalidade: tutela da saúde, diagnóstico clínico, acompanhamento longitudinal e cumprimento de obrigação legal de manutenção de prontuário médico (Art. 7º, VIII e Art. 11, II, "f" da LGPD).
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                3. Sigilo Profissional e Segurança da Informação
              </h2>
              <p>
                Todos os dados de saúde encontram-se sob a proteção permanente do <strong>segredo médico</strong> (Art. 73 do Código de Ética Médica). Não prometemos "privacidade absoluta", uma vez que nenhum sistema digital é totalmente imune a imprevistos tecnológicos; no entanto, adotamos rigorosas salvaguardas técnicas e administrativas para assegurar a inviolabilidade de seus dados:
              </p>
              <ul style={{ paddingLeft: '1.5rem', margin: '0.75rem 0' }}>
                <li>Criptografia e controle restrito de acesso aos sistemas de prontuário eletrônico.</li>
                <li>Teleconsultas realizadas por meio de plataformas que respeitam a Resolução CFM nº 2.314/2022.</li>
                <li>Prescrições e atestados médicos digitais emitidos com assinatura eletrônica qualificada ICP-Brasil.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                4. Não Compartilhamento e Exceções Legais
              </h2>
              <p>
                A Medicinarte Serviços Médicos Ltda <strong>jamais vende, aluga ou compartilha dados pessoais com empresas de publicidade ou intermediários comerciais</strong>. O compartilhamento pontual ocorre exclusivamente nas seguintes hipóteses estritas:
              </p>
              <ul style={{ paddingLeft: '1.5rem', margin: '0.75rem 0' }}>
                <li>Com farmácias ou laboratórios, estritamente quando o paciente apresenta a receita digital ou encaminhamento para validar o atendimento.</li>
                <li>Por dever de notificação compulsória sanitária exigida por lei aos órgãos de vigilância em saúde.</li>
                <li>Por expressa ordem judicial nos termos previstos na legislação brasileira.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                5. Guarda e Temporalidade do Prontuário Médico
              </h2>
              <p>
                Em observância ao Art. 6º da Lei Federal nº 13.787/2018 e à Resolução CFM nº 1.821/2007, o prontuário do paciente em suporte eletrônico deve ser conservado pelo <strong>prazo mínimo de 20 (vinte) anos</strong> a partir do último registro médico, prevalecendo essa obrigação legal de guarda sobre eventuais solicitações de eliminação precoce.
              </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                6. Seus Direitos como Titular de Dados
              </h2>
              <p>
                De acordo com o Art. 18 da LGPD, você possui o direito de solicitar a qualquer momento:
              </p>
              <ul style={{ paddingLeft: '1.5rem', margin: '0.75rem 0' }}>
                <li>Confirmação da existência de tratamento dos seus dados.</li>
                <li>Acesso aos seus dados e cópia do seu prontuário médico.</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
                <li>Informações sobre eventuais compartilhamentos realizados para fins assistenciais.</li>
              </ul>
            </section>

            <section id="contato-dpo" style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                7. Canal de Contato com o Consultório
              </h2>
              <p style={{ fontSize: '0.925rem', marginBottom: '0.75rem' }}>
                Para exercer seus direitos de titular ou esclarecer qualquer dúvida sobre o tratamento de suas informações, você pode entrar em contato diretamente conosco:
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--accent)' }}>Clínica Medicinarte</strong><br />
                <strong>MEDICINARTE SERVIÇOS MÉDICOS LTDA</strong><br />
                📍 Rua Antunes de Alencar, 152 — Bairro Bosque, Rio Branco/AC • CEP: 69900-364<br />
                📱 WhatsApp: <strong>{DOCTOR_INFO.phone}</strong><br />
                Responsável Técnica: <strong>Dra. Cibele Cristina — CRM-AC 1810 / RQE 1078</strong>
              </p>
            </section>

          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/" className="btn-gold" style={{ display: 'inline-flex', padding: '0.8rem 1.75rem' }}>
              ← Voltar à Página Inicial
            </Link>
          </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MEDICINARTE SERVIÇOS MÉDICOS LTDA • Dra. Cibele Cristina (CRM-AC 1810 | RQE 1078). Tratamento ético de dados em conformidade com a LGPD e o Código de Ética Médica.</p>
        </div>
      </footer>

    </div>
  );
}
