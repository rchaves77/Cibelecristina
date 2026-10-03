export type BlogCategoryKey = 'todas' | 'saude-adulto' | 'saude-mulher' | 'saude-crianca' | 'saude-idoso' | 'prevencao' | 'ouvido';

export interface ArticleData {
  id: string;
  categoryKey: BlogCategoryKey;
  category: string;
  badgeOverlay: string;
  title: string;
  image: string;
  alt: string;
  summary: string;
  readTime: string;
  ctaBookText: string;
  ctaBookUrl: string;
  serviceKey: string;
  servicePrompt: string;
  fullHtml: string;
}

export interface FeaturedHighlight {
  id: string;
  badge: string;
  badgeClass: 'badge-checkup' | 'badge-procedure' | 'badge-family';
  badgeOverlay: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
  category: string;
  modalTitle: string;
  serviceKey: string;
  servicePrompt: string;
  fullHtml: string;
  whatsappCta: string;
  whatsappText: string;
  isPrimary?: boolean;
  procedureHighlight?: boolean;
}

export interface ServiceItem {
  id: string;
  tag: string;
  title: string;
  desc: string;
  isFeatured?: boolean;
  landingUrl?: string;
}

export interface PillarItem {
  id: string;
  title: string;
  desc: string;
  iconType: 'heart' | 'target' | 'users' | 'file';
}

export interface FAQItemData {
  id: string;
  question: string;
  answer: string;
}

export const DOCTOR_INFO = {
  name: 'Dra. Cibele Cristina',
  prefix: 'Drª',
  fullName: 'Dra. Cibele Cristina Cunha Brígido',
  crm: 'CRM-AC 1810',
  rqe: 'RQE 1078',
  specialty: 'Medicina de Família e Comunidade',
  clinicName: 'Clínica Medicinarte',
  clinicLegalName: 'MEDICINARTE SERVIÇOS MÉDICOS LTDA',
  clinicCrmPj: 'CRM-AC PJ 258',
  technicalDirector: 'Dra. Cibele Cristina — CRM-AC 1810 / RQE 1078',
  phone: '(68) 98103-4408',
  whatsappNumber: '5568981034408',
  address: 'Rua Antunes de Alencar, 152 – Bosque, Rio Branco / AC, CEP: 69900-364',
  googleMapsUrl: 'https://maps.google.com/?q=Rua+Antunes+de+Alencar,+152+-+Bosque,+Rio+Branco+-+AC,+69900-364',
  logoImage: '/logo.png',
  doctorImage: '/cibele.png',
  doctorImageFallback: '/cibele.png'
};

export const PILLARS: PillarItem[] = [
  {
    id: 'p1',
    iconType: 'heart',
    title: 'Cuidado Biopsicossocial',
    desc: 'A saúde vai além do biológico. Analisamos seus hábitos, seu ambiente familiar, seu contexto emocional e profissional para orientar decisões terapêuticas.'
  },
  {
    id: 'p2',
    iconType: 'target',
    title: 'Prevenção baseada em evidências',
    desc: 'Solicitação prudente de exames e condutas com base científica sólida, protegendo você de excessos diagnósticos e intervenções desnecessárias.'
  },
  {
    id: 'p3',
    iconType: 'users',
    title: 'Longitudinalidade & Vínculo',
    desc: 'Um médico que conhece a sua história ao longo dos anos coordena melhor o seu plano de saúde, tornando as decisões mais assertivas e acolhedoras.'
  },
  {
    id: 'p4',
    iconType: 'file',
    title: 'Plano Individualizado',
    desc: 'Metas pactuadas em conjunto. Você participa ativamente do planejamento do seu próprio bem-estar, com metas reais e sustentáveis no dia a dia.'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'consulta',
    tag: 'Presencial • Todas as Idades',
    title: 'Consulta Médica',
    desc: 'Atendimento presencial cuidadoso, acolhedor e resolutivo para toda a família em Rio Branco. Escuta ativa, exame físico detalhado e plano terapêutico individualizado.'
  },
  {
    id: 'checkup',
    tag: 'Prevenção Baseada em Evidências',
    title: 'Check-up Individualizado',
    desc: 'Avaliação individualizada do seu estado de saúde, estilo de vida e histórico familiar, com solicitação consciente de exames fundamentados em evidências sólidas.'
  },
  {
    id: 'cronicos',
    tag: 'Cuidado Contínuo',
    title: 'Doenças Crônicas',
    desc: 'Acompanhamento longitudinal e humanizado para hipertensão, diabetes, colesterol e outras condições, pactuando metas possíveis adaptadas à sua rotina real.'
  },
  {
    id: 'lavagem',
    tag: '★ Procedimento em Destaque em Rio Branco - AC',
    title: 'Lavagem de Ouvido em Rio Branco - AC',
    desc: 'Avaliação médica do ouvido e, quando indicada, remoção segura do excesso de cerúmen no consultório no Bairro Bosque, com orientações de preparo prévio adequado.',
    isFeatured: true,
    landingUrl: '/lavagem-de-ouvido-rio-branco'
  },
  {
    id: 'teleconsulta',
    tag: 'Online • Todo o Brasil',
    title: 'Teleconsulta',
    desc: 'Atendimento acolhedor e resolutivo por vídeo onde você estiver, com envio imediato de prescrições e pedidos de exames digitais válidos em todo o país.'
  },
  {
    id: 'domiciliar',
    tag: 'No Conforto do Lar em Rio Branco',
    title: 'Visita Domiciliar',
    desc: 'Atendimento médico humanizado no seu lar em Rio Branco, especialmente voltado a idosos, pessoas acamadas ou com mobilidade reduzida que precisam de cuidado próximo.'
  }
];

export interface OfficeProcedureItem {
  id: string;
  title: string;
  badge: string;
  summary: string;
  description: string;
  indications: string[];
  requiresEvaluation: boolean;
  ctaText: string;
  whatsappMessage: string;
  externalLink?: string;
  externalLinkText?: string;
}

export const OFFICE_PROCEDURES: OfficeProcedureItem[] = [
  {
    id: 'lavagem-otologica',
    title: 'Lavagem Otológica (Remoção de Cerúmen)',
    badge: 'Saúde Auditiva',
    summary: 'Avaliação otoscópica prévia e higienização segura com irrigação suave à temperatura corporal no consultório no Bairro Bosque.',
    description: 'Indicada para pacientes com sensação de ouvido entupido, zumbido por tampão de cera ou diminuição da audição provocada por cerúmen impactado. Procedimento confortável, rápido e indolor.',
    indications: ['Sensação de ouvido tampado ou abafado', 'Acúmulo comprovado de cerúmen no exame físico', 'Após preparo prévio com gotas quando recomendado'],
    requiresEvaluation: true,
    ctaText: 'Agendar Avaliação para Lavagem',
    whatsappMessage: 'Olá, Dra. Cibele! Gostaria de agendar uma avaliação para Lavagem Otológica no consultório em Rio Branco.',
    externalLink: '/lavagem-de-ouvido-rio-branco',
    externalLinkText: 'Ver página exclusiva sobre Lavagem de Ouvido em Rio Branco →'
  },
  {
    id: 'artrocentese',
    title: 'Artrocentese Articular (Punção Diagnóstica e de Alívio)',
    badge: 'Cuidado Articular',
    summary: 'Punção médica com agulha fina para aspiração e descompressão de derrame articular (acúmulo de líquido na articulação).',
    description: 'Realizada no joelho e em articulações selecionadas sob rigorosa técnica asséptica. Promove alívio mecânico imediato da pressão articular e permite análise laboratorial do líquido sinovial quando clinicamente indicada.',
    indications: ['Derrame articular com dor, edema ou restrição de mobilidade', 'Avaliação diagnóstica de artrites e sinovites agudas', 'Alívio mecânico da distensão articular'],
    requiresEvaluation: true,
    ctaText: 'Agendar Avaliação para Artrocentese',
    whatsappMessage: 'Olá, Dra. Cibele! Gostaria de agendar uma consulta para avaliação médica articular (Artrocentese).'
  },
  {
    id: 'infiltracao-articular',
    title: 'Infiltração Articular e Periarticular',
    badge: 'Controle de Dor e Reabilitação',
    summary: 'Aplicação médica precisa de substâncias terapêuticas na articulação, bursa ou tecidos periarticulares para controle álgico e inflamatório.',
    description: 'Indicada para o controle direcionado de dor inflamatória persistente em condições como osteoartrite de joelho, bursite trocantérica, bursite de ombro e tendinopatias selecionadas, restaurando a mobilidade funcional.',
    indications: ['Osteoartrite de joelho com dor inflamatória', 'Tendinopatias com indicação de controle inflamatório local'],
    requiresEvaluation: true,
    ctaText: 'Agendar Avaliação para Infiltração',
    whatsappMessage: 'Olá, Dra. Cibele! Gostaria de agendar uma consulta para avaliação médica de Infiltração Articular.'
  }
];

export const FEATURED_HIGHLIGHTS: FeaturedHighlight[] = [
  {
    id: 'destaque_checkup',
    badge: 'Prevenção & Longevidade',
    badgeClass: 'badge-checkup',
    badgeOverlay: 'Prevenção & Check-up',
    title: '🩺 Check-up: quais exames realmente preciso fazer?',
    desc: 'Check-up não é fazer todos os exames. Descubra quais avaliações realmente fazem sentido para você e proteja sua saúde com clareza.',
    image: 'https://img.usecurling.com/p/600/380?q=medical%20checkup%20doctor&color=green',
    alt: 'Médica conversando atentamente sobre exames preventivos',
    category: 'Check-up Individualizado • Prevenção',
    modalTitle: '🩺 Check-up: quais exames realmente preciso fazer?',
    serviceKey: 'Check-up',
    servicePrompt: 'Check-up Individualizado',
    whatsappCta: 'Agendar Check-up Individualizado',
    whatsappText: 'Olá Dra. Cibele! Li o artigo sobre Check-up e gostaria de agendar uma avaliação individualizada.',
    isPrimary: true,
    fullHtml: '<p>É comum pensar que um &quot;bom check-up&quot; signifique pedir dezenas de exames de sangue aleatórios, ultrassons e tomografias sem critério.</p><p>A medicina baseada em evidências comprova que o excesso de exames pode encontrar alterações inofensivas que geram ansiedade, custos desnecessários e procedimentos invasivos sem benefício real.</p><p>Na consulta com a Médica de Família, seus exames são pensados de acordo com sua idade, seus antecedentes familiares, seu estilo de vida e seus riscos individuais. Cuidar de verdade é fazer o que é necessário para a sua proteção.</p><p><strong>Pronto para cuidar da sua saúde sem excessos? Agende seu Check-up Individualizado com a Dra. Cibele.</strong></p>'
  },
  {
    id: 'destaque_lavagem',
    badge: 'Procedimento em Consultório',
    badgeClass: 'badge-procedure',
    badgeOverlay: 'Procedimento em Destaque',
    title: '👂 Ouvido entupido por cera: quando é preciso fazer lavagem?',
    desc: 'Sensação de ouvido tampado? Entenda quando o excesso de cerúmen pode ser a causa e como a remoção médica restaura seu bem-estar.',
    image: 'https://img.usecurling.com/p/600/380?q=ear%20hearing%20examination&color=yellow',
    alt: 'Avaliação médica cuidadosa do conduto auditivo',
    category: 'Lavagem Otológica • Rio Branco',
    modalTitle: '👂 Ouvido entupido por cera: quando é preciso fazer lavagem?',
    serviceKey: 'Lavagem Otológica',
    servicePrompt: 'Lavagem Otológica em Rio Branco',
    whatsappCta: 'Agendar Lavagem Otológica',
    whatsappText: 'Olá Dra. Cibele! Li sobre ouvido entupido e gostaria de agendar uma avaliação para Lavagem Otológica.',
    isPrimary: true,
    procedureHighlight: true,
    fullHtml: '<p>Aquela sensação incômoda de ouvido tampado, como se estivesse sob a água ou com som abafado, muitas vezes é provocada pelo acúmulo e compactação de cerúmen.</p><p>A cera tem função protetora, mas o uso de cotonetes, fones intra-auriculares ou a própria anatomia do conduto podem formar um tampão que bloqueia a audição.</p><p>No consultório no Bairro Bosque em Rio Branco, realizamos a avaliação médica completa com otoscópio e, quando indicada, a remoção cuidadosa e segura da rolha de cerúmen com água morna à temperatura corporal, devolvendo o conforto auditivo de forma imediata e indolor.</p><p><strong>Sentindo o ouvido tampado? Não use hastes flexíveis. Agende sua avaliação com a Dra. Cibele Cristina.</strong></p>'
  },
  {
    id: 'destaque_medico_familia',
    badge: 'Medicina de Família',
    badgeClass: 'badge-family',
    badgeOverlay: 'Medicina de Família',
    title: '👩‍⚕️ Médico de Família: o que ele trata?',
    desc: 'Um médico para todas as fases da vida. Conheça a especialidade focada em cuidar da pessoa como um todo com acolhimento contínuo.',
    image: 'https://img.usecurling.com/p/600/380?q=family%20doctor%20stethoscope&color=green',
    alt: 'Médica de família em momento acolhedor com paciente',
    category: 'Medicina de Família • Cuidado Integral',
    modalTitle: '👩‍⚕️ Médico de Família: o que ele trata?',
    serviceKey: 'Consulta Médica',
    servicePrompt: 'Consulta Médica com Especialista em Medicina de Família',
    whatsappCta: 'Agendar com Médica de Família',
    whatsappText: 'Olá Dra. Cibele! Gostaria de iniciar meu acompanhamento médico com você e agendar uma consulta.',
    fullHtml: '<p>O Médico de Família e Comunidade é o especialista capacitado para cuidar da pessoa ao longo de todas as fases da vida: crianças, adultos, gestantes e idosos.</p><p>Ele não olha apenas para um órgão ou sintoma isolado: compreende seu contexto de vida, seu trabalho, sua família e suas prioridades, resolvendo cerca de 85% a 90% das queixas e coordenando o cuidado com outros especialistas quando estritamente necessário.</p><p>Ter um médico que conhece o seu histórico evita peregrinações desnecessárias por prontos-socorros e exames repetidos.</p><p><strong>Construa uma relação duradoura com a sua médica de confiança. Agende sua primeira consulta.</strong></p>'
  }
];

export const ARTICLES: ArticleData[] = [
  {
    "id": "artigo_cronicas",
    "categoryKey": "saude-adulto",
    "category": "Saúde do Adulto • Doenças Crônicas",
    "badgeOverlay": "Saúde do Adulto",
    "title": "🍬 Diabetes e Hipertensão: acompanhamento contínuo em Rio Branco.",
    "image": "https://img.usecurling.com/p/600/380?q=blood%20pressure%20check&color=green",
    "alt": "Aferição de pressão arterial em Rio Branco",
    "summary": "Pressão e glicose descompensadas agem em silêncio. Um plano de metas reais pactuado com sua médica de confiança protege seu coração, rins e visão.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Acompanhamento &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20acompanhamento%20de%20Hipertens%C3%A3o%20ou%20Diabetes.",
    "serviceKey": "Doenças Crônicas",
    "servicePrompt": "Acompanhamento de Doenças Crônicas",
    "fullHtml": "<p>A pressão alta e as alterações na glicemia não costumam doer no dia a dia. É justamente esse silêncio que esconde riscos a longo prazo para o coração, rins, olhos e vasos sanguíneos.</p><p>Acompanhar essas condições não se resume a repetir receitas todo mês. Na medicina de família, pactuamos metas reais, adaptadas à sua alimentação habitual e ao seu trabalho, ajustando dosagens e prevenindo efeitos colaterais.</p><p>Com consultas regulares planejadas, você mantém sua qualidade de vida sem sustos silenciosos no futuro.</p><p><strong>Quer manter sua glicose e pressão sob controle com tranquilidade e apoio constante? Agende seu acompanhamento.</strong></p>"
  },
  {
    "id": "artigo_ansiedade",
    "categoryKey": "saude-adulto",
    "category": "Saúde do Adulto • Saúde Mental",
    "badgeOverlay": "Saúde do Adulto",
    "title": "🧠 Ansiedade e Esgotamento: quando o corpo pede ajuda emocional.",
    "image": "https://img.usecurling.com/p/600/380?q=mental%20peace%20wellbeing&color=green",
    "alt": "Acolhimento médico para ansiedade",
    "summary": "Aperto no peito, noites maldormidas e cansaço constante são sinais físicos de sobrecarga. Um acolhimento biopsicossocial ajuda a resgatar sua estabilidade.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Li%20sobre%20Ansiedade%20e%20Esgotamento%20e%20gostaria%20de%20agendar%20uma%20consulta.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica para Ansiedade e Esgotamento",
    "fullHtml": "<p>Noites maldormidas, dores de cabeça tensionais, palpitações e aperto no peito muitas vezes não vêm de doenças físicas graves, mas do esgotamento emocional que o corpo não consegue mais esconder.</p><p>A consulta com a médica de família proporciona um refúgio acolhedor e sem julgamentos. Descartamos alterações orgânicas (como problemas na tireoide ou carências nutricionais) e desenhamos juntos passos sustentáveis para diminuir a sobrecarga diária.</p><p>Cuidar da sua mente é cuidar do seu corpo por inteiro.</p><p><strong>Não carregue esse peso sozinho. Agende uma consulta com escuta atenta e plano terapêutico individualizado.</strong></p>"
  },
  {
    "id": "artigo_sono",
    "categoryKey": "saude-adulto",
    "category": "Saúde do Adulto • Sono & Energia",
    "badgeOverlay": "Saúde do Adulto",
    "title": "💤 Sono e Disposição: o impacto do descanso na sua produtividade.",
    "image": "https://img.usecurling.com/p/600/380?q=restful%20sleep%20morning&color=blue",
    "alt": "Qualidade do sono",
    "summary": "Acordar cansado todos os dias não é normal. Investigue causas clínicas de fadiga crônica e recupere o vigor com apoio da sua médica de família.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o%20m%C3%A9dica%20para%20sono%20e%20disposi%C3%A7%C3%A3o.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica para Avaliação do Sono e Disposição",
    "fullHtml": "<p>Passar o dia arrastando cansaço, precisando de doses infinitas de café para funcionar, não é normal e não deve ser naturalizado.</p><p>Distúrbios do sono afetam a imunidade, desregulam a pressão arterial, aumentam o apetite por carboidratos e prejudicam a concentração e o humor. Na consulta, investigamos causas como apneia obstrutiva, hábitos noturnos prejudiciais e alterações clínicas silenciosas.</p><p>Com ajustes simples de higiene do sono e intervenção médica precisa, você retoma o vigor e a alegria de produzir com energia.</p><p><strong>Recupere o prazer de acordar com real descanso. Agende uma consulta médica focada na sua rotina.</strong></p>"
  },
  {
    "id": "artigo_colesterol",
    "categoryKey": "saude-adulto",
    "category": "Saúde do Adulto • Proteção Cardiovascular",
    "badgeOverlay": "Saúde do Adulto",
    "title": "📉 Colesterol e Triglicerídeos: equilíbrio sem terrorismo nutricional.",
    "image": "https://img.usecurling.com/p/600/380?q=healthy%20heart%20nutrition&color=red",
    "alt": "Saúde cardiovascular e colesterol",
    "summary": "Números alterados no exame exigem método, não pânico. Veja como ajustes possíveis na alimentação e acompanhamento reduzem riscos vasculares reais.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Acompanhamento &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20acompanhamento%20para%20colesterol%2Ftriglicer%C3%ADdeos.",
    "serviceKey": "Doenças Crônicas",
    "servicePrompt": "Acompanhamento de Colesterol e Triglicerídeos",
    "fullHtml": "<p>Receber um exame de sangue com taxas de colesterol ou triglicerídeos elevadas costuma provocar susto e sensação de perda de controle.</p><p>A verdade é que esses lipídios respondem de forma muito favorável a intervenções estratégicas bem planejadas: desde a escolha das gorduras certas na cozinha até o ajuste farmacológico quando indicado por evidências.</p><p>Com acompanhamento médico contínuo, monitoramos a evolução das placas arteriais e reduzimos riscos vasculares sem impor restrições extremas e insustentáveis.</p><p><strong>Recebeu exames alterados e quer um plano seguro de controle? Agende seu acompanhamento crônico.</strong></p>"
  },
  {
    "id": "artigo_mulher_prevencao",
    "categoryKey": "saude-mulher",
    "category": "Saúde da Mulher • Rastreamento Consciente",
    "badgeOverlay": "Saúde da Mulher",
    "title": "🌸 Prevenção Ginecológica Racional: exames essenciais em cada fase.",
    "image": "https://img.usecurling.com/p/600/380?q=woman%20health%20doctor&color=green",
    "alt": "Cuidado preventivo na saúde da mulher",
    "summary": "Papanicolau, mamografia e exames de sangue: saiba quando realizar cada investigação com embasamento científico e respeito à sua história clínica.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta da Mulher &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20de%20Sa%C3%BAde%20da%20Mulher.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Saúde da Mulher",
    "fullHtml": "<p>O cuidado com a saúde da mulher na Medicina de Família vai muito além de repetir exames no automático. Avaliamos a idade, os fatores de risco individuais e os hábitos para indicar os rastreamentos recomendados cientificamente, como o preventivo de colo de útero e a mamografia no tempo certo.</p><p>Um atendimento delicado, acolhedor e focado no seu bem-estar completo em Rio Branco.</p><p><strong>Agende sua consulta para colocar a sua saúde em dia com serenidade.</strong></p>"
  },
  {
    "id": "artigo_mulher_menopausa",
    "categoryKey": "saude-mulher",
    "category": "Saúde da Mulher • Climatério",
    "badgeOverlay": "Saúde da Mulher",
    "title": "🌷 Climatério e Menopausa: alívio de sintomas e longevidade feminina.",
    "image": "https://img.usecurling.com/p/600/380?q=mature%20woman%20smiling&color=green",
    "alt": "Mulher madura com saúde e bem-estar",
    "summary": "Ondas de calor, alterações do humor e do sono podem ser manejados com segurança. Uma abordagem individualizada devolve o bem-estar e a disposição.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20orienta%C3%A7%C3%A3o%20e%20atendimento%20para%20climat%C3%A9rio%2Fmenopausa.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Climatério e Menopausa",
    "fullHtml": "<p>A transição para a menopausa não precisa ser vivida com sofrimento silencioso. Ondas de calor (fogachos), oscilações de humor, alterações no sono e ressecamento podem ser aliviados com abordagens terapêuticas seguras e individualizadas.</p><p>Discutimos alternativas com base em evidências para que essa fase seja vivida com leveza, energia e autonomia.</p><p><strong>Agende uma conversa detalhada sobre o climatério e viva essa etapa com bem-estar.</strong></p>"
  },
  {
    "id": "artigo_puericultura",
    "categoryKey": "saude-crianca",
    "category": "Saúde da Criança • Puericultura",
    "badgeOverlay": "Saúde da Criança",
    "title": "👶 Saúde da Criança: a importância de um acompanhamento longitudinal.",
    "image": "https://img.usecurling.com/p/600/380?q=child%20doctor%20gentle&color=green",
    "alt": "Acompanhamento da criança em Rio Branco",
    "summary": "Crescimento, marcos do desenvolvimento, sono e vacinas: ter uma médica de família que conhece todo o histórico traz leveza e segurança duradoura.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta Infantil &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20de%20puericultura%20para%20meu%20filho.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Cuidado Familiar (Saúde da Criança)",
    "fullHtml": "<p>O crescimento de uma criança é dinâmico. Ter a mesma médica acompanhando desde as primeiras semanas permite notar pequenas variações no desenvolvimento que passariam despercebidas em consultas pontuais de pronto-socorro.</p><p>Avaliamos marcos motores, fala, sono, introdução alimentar e calendário de vacinas, criando um espaço de diálogo onde pais podem tirar dúvidas sem culpa ou pressa.</p><p>E quando surgem febres ou resfriados, ser atendido por quem já conhece o jeitinho da criança transforma o momento em algo muito mais calmo e acolhedor.</p><p><strong>Proporcione à sua criança o carinho de um acompanhamento longitudinal. Agende sua consulta familiar.</strong></p>"
  },
  {
    "id": "artigo_crianca_febre",
    "categoryKey": "saude-crianca",
    "category": "Saúde da Criança • Dúvidas dos Pais",
    "badgeOverlay": "Saúde da Criança",
    "title": "🌡️ Febre na Criança: quando observar com calma e quando procurar avaliação?",
    "image": "https://img.usecurling.com/p/600/380?q=child%20comfort%20care&color=green",
    "alt": "Cuidado com febre infantil",
    "summary": "A febre é uma resposta de defesa natural do organismo infantil. Aprenda a reconhecer sinais de alerta e saiba como agir com tranquilidade e suporte médico.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20m%C3%A9dica%20para%20minha%20crian%C3%A7a.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Saúde da Criança",
    "fullHtml": "<p>A febre na infância é um dos motivos que mais angustiam mães e pais. No entanto, ela é um mecanismo de defesa saudável do sistema imunológico da criança combatendo infecções comuns.</p><p>O mais importante é observar o estado geral da criança: ela brinca e se hidrata quando a febre baixa? Há sinais como prostração intensa ou manchas na pele? Acompanhar a infância com sua médica de família garante orientação firme e tranquilidade para toda a família.</p><p><strong>Conte com o apoio da Dra. Cibele para cuidar do seu filho com carinho e embasamento técnico.</strong></p>"
  },
  {
    "id": "artigo_longevidade",
    "categoryKey": "saude-idoso",
    "category": "Saúde do Idoso • Autonomia",
    "badgeOverlay": "Saúde do Idoso",
    "title": "👵 Longevidade com Qualidade: envelhecer com independência.",
    "image": "https://img.usecurling.com/p/600/380?q=senior%20happy%20conversation&color=green",
    "alt": "Idoso saudável e ativo",
    "summary": "Revisão de medicamentos em excesso, avaliação do risco de quedas e estímulo cognitivo: pilares fundamentais para garantir dignidade e autonomia na maturidade.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20de%20cuidado%20para%20idoso.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Cuidado Familiar (Longevidade do Idoso)",
    "fullHtml": "<p>Viver mais anos só tem real valor quando acompanhado de independência, bom humor, mobilidade e clareza mental.</p><p>O acompanhamento voltado à maturidade foca em revisar a 'farmacinha' em casa (reduzindo interações perigosas entre remédios), avaliar o risco de quedas, preservar massa muscular e estimular a memória com metas práticas.</p><p>Com suporte médico cuidadoso, envelhecer se torna uma etapa de plenitude e tranquilidade para toda a família.</p><p><strong>Traga seus pais ou planeje seu próprio envelhecimento saudável. Agende uma avaliação de cuidado familiar.</strong></p>"
  },
  {
    "id": "artigo_visita_domiciliar",
    "categoryKey": "saude-idoso",
    "category": "Saúde do Idoso • Visita Domiciliar",
    "badgeOverlay": "Saúde do Idoso",
    "title": "🏡 Atendimento Domiciliar ao Idoso: conforto e segurança no lar.",
    "image": "https://img.usecurling.com/p/600/380?q=home%20doctor%20elderly%20visit&color=green",
    "alt": "Médica em visita domiciliar",
    "summary": "Para pacientes com mobilidade reduzida ou idosos que se cansam em deslocamentos: uma consulta completa, humana e atenciosa no conforto de sua própria casa.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Visita Domiciliar &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20Visita%20Domiciliar%20em%20Rio%20Branco.",
    "serviceKey": "Visita Domiciliar",
    "servicePrompt": "Visita Domiciliar",
    "fullHtml": "<p>Para pacientes idosos, pessoas convalescentes após cirurgias ou com mobilidade comprometida, a jornada até um consultório médico pode ser desgastante e dolorosa.</p><p>A visita médica domiciliar resgata a essência da medicina familiar: a médica vai até a sua residência, conversa no seu ambiente, observa a dinâmica da casa e realiza o exame físico com total tranquilidade e respeito.</p><p>Uma experiência de atendimento acolhedora, que poupa desgaste físico e emocional de quem você mais ama.</p><p><strong>Precisa de atendimento em domicílio em Rio Branco? Solicite o agendamento de uma Visita Domiciliar.</strong></p>"
  },
  {
    "id": "destaque_checkup",
    "categoryKey": "prevencao",
    "category": "Prevenção • Check-up Individualizado",
    "badgeOverlay": "Prevenção",
    "title": "🩺 Check-up: quais exames você realmente precisa fazer?",
    "image": "https://img.usecurling.com/p/600/380?q=medical%20checkup%20doctor&color=green",
    "alt": "Check-up preventivo",
    "summary": "Excesso de exames sem critério clínico gera alarmes falsos e ansiedade desnecessária. A medicina baseada em evidências foca no que verdadeiramente protege a sua vida.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Check-up &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20um%20Check-up%20Individualizado.",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up Individualizado",
    "fullHtml": "<p>É comum pensar que um 'bom check-up' signifique pedir dezenas de exames de sangue aleatórios, ultrassons e tomografias sem critério.</p><p>A medicina baseada em evidências comprova que <strong>check-up não é fazer todos os exames</strong>. Fazer investigações em excesso sem necessidade clínica gera alarmes falsos, ansiedade, custos desnecessários e procedimentos invasivos que não trazem proteção real.</p><p>O check-up verdadeiro começa com uma consulta atenta e próxima com sua médica de família. Analisamos sua idade, hábitos, histórico familiar e estilo de vida para solicitar exclusivamente os exames fundamentados que protegem seu futuro.</p><p><strong>Pronto para fazer uma prevenção inteligente e personalizada? Agende seu check-up individualizado com a Dra. Cibele Cristina.</strong></p>"
  },
  {
    "id": "artigo_imunidade",
    "categoryKey": "prevencao",
    "category": "Prevenção • Defesas Naturais",
    "badgeOverlay": "Prevenção",
    "title": "🛡️ Imunidade e Prevenção no Clima Amazônico: proteja seu corpo.",
    "image": "https://img.usecurling.com/p/600/380?q=healthy%20immune%20fresh%20fruits&color=orange",
    "alt": "Fortalecimento de imunidade",
    "summary": "A alternância de calor intenso e umidade favorece vírus respiratórios. Saiba o que a ciência comprova sobre manter a imunidade alta sem fórmulas mágicas.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20preventiva.",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up Individualizado Preventivo (Imunidade)",
    "fullHtml": "<p>Com a alternância de calor intenso, umidade e chuvas em nossa região, gripes e crises respiratórias encontram o terreno perfeito para se espalhar.</p><p>A verdadeira imunidade não vem de suplementos milagrosos comprados sem receita, mas da regularidade no sono, vacinação em dia, controle de estresse e rastreio de deficiências reais no organismo.</p><p>A prevenção baseada em evidências avalia suas vulnerabilidades biológicas e fornece orientações práticas para blindar a sua saúde antes que o clima te pegue de surpresa.</p><p><strong>Quer passar o ano com as defesas do corpo em alta? Agende sua avaliação preventiva com a Dra. Cibele.</strong></p>"
  },
  {
    "id": "artigo_atividade_fisica",
    "categoryKey": "prevencao",
    "category": "Prevenção • Esporte & Vida Ativa",
    "badgeOverlay": "Prevenção",
    "title": "🏃 Atividade Física com Segurança: avaliação médica prévia.",
    "image": "https://img.usecurling.com/p/600/380?q=running%20exercise%20fitness&color=green",
    "alt": "Avaliação pré-exercício",
    "summary": "Antes de iniciar treinos ou corridas, uma checagem cardiorrespiratória responsável garante que seu exercício traga apenas saúde e vitalidade.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Avaliação &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Quero%20agendar%20uma%20avalia%C3%A7%C3%A3o%20para%20atividade%20f%C3%ADsica.",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up e Avaliação para Atividade Física",
    "fullHtml": "<p>Praticar esportes, musculação ou iniciar corridas é uma das melhores decisões que você pode tomar pela sua saúde. No entanto, o entusiasmo inicial precisa vir acompanhado de segurança cardiovascular.</p><p>Uma consulta médica pré-participação checa a pressão arterial, ausculta cardiopulmonar, avalia riscos hereditários e histórico de sintomas como tontura ou dor torácica aos esforços.</p><p>Liberar o corpo com segurança garante que o exercício seja apenas fonte de longevidade, sem riscos desnecessários.</p><p><strong>Pronto para se movimentar com proteção e acompanhamento? Agende sua avaliação de check-up.</strong></p>"
  },
  {
    "id": "artigo_plano_cuidado",
    "categoryKey": "prevencao",
    "category": "Prevenção • Cuidado Transparente",
    "badgeOverlay": "Prevenção",
    "title": "📋 Plano de Cuidado Escrito: saia da consulta sem nenhuma dúvida.",
    "image": "https://img.usecurling.com/p/600/380?q=doctor%20writing%20care%20plan&color=green",
    "alt": "Plano de cuidado por escrito",
    "summary": "Receber todas as recomendações claras por escrito garante que você e seus familiares saibam exatamente o que fazer no tratamento domiciliar.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20com%20plano%20de%20cuidado.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica com Plano de Cuidado Escrito",
    "fullHtml": "<p>Quantas vezes você já saiu de um consultório sem entender a letra da receita, sem saber que horas tomar o remédio ou o que fazer caso sinta algum efeito colateral?</p><p>Na consulta com a Dra. Cibele Cristina, o <strong>Plano de Cuidado Escrito</strong> é um dos maiores pilares de respeito ao paciente. Cada orientação, ajuste de hábito e prazo para reavaliação é entregue por escrito, em linguagem limpa e acessível.</p><p>Dessa forma, você e sua família se sentem amparados, seguros e confiantes em cada passo do seu tratamento.</p><p><strong>Experimente uma medicina transparente e acolhedora. Agende sua consulta médica presencial ou online.</strong></p>"
  },
  {
    "id": "destaque_lavagem",
    "categoryKey": "ouvido",
    "category": "Ouvido / Lavagem Otológica • Rio Branco",
    "badgeOverlay": "Ouvido / Lavagem",
    "title": "👂 Ouvido entupido por cera: quando fazer a lavagem médica?",
    "image": "https://img.usecurling.com/p/600/380?q=ear%20hearing%20examination&color=yellow",
    "alt": "Lavagem de ouvido em Rio Branco AC",
    "summary": "Sensação incômoda de som abafado ou ouvido tampado? A lavagem otológica com preparo amolecedor prévio remove a rolha de cerúmen de forma segura.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Ver Página do Procedimento &rarr;",
    "ctaBookUrl": "lavagem-de-ouvido-rio-branco.html",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Lavagem Otológica",
    "fullHtml": "<p>A sensação incômoda de som abafado, zumbido leve ou eco da própria voz costuma ter uma causa simples: acúmulo de cerúmen.</p><p>A cera protege o canal do ouvido, mas quando se acumula em excesso — muitas vezes empurrada inadvertidamente por hastes flexíveis (cotonetes) — ela forma uma rolha que bloqueia a audição.</p><p><strong>Quando a lavagem é indicada?</strong> Quando há queixas de audição abafada ou desconforto mecânico e o exame cuidadoso com otoscópio confirma a presença de cerúmen com a membrana timpânica íntegra. Com orientações prévias de preparo amolecedor, o procedimento é seguro, suave e proporciona alívio imediato.</p><p><strong>Sentindo o ouvido pesado ou tampado? Agende sua avaliação otológica agora mesmo.</strong></p>"
  },
  {
    "id": "artigo_aviao",
    "categoryKey": "ouvido",
    "category": "Ouvido / Lavagem Otológica • Viagem",
    "badgeOverlay": "Ouvido / Lavagem",
    "title": "✈️ Ouvido tampado e viagem de avião: o que fazer antes do voo.",
    "image": "https://img.usecurling.com/p/600/380?q=airplane%20travel%20passenger&color=blue",
    "alt": "Ouvido tampado em viagem de avião",
    "summary": "Alterações bruscas de pressão na cabine podem piorar a dor e o bloqueio quando há cera acumulada. Faça uma checagem otoscópica preventiva.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Avaliação &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Vou%20viajar%20e%20gostaria%20de%20avaliar%20meus%20ouvidos.",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Avaliação para Lavagem Otológica antes de Viagem",
    "fullHtml": "<p>Ao voar, a pressão da cabine sofre variações durante a subida e a descida. Nossos ouvidos contam com a tuba auditiva para equilibrar essa pressão com o ambiente externo.</p><p>Se houver cerúmen impactado ou inflamação no canal auditivo, a equalização de pressão se torna dolorosa, podendo causar dor intensa, sensação de ouvido estalando e surdez temporária prolongada após o pouso.</p><p>Fazer uma checagem com otoscópio antes de viagens longas permite remover excessos com antecedência e viajar com total tranquilidade.</p><p><strong>Vai viajar em breve? Agende sua avaliação otológica antes do embarque.</strong></p>"
  },
  {
    "id": "artigo_mergulho",
    "categoryKey": "ouvido",
    "category": "Ouvido / Lavagem Otológica • Sintomas",
    "badgeOverlay": "Ouvido / Lavagem",
    "title": "🏊 Ouvido tampado após banho de rio ou piscina: como resolver?",
    "image": "https://img.usecurling.com/p/600/380?q=swimming%20water%20ear&color=blue",
    "alt": "Água no ouvido após mergulho",
    "summary": "A água hidrata o cerúmen e expande a rolha, bloqueando o canal. Descubra como a remoção médica rápida evita o desenvolvimento de otite externa.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Avaliação &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Estou%20com%20ouvido%20tampado%20ap%C3%B3s%20entrar%20na%20%C3%A1gua.",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Avaliação para Lavagem Otológica pós Mergulho",
    "fullHtml": "<p>Após banhos de rio, igarapé ou piscina, a água pode entrar no conduto e entrar em contato com um acúmulo de cera que já estava ali, fazendo-o inchar e obstruir o canal auditivo.</p><p>Se a sensação de entupimento não sumir em poucas horas ou começar a doer ao puxar a orelha, nunca utilize cotonetes, palitos ou álcool caseiro: isso pode perfurar o tímpano ou piorar a inflamação.</p><p>A avaliação médica com visualização direta indica se é caso de higienização ou de tratamento tópico com gotas prescritas.</p><p><strong>Ouvido incômodo após contato com água? Agende sua consulta para alívio seguro.</strong></p>"
  },
  {
    "id": "destaque_medico_familia",
    "categoryKey": "saude-adulto",
    "category": "Saúde do Adulto • Medicina de Família",
    "badgeOverlay": "Saúde do Adulto",
    "title": "👩‍⚕️ Médico de Família: cuidado integral para você e sua família.",
    "image": "https://img.usecurling.com/p/600/380?q=family%20doctor%20stethoscope&color=green",
    "alt": "Médica de Família em Rio Branco",
    "summary": "Um médico que conhece sua história acompanha toda a sua vida com proximidade, construindo decisões compartilhadas e resolvendo a grande maioria dos problemas de saúde.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20familiar.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta com a Médica de Família",
    "fullHtml": "<p>O Médico de Família e Comunidade é o profissional preparado para acolher você e sua família em todas as fases da vida — desde bebês até a terceira idade.</p><p>Ele resolve a grande maioria das queixas de saúde: viroses, dores, alterações gastrointestinais, controle de hipertensão e diabetes, exames de rotina e saúde mental. Mais do que tratar sintomas isolados, ele constrói um vínculo ao longo dos anos, conhecendo sua rotina e orientando quando é realmente necessário acionar outro especialista focal.</p><p>É ter uma médica que escuta com calma, sem pressa e que é <em>gente como a gente</em>.</p><p><strong>Deseja um acompanhamento médico contínuo e acolhedor para você e quem você ama? Inicie sua jornada hoje.</strong></p>"
  }
];

export const FAQ_ITEMS: FAQItemData[] = [
  {
    id: 'faq1',
    question: 'Qual é o tempo de duração da consulta?',
    answer: 'A consulta é realizada com tempo adequado para escuta ativa, exame físico detalhado e construção compartilhada do plano de cuidado, garantindo que todas as suas queixas e dúvidas sejam acolhidas sem pressa.'
  },
  {
    id: 'faq2',
    question: 'A Dra. Cibele atende convênios ou somente particular?',
    answer: 'Os atendimentos são particulares e por meio dos seguintes convênios e parcerias: Despachante Barros, Sintesac, Sintest, PP Saúde, Santa Juliana, Medprev, MedPop, OAB e Real. Para atendimentos particulares, emitimos nota fiscal e recibo detalhados para que você possa solicitar o reembolso ao seu plano de saúde de acordo com a sua operadora.'
  },
  {
    id: 'faq3',
    question: 'Como funciona a lavagem de ouvido em Rio Branco?',
    answer: 'O procedimento é realizado em consultório no Bairro Bosque com prévia avaliação otoscópica para confirmar a presença do cerúmen. Frequentemente recomendamos o preparo de 3 a 5 dias com gotas ceruminolíticas para amolecer a cera, tornando o procedimento 100% confortável e seguro.'
  },
  {
    id: 'faq4',
    question: 'A teleconsulta tem a mesma validade de uma consulta presencial?',
    answer: 'Sim! As teleconsultas seguem rigorosamente a regulamentação do Conselho Federal de Medicina (CFM). Durante o atendimento por vídeo seguro, são emitidas receitas digitais, pedidos de exames e atestados com assinatura digital certificada pela ICP-Brasil, válidos em farmácias e laboratórios de todo o Brasil.'
  },
  {
    id: 'faq5',
    question: 'Como posso agendar minha consulta ou tirar dúvidas?',
    answer: 'Basta clicar em qualquer um dos botões de WhatsApp do site ou enviar uma mensagem para (68) 98103-4408. Nossa equipe responderá prontamente com os horários disponíveis e as orientações para o seu atendimento.'
  },
  {
    id: 'faq6',
    question: 'Como funciona a política de retorno para avaliação de exames?',
    answer: 'Quando houver indicação clínica para avaliação de exames solicitados ou reavaliação de conduta terapêutica, os prazos, orientações e condições de retorno são combinados com total clareza e transparência diretamente com a Dra. Cibele durante o seu atendimento.'
  },
  {
    id: 'faq7',
    question: 'Quais procedimentos médicos são realizados em consultório?',
    answer: 'Além da consulta clínica abrangente, realizamos em ambiente ambulatorial procedimentos como Lavagem Otológica (remoção segura de rolha de cerúmen) e, sempre mediante avaliação médica prévia e indicação precisa, Artrocentese articular e Infiltração articular/periarticular para alívio de dor e processos inflamatórios.'
  }
];
