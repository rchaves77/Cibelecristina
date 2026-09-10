import { BlogPost, DoctorProfile, FAQItem, InsurancePlan, Testimonial } from '../types';

export const DOCTOR_PROFILE: DoctorProfile = {
  name: 'Dra. Cibele Cristina',
  fullName: 'Cibele Cristina Cunha Brígido',
  specialty: 'Medicina de Família e Comunidade',
  emphasis: 'Clínica Médica e Saúde Preventiva Integral',
  crm: 'CRM 3482 / AC', // Typical medical registry format
  rqe: 'RQE 1845',
  graduation: 'Graduação em Medicina',
  graduationInstitution: 'Universidad de Cádiz (Espanha, 2008)',
  graduationYear: 2008,
  revalidation: 'Diploma Revalidado pela Universidade Federal da Paraíba (UFPB)',
  postGraduation: 'Pós-graduação em Saúde da Família',
  postGraduationInstitution: 'Universidade Federal de Pelotas (UFPeL)',
  currentRoles: [
    'Sólida e ampla prática clínica em Medicina Interna e Urgências',
    'Vasta experiência em Atenção Primária e Medicina da Família',
    'Professora de PIS do Centro Universitário Uninorte',
    'Preceptora e educadora em Medicina Integral e Humanizada'
  ],
  lattesUrl: 'http://lattes.cnpq.br/4827103957281932',
  phone: '(68) 3224-5500',
  whatsapp: '5568999881122',
  email: 'contato@dracibelecristina.com.br',
  address: {
    clinic: 'Espaço Médico Integrado & Saúde da Família',
    street: 'Av. Ceará, 2850 - Edifício Saúde & Vida',
    neighborhood: 'Jardim Tropical',
    cityState: 'Rio Branco - AC',
    room: 'Consultório 402'
  },
  schedule: [
    { day: 'Segunda-feira', hours: '08:00 às 12:00 e 14:00 às 18:00', type: 'Consultório & Telemedicina' },
    { day: 'Terça-feira', hours: '08:00 às 12:00 (Tarde: Uninorte Docência)', type: 'Consultório Presencial' },
    { day: 'Quarta-feira', hours: '08:00 às 12:00 e 14:00 às 18:00', type: 'Consultório & Visitas Domiciliares' },
    { day: 'Quinta-feira', hours: '14:00 às 19:00', type: 'Consultório & Acompanhamento Crônico' },
    { day: 'Sexta-feira', hours: '08:00 às 13:00', type: 'Puericultura & Avaliação Familiar' },
    { day: 'Sábado', hours: '08:00 às 12:00 (Quinzenal)', type: 'Plantão Preventivo & Check-ups' }
  ]
};

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'check-up-preventivo-por-que-nao-esperar-sintomas',
    title: 'Check-up Preventivo: Por que você não deve esperar os sintomas para cuidar da sua saúde?',
    excerpt: 'Descubra como a medicina de família atua antes da doença se manifestar, reduzindo riscos de hipertensão, diabetes e problemas cardiovasculares com rastreio individualizado.',
    content: `A medicina tradicional muitas vezes foi encarada como um recurso de emergência: a pessoa só busca o consultório quando sente dores intensas, cansaço extremo ou nota alterações no corpo. No entanto, as doenças que mais impactam a qualidade e o tempo de vida — como a hipertensão arterial, a diabetes tipo 2 e dislipidemias — costumam ser silenciosas durante muitos anos.

### O papel da Medicina de Família e Comunidade
Como médica de família, meu compromisso com você vai muito além de prescrever remédios quando algo dói. Nosso foco é conhecer o seu histórico, seus hábitos de vida, seu ambiente de trabalho e suas predisposições genéticas. Com isso, traçamos um plano de rastreamento sob medida, evitando tanto a falta de exames essenciais quanto o excesso de intervenções desnecessárias.

### O que realmente importa em uma avaliação de rotina?
1. **História Clínica e Exame Físico Detalhado:** Aferição correta da pressão arterial, cálculo do IMC, circunferência abdominal e ausculta cardiopulmonar.
2. **Rastreio Metabólico Estratificado:** Exames laboratoriais selecionados com base na sua faixa etária, gênero e histórico familiar.
3. **Imunização em Dia:** Atualização da carteira vacinal do adulto e do idoso.
4. **Avaliação da Saúde Mental e Sono:** Ansiedade, estresse crônico e insônia afetam diretamente o sistema imune e a saúde cardíaca.

Agende sua consulta e venha conversar sobre sua saúde com tranquilidade. Cuidar de si é um gesto contínuo de amor à sua vida e à sua família.`,
    category: 'Prevenção',
    coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dra. Cibele Cristina',
      role: 'Médica de Família e Comunidade',
      avatar: '/cibele.png'
    },
    publishedAt: '2026-08-28',
    readTimeMinutes: 4,
    status: 'published',
    seoTitle: 'Check-up Preventivo com Médica de Família | Dra. Cibele Cristina',
    seoDescription: 'Entenda a importância do check-up preventivo individualizado e como a medicina de família atua na promoção de saúde e longevidade.',
    tags: ['Prevenção', 'Check-up', 'Atenção Primária', 'Saúde Integral']
  },
  {
    id: 'post-2',
    slug: 'puericultura-e-desenvolvimento-infantil',
    title: 'Puericultura: O acompanhamento do crescimento e marcos motores nos primeiros anos de vida',
    excerpt: 'Entenda como as consultas de puericultura acompanham a nutrição, vacinação, marcos do neurodesenvolvimento e orientam pais com afeto e segurança.',
    content: `A infância é uma das janelas de oportunidade mais preciosas da vida humana. Cada mês traz novas conquistas: a primeira sustentação do pescoço, o primeiro sorriso social, os primeiros balbucios e os passos iniciais. 

### O que é a Puericultura?
Puericultura é o ramo da medicina dedicado a acompanhar o crescimento e o desenvolvimento global da criança, desde o nascimento até a adolescência. Não é uma consulta rápida para tratar febre ou tosse, mas sim um momento de escuta detalhada com os pais.

### Pilares acompanhados em cada consulta:
- **Curvas de Crescimento (OMS):** Peso, estatura e perímetro cefálico acompanhados longitudinalmente.
- **Desenvolvimento Neuropsicomotor:** Avaliação de marcos motores, cognitivos e de linguagem.
- **Alimentação e Nutrição:** Suporte ao aleitamento materno e introdução alimentar guiada e respeitosa.
- **Calendário Vacinal:** Garantia de proteção imunológica completa.
- **Prevenção de Acidentes Domésticos:** Dicas práticas para as fases do engatinhar e andar.

Trazer seu filho para as consultas de rotina fortalece o vínculo de confiança entre a família e o médico, permitindo intervenções precoces que fazem toda a diferença para o futuro.`,
    category: 'Crianças',
    coverImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dra. Cibele Cristina',
      role: 'Médica de Família e Comunidade',
      avatar: '/cibele.png'
    },
    publishedAt: '2026-08-15',
    readTimeMinutes: 5,
    status: 'published',
    seoTitle: 'Consulta de Puericultura e Desenvolvimento Infantil | Dra. Cibele Cristina',
    seoDescription: 'Guia completo de puericultura para pais: vacinas, alimentação, marcos motores e cuidado preventivo para bebês e crianças.',
    tags: ['Crianças', 'Puericultura', 'Pediatria', 'Desenvolvimento']
  },
  {
    id: 'post-3',
    slug: 'manejo-da-hipertensao-e-diabetes-no-adulto',
    title: 'Hipertensão e Diabetes no Adulto: Como ter autonomia e qualidade de vida sem neuras',
    excerpt: 'Orientações práticas para manter o controle glicêmico e a pressão arterial estáveis, aliando medicação correta, alimentação acessível e acompanhamento contínuo.',
    content: `Receber o diagnóstico de pressão alta ou diabetes muitas vezes assusta o paciente. Surgem dúvidas sobre restrições alimentares, medo de complicações e insegurança em relação ao uso contínuo de medicamentos.

No entanto, o tratamento não precisa ser um fardo. Com a medicina de família, construímos juntos uma rotina realista que se adapta à sua vida, e não o contrário.

### Os 4 eixos do controle eficaz:
1. **Compreensão da Doença:** Saber o que significam seus números de glicemia de jejum, hemoglobina glicada e pressão arterial.
2. **Ajuste Medicamentoso Individualizado:** Menos efeitos colaterais e maior comodidade posológica para facilitar a adesão.
3. **Alimentação Descomplicada:** Foco em comida de verdade, redução inteligente do sal e açúcares refinados, sem dietas extremas insustentáveis.
4. **Monitoramento Domiciliar Periódico:** Como aferir sua pressão corretamente e quando entrar em contato com o consultório.

Com o acompanhamento regular, você previne complicações renais, oculares e cardíacas, mantendo sua produtividade e energia para aproveitar o dia a dia com sua família.`,
    category: 'Adultos',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dra. Cibele Cristina',
      role: 'Médica de Família e Comunidade',
      avatar: '/cibele.png'
    },
    publishedAt: '2026-08-05',
    readTimeMinutes: 4,
    status: 'published',
    seoTitle: 'Controle de Hipertensão e Diabetes no Adulto | Dra. Cibele Cristina',
    seoDescription: 'Aprenda como controlar a pressão arterial e a diabetes com apoio da médica de família e hábitos saudáveis.',
    tags: ['Adultos', 'Hipertensão', 'Diabetes', 'Clínica Médica']
  },
  {
    id: 'post-4',
    slug: 'envelhecimento-ativo-e-prevencao-de-quedas-em-idosos',
    title: 'Envelhecimento Ativo: Estratégias médicas para autonomia, cognição e prevenção de quedas',
    excerpt: 'Cuidar da saúde do idoso requer olhar holístico: revisão de polifarmácia, fortalecimento muscular, adaptação do ambiente e preservação da independência.',
    content: `Envelhecer com saúde e dignidade é um direito e uma conquista. Na medicina da família, nosso foco principal com a pessoa idosa é preservar a sua funcionalidade — ou seja, a capacidade de realizar suas próprias atividades, interagir socialmente e tomar decisões com clareza.

### A importância da Avaliação Geriátrica Ampla:
- **Revisão de Medicamentos (Desprescrição):** É muito frequente idosos tomarem múltiplos remédios prescritos por médicos diferentes. Revisamos interações medicamentosas para eliminar substâncias desnecessárias que causam tonturas e sonolência.
- **Saúde Óssea e Muscular:** A sarcopenia (perda de massa muscular) é a principal causa de fragilidade. Exercícios resistidos supervisionados e ingestão proteica adequada protegem as articulações.
- **Prevenção Ativa de Quedas:** Iluminação adequada nos corredores, eliminação de tapetes soltos e barras de apoio no banheiro evitam fraturas que comprometem a mobilidade.
- **Estímulo Cognitivo e Afetivo:** A solidão e a depressão na terceira idade são silenciosas. Cultivar laços afetivos e atividades mentais estimulantes protege a memória.`,
    category: 'Idosos',
    coverImage: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dra. Cibele Cristina',
      role: 'Médica de Família e Comunidade',
      avatar: '/cibele.png'
    },
    publishedAt: '2026-07-20',
    readTimeMinutes: 5,
    status: 'published',
    seoTitle: 'Envelhecimento Ativo e Prevenção de Quedas | Dra. Cibele Cristina',
    seoDescription: 'Dicas médicas essenciais para a saúde do idoso: revisão de remédios, fortalecimento e autonomia com atendimento humanizado.',
    tags: ['Idosos', 'Longevidade', 'Autonomia', 'Geriatria Preventiva']
  },
  {
    id: 'post-5',
    slug: 'sono-reparador-e-gestao-do-estresse',
    title: 'Sono Reparador e Gestão do Estresse: A base biológica da sua imunidade e disposição',
    excerpt: 'Aprenda técnicas validadas pela ciência para melhorar a higiene do sono, regular o cortisol e recuperar a energia física e mental no cotidiano.',
    content: `Quantas vezes você acordou com a sensação de não ter descansado nada? O estresse crônico do trabalho e o excesso de telas antes de dormir alteram a produção de melatonina e mantêm o organismo em estado constante de alerta.

### O impacto do sono na saúde:
Durante o sono profundo, o cérebro realiza uma verdadeira faxina metabólica, consolidando memórias e reparando tecidos. A privação do sono está associada a:
- Aumento da pressão arterial noturna
- Maior resistência à insulina e compulsão por carboidratos refinados
- Queda da imunidade celular
- Oscilações de humor e irritabilidade

### Guia prático de Higiene do Sono:
1. **Regra das Telas:** Desligue celulares e tablets pelo menos 45 minutos antes de deitar.
2. **Ambiente Escuro e Silencioso:** A escuridão total estimula o pico fisiológico de melatonina.
3. **Evite Estimulantes após as 15h:** Café, refrigerantes de cola e energéticos têm meia-vida longa no fígado.
4. **Respiração Diafragmática:** 5 minutos de respiração calma reduzem a frequência cardíaca e induzem o relaxamento parassimpático.`,
    category: 'Estilo de Vida',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
    author: {
      name: 'Dra. Cibele Cristina',
      role: 'Médica de Família e Comunidade',
      avatar: '/cibele.png'
    },
    publishedAt: '2026-07-10',
    readTimeMinutes: 4,
    status: 'published',
    seoTitle: 'Higiene do Sono e Controle do Estresse | Dra. Cibele Cristina',
    seoDescription: 'Orientações práticas de estilo de vida para noites reparadoras, equilíbrio emocional e imunidade reforçada.',
    tags: ['Estilo de Vida', 'Sono', 'Saúde Mental', 'Bem-Estar']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Mariana Vasconcelos',
    roleOrRelation: 'Paciente há 2 anos • Acompanhamento Familiar',
    comment: 'A Dra. Cibele é aquele tipo raro de médica que olha no seu olho, escuta com atenção genuína e não tem pressa. Ela cuida de mim, do meu marido e dos meus pais idosos. O atendimento humanizado fez toda a diferença no controle da pressão da minha mãe.',
    rating: 5,
    date: 'Agosto de 2026',
    treatmentType: 'Check-up Familiar e Hipertensão'
  },
  {
    id: 'test-2',
    name: 'Carlos Eduardo Nogueira',
    roleOrRelation: 'Paciente de Clínica Geral',
    comment: 'Cheguei com exames alterados e muito assustado. A Dra. Cibele explicou cada detalhe com calma e clareza, sem me aterrorizar, e montou um plano simples de alimentação e medicação. Em 4 meses meus exames normalizaram. Recomendo de olhos fechados!',
    rating: 5,
    date: 'Julho de 2026',
    treatmentType: 'Controle de Diabetes e Colesterol'
  },
  {
    id: 'test-3',
    name: 'Juliana e Renato Medeiros',
    roleOrRelation: 'Pais do Theo (1 ano e 4 meses)',
    comment: 'Fazemos todo o acompanhamento de puericultura do nosso filho com a Dra. Cibele. Como pais de primeira viagem, tínhamos mil dúvidas. A tranquilidade e o carinho com que ela examina o bebê nos dão uma segurança impagável. O agendamento pelo WhatsApp também é super prático.',
    rating: 5,
    date: 'Junho de 2026',
    treatmentType: 'Puericultura e Desenvolvimento Infantil'
  },
  {
    id: 'test-4',
    name: 'Dona Francisca Albuquerque (72 anos)',
    roleOrRelation: 'Paciente de Medicina Preventiva do Idoso',
    comment: 'Eu tomava oito comprimidos por dia e vivia tonta. A Dra. Cibele revisou tudo com muita paciência, conversou com meus outros médicos e ajustou os horários. Hoje tenho disposição para caminhar e brincar com meus netos. Uma médica enviada por Deus.',
    rating: 5,
    date: 'Maio de 2026',
    treatmentType: 'Saúde do Idoso e Desprescrição'
  },
  {
    id: 'test-5',
    name: 'Rodrigo Fontes Pinheiro',
    roleOrRelation: 'Paciente de Telemedicina',
    comment: 'Moro no interior e a telemedicina com a Dra. Cibele foi uma bênção. A plataforma é fácil de usar e o envio das receitas digitais com assinatura ICP-Brasil foi imediato. O atendimento não perdeu nada em acolhimento e calor humano.',
    rating: 5,
    date: 'Abril de 2026',
    treatmentType: 'Consulta Online / Telemedicina'
  }
];

export const INSURANCE_PLANS: InsurancePlan[] = [
  {
    id: 'unimed',
    name: 'Unimed',
    tagline: 'Planos Regionais e Nacionais',
    logoText: 'UNIMED',
    coveredServices: ['Consultas Clínicas', 'Avaliação Preventiva', 'Puericultura', 'Acompanhamento Crônico'],
    notes: 'Atendimento direto via autorização no consultório com carteirinha física ou digital.'
  },
  {
    id: 'bradesco',
    name: 'Bradesco Saúde',
    tagline: 'Top Nacional e Linhas Selecionadas',
    logoText: 'BRADESCO SAÚDE',
    coveredServices: ['Consultas Presenciais', 'Telemedicina Credenciada', 'Check-up Clínico'],
    notes: 'Cobertura integral conforme plano contratado.'
  },
  {
    id: 'sulamerica',
    name: 'SulAmérica',
    tagline: 'Saúde Integral e Executivo',
    logoText: 'SULAMÉRICA',
    coveredServices: ['Consultas de Família', 'Saúde da Mulher', 'Saúde do Idoso'],
    notes: 'Aceito para consultas eletivas agendadas.'
  },
  {
    id: 'cassi',
    name: 'Cassi',
    tagline: 'Caixa de Assistência do Banco do Brasil',
    logoText: 'CASSI',
    coveredServices: ['Atenção Primária', 'Acompanhamento Domiciliar Elegível', 'Clínica Geral'],
    notes: 'Forte ênfase no modelo de Médico de Família.'
  },
  {
    id: 'postal',
    name: 'Postal Saúde',
    tagline: 'Assistência Médica dos Correios',
    logoText: 'POSTAL SAÚDE',
    coveredServices: ['Consultas Ambulatoriais', 'Rotina Preventiva', 'Puericultura'],
    notes: 'Apresentação de carteirinha e documento com foto.'
  },
  {
    id: 'geap',
    name: 'GEAP Saúde',
    tagline: 'Fundação de Seguridade Social',
    logoText: 'GEAP SAÚDE',
    coveredServices: ['Consultas Clínicas', 'Acompanhamento de Hipertensão e Diabetes'],
    notes: 'Autorização ágil no momento da recepção.'
  },
  {
    id: 'assefaz',
    name: 'Assefaz',
    tagline: 'Fundação Assistencial dos Servidores do MF',
    logoText: 'ASSEFAZ',
    coveredServices: ['Consultas Médicas', 'Medicina Preventiva'],
    notes: 'Válido para beneficiários titulares e dependentes.'
  },
  {
    id: 'particular',
    name: 'Particular & Reembolso',
    tagline: 'Recibo Médico Completo para Reembolso',
    logoText: 'PARTICULAR',
    coveredServices: ['Tempo Estendido de Consulta', 'Canal Direto de Suporte', 'Atestados e Relatórios'],
    notes: 'Fornecemos nota fiscal detalhada e relatório médico para você solicitar 100% de reembolso ao seu plano (como Amil, Omint, Care Plus, etc.).'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Agendamento',
    question: '1. Como funciona o agendamento online e a confirmação via WhatsApp?',
    answer: 'É simples e ágil: você seleciona no site a modalidade, o serviço desejado, a data e o horário disponível na agenda da Dra. Cibele. Ao clicar em confirmar, os dados do seu agendamento são registrados no sistema e uma conversa no WhatsApp da recepção é aberta com a mensagem pronta. A equipe responde prontamente confirmando seu horário, sem filas de espera ou burocracia.'
  },
  {
    id: 'faq-2',
    category: 'Tipos de Consulta',
    question: '2. Quais são os tipos e modalidades de consulta disponíveis?',
    answer: 'A Dra. Cibele oferece três modalidades: 1) Presencial no consultório (Espaço Médico Integrado), com ambiente privativo e acolhedor; 2) Visita Domiciliar, estruturada especialmente para idosos, pessoas com mobilidade reduzida ou pós-parto; e 3) Telemedicina por videoconferência segura, com emissão de receitas e pedidos com assinatura digital ICP-Brasil válida em todo o Brasil.'
  },
  {
    id: 'faq-3',
    category: 'Convênios',
    question: '3. Quais convênios são aceitos e como funciona o reembolso?',
    answer: 'Aceitamos diretamente os principais planos (Unimed, Bradesco Saúde, SulAmérica, Cassi, Postal Saúde, GEAP, Assefaz). Para pacientes de outros planos (como Amil, Omint, Care Plus) ou particulares, fornecemos nota fiscal com CRM e relatório médico detalhado com CID para você solicitar o reembolso de até 100% do valor da consulta junto ao seu plano de saúde.'
  },
  {
    id: 'faq-4',
    category: 'Serviços Oferecidos',
    question: '4. Quais serviços e áreas de acompanhamento a Dra. Cibele realiza?',
    answer: 'Como Médica de Família e Comunidade com ênfase em clínica médica, ela realiza: check-up preventivo individualizado, puericultura e acompanhamento do crescimento infantil, controle de hipertensão e diabetes, desprescrição e revisão de medicamentos em idosos, saúde integral da mulher e manejo de sintomas agudos para toda a família.'
  },
  {
    id: 'faq-5',
    category: 'Diferencial Particular',
    question: '5. Qual é o diferencial de consultar no particular em relação ao atendimento público?',
    answer: 'O grande diferencial é o tempo e a profundidade do cuidado: no consultório particular, a Dra. Cibele dedica de 45 a 60 minutos exclusivos para você, sem a pressa ou filas exaustivas da rede pública. Você tem pontualidade rigorosa, acolhimento integral de toda a sua história de saúde, ambiente calmo e um canal de contato direto para acompanhamento contínuo e dúvidas entre as consultas.'
  }
];

export const PRESET_IMAGE_LIBRARY = [
  {
    label: 'Clínica & Consulta Humanizada',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    category: 'Prevenção'
  },
  {
    label: 'Cuidado Infantil & Família',
    url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
    category: 'Crianças'
  },
  {
    label: 'Estetoscópio & Exames Clínicos',
    url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    category: 'Adultos'
  },
  {
    label: 'Idoso Ativo & Longevidade',
    url: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80',
    category: 'Idosos'
  },
  {
    label: 'Alimentação Saudável & Equilíbrio',
    url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    category: 'Estilo de Vida'
  },
  {
    label: 'Sono & Relaxamento Saudável',
    url: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
    category: 'Estilo de Vida'
  },
  {
    label: 'Caminhada & Atividade Física',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    category: 'Prevenção'
  }
];
