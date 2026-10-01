// Utilitário de Mensuração e Analytics para o Site da Dra. Cibele Cristina
// Suporta Google Analytics 4 (gtag), Google Tag Manager (dataLayer) e eventos customizados de conversão.

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface WhatsAppEventProps {
  location: string;
  service?: string;
  label?: string;
  url?: string;
}

export interface AppointmentEventProps {
  service: string;
  source: string;
  nameProvided?: boolean;
}

export interface ArticleEventProps {
  articleId: string;
  title: string;
  category?: string;
}

export interface ProcedureEventProps {
  procedureName: string;
  source: string;
}

/**
 * Dispara evento seguro para Google Analytics 4 e Google Tag Manager
 */
export function trackCustomEvent(eventName: string, parameters: Record<string, any> = {}) {
  try {
    const timestamp = new Date().toISOString();
    const eventPayload = {
      event: eventName,
      timestamp,
      ...parameters
    };

    // 1. Envio para dataLayer (Google Tag Manager)
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(eventPayload);
    }

    // 2. Envio para gtag (Google Analytics 4)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }

    // Log para verificação e depuração
    if ((import.meta as any)?.env?.DEV) {
      console.log(`[Analytics: ${eventName}]`, eventPayload);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * Mensura cliques em botões e links de WhatsApp (Conversão de Contato)
 */
export function trackWhatsAppClick({ location, service, label, url }: WhatsAppEventProps) {
  trackCustomEvent('click_whatsapp', {
    event_category: 'Conversao',
    event_label: label || `WhatsApp - ${location}`,
    contact_location: location,
    service_selected: service || 'Nenhum / Geral',
    destination_url: url || ''
  });
}

/**
 * Mensura submissão de agendamento ou início de plano de cuidado
 */
export function trackAppointmentSubmission({ service, source, nameProvided = true }: AppointmentEventProps) {
  trackCustomEvent('submit_agendamento', {
    event_category: 'Agendamento',
    event_label: `Agendamento - ${service}`,
    service_requested: service,
    form_source: source,
    has_patient_name: nameProvided
  });
}

/**
 * Mensura visualização ou clique para ler um artigo da biblioteca médica
 */
export function trackArticleView({ articleId, title, category }: ArticleEventProps) {
  trackCustomEvent('view_artigo_medico', {
    event_category: 'Biblioteca de Saude',
    event_label: title,
    article_id: articleId,
    article_title: title,
    article_category: category || 'Geral'
  });
}

/**
 * Mensura cliques e interações com a seção de procedimentos em consultório
 */
export function trackProcedureInteraction({ procedureName, source }: ProcedureEventProps) {
  trackCustomEvent('click_procedimento', {
    event_category: 'Procedimentos Ambulatoriais',
    event_label: procedureName,
    procedure_name: procedureName,
    source_location: source
  });
}
