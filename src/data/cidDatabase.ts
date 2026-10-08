/**
 * BANCO INTEGRADO DE REGISTROS OFICIAIS CID-10 (OMS / DATASUS)
 * Classificação Internacional de Doenças (OMS / Ministério da Saúde / DATASUS)
 * Mapeamento clínico para Medicina de Família e Comunidade, Clínica Médica e Ambulatório
 */

export interface CidItem {
  id: string;
  cid10: string;
  cid11: string;
  nome: string;
  categoria: string;
  grupo?: string;
  sinonimos?: string[];
  descricaoDetalhada?: string;
}

export const CID_DATABASE: CidItem[] = [
  // --- APARELHO CIRCULATÓRIO / CARDIOVASCULAR ---
  {
    id: 'cid-i10',
    cid10: 'I10',
    cid11: 'BA00',
    nome: 'Hipertensão arterial essencial (primária)',
    categoria: 'Cardiovascular',
    sinonimos: ['pressão alta', 'has', 'hipertensao', 'pressao arterial elevada'],
    descricaoDetalhada: 'Elevação sustentada dos níveis pressóricos sistólicos ≥ 140 mmHg e/ou diastólicos ≥ 90 mmHg.'
  },
  {
    id: 'cid-i11',
    cid10: 'I11',
    cid11: 'BA01',
    nome: 'Doença cardíaca hipertensiva',
    categoria: 'Cardiovascular',
    sinonimos: ['cardiopatia hipertensiva', 'hipertensao com acometimento cardiaco']
  },
  {
    id: 'cid-i20',
    cid10: 'I20',
    cid11: 'BA40',
    nome: 'Angina pectoris',
    categoria: 'Cardiovascular',
    sinonimos: ['dor no peito', 'isquemia miocardica', 'angina estavel']
  },
  {
    id: 'cid-i21',
    cid10: 'I21',
    cid11: 'BA41',
    nome: 'Infarto agudo do miocárdio (IAM)',
    categoria: 'Cardiovascular',
    sinonimos: ['ataque cardiaco', 'infarto', 'iam']
  },
  {
    id: 'cid-i25',
    cid10: 'I25',
    cid11: 'BA80',
    nome: 'Doença isquêmica crônica do coração',
    categoria: 'Cardiovascular',
    sinonimos: ['coronariopatia cronica', 'dac']
  },
  {
    id: 'cid-i50',
    cid10: 'I50',
    cid11: 'BD10',
    nome: 'Insuficiência cardíaca (IC)',
    categoria: 'Cardiovascular',
    sinonimos: ['ic', 'insuficiencia cardiaca congestiva', 'icc', 'falencia cardiaca']
  },
  {
    id: 'cid-i83',
    cid10: 'I83',
    cid11: 'BD71',
    nome: 'Varizes dos membros inferiores',
    categoria: 'Cardiovascular',
    sinonimos: ['varizes', 'insuficiencia venosa periferica', 'pernas cansadas']
  },
  {
    id: 'cid-i95',
    cid10: 'I95',
    cid11: 'BA04',
    nome: 'Hipotensão arterial',
    categoria: 'Cardiovascular',
    sinonimos: ['pressao baixa', 'queda de pressao', 'hipotensao ortostatica']
  },

  // --- APARELHO RESPIRATÓRIO & OTORRINOLARINGOLOGIA ---
  {
    id: 'cid-j00',
    cid10: 'J00',
    cid11: 'CA00',
    nome: 'Nasofaringite aguda (Resfriado comum)',
    categoria: 'Respiratório',
    sinonimos: ['resfriado', 'coriza', 'nariz escorrendo', 'congestao nasal']
  },
  {
    id: 'cid-j01',
    cid10: 'J01',
    cid11: 'CA01',
    nome: 'Sinusite aguda',
    categoria: 'Respiratório',
    sinonimos: ['rinossinusite aguda', 'dor facial', 'congestao dos seios da face']
  },
  {
    id: 'cid-j02',
    cid10: 'J02',
    cid11: 'CA02',
    nome: 'Faringite aguda',
    categoria: 'Respiratório',
    sinonimos: ['dor de garganta', 'faringite viral', 'faringite estreptococica']
  },
  {
    id: 'cid-j03',
    cid10: 'J03',
    cid11: 'CA03',
    nome: 'Amigdalite aguda',
    categoria: 'Respiratório',
    sinonimos: ['tonsilite aguda', 'amigdalas inflamadas', 'placas na garganta']
  },
  {
    id: 'cid-j06',
    cid10: 'J06',
    cid11: 'CA06',
    nome: 'Infecção aguda das vias aéreas superiores não especificada (IVAS)',
    categoria: 'Respiratório',
    sinonimos: ['ivas', 'virose respiratoria', 'infeccao de via aerea superior']
  },
  {
    id: 'cid-j10',
    cid10: 'J10',
    cid11: 'CA22',
    nome: 'Influenza (Gripe) por vírus identificado',
    categoria: 'Respiratório',
    sinonimos: ['gripe a', 'h1n1', 'influenza', 'gripe suina']
  },
  {
    id: 'cid-j11',
    cid10: 'J11',
    cid11: 'CA23',
    nome: 'Influenza (Gripe) por vírus não identificado',
    categoria: 'Respiratório',
    sinonimos: ['sindrome gripal', 'gripe sazonal', 'febre e tosse']
  },
  {
    id: 'cid-j18',
    cid10: 'J18',
    cid11: 'CA40',
    nome: 'Pneumonia por microrganismo não especificado',
    categoria: 'Respiratório',
    sinonimos: ['pneumonia adquirida na comunidade', 'pac', 'infeccao pulmonar']
  },
  {
    id: 'cid-j20',
    cid10: 'J20',
    cid11: 'CA42',
    nome: 'Bronquite aguda',
    categoria: 'Respiratório',
    sinonimos: ['bronquite', 'tosse produtiva com catarro']
  },
  {
    id: 'cid-j30',
    cid10: 'J30',
    cid11: 'CA08',
    nome: 'Rinite alérgica e vasomotora',
    categoria: 'Respiratório',
    sinonimos: ['rinite alergica', 'espirros frequentes', 'prurido nasal', 'alergia']
  },
  {
    id: 'cid-j32',
    cid10: 'J32',
    cid11: 'CA0E',
    nome: 'Sinusite crônica',
    categoria: 'Respiratório',
    sinonimos: ['rinossinusite cronica', 'gotejamento pos-nasal']
  },
  {
    id: 'cid-j44',
    cid10: 'J44',
    cid11: 'CA22',
    nome: 'Doença pulmonar obstrutiva crônica (DPOC)',
    categoria: 'Respiratório',
    sinonimos: ['dpoc', 'enfisema pulmonar', 'bronquite cronica']
  },
  {
    id: 'cid-j45',
    cid10: 'J45',
    cid11: 'CA23',
    nome: 'Asma brônquica',
    categoria: 'Respiratório',
    sinonimos: ['asma', 'bronquite asmatica', 'chiado no peito', 'dispneia']
  },
  {
    id: 'cid-r05',
    cid10: 'R05',
    cid11: 'MD11',
    nome: 'Tosse persistente ou aguda',
    categoria: 'Sintomas e Sinais',
    sinonimos: ['tosse seca', 'tosse produtiva', 'pigarro']
  },

  // --- OUVIDO E MASTOIDE (OTORRINOLARINGOLOGIA & LAVAGEM OTOLÓGICA) ---
  {
    id: 'cid-h60',
    cid10: 'H60',
    cid11: 'AA00',
    nome: 'Otite externa',
    categoria: 'Ouvido & Otorrino',
    sinonimos: ['otite de piscina', 'dor no conduto auditivo', 'ouvido inflamado']
  },
  {
    id: 'cid-h61',
    cid10: 'H61.2',
    cid11: 'AB12',
    nome: 'Cerume impactado (Rolha ceruminosa)',
    categoria: 'Ouvido & Otorrino',
    sinonimos: ['cerume no ouvido', 'ouvido tampado', 'rolha de cera', 'lavagem de ouvido', 'lavagem otologica'],
    descricaoDetalhada: 'Obstrução do meato acústico externo por acúmulo e impactação de cerúmen, justificando procedimento de lavagem otológica com seringa de Jansen.'
  },
  {
    id: 'cid-h65',
    cid10: 'H65',
    cid11: 'AA40',
    nome: 'Otite média não supurativa (Otite serosa)',
    categoria: 'Ouvido & Otorrino',
    sinonimos: ['ouvido tapado', 'otite secretora', 'sensacao de agua no ouvido']
  },
  {
    id: 'cid-h66',
    cid10: 'H66',
    cid11: 'AA41',
    nome: 'Otite média supurativa e não especificada',
    categoria: 'Ouvido & Otorrino',
    sinonimos: ['otite media aguda', 'oma', 'dor de ouvido com febre']
  },
  {
    id: 'cid-h81',
    cid10: 'H81',
    cid11: 'AB31',
    nome: 'Transtornos da função vestibular (Labirintite / VPPB)',
    categoria: 'Ouvido & Otorrino',
    sinonimos: ['labirintite', 'tontura rotatoria', 'vertigem posicional paroxistica benigna', 'vppb']
  },
  {
    id: 'cid-r42',
    cid10: 'R42',
    cid11: 'MB23',
    nome: 'Tontura e instabilidade',
    categoria: 'Sintomas e Sinais',
    sinonimos: ['vertigem', 'tonteira', 'desequilibrio']
  },

  // --- SAÚDE MENTAL & TRANSTORNOS COMPORTAMENTAIS ---
  {
    id: 'cid-f32',
    cid10: 'F32',
    cid11: '6A70',
    nome: 'Episódio depressivo',
    categoria: 'Saúde Mental',
    sinonimos: ['depressao', 'tristeza profunda', 'anedonia', 'desanimo']
  },
  {
    id: 'cid-f33',
    cid10: 'F33',
    cid11: '6A71',
    nome: 'Transtorno depressivo recorrente',
    categoria: 'Saúde Mental',
    sinonimos: ['depressao cronica', 'depressao maior recorrente']
  },
  {
    id: 'cid-f41-0',
    cid10: 'F41.0',
    cid11: '6B01',
    nome: 'Transtorno de pânico (Ansiedade paroxística episódica)',
    categoria: 'Saúde Mental',
    sinonimos: ['panico', 'ataque de panico', 'crise de ansiedade aguda']
  },
  {
    id: 'cid-f41-1',
    cid10: 'F41.1',
    cid11: '6B00',
    nome: 'Transtorno de ansiedade generalizada (TAG)',
    categoria: 'Saúde Mental',
    sinonimos: ['tag', 'ansiedade generalizada', 'preocupacao excessiva', 'nervosismo']
  },
  {
    id: 'cid-f41-2',
    cid10: 'F41.2',
    cid11: '6A73',
    nome: 'Transtorno misto ansioso e depressivo',
    categoria: 'Saúde Mental',
    sinonimos: ['ansiedade e depressao juntas', 'sintomas mistos']
  },
  {
    id: 'cid-f43-0',
    cid10: 'F43.0',
    cid11: '6B43',
    nome: 'Reação aguda ao estresse',
    categoria: 'Saúde Mental',
    sinonimos: ['estresse agudo', 'sobrecarga emocional', 'crise emocional']
  },
  {
    id: 'cid-f43-1',
    cid10: 'F43.1',
    cid11: '6B40',
    nome: 'Transtorno de estresse pós-traumático (TEPT)',
    categoria: 'Saúde Mental',
    sinonimos: ['tept', 'estresse pos traumatico', 'trauma psicologico']
  },
  {
    id: 'cid-f43-2',
    cid10: 'F43.2',
    cid11: '6B43',
    nome: 'Transtornos de adaptação (Ajustamento)',
    categoria: 'Saúde Mental',
    sinonimos: ['dificuldade de adaptacao', 'luto', 'separacao']
  },
  {
    id: 'cid-f51',
    cid10: 'F51',
    cid11: '7A00',
    nome: 'Transtornos do sono não-orgânicos (Insônia)',
    categoria: 'Saúde Mental',
    sinonimos: ['insonia', 'sono fragmentado', 'dificuldade para dormir', 'despertar precoce']
  },
  {
    id: 'cid-f90',
    cid10: 'F90',
    cid11: '6A05',
    nome: 'Transtornos hipercinéticos (TDAH)',
    categoria: 'Neurodesenvolvimento',
    sinonimos: ['tdah', 'deficit de atencao', 'hiperatividade', 'desatencao escolar']
  },
  {
    id: 'cid-f84',
    cid10: 'F84',
    cid11: '6A02',
    nome: 'Transtornos globais do desenvolvimento (Autismo / TEA)',
    categoria: 'Neurodesenvolvimento',
    sinonimos: ['autismo', 'tea', 'espectro autista', 'asperger']
  },
  {
    id: 'cid-qd85',
    cid10: 'Z73.0',
    cid11: 'QD85',
    nome: 'Síndrome de Burnout (Esgotamento profissional)',
    categoria: 'Saúde Ocupacional & Mental',
    sinonimos: ['burnout', 'estresse ocupacional', 'estafa mental', 'esgotamento no trabalho']
  },

  // --- ENDOCRINOLOGIA, NUTRIÇÃO E METABOLISMO ---
  {
    id: 'cid-e10',
    cid10: 'E10',
    cid11: '5A10',
    nome: 'Diabetes mellitus tipo 1',
    categoria: 'Endocrinologia',
    sinonimos: ['dm1', 'diabetes juvenil', 'diabetes insulino-dependente']
  },
  {
    id: 'cid-e11',
    cid10: 'E11',
    cid11: '5A11',
    nome: 'Diabetes mellitus tipo 2',
    categoria: 'Endocrinologia',
    sinonimos: ['dm2', 'diabetes do adulto', 'glicemia alta', 'hiperglicemia']
  },
  {
    id: 'cid-e03',
    cid10: 'E03',
    cid11: '5A00',
    nome: 'Hipotireoidismo não especificado',
    categoria: 'Endocrinologia',
    sinonimos: ['tireoide preguicosa', 'tsh elevado', 'tireoidite de hashimoto']
  },
  {
    id: 'cid-e05',
    cid10: 'E05',
    cid11: '5A02',
    nome: 'Tireotoxicose (Hipertireoidismo)',
    categoria: 'Endocrinologia',
    sinonimos: ['hipertireoidismo', 'doenca de graves', 'palpitacoes e emagrecimento']
  },
  {
    id: 'cid-e66',
    cid10: 'E66',
    cid11: '5B81',
    nome: 'Obesidade',
    categoria: 'Endocrinologia',
    sinonimos: ['obesidade grau 1', 'obesidade grau 2', 'obesidade morbida', 'excesso de peso', 'imc elevado']
  },
  {
    id: 'cid-e78',
    cid10: 'E78',
    cid11: '5C80',
    nome: 'Distúrbios do metabolismo de lipoproteínas (Dislipidemia / Colesterol)',
    categoria: 'Endocrinologia',
    sinonimos: ['colesterol alto', 'hipercolesterolemia', 'triglicerideos altos', 'dislipidemia']
  },
  {
    id: 'cid-e79',
    cid10: 'E79',
    cid11: '5C81',
    nome: 'Hiperuricemia (Ácido úrico elevado / Gota)',
    categoria: 'Endocrinologia',
    sinonimos: ['acido urico alto', 'gota', 'artrite gotosa']
  },

  // --- APARELHO DIGESTIVO & GASTROENTEROLOGIA ---
  {
    id: 'cid-k21',
    cid10: 'K21',
    cid11: 'DA22',
    nome: 'Doença do refluxo gastroesofágico (DRGE)',
    categoria: 'Digestivo',
    sinonimos: ['drge', 'refluxo', 'azia', 'queimacao no estomago', 'pirose']
  },
  {
    id: 'cid-k29',
    cid10: 'K29',
    cid11: 'DA42',
    nome: 'Gastrite e duodenite',
    categoria: 'Digestivo',
    sinonimos: ['gastrite aguda', 'dor de estomago', 'epigastralgia', 'dispepsia']
  },
  {
    id: 'cid-k58',
    cid10: 'K58',
    cid11: 'DD91',
    nome: 'Síndrome do intestino irritável (SII)',
    categoria: 'Digestivo',
    sinonimos: ['sii', 'colon irritavel', 'distensao abdominal e diarreia']
  },
  {
    id: 'cid-k59',
    cid10: 'K59.0',
    cid11: 'DB30',
    nome: 'Constipação intestinal (Prisão de ventre)',
    categoria: 'Digestivo',
    sinonimos: ['intestino preso', 'constipacao cronica', 'fezes ressecadas']
  },
  {
    id: 'cid-a09',
    cid10: 'A09',
    cid11: '1A00',
    nome: 'Diarreia e gastroenterite infecciosa presumida (GECA)',
    categoria: 'Digestivo & Infeccioso',
    sinonimos: ['geca', 'gastroenterite', 'diarreia aguda', 'virose intestinal', 'dor de barriga']
  },
  {
    id: 'cid-k80',
    cid10: 'K80',
    cid11: 'DC11',
    nome: 'Colelitíase (Cálculo na vesícula biliar)',
    categoria: 'Digestivo',
    sinonimos: ['pedra na vesicula', 'colica biliar']
  },
  {
    id: 'cid-k76',
    cid10: 'K76.0',
    cid11: 'DB92',
    nome: 'Esteatose hepática (Gordura no fígado)',
    categoria: 'Digestivo',
    sinonimos: ['gordura no figado', 'esteatose', 'figado gorduroso']
  },

  // --- SISTEMA OSTEOMUSCULAR, REUMATOLOGIA & COLUNA ---
  {
    id: 'cid-m54-5',
    cid10: 'M54.5',
    cid11: 'ME84.2',
    nome: 'Dor lombar baixa (Lombalgia)',
    categoria: 'Musculoesquelético',
    sinonimos: ['lombalgia aguda', 'dor nas costas', 'coluna travada', 'bico de papagaio', 'lumbago']
  },
  {
    id: 'cid-m54-2',
    cid10: 'M54.2',
    cid11: 'ME84.0',
    nome: 'Cervicalgia (Dor cervical / pescoço)',
    categoria: 'Musculoesquelético',
    sinonimos: ['dor no pescoco', 'torcicolo', 'dor na nuca']
  },
  {
    id: 'cid-m54-4',
    cid10: 'M54.4',
    cid11: 'ME84.5',
    nome: 'Lombociatalgia (Ciática / Dor ciática)',
    categoria: 'Musculoesquelético',
    sinonimos: ['ciatica', 'nervo ciatico inflamado', 'dor na perna que desce da coluna']
  },
  {
    id: 'cid-m51',
    cid10: 'M51',
    cid11: 'FA80',
    nome: 'Transtornos de discos intervertebrais (Hérnia de disco)',
    categoria: 'Musculoesquelético',
    sinonimos: ['hernia de disco', 'protusao discal', 'abaulamento discal']
  },
  {
    id: 'cid-m75',
    cid10: 'M75',
    cid11: 'FA31',
    nome: 'Lesões do ombro (Tendinite / Bursite de ombro)',
    categoria: 'Musculoesquelético',
    sinonimos: ['bursite no ombro', 'tendinite de manguito rotador', 'dor no ombro']
  },
  {
    id: 'cid-m79-1',
    cid10: 'M79.1',
    cid11: 'ME82',
    nome: 'Mialgia (Dor muscular generalizada ou localizada)',
    categoria: 'Musculoesquelético',
    sinonimos: ['dor muscular', 'tensao muscular', 'fadiga muscular']
  },
  {
    id: 'cid-m79-7',
    cid10: 'M79.7',
    cid11: 'MG30.01',
    nome: 'Fibromialgia',
    categoria: 'Musculoesquelético',
    sinonimos: ['fibromialgia', 'dor cronica disseminada', 'pontos de dor']
  },
  {
    id: 'cid-m17',
    cid10: 'M17',
    cid11: 'FA01',
    nome: 'Gonartrose (Artrose do joelho)',
    categoria: 'Musculoesquelético',
    sinonimos: ['artrose no joelho', 'desgaste articular', 'dor no joelho']
  },
  {
    id: 'cid-m65',
    cid10: 'M65',
    cid11: 'FB40',
    nome: 'Sinovite e tenossinovite (Tendinite por esforço repetitivo / LER)',
    categoria: 'Musculoesquelético & Ocupacional',
    sinonimos: ['ler', 'dort', 'tendinite no pulso', 'tenossinovite de de quervain']
  },

  // --- DOENÇAS INFECCIOSAS & PARASITÁRIAS ---
  {
    id: 'cid-a90',
    cid10: 'A90',
    cid11: '1D20',
    nome: 'Dengue clássica (Febre do Dengue)',
    categoria: 'Infeccioso & Arboviroses',
    sinonimos: ['dengue', 'dor retro-orbital', 'dor nas articulacoes', 'mialgia e febre', 'arbovirose']
  },
  {
    id: 'cid-a92-0',
    cid10: 'A92.0',
    cid11: '1D21',
    nome: 'Febre de Chikungunya',
    categoria: 'Infeccioso & Arboviroses',
    sinonimos: ['chikungunya', 'artrite aguda por arbovirose', 'dor intensa nas juntas']
  },
  {
    id: 'cid-a92-8',
    cid10: 'A92.8',
    cid11: '1D22',
    nome: 'Febre por vírus Zika',
    categoria: 'Infeccioso & Arboviroses',
    sinonimos: ['zika virus', 'zika', 'exantema com prurido']
  },
  {
    id: 'cid-u07-1',
    cid10: 'U07.1',
    cid11: 'RA01',
    nome: 'COVID-19 (Vírus identificado)',
    categoria: 'Infeccioso & Respiratório',
    sinonimos: ['covid', 'coronavirus', 'sars-cov-2', 'infeccao por covid']
  },
  {
    id: 'cid-b34-9',
    cid10: 'B34.9',
    cid11: '1D4Z',
    nome: 'Infecção viral não especificada (Virose aguda)',
    categoria: 'Infeccioso',
    sinonimos: ['virose', 'quadro viral inespecifico', 'sindrome febril']
  },
  {
    id: 'cid-b35',
    cid10: 'B35',
    cid11: '1F28',
    nome: 'Dermatofitose (Micoses superficiais / Tinea)',
    categoria: 'Pele & Infeccioso',
    sinonimos: ['micose de pele', 'pano branco', 'pe de atleta', 'impingem']
  },
  {
    id: 'cid-b00',
    cid10: 'B00',
    cid11: '1F00',
    nome: 'Infecções pelo vírus do herpes simples (Herpes labial / genital)',
    categoria: 'Pele & Infeccioso',
    sinonimos: ['herpes labial', 'vesiculas dolorosas nos labios']
  },
  {
    id: 'cid-b02',
    cid10: 'B02',
    cid11: '1E91',
    nome: 'Herpes zóster (Cobreiro)',
    categoria: 'Pele & Infeccioso',
    sinonimos: ['cobreiro', 'herpes zoster', 'nevralgia pos-herpetica']
  },

  // --- APARELHO GENITURINÁRIO & NEFROLOGIA ---
  {
    id: 'cid-n39-0',
    cid10: 'N39.0',
    cid11: 'GC08',
    nome: 'Infecção do trato urinário de localização não especificada (ITU)',
    categoria: 'Geniturinário',
    sinonimos: ['itu', 'infeccao urinaria', 'cistite', 'ardencia para urinar', 'disuria', 'polaciuria']
  },
  {
    id: 'cid-n30',
    cid10: 'N30',
    cid11: 'GC00',
    nome: 'Cistite aguda',
    categoria: 'Geniturinário',
    sinonimos: ['cistite', 'dor na bexiga', 'infeccao baixa da bexiga']
  },
  {
    id: 'cid-n20',
    cid10: 'N20',
    cid11: 'GB90',
    nome: 'Cálculo do rim e do ureter (Cólica Nefrética / Renal)',
    categoria: 'Geniturinário',
    sinonimos: ['calculo renal', 'pedra nos rins', 'colica de rim', 'colica renal']
  },
  {
    id: 'cid-n40',
    cid10: 'N40',
    cid11: 'GA90',
    nome: 'Hiperplasia benigna da próstata (HPB)',
    categoria: 'Geniturinário',
    sinonimos: ['hpb', 'prostata aumentada', 'jato urinario fraco', 'nocturia']
  },
  {
    id: 'cid-n76',
    cid10: 'N76',
    cid11: 'GA14',
    nome: 'Vaginite e vulvovaginite (Candidíase / Vaginose)',
    categoria: 'Geniturinário',
    sinonimos: ['candidiase', 'corrimento vaginal', 'coceira intima', 'vaginose bacteriana']
  },
  {
    id: 'cid-n94-6',
    cid10: 'N94.6',
    cid11: 'GA34.3',
    nome: 'Dismenorreia não especificada (Cólica menstrual)',
    categoria: 'Geniturinário',
    sinonimos: ['colica menstrual', 'dor no periodo menstrual']
  },
  {
    id: 'cid-n95-1',
    cid10: 'N95.1',
    cid11: 'GA30',
    nome: 'Sintomas climatéricos e menopausa (Ondas de calor)',
    categoria: 'Geniturinário',
    sinonimos: ['menopausa', 'climaterio', 'fogachos', 'ondas de calor']
  },

  // --- NEUROLOGIA & CEFALEIAS ---
  {
    id: 'cid-g43',
    cid10: 'G43',
    cid11: '8A80',
    nome: 'Enxaqueca (Migrânea com ou sem aura)',
    categoria: 'Neurologia',
    sinonimos: ['enxaqueca', 'dor de cabeca pulsante', 'fotofobia e nausea']
  },
  {
    id: 'cid-g44-2',
    cid10: 'G44.2',
    cid11: '8A81',
    nome: 'Cefaleia tensional episódica ou crônica',
    categoria: 'Neurologia',
    sinonimos: ['dor de cabeca tensional', 'aperto na cabeca', 'cefaleia por estresse']
  },
  {
    id: 'cid-r51',
    cid10: 'R51',
    cid11: 'MD90',
    nome: 'Cefaleia não especificada (Dor de cabeça)',
    categoria: 'Sintomas e Sinais',
    sinonimos: ['dor de cabeca', 'cefaleia']
  },

  // --- DERMATOLOGIA & PELE ---
  {
    id: 'cid-l20',
    cid10: 'L20',
    cid11: 'EA80',
    nome: 'Dermatite atópica (Eczema)',
    categoria: 'Pele & Alergias',
    sinonimos: ['dermatite atopica', 'eczema', 'pele seca e pruriginosa']
  },
  {
    id: 'cid-l23',
    cid10: 'L23',
    cid11: 'EK00',
    nome: 'Dermatite de contato alérgica',
    categoria: 'Pele & Alergias',
    sinonimos: ['alergia de contato', 'irritacao por bijuteria ou perfume']
  },
  {
    id: 'cid-l50',
    cid10: 'L50',
    cid11: 'EB00',
    nome: 'Urticária aguda ou crônica',
    categoria: 'Pele & Alergias',
    sinonimos: ['urticaria', 'placas vermelhas na pele com coceira', 'empipocamento']
  },
  {
    id: 'cid-l70',
    cid10: 'L70',
    cid11: 'ED80',
    nome: 'Acne vulgar',
    categoria: 'Pele & Alergias',
    sinonimos: ['acne', 'espinhas', 'cravos']
  },

  // --- CONSULTAS, CHECK-UPS, ATESTADOS E ACOMPANHAMENTOS (CAPÍTULO Z - CID 10 / QA-QC CID 11) ---
  {
    id: 'cid-z00-0',
    cid10: 'Z00.0',
    cid11: 'QA00',
    nome: 'Exame médico geral (Check-up clínico de rotina)',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['check-up', 'exame de rotina', 'avaliacao periodica', 'checkup geral', 'consulta preventiva'],
    descricaoDetalhada: 'Exame médico geral e avaliação de rotina em paciente sem queixas agudas para promoção de saúde e prevenção.'
  },
  {
    id: 'cid-z02-1',
    cid10: 'Z02.1',
    cid11: 'QA02.1',
    nome: 'Exame médico pré-admissional ou para admissão ao emprego',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['atestado admissional', 'apto para trabalho', 'exame admissional']
  },
  {
    id: 'cid-z02-5',
    cid10: 'Z02.5',
    cid11: 'QA02.5',
    nome: 'Exame médico para participação em esportes e atividades físicas',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['atestado para academia', 'apto para atividade fisica', 'apto para esportes']
  },
  {
    id: 'cid-z76-3',
    cid10: 'Z76.3',
    cid11: 'QC43',
    nome: 'Pessoa em boa saúde acompanhando pessoa doente (Atestado de Acompanhante)',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['atestado de acompanhante', 'acompanhamento de filho doente', 'declaracao de acompanhante', 'declaracao de comparecimento'],
    descricaoDetalhada: 'Pessoa que comparece à unidade de saúde na condição de acompanhante legal ou responsável por paciente dependente.'
  },
  {
    id: 'cid-z54',
    cid10: 'Z54',
    cid11: 'QC00',
    nome: 'Convalescença pós-tratamento ou pós-cirurgia',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['repouso medico', 'recuperacao cirurgica', 'afastamento para convalescenca']
  },
  {
    id: 'cid-z71-1',
    cid10: 'Z71.1',
    cid11: 'QC10',
    nome: 'Pessoa com receio de doença que não tem diagnóstico firmado',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['ansiedade por doenca', 'esclarecimento de duvidas de saude']
  },
  {
    id: 'cid-z23',
    cid10: 'Z23',
    cid11: 'QC40',
    nome: 'Necessidade de imunização / Vacinação',
    categoria: 'Atestados & Preventivo',
    sinonimos: ['vacina', 'calendario vacinal', 'atualizacao de vacinas']
  }
];

/**
 * Remove formatações, pontuações, espaços e caracteres especiais para comparação flexível de código
 * Ex: 'K04.1' -> 'K041', 'k041' -> 'K041', 'k.04.1' -> 'K041'
 */
export function cleanCidCode(code: string): string {
  if (!code) return '';
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Converte um código digitado sem ponto para o formato canônico oficial do CID-10 com ponto
 * Exemplo: 'k041' -> 'K04.1', 'K041' -> 'K04.1', 'j00' -> 'J00', 'k04.1' -> 'K04.1'
 */
export function formatCidCanonical(input: string): string {
  if (!input) return '';
  const trimmed = input.trim().toUpperCase();
  const clean = cleanCidCode(trimmed);
  // Se for código com 4 caracteres (1 letra + 2 dígitos + 1 caractere alfanumérico): ex K041 -> K04.1
  if (/^[A-Z][0-9]{2}[0-9A-Z]$/.test(clean)) {
    return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  }
  // Se for código de categoria com 3 caracteres (1 letra + 2 dígitos): ex J00, I10, K04
  if (/^[A-Z][0-9]{2}$/.test(clean)) {
    return clean;
  }
  return trimmed;
}

/**
 * Verifica se um texto tem padrão de código CID (com ou sem ponto)
 * Ex: 'k041' -> true, 'K04.1' -> true, 'j00' -> true, 'dor de cabeça' -> false
 */
export function isCidCodeFormat(input: string): boolean {
  if (!input) return false;
  const clean = cleanCidCode(input);
  return /^[A-Z][0-9]{2}[0-9A-Z]?$/.test(clean);
}

/**
 * Busca item exato no banco de CID por código (com ou sem ponto)
 * Ex: findCidByCode('k041') retorna o objeto K04.1 (Necrose da polpa)
 */
export function findCidByCode(code: string): CidItem | undefined {
  if (!code) return undefined;
  const cleanTarget = cleanCidCode(code);
  const canonicalTarget = formatCidCanonical(code);

  const dataset = fullCidCache || CID_DATABASE;
  return dataset.find(item => {
    const itemClean = cleanCidCode(item.cid10);
    return itemClean === cleanTarget || item.cid10.toUpperCase() === canonicalTarget;
  });
}

/**
 * Resolve uma string digitada pelo usuário:
 * Se o usuário digitou apenas 'k041' ou 'k04.1', resolve para 'K04.1 - Necrose da polpa'.
 * Se já contiver nome ou hífen, padroniza o código.
 */
export function resolveCidString(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // Se já está no formato "CÓDIGO - Descrição"
  if (trimmed.includes(' - ')) {
    const parts = trimmed.split(' - ');
    const codePart = parts[0].trim();
    const canon = formatCidCanonical(codePart);
    if (canon !== codePart) {
      return `${canon} - ${parts.slice(1).join(' - ').trim()}`;
    }
    return trimmed;
  }

  // Se o usuário digitou apenas o código (ex: 'k041' ou 'K04.1')
  const matched = findCidByCode(trimmed);
  if (matched) {
    return `${matched.cid10} - ${matched.nome}`;
  }

  // Se tem formato de código sem ponto mas não achou nome no cache
  if (isCidCodeFormat(trimmed)) {
    return formatCidCanonical(trimmed);
  }

  return trimmed;
}

/**
 * TABELA OFICIAL DE GRUPOS / BLOCOS DE CATEGORIAS CID-10 (OMS / MINISTÉRIO DA SAÚDE)
 */
export const OFFICIAL_CID_GROUPS: [string, string, string][] = [
  // Capítulo I - Doenças infecciosas e parasitárias (A00-B99)
  ['A00', 'A09', 'A00-A09: Doenças infecciosas intestinais'],
  ['A15', 'A19', 'A15-A19: Tuberculose'],
  ['A20', 'A28', 'A20-A28: Algumas zoonoses bacterianas'],
  ['A30', 'A49', 'A30-A49: Outras doenças bacterianas'],
  ['A50', 'A64', 'A50-A64: Infecções de transmissão predominantemente sexual'],
  ['A65', 'A69', 'A65-A69: Outras doenças por espiroquetas'],
  ['A70', 'A74', 'A70-A74: Outras doenças causadas por clamídias'],
  ['A75', 'A79', 'A75-A79: Rickettsioses'],
  ['A80', 'A89', 'A80-A89: Infecções virais do sistema nervoso central'],
  ['A90', 'A99', 'A90-A99: Febres por arbovírus e febres hemorrágicas virais'],
  ['B00', 'B09', 'B00-B09: Infecções virais caracterizadas por lesões da pele e das mucosas'],
  ['B15', 'B19', 'B15-B19: Hepatite viral'],
  ['B20', 'B24', 'B20-B24: Doença pelo vírus da imunodeficiência humana [HIV]'],
  ['B25', 'B34', 'B25-B34: Outras doenças virais'],
  ['B35', 'B49', 'B35-B49: Micoses'],
  ['B50', 'B64', 'B50-B64: Doenças devidas a protozoários'],
  ['B65', 'B83', 'B65-B83: Helmintíases'],
  ['B85', 'B89', 'B85-B89: Pediculose, acaríase e outras infestações'],
  ['B90', 'B94', 'B90-B94: Seqüelas de doenças infecciosas e parasitárias'],
  ['B95', 'B97', 'B95-B97: Bactérias, vírus e outros agentes infecciosos'],
  ['B99', 'B99', 'B99: Outras doenças infecciosas'],

  // Capítulo II - Neoplasias [tumores] (C00-D48)
  ['C00', 'C14', 'C00-C14: Neoplasias malignas do lábio, cavidade oral e faringe'],
  ['C15', 'C26', 'C15-C26: Neoplasias malignas dos órgãos digestivos'],
  ['C30', 'C39', 'C30-C39: Neoplasias malignas dos órgãos respiratórios e intratorácicos'],
  ['C40', 'C41', 'C40-C41: Neoplasias malignas dos ossos e cartilagens articulares'],
  ['C43', 'C44', 'C43-C44: Melanoma e outras neoplasias malignas da pele'],
  ['C45', 'C49', 'C45-C49: Neoplasias malignas dos tecidos moles e tecido conjuntivo'],
  ['C50', 'C50', 'C50: Neoplasia maligna da mama'],
  ['C51', 'C58', 'C51-C58: Neoplasias malignas dos órgãos genitais femininos'],
  ['C60', 'C63', 'C60-C63: Neoplasias malignas dos órgãos genitais masculinos'],
  ['C64', 'C68', 'C64-C68: Neoplasias malignas do trato urinário'],
  ['C69', 'C72', 'C69-C72: Neoplasias malignas do olho, encéfalo e SNC'],
  ['C73', 'C75', 'C73-C75: Neoplasias malignas da tireóide e outras glândulas endócrinas'],
  ['C76', 'C80', 'C76-C80: Neoplasias malignas de localizações mal definidas, secundárias e não especificadas'],
  ['C81', 'C96', 'C81-C96: Neoplasias malignas dos tecidos linfático e hematopoético'],
  ['C97', 'C97', 'C97: Neoplasias malignas de localizações múltiplas independentes'],
  ['D00', 'D09', 'D00-D09: Neoplasias in situ'],
  ['D10', 'D36', 'D10-D36: Neoplasias benignas'],
  ['D37', 'D48', 'D37-D48: Neoplasias de comportamento incerto ou desconhecido'],

  // Capítulo III - Doenças do sangue e órgãos hematopoéticos (D50-D89)
  ['D50', 'D53', 'D50-D53: Anemias nutricionais'],
  ['D55', 'D59', 'D55-D59: Anemias hemolíticas'],
  ['D60', 'D64', 'D60-D64: Aplasias medulares e outras anemias'],
  ['D65', 'D69', 'D65-D69: Defeitos da coagulação, púrpura e outras afecções hemorrágicas'],
  ['D70', 'D77', 'D70-D77: Outras doenças do sangue e órgãos hematopoéticos'],
  ['D80', 'D89', 'D80-D89: Transtornos que comprometem o mecanismo imunitário'],

  // Capítulo IV - Doenças endócrinas, nutricionais e metabólicas (E00-E90)
  ['E00', 'E07', 'E00-E07: Transtornos da glândula tireóide'],
  ['E10', 'E14', 'E10-E14: Diabetes mellitus'],
  ['E15', 'E16', 'E15-E16: Outros transtornos da regulação da glicose e secreção do pâncreas'],
  ['E20', 'E35', 'E20-E35: Transtornos de outras glândulas endócrinas'],
  ['E40', 'E46', 'E40-E46: Desnutrição'],
  ['E50', 'E64', 'E50-E64: Outras deficiências nutricionais'],
  ['E65', 'E68', 'E65-E68: Obesidade e outras formas de hiperalimentação'],
  ['E70', 'E90', 'E70-E90: Distúrbios metabólicos'],

  // Capítulo V - Transtornos mentais e comportamentais (F00-F99)
  ['F00', 'F09', 'F00-F09: Transtornos mentais orgânicos, inclusive os sintomáticos'],
  ['F10', 'F19', 'F10-F19: Transtornos mentais devidos ao uso de substância psicoativa'],
  ['F20', 'F29', 'F20-F29: Esquizofrenia, transtornos esquizotípicos e delirantes'],
  ['F30', 'F39', 'F30-F39: Transtornos do humor [afetivos]'],
  ['F40', 'F48', 'F40-F48: Transtornos neuróticos, relacionados com estresse e somatoformes'],
  ['F50', 'F59', 'F50-F59: Síndromes comportamentais associadas a fatores físicos/fisiológicos'],
  ['F60', 'F69', 'F60-F69: Transtornos da personalidade e do comportamento do adulto'],
  ['F70', 'F79', 'F70-F79: Retardo mental'],
  ['F80', 'F89', 'F80-F89: Transtornos do desenvolvimento psicológico'],
  ['F90', 'F98', 'F90-F98: Transtornos do comportamento e emocionais da infância/adolescência'],
  ['F99', 'F99', 'F99: Transtorno mental não especificado'],

  // Capítulo VI - Doenças do sistema nervoso (G00-G99)
  ['G00', 'G09', 'G00-G09: Doenças inflamatórias do sistema nervoso central'],
  ['G10', 'G13', 'G10-G13: Atrofias sistêmicas que afetam principalmente o SNC'],
  ['G20', 'G26', 'G20-G26: Doenças extrapiramidais e transtornos dos movimentos'],
  ['G30', 'G32', 'G30-G32: Outras doenças degenerativas do sistema nervoso'],
  ['G35', 'G37', 'G35-G37: Doenças desmielinizantes do sistema nervoso central'],
  ['G40', 'G47', 'G40-G47: Transtornos episódicos e paroxísticos'],
  ['G50', 'G59', 'G50-G59: Transtornos dos nervos, raízes e plexos nervosos'],
  ['G60', 'G64', 'G60-G64: Polineuropatias e outros transtornos do SNP'],
  ['G70', 'G73', 'G70-G73: Doenças da junção mioneural e dos músculos'],
  ['G80', 'G83', 'G80-G83: Paralisia cerebral e outras síndromes paralíticas'],
  ['G90', 'G99', 'G90-G99: Outros transtornos do sistema nervoso'],

  // Capítulo VII - Doenças do olho e anexos (H00-H59)
  ['H00', 'H06', 'H00-H06: Transtornos da pálpebra, aparelho lacrimal e órbita'],
  ['H10', 'H13', 'H10-H13: Transtornos da conjuntiva'],
  ['H15', 'H22', 'H15-H22: Transtornos da esclera, córnea, íris e corpo ciliar'],
  ['H25', 'H28', 'H25-H28: Transtornos do cristalino (Catarata e afins)'],
  ['H30', 'H36', 'H30-H36: Transtornos da coróide e retina'],
  ['H40', 'H42', 'H40-H42: Glaucoma'],
  ['H43', 'H45', 'H43-H45: Transtornos do corpo vítreo e globo ocular'],
  ['H46', 'H48', 'H46-H48: Transtornos do nervo óptico e vias ópticas'],
  ['H49', 'H52', 'H49-H52: Transtornos da musculatura ocular, refração e acomodação'],
  ['H53', 'H54', 'H53-H54: Distúrbios visuais e cegueira'],
  ['H55', 'H59', 'H55-H59: Outros transtornos do olho e anexos'],

  // Capítulo VIII - Doenças do ouvido e da apófise mastóide (H60-H95)
  ['H60', 'H62', 'H60-H62: Doenças do ouvido externo'],
  ['H65', 'H75', 'H65-H75: Doenças do ouvido médio e mastóide'],
  ['H80', 'H83', 'H80-H83: Doenças do ouvido interno'],
  ['H90', 'H95', 'H90-H95: Outros transtornos do ouvido'],

  // Capítulo IX - Doenças do aparelho circulatório (I00-I99)
  ['I00', 'I02', 'I00-I02: Febre reumática aguda'],
  ['I05', 'I09', 'I05-I09: Doenças cardíacas reumáticas crônicas'],
  ['I10', 'I15', 'I10-I15: Doenças hipertensivas'],
  ['I20', 'I25', 'I20-I25: Doenças isquêmicas do coração'],
  ['I26', 'I28', 'I26-I28: Doença cardíaca pulmonar e circulação pulmonar'],
  ['I30', 'I52', 'I30-I52: Outras formas de doença do coração'],
  ['I60', 'I69', 'I60-I69: Doenças cerebrovasculares (AVC e afins)'],
  ['I70', 'I79', 'I70-I79: Doenças das artérias, arteríolas e capilares'],
  ['I80', 'I89', 'I80-I89: Doenças das veias, vasos linfáticos e linfonodos'],
  ['I95', 'I99', 'I95-I99: Outros transtornos do aparelho circulatório'],

  // Capítulo X - Doenças do aparelho respiratório (J00-J99)
  ['J00', 'J06', 'J00-J06: Infecções agudas das vias aéreas superiores'],
  ['J09', 'J18', 'J09-J18: Influenza [gripe] e pneumonia'],
  ['J20', 'J22', 'J20-J22: Outras infecções agudas das vias aéreas inferiores'],
  ['J30', 'J39', 'J30-J39: Outras doenças das vias aéreas superiores'],
  ['J40', 'J47', 'J40-J47: Doenças crônicas das vias aéreas inferiores (Asma, DPOC)'],
  ['J60', 'J70', 'J60-J70: Doenças pulmonares devidas a agentes externos'],
  ['J80', 'J84', 'J80-J84: Outras doenças respiratórias do interstício'],
  ['J85', 'J86', 'J85-J86: Afecções supurativas e necróticas das vias aéreas inferiores'],
  ['J90', 'J94', 'J90-J94: Outras doenças da pleura'],
  ['J95', 'J99', 'J95-J99: Outras doenças do aparelho respiratório'],

  // Capítulo XI - Doenças do aparelho digestivo (K00-K93)
  ['K00', 'K14', 'K00-K14: Doenças da cavidade oral, glândulas salivares e maxilares'],
  ['K20', 'K31', 'K20-K31: Doenças do esôfago, estômago e duodeno'],
  ['K35', 'K38', 'K35-K38: Doenças do apêndice'],
  ['K40', 'K46', 'K40-K46: Hérnias'],
  ['K50', 'K52', 'K50-K52: Enterites e colites não-infecciosas'],
  ['K55', 'K63', 'K55-K63: Outras doenças dos intestinos'],
  ['K65', 'K67', 'K65-K67: Doenças do peritônio'],
  ['K70', 'K77', 'K70-K77: Doenças do fígado'],
  ['K80', 'K87', 'K80-K87: Transtornos da vesícula biliar, trato biliar e pâncreas'],
  ['K90', 'K93', 'K90-K93: Outras doenças do aparelho digestivo'],

  // Capítulo XII - Doenças da pele e tecido subcutâneo (L00-L99)
  ['L00', 'L08', 'L00-L08: Infecções da pele e do tecido subcutâneo'],
  ['L10', 'L14', 'L10-L14: Afecções bolhosas'],
  ['L20', 'L30', 'L20-L30: Dermatite e eczema'],
  ['L40', 'L45', 'L40-L45: Afecções pápulo-descamativas (Psoríase)'],
  ['L50', 'L54', 'L50-L54: Urticária e eritema'],
  ['L55', 'L59', 'L55-L59: Transtornos da pele relacionados à radiação'],
  ['L60', 'L75', 'L60-L75: Transtornos dos anexos da pele (Unhas, Cabelos)'],
  ['L80', 'L99', 'L80-L99: Outros transtornos da pele e tecido subcutâneo'],

  // Capítulo XIII - Doenças do sistema osteomuscular e tecido conjuntivo (M00-M99)
  ['M00', 'M25', 'M00-M25: Artropatias'],
  ['M30', 'M36', 'M30-M36: Doenças sistêmicas do tecido conjuntivo'],
  ['M40', 'M54', 'M40-M54: Dorsopatias (Lombalgia, Hérnia discal, Cervicalgia)'],
  ['M60', 'M79', 'M60-M79: Transtornos dos tecidos moles (Tendinites, Fibromialgia)'],
  ['M80', 'M94', 'M80-M94: Osteopatias e condropatias (Osteoporose)'],
  ['M95', 'M99', 'M95-M99: Outros transtornos do sistema osteomuscular'],

  // Capítulo XIV - Doenças do aparelho geniturinário (N00-N99)
  ['N00', 'N08', 'N00-N08: Doenças glomerulares'],
  ['N10', 'N16', 'N10-N16: Doenças túbulo-intersticiais renais'],
  ['N17', 'N19', 'N17-N19: Insuficiência renal'],
  ['N20', 'N23', 'N20-N23: Litíase urinária (Cálculo renal)'],
  ['N25', 'N29', 'N25-N29: Outros transtornos do rim e do ureter'],
  ['N30', 'N39', 'N30-N39: Outras doenças do aparelho urinário (Cistite, ITU)'],
  ['N40', 'N51', 'N40-N51: Doenças dos órgãos genitais masculinos'],
  ['N60', 'N64', 'N60-N64: Transtornos da mama'],
  ['N70', 'N77', 'N70-N77: Doenças inflamatórias dos órgãos pélvicos femininos'],
  ['N80', 'N98', 'N80-N98: Transtornos não-inflamatórios do trato genital feminino'],
  ['N99', 'N99', 'N99: Outros transtornos do trato geniturinário'],

  // Capítulo XV - Gravidez, parto e puerpério (O00-O99)
  ['O00', 'O08', 'O00-O08: Gravidez que termina em aborto'],
  ['O10', 'O16', 'O10-O16: Edema, proteinúria e transtornos hipertensivos na gestação/parto'],
  ['O20', 'O29', 'O20-O29: Outros transtornos maternos relacionados à gravidez'],
  ['O30', 'O48', 'O30-O48: Assistência à mãe por motivos fetais, cavidade amniótica e parto'],
  ['O60', 'O75', 'O60-O75: Complicações do trabalho de parto e parto'],
  ['O80', 'O84', 'O80-O84: Parto'],
  ['O85', 'O92', 'O85-O92: Complicações relacionadas ao puerpério'],
  ['O94', 'O99', 'O94-O99: Outras afecções obstétricas'],

  // Capítulo XVI - Algumas afecções originadas no período perinatal (P00-P96)
  ['P00', 'P04', 'P00-P04: Feto e recém-nascido afetados por fatores maternos e complicações'],
  ['P05', 'P08', 'P05-P08: Transtornos da duração da gestação e crescimento fetal'],
  ['P10', 'P15', 'P10-P15: Traumatismo de parto'],
  ['P20', 'P29', 'P20-P29: Transtornos respiratórios e cardiovasculares do período perinatal'],
  ['P35', 'P39', 'P35-P39: Infecções específicas do período perinatal'],
  ['P50', 'P61', 'P50-P61: Transtornos hemorrágicos e hematológicos do feto e RN'],
  ['P70', 'P74', 'P70-P74: Transtornos endócrinos e metabólicos transitórios do RN'],
  ['P75', 'P78', 'P75-P78: Transtornos do aparelho digestivo do RN'],
  ['P80', 'P83', 'P80-P83: Afecções do tegumento e termorregulação do RN'],
  ['P90', 'P96', 'P90-P96: Outros transtornos originados no período perinatal'],

  // Capítulo XVII - Malformações congênitas, deformidades e anomalias cromossômicas (Q00-Q99)
  ['Q00', 'Q07', 'Q00-Q07: Malformações congênitas do sistema nervoso'],
  ['Q10', 'Q18', 'Q10-Q18: Malformações congênitas do olho, ouvido, face e pescoço'],
  ['Q20', 'Q28', 'Q20-Q28: Malformações congênitas do aparelho circulatório'],
  ['Q30', 'Q34', 'Q30-Q34: Malformações congênitas do aparelho respiratório'],
  ['Q35', 'Q37', 'Q35-Q37: Fenda labial e fenda palatina'],
  ['Q38', 'Q45', 'Q38-Q45: Outras malformações congênitas do aparelho digestivo'],
  ['Q50', 'Q56', 'Q50-Q56: Malformações congênitas dos órgãos genitais'],
  ['Q60', 'Q64', 'Q60-Q64: Malformações congênitas do aparelho urinário'],
  ['Q65', 'Q79', 'Q65-Q79: Deformidades e malformações congênitas do sistema osteomuscular'],
  ['Q80', 'Q89', 'Q80-Q89: Outras malformações congênitas'],
  ['Q90', 'Q99', 'Q90-Q99: Anomalias cromossômicas'],

  // Capítulo XVIII - Sintomas, sinais e achados anormais de exames clínicos e laboratório (R00-R99)
  ['R00', 'R09', 'R00-R09: Sintomas e sinais relativos aos aparelhos circulatório e respiratório'],
  ['R10', 'R19', 'R10-R19: Sintomas e sinais relativos ao aparelho digestivo e abdome'],
  ['R20', 'R23', 'R20-R23: Sintomas e sinais relativos à pele e tecido subcutâneo'],
  ['R25', 'R29', 'R25-R29: Sintomas e sinais dos sistemas nervoso e osteomuscular'],
  ['R30', 'R39', 'R30-R39: Sintomas e sinais relativos ao aparelho urinário'],
  ['R40', 'R46', 'R40-R46: Sintomas e sinais relativos à cognição, percepção e comportamento'],
  ['R47', 'R49', 'R47-R49: Sintomas e sinais relativos à fala e à voz'],
  ['R50', 'R69', 'R50-R69: Sintomas e sinais gerais (Febre, Cefaléia, Dor, Mal-estar)'],
  ['R70', 'R79', 'R70-R79: Achados anormais de exames de sangue, sem diagnóstico'],
  ['R80', 'R82', 'R80-R82: Achados anormais de exames de urina, sem diagnóstico'],
  ['R83', 'R89', 'R83-R89: Achados anormais de outros líquidos e tecidos corporais'],
  ['R90', 'R94', 'R90-R94: Achados anormais de diagnóstico por imagem e estudos funcionais'],
  ['R95', 'R99', 'R95-R99: Causas mal definidas e desconhecidas de morbimortalidade'],

  // Capítulo XIX - Traumatismos, envenenamentos e causas externas (S00-T98)
  ['S00', 'S09', 'S00-S09: Traumatismos da cabeça'],
  ['S10', 'S19', 'S10-S19: Traumatismos do pescoço'],
  ['S20', 'S29', 'S20-S29: Traumatismos do tórax'],
  ['S30', 'S39', 'S30-S39: Traumatismos do abdome, dorso, coluna lombar e pelve'],
  ['S40', 'S49', 'S40-S49: Traumatismos do ombro e braço'],
  ['S50', 'S59', 'S50-S59: Traumatismos do cotovelo e antebraço'],
  ['S60', 'S69', 'S60-S69: Traumatismos do punho e mão'],
  ['S70', 'S79', 'S70-S79: Traumatismos do quadril e coxa'],
  ['S80', 'S89', 'S80-S89: Traumatismos do joelho e perna'],
  ['S90', 'S99', 'S90-S99: Traumatismos do tornozelo e pé'],
  ['T00', 'T07', 'T00-T07: Traumatismos que afetam múltiplas regiões do corpo'],
  ['T08', 'T14', 'T08-T14: Traumatismos de partes não especificadas do tronco ou membro'],
  ['T15', 'T19', 'T15-T19: Efeitos de corpo estranho em orifício natural'],
  ['T20', 'T32', 'T20-T32: Queimaduras e corrosões'],
  ['T33', 'T35', 'T33-T35: Geladura'],
  ['T36', 'T50', 'T36-T50: Intoxicação por medicamentos e substâncias biológicas'],
  ['T51', 'T65', 'T51-T65: Efeitos tóxicos de substâncias não-medicinais'],
  ['T66', 'T78', 'T66-T78: Outros efeitos e os não especificados de causas externas'],
  ['T79', 'T79', 'T79: Algumas complicações precoces dos traumatismos'],
  ['T80', 'T88', 'T80-T88: Complicações de cuidados médicos e cirúrgicos'],
  ['T90', 'T98', 'T90-T98: Seqüelas de traumatismos, intoxicações e causas externas'],

  // Capítulo XX - Causas externas de morbidade e de mortalidade (V01-Y98)
  ['V01', 'V09', 'V01-V09: Pedestre traumatizado em acidente de transporte'],
  ['V10', 'V19', 'V10-V19: Ciclista traumatizado em acidente de transporte'],
  ['V20', 'V29', 'V20-V29: Motociclista traumatizado em acidente de transporte'],
  ['V30', 'V39', 'V30-V39: Ocupante de triciclo em acidente de transporte'],
  ['V40', 'V49', 'V40-V49: Ocupante de automóvel em acidente de transporte'],
  ['V50', 'V59', 'V50-V59: Ocupante de caminhonete em acidente de transporte'],
  ['V60', 'V69', 'V60-V69: Ocupante de veículo pesado em acidente de transporte'],
  ['V70', 'V79', 'V70-V79: Ocupante de ônibus em acidente de transporte'],
  ['V80', 'V89', 'V80-V89: Outros acidentes de transporte terrestre'],
  ['V90', 'V94', 'V90-V94: Acidentes de transporte por água'],
  ['V95', 'V97', 'V95-V97: Acidentes de transporte aéreo e espacial'],
  ['V98', 'V99', 'V98-V99: Acidentes de transporte outros e não especificados'],
  ['W00', 'W19', 'W00-W19: Quedas'],
  ['W20', 'W49', 'W20-W49: Exposição a forças mecânicas inanimadas'],
  ['W50', 'W64', 'W50-W64: Exposição a forças mecânicas animadas'],
  ['W65', 'W74', 'W65-W74: Afogamento e submersão acidentais'],
  ['W75', 'W84', 'W75-W84: Outros riscos acidentais à respiração'],
  ['W85', 'W99', 'W85-W99: Exposição à corrente elétrica, radiação e temperaturas extremas'],
  ['X00', 'X09', 'X00-X09: Exposição à fumaça, ao fogo e às chamas'],
  ['X10', 'X19', 'X10-X19: Contato com fonte de calor e substâncias quentes'],
  ['X20', 'X29', 'X20-X29: Contato com animais e plantas venenosos'],
  ['X30', 'X39', 'X30-X39: Exposição às forças da natureza'],
  ['X40', 'X49', 'X40-X49: Envenenamento e intoxicação acidental por substâncias nocivas'],
  ['X50', 'X57', 'X50-X57: Excesso de esforço, viagens e privações'],
  ['X58', 'X59', 'X58-X59: Exposição acidental a outros fatores'],
  ['X60', 'X84', 'X60-X84: Lesões autoprovocadas intencionalmente'],
  ['X85', 'Y09', 'X85-Y09: Agressões'],
  ['Y10', 'Y34', 'Y10-Y34: Eventos cuja intenção é indeterminada'],
  ['Y35', 'Y36', 'Y35-Y36: Intervenções legais e operações de guerra'],
  ['Y40', 'Y59', 'Y40-Y59: Medicamentos e drogas que causam efeitos adversos'],
  ['Y60', 'Y69', 'Y60-Y69: Incidentes durante assistência médica e cirúrgica'],
  ['Y70', 'Y82', 'Y70-Y82: Dispositivos médicos associados a incidentes adversos'],
  ['Y83', 'Y84', 'Y83-Y84: Reações anormais durante procedimentos médicos'],
  ['Y85', 'Y89', 'Y85-Y89: Seqüelas de causas externas'],
  ['Y90', 'Y98', 'Y90-Y98: Fatores suplementares relacionados a causas externas'],

  // Capítulo XXI - Contato com os serviços de saúde (Z00-Z99)
  ['Z00', 'Z13', 'Z00-Z13: Exames de rotina e investigações clínicas'],
  ['Z20', 'Z29', 'Z20-Z29: Riscos potenciais à saúde relacionados com doenças transmissíveis'],
  ['Z30', 'Z39', 'Z30-Z39: Circunstâncias relacionadas à reprodução e pré-natal'],
  ['Z40', 'Z54', 'Z40-Z54: Procedimentos específicos e cuidados pós-operatórios'],
  ['Z55', 'Z65', 'Z55-Z65: Circunstâncias socioeconômicas e psicossociais'],
  ['Z70', 'Z76', 'Z70-Z76: Pessoas em contato com serviços de saúde por outros motivos'],
  ['Z80', 'Z99', 'Z80-Z99: Histórico familiar, histórico pessoal e fatores de risco'],

  // Capítulo XXII - Situações especiais (U00-U99)
  ['U00', 'U99', 'U00-U99: Códigos para situações especiais (ex: COVID-19)']
];

/**
 * Retorna o Grupo oficial do CID-10 para um código fornecido
 */
export function getGroupForCidCode(code: string): string {
  if (!code) return 'Classificação Geral CID-10';
  const clean = cleanCidCode(code);
  const base = clean.substring(0, 3).toUpperCase();
  for (const [start, end, label] of OFFICIAL_CID_GROUPS) {
    if (base >= start && base <= end) {
      return label;
    }
  }
  return 'Classificação Geral CID-10';
}

// Popula os grupos nos itens essenciais da base estática
for (const item of CID_DATABASE) {
  if (!item.grupo) {
    item.grupo = getGroupForCidCode(item.cid10);
  }
}

/**
 * Função utilitária de busca ágil por código ou nome (sem case sensitivity e sem acentos)
 */
function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

let fullCidCache: CidItem[] | null = null;
let isLoadingFullCid = false;

/**
 * Carrega a base completa oficial do DATASUS (~14.200+ códigos de A00.0 a Z99.9)
 */
export async function loadFullCidDatabase(): Promise<CidItem[]> {
  if (fullCidCache) return fullCidCache;
  if (isLoadingFullCid) {
    let attempts = 0;
    while (isLoadingFullCid && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      attempts++;
    }
    if (fullCidCache) return fullCidCache;
  }

  try {
    isLoadingFullCid = true;
    const response = await fetch('/data/cid10_full.json');
    if (!response.ok) throw new Error('Falha ao carregar banco completo de CID-10');
    
    const rawData: Array<{ code: string; name: string; cat: string; grupo?: string; restr?: string }> = await response.json();
    
    const fullList: CidItem[] = [];
    const addedCodes = new Set<string>();

    // 1. Adiciona primeiro os itens de alta prioridade com mapeamento e sinônimos estendidos
    for (const item of CID_DATABASE) {
      fullList.push(item);
      addedCodes.add(item.cid10.toUpperCase());
    }

    // 2. Adiciona todos os ~14.230 códigos oficiais do DATASUS/OMS (A00.0 a Z99.9)
    for (const r of rawData) {
      const codeUpper = r.code.toUpperCase();
      if (!addedCodes.has(codeUpper)) {
        addedCodes.add(codeUpper);
        fullList.push({
          id: `cid10-${codeUpper.replace('.', '')}`,
          cid10: r.code,
          cid11: '-',
          nome: r.name,
          categoria: r.cat || 'Classificação Geral CID-10',
          grupo: r.grupo || getGroupForCidCode(r.code)
        });
      }
    }

    fullCidCache = fullList;
    return fullList;
  } catch (error) {
    console.warn('Aviso: Utilizando banco essencial de CID-10.', error);
    fullCidCache = CID_DATABASE;
    return CID_DATABASE;
  } finally {
    isLoadingFullCid = false;
  }
}

export function searchCid(query: string, limit: number = 30): CidItem[] {
  const dataset = fullCidCache || CID_DATABASE;
  const rawQuery = (query || '').trim();

  // Engatilha carregamento em segundo plano se ainda não foi carregado
  if (!fullCidCache && typeof window !== 'undefined') {
    loadFullCidDatabase().catch(() => {});
  }

  if (!rawQuery) return dataset.slice(0, limit);

  const cleanQueryCode = cleanCidCode(rawQuery);
  const canonicalQuery = formatCidCanonical(rawQuery);
  const cleanText = removerAcentos(rawQuery);

  const scoredItems: { item: CidItem; score: number }[] = [];

  for (const item of dataset) {
    const itemCode = item.cid10.toUpperCase();
    const itemCleanCode = cleanCidCode(item.cid10);
    const itemNomeLimpo = removerAcentos(item.nome);
    const itemCatLimpa = removerAcentos(item.categoria);
    const itemGrupoLimpo = removerAcentos(item.grupo || '');
    const itemSinonimos = (item.sinonimos || []).map(removerAcentos).join(' ');

    let score = 0;

    // 1. MATCH EXATO DE CÓDIGO (ex: 'k041' == 'K04.1' ou 'k04.1' == 'K04.1')
    if (cleanQueryCode && itemCleanCode === cleanQueryCode) {
      score = 10000;
    } else if (canonicalQuery && itemCode === canonicalQuery) {
      score = 9999;
    }
    // 2. PREFIXO DE CÓDIGO (ex: 'k04' dá match em K04.0, K04.1, etc.)
    else if (cleanQueryCode.length >= 2 && itemCleanCode.startsWith(cleanQueryCode)) {
      score = 5000 + (itemCleanCode.length === cleanQueryCode.length + 1 ? 500 : 0);
    }
    // 3. CÓDIGO CONTÉM A BUSCA
    else if (cleanQueryCode.length >= 3 && itemCleanCode.includes(cleanQueryCode)) {
      score = 2000;
    }
    // 4. NOME INICIA COM O TEXTO
    else if (cleanText.length >= 2 && itemNomeLimpo.startsWith(cleanText)) {
      score = 1000;
    }
    // 5. NOME CONTÉM A PALAVRA OU TERMO
    else if (cleanText.length >= 2 && itemNomeLimpo.includes(cleanText)) {
      score = 500;
    }
    // 6. GRUPO RELACIONADO
    else if (cleanText.length >= 3 && itemGrupoLimpo.includes(cleanText)) {
      score = 350;
    }
    // 7. SINÔNIMOS OU CATEGORIA
    else if (cleanText.length >= 2 && (itemSinonimos.includes(cleanText) || itemCatLimpa.includes(cleanText))) {
      score = 200;
    }

    if (score > 0) {
      scoredItems.push({ item, score });
    }
  }

  // Ordena por pontuação decrescente, e em caso de empate, por código
  scoredItems.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.cid10.localeCompare(b.item.cid10);
  });

  return scoredItems.slice(0, limit).map(s => s.item);
}
