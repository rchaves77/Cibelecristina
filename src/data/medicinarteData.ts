export interface ArticleData {
  id: string;
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
  phone: '(68) 98103-4408',
  whatsappNumber: '5568981034408',
  address: 'Rua Antunes de Alencar, 152 – Bosque, Rio Branco / AC',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+Antunes+de+Alencar,+152+-+Bosque+-+Rio+Branco/AC',
  doctorImage: 'https://img.usecurling.com/ppl/large?gender=female&seed=doctor_cibele',
  doctorImageFallback: 'https://img.usecurling.com/ppl/large?gender=female&seed=doctor_cibele'
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
    title: 'Prevenção Racional',
    desc: 'Solicitação prudente de exames e tratamentos baseados em evidências sólidas, protegendo você de excessos diagnósticos e intervenções desnecessárias.'
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
    tag: 'Prevenção Racional',
    title: 'Check-up',
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
    tag: '★ Procedimento em Destaque',
    title: 'Lavagem Otológica',
    desc: 'Avaliação médica do ouvido e, quando indicada, remoção segura do excesso de cerúmen, com orientação adequada para preparo antes do procedimento.',
    isFeatured: true
  },
  {
    id: 'teleconsulta',
    tag: 'Online • Todo o Brasil',
    title: 'Teleconsulta',
    desc: 'Atendimento acolhedor e resolutivo por vídeo onde você estiver, com envio imediato de prescrições e pedidos de exames digitais válidos em todo o país.'
  },
  {
    id: 'domiciliar',
    tag: 'No Conforto do Lar',
    title: 'Visita Domiciliar',
    desc: 'Atendimento médico humanizado no seu lar, especialmente voltado a idosos, pessoas acamadas ou com mobilidade reduzida que precisam de cuidado próximo.'
  }
];

export const FEATURED_HIGHLIGHTS: FeaturedHighlight[] = [
  {
    "id": "destaque_checkup",
    "badge": "Destaque 1 • Atração de Consulta",
    "badgeClass": "badge-checkup",
    "badgeOverlay": "Prevenção & Check-up",
    "title": "🩺 Check-up: quais exames realmente preciso fazer?",
    "desc": "Check-up não é fazer todos os exames. Descubra quais avaliações realmente fazem sentido para você e proteja sua saúde com clareza.",
    "image": "https://img.usecurling.com/p/600/380?q=medical%20checkup%20doctor&color=green",
    "alt": "Médica conversando atentamente sobre exames preventivos",
    "category": "Check-up Racional • Prevenção",
    "modalTitle": "🩺 Check-up: quais exames realmente preciso fazer?",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up Racional",
    "whatsappCta": "Agendar Check-up Racional",
    "whatsappText": "Olá Dra. Cibele! Li o artigo sobre Check-up Racional e gostaria de agendar uma avaliação.",
    "isPrimary": true,
    "fullHtml": "<p>É comum pensar que um 'bom check-up' signifique pedir dezenas de exames de sangue aleatórios, ultrassons e tomografias sem critério.</p><p>A medicina baseada em evidências comprova que o excesso de exames pode encontrar alterações inofensivas que geram ansiedade, custos desnecessários e procedimentos invasivos sem benefício real.</p><p>Na consulta com a Médica de Família, seus exames são pensados de acordo com sua idade, seus antecedentes familiares, seu estilo de vida e seus riscos individuais. Cuidar de verdade é fazer o que é necessário para a sua proteção.</p><p><strong>Pronto para cuidar da sua saúde sem excessos? Agende seu Check-up Racional com a Dra. Cibele.</strong></p>"
  },
  {
    "id": "destaque_lavagem",
    "badge": "Destaque 2 • Atração de Procedimento",
    "badgeClass": "badge-procedure",
    "badgeOverlay": "Procedimento em Destaque",
    "title": "👂 Ouvido entupido por cera: quando é preciso fazer lavagem?",
    "desc": "Sensação de ouvido tampado? Entenda quando o excesso de cerúmen pode ser a causa e como a remoção médica restaura seu bem-estar.",
    "image": "https://img.usecurling.com/p/600/380?q=ear%20hearing%20examination&color=yellow",
    "alt": "Avaliação médica cuidadosa do conduto auditivo",
    "category": "Lavagem Otológica • Procedimento Resolutivo",
    "modalTitle": "👂 Ouvido entupido por cera: quando é preciso fazer lavagem?",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Lavagem Otológica",
    "whatsappCta": "Agendar Avaliação de Ouvido",
    "whatsappText": "Olá Dra. Cibele! Sinto meu ouvido entupido e gostaria de agendar uma avaliação para Lavagem Otológica.",
    "isPrimary": true,
    "procedureHighlight": true,
    "fullHtml": "<p>Aquela sensação incômoda de ouvido tampado, como se estivesse sob a água ou com som abafado, muitas vezes é provocada pelo acúmulo e compactação de cerúmen.</p><p>A cera tem função protetora, mas o uso de cotonetes, fones intra-auriculares ou a própria anatomia do conduto podem formar um tampão que bloqueia a audição.</p><p>No consultório, realizamos a avaliação médica completa com otoscópio e, quando indicada, a remoção cuidadosa e segura da rolha de cerúmen, devolvendo o conforto auditivo de forma imediata.</p><p><strong>Sentindo o ouvido tampado? Não use hastes flexíveis. Agende sua avaliação com a Dra. Cibele Cristina.</strong></p>"
  },
  {
    "id": "destaque_medico_familia",
    "badge": "Destaque 3 • Fortalecimento de Marca",
    "badgeClass": "badge-family",
    "badgeOverlay": "Medicina de Família",
    "title": "👩‍⚕️ Médico de Família: o que ele trata?",
    "desc": "Da infância à terceira idade: entenda como a médica de família acompanha toda a sua história com proximidade, afeto e resolutividade.",
    "image": "https://img.usecurling.com/p/600/380?q=family%20doctor%20stethoscope&color=green",
    "alt": "Médica de família em momento acolhedor com paciente",
    "category": "Identidade & Vínculo • Medicina Centrada na Pessoa",
    "modalTitle": "👩‍⚕️ Médico de Família: o que ele trata?",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica com Especialista em Medicina de Família",
    "whatsappCta": "Agendar com Médica de Família",
    "whatsappText": "Olá Dra. Cibele! Gostaria de iniciar meu acompanhamento médico com você e agendar uma consulta.",
    "fullHtml": "<p>O Médico de Família e Comunidade é o especialista capacitado para cuidar da pessoa ao longo de todas as fases da vida: crianças, adultos, gestantes e idosos.</p><p>Ele não olha apenas para um órgão ou sintoma isolado: compreende seu contexto de vida, seu trabalho, sua família e suas prioridades, resolvendo cerca de 85% a 90% das queixas e coordenando o cuidado com outros especialistas quando estritamente necessário.</p><p>Ter um médico que conhece o seu histórico evita peregrinações desnecessárias por prontos-socorros e exames repetidos.</p><p><strong>Construa uma relação duradoura com a sua médica de confiança. Agende sua primeira consulta.</strong></p>"
  }
];

export const ARTICLES: ArticleData[] = [
  {
    "id": "artigo_cronicas",
    "category": "Cuidado Contínuo",
    "badgeOverlay": "Acompanhamento de Crônicos",
    "title": "🍬 Diabetes e Hipertensão: como o acompanhamento evita complicações silenciosas.",
    "image": "https://img.usecurling.com/p/600/380?q=blood%20pressure%20check&color=green",
    "alt": "Aferição cuidadosa de pressão arterial em consulta médica",
    "summary": "Pressão e glicose descompensadas agem em silêncio. Um plano de metas reais pactuado com sua médica de confiança protege seu coração, rins e visão.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Acompanhamento &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Li%20sobre%20Diabetes%20e%20Hipertens%C3%A3o%20e%20gostaria%20de%20agendar%20meu%20acompanhamento%20de%20cr%C3%B4nicos.",
    "serviceKey": "Doenças Crônicas",
    "servicePrompt": "Acompanhamento de Doenças Crônicas",
    "fullHtml": "<p>A pressão alta e as alterações na glicemia não costumam doer no dia a dia. É justamente esse silêncio que esconde riscos a longo prazo para o coração, rins, olhos e vasos sanguíneos.</p><p>Acompanhar essas condições não se resume a repetir receitas todo mês. Na medicina de família, pactuamos metas reais, adaptadas à sua alimentação habitual e ao seu trabalho, ajustando dosagens e prevenindo efeitos colaterais.</p><p>Com consultas regulares planejadas, você mantém sua qualidade de vida sem sustos silenciosos no futuro.</p><p><strong>Quer manter sua glicose e pressão sob controle com tranquilidade e apoio constante? Agende seu acompanhamento.</strong></p>"
  },
  {
    "id": "artigo_ansiedade",
    "category": "Saúde Mental & Corpo",
    "badgeOverlay": "Consulta Médica",
    "title": "🧠 Ansiedade e Esgotamento: quando o corpo pede ajuda emocional.",
    "image": "https://img.usecurling.com/p/600/380?q=mental%20peace%20wellbeing&color=green",
    "alt": "Pessoa respirando com tranquilidade e buscando equilíbrio emocional",
    "summary": "Aperto no peito, noites maldormidas e cansaço constante são sinais físicos de sobrecarga. Um acolhimento biopsicossocial ajuda a resgatar sua estabilidade.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Consulta Médica &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Li%20sobre%20Ansiedade%20e%20Esgotamento%20e%20gostaria%20de%20agendar%20uma%20consulta.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica para Ansiedade e Esgotamento",
    "fullHtml": "<p>Noites maldormidas, dores de cabeça tensionais, palpitações e aperto no peito muitas vezes não vêm de doenças físicas graves, mas do esgotamento emocional que o corpo não consegue mais esconder.</p><p>A consulta com a médica de família proporciona um refúgio acolhedor e sem julgamentos. Descartamos alterações orgânicas (como problemas na tireoide ou carências nutricionais) e desenhamos juntos passos sustentáveis para diminuir a sobrecarga diária.</p><p>Cuidar da sua mente é cuidar do seu corpo por inteiro.</p><p><strong>Não carregue esse peso sozinho. Agende uma consulta com escuta atenta e plano terapêutico individualizado.</strong></p>"
  },
  {
    "id": "artigo_puericultura",
    "category": "Infância & Vínculo",
    "badgeOverlay": "Cuidado Familiar",
    "title": "👶 Saúde da Criança: por que ter um médico que conhece todo o histórico do seu filho?",
    "image": "https://img.usecurling.com/p/600/380?q=child%20doctor%20gentle&color=green",
    "alt": "Criança sorrindo em consulta acolhedora com médica de família",
    "summary": "Ter uma médica de confiança acompanhando marcos de desenvolvimento, sono e vacinas traz leveza e segurança duradoura para toda a família.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Cuidado Familiar &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20consulta%20de%20cuidado%20familiar%20para%20meu%20filho.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Cuidado Familiar (Saúde da Criança)",
    "fullHtml": "<p>O crescimento de uma criança é dinâmico. Ter a mesma médica acompanhando desde as primeiras semanas permite notar pequenas variações no desenvolvimento que passariam despercebidas em consultas pontuais de pronto-socorro.</p><p>Avaliamos marcos motores, fala, sono, introdução alimentar e calendário de vacinas, criando um espaço de diálogo onde pais podem tirar dúvidas sem culpa ou pressa.</p><p>E quando surgem febres ou resfriados, ser atendido por quem já conhece o jeitinho da criança transforma o momento em algo muito mais calmo e acolhedor.</p><p><strong>Proporcione à sua criança o carinho de um acompanhamento longitudinal. Agende sua consulta familiar.</strong></p>"
  },
  {
    "id": "artigo_longevidade",
    "category": "Maturidade Ativa",
    "badgeOverlay": "Cuidado Familiar",
    "title": "👵 Longevidade com Qualidade: envelhecer com autonomia e saúde.",
    "image": "https://img.usecurling.com/p/600/380?q=senior%20happy%20conversation&color=green",
    "alt": "Pessoa idosa ativa e bem-disposta em conversa acolhedora",
    "summary": "Revisar medicamentos em excesso, prevenir risco de quedas e cuidar da memória são os pilares para garantir independência em cada fase do amadurecimento.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Cuidado Familiar &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Li%20sobre%20longevidade%20e%20gostaria%20de%20agendar%20uma%20consulta%20de%20cuidado%20familiar.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta de Cuidado Familiar (Longevidade do Idoso)",
    "fullHtml": "<p>Viver mais anos só tem real valor quando acompanhado de independência, bom humor, mobilidade e clareza mental.</p><p>O acompanhamento voltado à maturidade foca em revisar a 'farmacinha' em casa (reduzindo interações perigosas entre remédios), avaliar o risco de quedas, preservar massa muscular e estimular a memória com metas práticas.</p><p>Com suporte médico cuidadoso, envelhecer se torna uma etapa de plenitude e tranquilidade para toda a família.</p><p><strong>Traga seus pais ou planeje seu próprio envelhecimento saudável. Agende uma avaliação de cuidado familiar.</strong></p>"
  },
  {
    "id": "artigo_aviao",
    "category": "Saúde Auditiva do Viajante",
    "badgeOverlay": "Lavagem Otológica",
    "title": "✈️ Ouvido tampado e viagem de avião: o que saber antes de decolar.",
    "image": "https://img.usecurling.com/p/600/380?q=airplane%20travel%20passenger&color=blue",
    "alt": "Passageiro em voo relaxado com ouvidos confortáveis",
    "summary": "A mudança de pressão em altitude pode transformar um acúmulo discreto de cerúmen em dor e barotrauma. Avalie e higienize antes de viajar.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Lavagem Otológica &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Vou%20viajar%20de%20avi%C3%A3o%20e%20quero%20avaliar%20meus%20ouvidos%20para%20Lavagem%20Otol%C3%B3gica.",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Avaliação para Lavagem Otológica antes de Viagem",
    "fullHtml": "<p>Ao voar, a pressão da cabine sofre variações durante a subida e a descida. Nossos ouvidos contam com a tuba auditiva para equilibrar essa pressão com o ambiente externo.</p><p>Se houver cerúmen impactado ou inflamação no canal auditivo, a equalização de pressão se torna dolorosa, podendo causar dor intensa, sensação de ouvido estalando e surdez temporária prolongada após o pouso.</p><p>Fazer uma checagem com otoscópio antes de viagens longas permite remover excessos com antecedência e viajar com total tranquilidade.</p><p><strong>Vai viajar em breve? Agende sua avaliação otológica antes do embarque.</strong></p>"
  },
  {
    "id": "artigo_mergulho",
    "category": "Sintomas Auditivos",
    "badgeOverlay": "Lavagem Otológica",
    "title": "🏊 Dor ou ouvido tampado após mergulho: quando procurar avaliação?",
    "image": "https://img.usecurling.com/p/600/380?q=swimming%20water%20ear&color=blue",
    "alt": "Pessoa perto da água avaliando conforto nos ouvidos",
    "summary": "Água retida expande o cerúmen e favorece infecções da pele do canal. Saiba quando a lavagem médica cuidadosa é necessária para restabelecer o conforto.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Lavagem Otológica &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Senti%20o%20ouvido%20tampado%20ap%C3%B3s%20mergulho%20e%20gostaria%20de%20uma%20avalia%C3%A7%C3%A3o%20de%20Lavagem%20Otol%C3%B3gica.",
    "serviceKey": "Lavagem Otológica",
    "servicePrompt": "Avaliação para Lavagem Otológica pós Mergulho",
    "fullHtml": "<p>Após banhos de rio, igarapé ou piscina, a água pode entrar no conduto e entrar em contato com um acúmulo de cera que já estava ali, fazendo-o inchar e obstruir o canal auditivo.</p><p>Se a sensação de entupimento não sumir em poucas horas ou começar a doer ao puxar a orelha, nunca utilize cotonetes, palitos ou álcool caseiro: isso pode perfurar o tímpano ou piorar a inflamação.</p><p>A avaliação médica com visualização direta indica se é caso de higienização ou de tratamento tópico com gotas prescritas.</p><p><strong>Ouvido incômodo após contato com água? Agende sua consulta para alívio seguro.</strong></p>"
  },
  {
    "id": "artigo_obesidade",
    "category": "Cuidado Integral",
    "badgeOverlay": "Acompanhamento de Crônicos",
    "title": "⚖️ Obesidade e Saúde: um olhar acolhedor além da balança.",
    "image": "https://img.usecurling.com/p/600/380?q=nutrition%20lifestyle%20balance&color=green",
    "alt": "Refeição nutritiva e equilibrada com foco em bem-estar",
    "summary": "Sem culpas ou dietas restritivas impraticáveis. Conheça um acompanhamento médico contínuo centrado na sua disposição, metabolismo e rotina diária.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Acompanhamento &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Li%20o%20artigo%20sobre%20obesidade%20e%20sa%C3%BAde%20e%20gostaria%20de%20um%20acompanhamento%20m%C3%A9dico%20acolhedor.",
    "serviceKey": "Doenças Crônicas",
    "servicePrompt": "Acompanhamento de Crônicos (Metabolismo & Peso)",
    "fullHtml": "<p>O peso corporal é influenciado por genética, sono, regulação hormonal, estresse e rotina de vida. Julgar o paciente apenas pelo número da balança não resolve o problema e gera frustração.</p><p>Na Medicina de Família, investigamos marcadores metabólicos (como insulina, fígado e colesterol) e estabelecemos pactos realistas. Sem dietas da moda impossíveis de sustentar, construímos novos hábitos que cabem no seu dia a dia.</p><p>O objetivo é mais disposição, proteção cardiovascular e paz de espírito.</p><p><strong>Dê o primeiro passo em direção ao cuidado sem culpas. Agende seu acompanhamento crônico e metabólico.</strong></p>"
  },
  {
    "id": "artigo_sono",
    "category": "Descanso & Energia",
    "badgeOverlay": "Consulta Médica",
    "title": "💤 Sono e Disposição: como a qualidade do descanso impacta sua produtividade.",
    "image": "https://img.usecurling.com/p/600/380?q=restful%20sleep%20morning&color=blue",
    "alt": "Pessoa descansada acordando com energia pela manhã",
    "summary": "Acordar cansado todos os dias não é normal. Entenda como investigar causas clínicas de fadiga e recuperar seu sono reparador com apoio médico.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta Médica &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Estou%20com%20dificuldades%20para%20dormir%20bem%20e%20quero%20agendar%20uma%20consulta%20m%C3%A9dica.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica para Avaliação do Sono e Disposição",
    "fullHtml": "<p>Passar o dia arrastando cansaço, precisando de doses infinitas de café para funcionar, não é normal e não deve ser naturalizado.</p><p>Distúrbios do sono afetam a imunidade, desregulam a pressão arterial, aumentam o apetite por carboidratos e prejudicam a concentração e o humor. Na consulta, investigamos causas como apneia obstrutiva, hábitos noturnos prejudiciais e alterações clínicas silenciosas.</p><p>Com ajustes simples de higiene do sono e intervenção médica precisa, você retoma o vigor e a alegria de produzir com energia.</p><p><strong>Recupere o prazer de acordar com real descanso. Agende uma consulta médica focada na sua rotina.</strong></p>"
  },
  {
    "id": "artigo_imunidade",
    "category": "Prevenção Racional",
    "badgeOverlay": "Check-up Preventivo",
    "title": "🛡️ Imunidade e Prevenção: como preparar seu corpo para as mudanças de estação.",
    "image": "https://img.usecurling.com/p/600/380?q=healthy%20immune%20fresh%20fruits&color=orange",
    "alt": "Frutas frescas e estilo de vida que reforça as defesas naturais",
    "summary": "Fórmulas mágicas não substituem avaliação clínica. Descubra o que a ciência realmente comprova sobre fortalecer defesas através de um check-up assertivo.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Check-up &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20um%20check-up%20preventivo%20para%20avaliar%20minha%20imunidade.",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up Racional Preventivo (Imunidade)",
    "fullHtml": "<p>Com a alternância de calor intenso, umidade e chuvas em nossa região, gripes e crises respiratórias encontram o terreno perfeito para se espalhar.</p><p>A verdadeira imunidade não vem de suplementos milagrosos comprados sem receita, mas da regularidade no sono, vacinação em dia, controle de estresse e rastreio de deficiências reais no organismo.</p><p>Um check-up racional avalia suas vulnerabilidades biológicas e fornece orientações práticas para blindar a sua saúde antes que o clima te pegue de surpresa.</p><p><strong>Quer passar o ano com as defesas do corpo em alta? Agende seu check-up preventivo com a Dra. Cibele.</strong></p>"
  },
  {
    "id": "artigo_plano_cuidado",
    "category": "Comunicação Médica",
    "badgeOverlay": "Diferencial Dra. Cibele",
    "title": "📋 Plano de Cuidado Escrito: por que você não deve sair de uma consulta com dúvidas.",
    "image": "https://img.usecurling.com/p/600/380?q=doctor%20writing%20care%20plan&color=green",
    "alt": "Médica preenchendo plano de cuidado por escrito com clareza",
    "summary": "Nada de receitas ilegíveis ou orientações esquecidas. Entenda por que sair da consulta com um resumo claro em mãos transforma o sucesso do seu tratamento.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Valorizo%20um%20cuidado%20m%C3%A9dico%20claro%20e%20gostaria%20de%20agendar%20minha%20consulta.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica com Plano de Cuidado Escrito",
    "fullHtml": "<p>Quantas vezes você já saiu de um consultório sem entender a letra da receita, sem saber que horas tomar o remédio ou o que fazer caso sinta algum efeito colateral?</p><p>Na consulta com a Dra. Cibele Cristina, o <strong>Plano de Cuidado Escrito</strong> é um dos maiores pilares de respeito ao paciente. Cada orientação, ajuste de hábito e prazo para reavaliação é entregue por escrito, em linguagem limpa e acessível.</p><p>Dessa forma, você e sua família se sentem amparados, seguros e confiantes em cada passo do seu tratamento.</p><p><strong>Experimente uma medicina transparente e acolhedora. Agende sua consulta médica presencial ou online.</strong></p>"
  },
  {
    "id": "artigo_visita_domiciliar",
    "category": "Cuidado no Lar",
    "badgeOverlay": "Visita Domiciliar",
    "title": "🏡 Visita Domiciliar: a conveniência do cuidado médico no conforto do seu lar.",
    "image": "https://img.usecurling.com/p/600/380?q=home%20doctor%20elderly%20visit&color=green",
    "alt": "Médica em visita domiciliar atenciosa na sala de casa",
    "summary": "Para quem tem mobilidade reduzida ou prefere o aconchego de casa: uma consulta clínica detalhada, humana e resolutiva sem o estresse de deslocamento.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Visita Domiciliar &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20Visita%20Domiciliar%20para%20minha%20fam%C3%ADlia.",
    "serviceKey": "Visita Domiciliar",
    "servicePrompt": "Visita Domiciliar",
    "fullHtml": "<p>Para pacientes idosos, pessoas convalescentes após cirurgias ou com mobilidade comprometida, a jornada até um consultório médico pode ser desgastante e dolorosa.</p><p>A visita médica domiciliar resgata a essência da medicina familiar: a médica vai até a sua residência, conversa no seu ambiente, observa a dinâmica da casa e realiza o exame físico com total tranquilidade e respeito.</p><p>Uma experiência de atendimento acolhedora, que poupa desgaste físico e emocional de quem você mais ama.</p><p><strong>Precisa de atendimento em domicílio em Rio Branco? Solicite o agendamento de uma Visita Domiciliar.</strong></p>"
  },
  {
    "id": "artigo_teleconsulta",
    "category": "Atendimento Digital",
    "badgeOverlay": "Teleconsulta",
    "title": "💻 Teleconsulta: excelência médica a um clique de distância.",
    "image": "https://img.usecurling.com/p/600/380?q=telemedicine%20doctor%20video%20call&color=green",
    "alt": "Médica realizando teleatendimento por vídeo com sorriso e atenção",
    "summary": "Orientação segura de onde você estiver. Receba prescrições oficiais e pedidos de exames com certificação digital com validade nacional após a consulta.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Teleconsulta &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Gostaria%20de%20agendar%20uma%20Teleconsulta%20online.",
    "serviceKey": "Teleconsulta",
    "servicePrompt": "Teleconsulta Online",
    "fullHtml": "<p>A teleconsulta é uma realidade regulamentada que encurta distâncias sem perder o calor humano e a precisão do raciocínio clínico.</p><p>Ideal para quem tem rotina corrida, mora em localidades sem especialistas próximos ou necessita de orientação segura sobre sintomas e exames. As receitas, pedidos e atestados contam com certificado digital oficial pelo ICP-Brasil, válidos em farmácias e laboratórios de todo o país.</p><p>Cuidado médico de excelência, onde você estiver, pelo computador ou smartphone.</p><p><strong>Sem trânsito ou salas de espera. Agende agora sua Teleconsulta com a Dra. Cibele Cristina.</strong></p>"
  },
  {
    "id": "artigo_atividade_fisica",
    "category": "Exercício & Coração",
    "badgeOverlay": "Check-up Preventivo",
    "title": "🏃 Atividade Física com Segurança: a importância da avaliação prévia.",
    "image": "https://img.usecurling.com/p/600/380?q=running%20exercise%20fitness&color=green",
    "alt": "Pessoa praticando caminhada ao ar livre com saúde e segurança",
    "summary": "Iniciar treinos sem checar o coração e as articulações pode gerar riscos. Faça uma liberação médica responsável para se exercitar com confiança.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Check-up &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Quero%20iniciar%20atividades%20f%C3%ADsicas%20e%20gostaria%20de%20agendar%20um%20check-up%20preventivo.",
    "serviceKey": "Check-up",
    "servicePrompt": "Check-up e Avaliação para Atividade Física",
    "fullHtml": "<p>Praticar esportes, musculação ou iniciar corridas é uma das melhores decisões que você pode tomar pela sua saúde. No entanto, o entusiasmo inicial precisa vir acompanhado de segurança cardiovascular.</p><p>Uma consulta médica pré-participação checa a pressão arterial, ausculta cardiopulmonar, avalia riscos hereditários e histórico de sintomas como tontura ou dor torácica aos esforços.</p><p>Liberar o corpo com segurança garante que o exercício seja apenas fonte de longevidade, sem riscos desnecessários.</p><p><strong>Pronto para se movimentar com proteção e acompanhamento? Agende sua avaliação de check-up.</strong></p>"
  },
  {
    "id": "artigo_colesterol",
    "category": "Saúde Vascular",
    "badgeOverlay": "Acompanhamento de Crônicos",
    "title": "📉 Colesterol e Triglicerídeos: como a alimentação e o acompanhamento mudam seus números.",
    "image": "https://img.usecurling.com/p/600/380?q=healthy%20heart%20nutrition&color=red",
    "alt": "Cuidado cardiovascular e alimentação favorável ao equilíbrio lipídico",
    "summary": "Números altos no exame de sangue não exigem pânico, mas sim método. Veja como ajustes possíveis na alimentação e no acompanhamento protegem suas artérias.",
    "readTime": "Leitura: 4 min",
    "ctaBookText": "Agendar Acompanhamento &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Recebi%20exames%20com%20colesterol%2Ftriglicer%C3%ADdeos%20e%20gostaria%20de%20agendar%20um%20acompanhamento.",
    "serviceKey": "Doenças Crônicas",
    "servicePrompt": "Acompanhamento de Colesterol e Triglicerídeos",
    "fullHtml": "<p>Receber um exame de sangue com taxas de colesterol ou triglicerídeos elevadas costuma provocar susto e sensação de perda de controle.</p><p>A verdade é que esses lipídios respondem de forma muito favorável a intervenções estratégicas bem planejadas: desde a escolha das gorduras certas na cozinha até o ajuste farmacológico quando indicado por evidências.</p><p>Com acompanhamento médico contínuo, monitoramos a evolução das placas arteriais e reduzimos riscos vasculares sem impor restrições extremas e insustentáveis.</p><p><strong>Recebeu exames alterados e quer um plano seguro de controle? Agende seu acompanhamento crônico.</strong></p>"
  },
  {
    "id": "artigo_decisao_compartilhada",
    "category": "Relação Médico-Paciente",
    "badgeOverlay": "Identidade Humanizada",
    "title": "🤝 Decisão Compartilhada: você como protagonista do seu tratamento.",
    "image": "https://img.usecurling.com/p/600/380?q=doctor%20patient%20conversation%20smile&color=green",
    "alt": "Médica e paciente conversando em sintonia e respeito mútuo",
    "summary": "A melhor medicina acontece quando você é ouvido de verdade. Descubra como a parceria entre você e a Dra. Cibele constrói soluções reais que funcionam na sua vida.",
    "readTime": "Leitura: 3 min",
    "ctaBookText": "Agendar Consulta Médica &rarr;",
    "ctaBookUrl": "https://wa.me/5568981034408?text=Ol%C3%A1%20Dra.%20Cibele!%20Busco%20uma%20m%C3%A9dica%20humana%20e%20parceira%20para%20minha%20sa%C3%BAde.%20Gostaria%20de%20agendar%20uma%20consulta.",
    "serviceKey": "Consulta Médica",
    "servicePrompt": "Consulta Médica Humanizada (Decisão Compartilhada)",
    "fullHtml": "<p>O modelo antigo de medicina em que o profissional dá ordens e o paciente apenas obedece em silêncio ficou no passado. Tratamentos que ignoram seus desejos e limitações simplesmente não funcionam.</p><p>Na prática da Dra. Cibele Cristina, todas as decisões terapêuticas são tomadas a quatro mãos. Explicamos os prós, os contras, as alternativas e você participa ativamente da escolha do caminho que melhor respeita sua vida e seus princípios.</p><p>É a medicina feita com respeito mútuo, clareza e empatia de quem é <em>gente como a gente</em>.</p><p><strong>Quer viver uma experiência médica que realmente escuta você? Agende sua consulta hoje mesmo.</strong></p>"
  }
];

export const FAQ_ITEMS: FAQItemData[] = [
  {
    id: 'faq1',
    question: 'Qual é o tempo de duração da consulta?',
    answer: 'A consulta é realizada com tempo adequado para escuta, avaliação clínica e construção individualizada do plano de cuidado, favorecendo que todas as suas queixas e dúvidas sejam acolhidas com a atenção necessária.'
  },
  {
    id: 'faq2',
    question: 'A Dra. Cibele atende convênios ou somente particular?',
    answer: 'Os atendimentos são exclusivamente particulares, o que garante total liberdade para dedicar o tempo necessário a você sem as pressas dos planos de saúde. Fornecemos recibo médico detalhado e relatório clínico para que você possa solicitar o reembolso junto ao seu convênio conforme as normas da sua operadora.'
  },
  {
    id: 'faq3',
    question: 'Como funciona o preparo para a lavagem de ouvido?',
    answer: 'A remoção mecânica segura de cerúmen necessita de avaliação prévia por otoscopia. Frequentemente, orienta-se o uso prévio de gotas ceruminolíticas por alguns dias para amolecer a rolha de cera, garantindo que o procedimento ambulatorial seja suave, rápido e indolor.'
  },
  {
    id: 'faq4',
    question: 'A teleconsulta tem a mesma validade de uma consulta presencial?',
    answer: 'Sim! As teleconsultas são oficialmente regulamentadas pelo Conselho Federal de Medicina (CFM). Durante o atendimento por vídeo em ambiente seguro, a médica emite receitas digitais, pedidos de exames e atestados com assinatura digital certificada pela ICP-Brasil, aceitos em farmácias e laboratórios de todo o Brasil.'
  },
  {
    id: 'faq5',
    question: 'Como posso agendar minha consulta ou tirar dúvidas?',
    answer: 'Você pode solicitar seu agendamento de forma simples e direta pelo nosso WhatsApp oficial. Nossa equipe responderá prontamente com os horários disponíveis e todas as orientações necessárias para a sua consulta presencial ou teleconsulta.'
  }
];
