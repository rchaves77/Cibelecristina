/**
 * BANCO INTEGRADO DE REGISTROS OFICIAIS CID-10 E CID-11
 * Classificação Internacional de Doenças (OMS / Ministério da Saúde / DATASUS)
 * Mapeamento clínico para Medicina de Família e Comunidade, Clínica Médica e Ambulatório
 */

export interface CidItem {
  id: string;
  cid10: string;
  cid11: string;
  nome: string;
  categoria: string;
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
 * Função utilitária de busca ágil por código ou nome (sem case sensitivity e sem acentos)
 */
function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function searchCid(query: string, limit: number = 20): CidItem[] {
  const clean = removerAcentos(query.trim());
  if (!clean) return CID_DATABASE.slice(0, limit);

  return CID_DATABASE.filter(item => {
    const nomeLimpo = removerAcentos(item.nome);
    const cid10Limpo = item.cid10.toLowerCase();
    const cid11Limpo = item.cid11.toLowerCase();
    const categoriaLimpa = removerAcentos(item.categoria);
    const sinonimosLimpos = (item.sinonimos || []).map(removerAcentos).join(' ');

    return (
      cid10Limpo.includes(clean) ||
      cid11Limpo.includes(clean) ||
      nomeLimpo.includes(clean) ||
      categoriaLimpa.includes(clean) ||
      sinonimosLimpos.includes(clean)
    );
  }).slice(0, limit);
}
