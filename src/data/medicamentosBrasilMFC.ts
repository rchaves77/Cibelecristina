export interface MedicamentoRENAME {
  id: string;
  nome: string;
  principio_ativo: string;
  concentracao: string;
  forma_farmaceutica: string;
  via_padrao: 'Oral' | 'Tópico' | 'Inalatório' | 'Ocular' | 'Otológico' | 'Retal' | 'Sublingual' | 'Injetável';
  posologia_sugerida: string;
  duracao_sugerida: string;
  quantidade_sugerida: string;
  tipo_receita: 'Simples' | 'Controle Especial';
  categoria: string;
}

export const medicamentosBrasilMFC: MedicamentoRENAME[] = [
  // --- ANTI-HIPERTENSIVOS E CARDIOVASCULARES ---
  {
    id: 'med-losartana-50',
    nome: 'Losartana Potássica 50mg',
    principio_ativo: 'Losartana potássica',
    concentracao: '50mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia (ou de 12/12h conforme orientação médica).',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-hipertensivo'
  },
  {
    id: 'med-hctz-25',
    nome: 'Hidroclorotiazida 25mg',
    principio_ativo: 'Hidroclorotiazida',
    concentracao: '25mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral pela manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Diurético / Anti-hipertensivo'
  },
  {
    id: 'med-enalapril-10',
    nome: 'Enalapril Maleato 10mg',
    principio_ativo: 'Maleato de enalapril',
    concentracao: '10mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 12 horas.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-hipertensivo / IECA'
  },
  {
    id: 'med-enalapril-20',
    nome: 'Enalapril Maleato 20mg',
    principio_ativo: 'Maleato de enalapril',
    concentracao: '20mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 12 horas.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-hipertensivo / IECA'
  },
  {
    id: 'med-anlodipino-5',
    nome: 'Anlodipino Besilato 5mg',
    principio_ativo: 'Besilato de anlodipino',
    concentracao: '5mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-hipertensivo / BCC'
  },
  {
    id: 'med-anlodipino-10',
    nome: 'Anlodipino Besilato 10mg',
    principio_ativo: 'Besilato de anlodipino',
    concentracao: '10mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-hipertensivo / BCC'
  },
  {
    id: 'med-atenolol-50',
    nome: 'Atenolol 50mg',
    principio_ativo: 'Atenolol',
    concentracao: '50mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Betabloqueador'
  },
  {
    id: 'med-carvedilol-125',
    nome: 'Carvedilol 12,5mg',
    principio_ativo: 'Carvedilol',
    concentracao: '12,5mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 12 horas com alimentos.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Betabloqueador / Cardioproteção'
  },
  {
    id: 'med-espironolactona-25',
    nome: 'Espironolactona 25mg',
    principio_ativo: 'Espironolactona',
    concentracao: '25mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Diurético poupador de potássio'
  },
  {
    id: 'med-furosemida-40',
    nome: 'Furosemida 40mg',
    principio_ativo: 'Furosemida',
    concentracao: '40mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral pela manhã em jejum.',
    duracao_sugerida: 'Conforme prescrição',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Diurético de alça'
  },
  {
    id: 'med-sinvastatina-20',
    nome: 'Sinvastatina 20mg',
    principio_ativo: 'Sinvastatina',
    concentracao: '20mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Hipolipemiante / Estatina'
  },
  {
    id: 'med-sinvastatina-40',
    nome: 'Sinvastatina 40mg',
    principio_ativo: 'Sinvastatina',
    concentracao: '40mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Hipolipemiante / Estatina'
  },
  {
    id: 'med-aas-100',
    nome: 'Ácido Acetilsalicílico (AAS) 100mg',
    principio_ativo: 'Ácido acetilsalicílico',
    concentracao: '100mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral após o almoço.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Antiagregante plaquetário'
  },

  // --- ANTIDIABÉTICOS ---
  {
    id: 'med-metformina-500',
    nome: 'Metformina Cloridrato 500mg',
    principio_ativo: 'Cloridrato de metformina',
    concentracao: '500mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral junto ou logo após as refeições principais (de 12/12h).',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Antidiabético oral'
  },
  {
    id: 'med-metformina-850',
    nome: 'Metformina Cloridrato 850mg',
    principio_ativo: 'Cloridrato de metformina',
    concentracao: '850mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral após almoço e jantar (2x ao dia).',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Antidiabético oral'
  },
  {
    id: 'med-glibenclamida-5',
    nome: 'Glibenclamida 5mg',
    principio_ativo: 'Glibenclamida',
    concentracao: '5mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 30 minutos antes do café da manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Antidiabético / Sulfonilureia'
  },
  {
    id: 'med-gliclazida-30mr',
    nome: 'Gliclazida MR 30mg',
    principio_ativo: 'Gliclazida',
    concentracao: '30mg',
    forma_farmaceutica: 'Comprimido de liberação modificada',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 a 2 comprimidos por via oral pela manhã durante o café.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '60 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Antidiabético oral'
  },
  {
    id: 'med-insulina-nph',
    nome: 'Insulina Humana NPH 100 UI/ml',
    principio_ativo: 'Insulina humana NPH',
    concentracao: '100 UI/ml',
    forma_farmaceutica: 'Frasco-ampola ou refil 3ml/10ml',
    via_padrao: 'Injetável',
    posologia_sugerida: 'Aplicar via subcutânea conforme esquema de doses prescrito pela médica.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: 'Conforme consumo',
    tipo_receita: 'Simples',
    categoria: 'Insulina'
  },

  // --- ANALGÉSICOS, ANTITÉRMICOS & ANTI-INFLAMATÓRIOS ---
  {
    id: 'med-dipirona-500',
    nome: 'Dipirona Monoidratada 500mg',
    principio_ativo: 'Dipirona monoidratada',
    concentracao: '500mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas se dor ou febre (máx 4g/dia).',
    duracao_sugerida: 'Se necessário / até 5 dias',
    quantidade_sugerida: '20 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Analgésico e Antitérmico'
  },
  {
    id: 'med-dipirona-1g',
    nome: 'Dipirona Monoidratada 1g',
    principio_ativo: 'Dipirona monoidratada',
    concentracao: '1000mg',
    forma_farmaceutica: 'Comprimido efervescente ou simples',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas se dor moderada a intensa.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '10 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Analgésico e Antitérmico'
  },
  {
    id: 'med-dipirona-gotas',
    nome: 'Dipirona Sódica 500mg/ml gotas',
    principio_ativo: 'Dipirona sódica',
    concentracao: '500mg/ml',
    forma_farmaceutica: 'Solução oral gotas (frasco 20ml)',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 20 a 40 gotas diluídas em água a cada 6 horas se dor ou febre.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Analgésico e Antitérmico'
  },
  {
    id: 'med-paracetamol-500',
    nome: 'Paracetamol 500mg',
    principio_ativo: 'Paracetamol',
    concentracao: '500mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 a 2 comprimidos por via oral a cada 6 horas em caso de dor ou febre.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '20 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Analgésico e Antitérmico'
  },
  {
    id: 'med-paracetamol-750',
    nome: 'Paracetamol 750mg',
    principio_ativo: 'Paracetamol',
    concentracao: '750mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 6 a 8 horas se dor ou febre.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '20 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Analgésico e Antitérmico'
  },
  {
    id: 'med-ibuprofeno-600',
    nome: 'Ibuprofeno 600mg',
    principio_ativo: 'Ibuprofeno',
    concentracao: '600mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral de 8/8h após as refeições por 3 a 5 dias.',
    duracao_sugerida: 'Por 5 dias',
    quantidade_sugerida: '15 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-inflamatório (AINE)'
  },
  {
    id: 'med-ibuprofeno-gotas',
    nome: 'Ibuprofeno 50mg/ml gotas (Pediátrico)',
    principio_ativo: 'Ibuprofeno',
    concentracao: '50mg/ml',
    forma_farmaceutica: 'Suspensão oral gotas',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 gota por kg de peso a cada 6 a 8 horas se febre ou dor.',
    duracao_sugerida: 'Por 3 dias',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Anti-inflamatório e Antitérmico'
  },

  // --- ANTIBIÓTICOS E ANTIMICROBIANOS (CONTROLE ESPECIAL - 2 VIAS) ---
  {
    id: 'med-amoxicilina-500',
    nome: 'Amoxicilina 500mg cápsulas',
    principio_ativo: 'Amoxicilina tri-hidratada',
    concentracao: '500mg',
    forma_farmaceutica: 'Cápsula',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 cápsula por via oral de 8 em 8 horas pontualmente.',
    duracao_sugerida: 'Por 7 dias',
    quantidade_sugerida: '21 cápsulas',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico / Penicilina'
  },
  {
    id: 'med-amox-clav-500',
    nome: 'Amoxicilina + Clavulanato 500mg + 125mg',
    principio_ativo: 'Amoxicilina + Clavulanato de potássio',
    concentracao: '500mg + 125mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 8 horas no início das refeições.',
    duracao_sugerida: 'Por 7 a 10 dias',
    quantidade_sugerida: '21 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico com inibidor de beta-lactamase'
  },
  {
    id: 'med-amox-clav-875',
    nome: 'Amoxicilina + Clavulanato 875mg + 125mg',
    principio_ativo: 'Amoxicilina + Clavulanato de potássio',
    concentracao: '875mg + 125mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 12 horas.',
    duracao_sugerida: 'Por 7 a 10 dias',
    quantidade_sugerida: '14 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico com inibidor de beta-lactamase'
  },
  {
    id: 'med-azitromicina-500',
    nome: 'Azitromicina 500mg',
    principio_ativo: 'Azitromicina di-hidratada',
    concentracao: '500mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia, 1 hora antes ou 2 horas após refeição.',
    duracao_sugerida: 'Por 3 a 5 dias',
    quantidade_sugerida: '5 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico / Macrolídeo'
  },
  {
    id: 'med-cefalexina-500',
    nome: 'Cefalexina 500mg',
    principio_ativo: 'Cefalexina monoidratada',
    concentracao: '500mg',
    forma_farmaceutica: 'Drágea / Cápsula',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 cápsula por via oral a cada 6 horas pontualmente.',
    duracao_sugerida: 'Por 7 a 10 dias',
    quantidade_sugerida: '28 a 40 cápsulas',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico / Cefalosporina'
  },
  {
    id: 'med-ciprofloxacino-500',
    nome: 'Ciprofloxacino Cloridrato 500mg',
    principio_ativo: 'Cloridrato de ciprofloxacino',
    concentracao: '500mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral a cada 12 horas.',
    duracao_sugerida: 'Por 7 dias',
    quantidade_sugerida: '14 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antibiótico / Quinolona'
  },
  {
    id: 'med-nitrofurantoina-100',
    nome: 'Nitrofurantoína 100mg',
    principio_ativo: 'Nitrofurantoína',
    concentracao: '100mg',
    forma_farmaceutica: 'Cápsula',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 cápsula por via oral a cada 6 horas com alimentos.',
    duracao_sugerida: 'Por 7 dias',
    quantidade_sugerida: '28 cápsulas',
    tipo_receita: 'Controle Especial',
    categoria: 'Antisséptico urinário'
  },

  // --- SAÚDE MENTAL & PSICOTRÓPICOS (CONTROLE ESPECIAL - PORTARIA 344) ---
  {
    id: 'med-fluoxetina-20',
    nome: 'Fluoxetina Cloridrato 20mg',
    principio_ativo: 'Cloridrato de fluoxetina',
    concentracao: '20mg',
    forma_farmaceutica: 'Cápsula',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 cápsula por via oral pela manhã após o café.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 ou 60 cápsulas',
    tipo_receita: 'Controle Especial',
    categoria: 'Antidepressivo / ISRS'
  },
  {
    id: 'med-sertralina-50',
    nome: 'Sertralina Cloridrato 50mg',
    principio_ativo: 'Cloridrato de sertralina',
    concentracao: '50mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral pela manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antidepressivo / ISRS'
  },
  {
    id: 'med-amitriptilina-25',
    nome: 'Amitriptilina Cloridrato 25mg',
    principio_ativo: 'Cloridrato de amitriptilina',
    concentracao: '25mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral à noite ao deitar.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antidepressivo Tricíclico / Modulador de dor'
  },
  {
    id: 'med-escitalopram-10',
    nome: 'Escitalopram Oxalato 10mg',
    principio_ativo: 'Oxalato de escitalopram',
    concentracao: '10mg',
    forma_farmaceutica: 'Comprimido revestido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia pela manhã.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Antidepressivo / ISRS'
  },
  {
    id: 'med-clonazepam-2',
    nome: 'Clonazepam 2mg',
    principio_ativo: 'Clonazepam',
    concentracao: '2mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar conforme orientação médica rigorosa à noite.',
    duracao_sugerida: 'Conforme avaliação',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Controle Especial',
    categoria: 'Benzodiazepínico (Notificação B1)'
  },

  // --- RESPIRATÓRIO & ALERGIAS ---
  {
    id: 'med-salbutamol-spray',
    nome: 'Salbutamol Sulfato 100mcg/dose Spray Inalatório',
    principio_ativo: 'Sulfato de salbutamol',
    concentracao: '100mcg/dose',
    forma_farmaceutica: 'Aerossol dosimetrado (frasco 200 doses)',
    via_padrao: 'Inalatório',
    posologia_sugerida: 'Inalar 2 jatos com espaçador a cada 4 a 6 horas em crises de falta de ar ou sibilos.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Broncodilatador de alívio'
  },
  {
    id: 'med-beclometasona-250',
    nome: 'Beclometasona Dipropionato 250mcg Spray Inalatório',
    principio_ativo: 'Dipropionato de beclometasona',
    concentracao: '250mcg/dose',
    forma_farmaceutica: 'Aerossol dosimetrado',
    via_padrao: 'Inalatório',
    posologia_sugerida: 'Inalar 1 a 2 jatos por via inalatória de 12 em 12 horas contínuo. Enxaguar a boca após.',
    duracao_sugerida: 'Uso contínuo',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Corticoide inalatório de manutenção'
  },
  {
    id: 'med-budesonida-spray',
    nome: 'Budesonida Spray Nasal 32mcg / 64mcg',
    principio_ativo: 'Budesonida',
    concentracao: '32mcg ou 64mcg/dose',
    forma_farmaceutica: 'Suspensão nasal spray',
    via_padrao: 'Tópico',
    posologia_sugerida: 'Aplicar 1 a 2 jatos em cada narina 1 vez ao dia pela manhã.',
    duracao_sugerida: 'Por 30 dias',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Corticoide nasal para rinite'
  },
  {
    id: 'med-prednisona-20',
    nome: 'Prednisona 20mg',
    principio_ativo: 'Prednisona',
    concentracao: '20mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 a 2 comprimidos por via oral pela manhã com alimentos.',
    duracao_sugerida: 'Por 5 dias',
    quantidade_sugerida: '10 ou 20 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Corticoide sistêmico'
  },
  {
    id: 'med-loratadina-10',
    nome: 'Loratadina 10mg',
    principio_ativo: 'Loratadina',
    concentracao: '10mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 1 vez ao dia à noite.',
    duracao_sugerida: 'Por 7 a 10 dias',
    quantidade_sugerida: '12 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Anti-histamínico (Antialérgico)'
  },

  // --- GASTROINTESTINAL & OTOLÓGICO ---
  {
    id: 'med-omeprazol-20',
    nome: 'Omeprazol 20mg',
    principio_ativo: 'Omeprazol',
    concentracao: '20mg',
    forma_farmaceutica: 'Cápsula',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 cápsula por via oral pela manhã em jejum 30 minutos antes do café.',
    duracao_sugerida: 'Por 30 a 60 dias',
    quantidade_sugerida: '30 cápsulas',
    tipo_receita: 'Simples',
    categoria: 'Protetor gástrico / IBP'
  },
  {
    id: 'med-domperidona-10',
    nome: 'Domperidona 10mg',
    principio_ativo: 'Domperidona',
    concentracao: '10mg',
    forma_farmaceutica: 'Comprimido',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 1 comprimido por via oral 15 minutos antes das principais refeições.',
    duracao_sugerida: 'Por 7 a 14 dias',
    quantidade_sugerida: '30 comprimidos',
    tipo_receita: 'Simples',
    categoria: 'Procinético e Antiemético'
  },
  {
    id: 'med-simeticona-gotas',
    nome: 'Simeticona 75mg/ml Gotas',
    principio_ativo: 'Simeticona',
    concentracao: '75mg/ml',
    forma_farmaceutica: 'Emulsão oral gotas',
    via_padrao: 'Oral',
    posologia_sugerida: 'Tomar 30 a 40 gotas de 8/8h se desconforto por gases abdominais.',
    duracao_sugerida: 'Se necessário',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Antiflatulento'
  },
  {
    id: 'med-gotas-otologicas-cerume',
    nome: 'Solução Ceruminolítica (Glicerina / Carbonato de Sódio)',
    principio_ativo: 'Glicerina bidestilada / Carbonato de sódio',
    concentracao: 'Solução otológica',
    forma_farmaceutica: 'Frasco conta-gotas 10ml',
    via_padrao: 'Otológico',
    posologia_sugerida: 'Instilar 3 a 4 gotas no conduto auditivo afetado 3x ao dia durante 3 a 5 dias antes da lavagem de ouvido.',
    duracao_sugerida: 'Por 3 a 5 dias antes do procedimento',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Simples',
    categoria: 'Otológico / Ceruminolítico para Lavagem de Ouvido'
  },
  {
    id: 'med-polimixina-otologica',
    nome: 'Polimixina B + Neomicina + Fluocinolona Gotas Otológicas',
    principio_ativo: 'Sulfato de polimixina B + Sulfato de neomicina + Fluocinolona',
    concentracao: 'Gotas otológicas',
    forma_farmaceutica: 'Frasco conta-gotas 5ml/10ml',
    via_padrao: 'Otológico',
    posologia_sugerida: 'Instilar 3 a 4 gotas no ouvido afetado a cada 8 horas.',
    duracao_sugerida: 'Por 7 dias',
    quantidade_sugerida: '1 frasco',
    tipo_receita: 'Controle Especial',
    categoria: 'Otológico / Otite Externa bacteriana'
  }
];

export function buscarMedicamentosRENAME(termo: string): MedicamentoRENAME[] {
  if (!termo || termo.trim().length === 0) {
    return medicamentosBrasilMFC.slice(0, 10);
  }
  const clean = termo.toLowerCase().trim();
  return medicamentosBrasilMFC.filter((m) =>
    m.nome.toLowerCase().includes(clean) ||
    m.principio_ativo.toLowerCase().includes(clean) ||
    m.categoria.toLowerCase().includes(clean) ||
    m.concentracao.toLowerCase().includes(clean)
  );
}
