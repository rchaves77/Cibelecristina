import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DOCTOR_INFO } from '../data/medicinarteData';
import { ValidacaoAtestado, PrescricaoItem } from '../types/clinical';
import { LOGO_ATESTADO_BASE64 } from '../assets/logoAtestadoBase64';

async function getBase64ImageFromUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Não foi possível carregar a imagem da logo para o PDF:', err);
    return null;
  }
}

export interface GenerateAtestadoPdfOptions {
  validacao: ValidacaoAtestado;
  signatureDataUrl?: string;
  baseUrl?: string;
}

export async function generateAtestadoPdf({
  validacao,
  signatureDataUrl,
  baseUrl = window.location.origin
}: GenerateAtestadoPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Carrega a logo oficial recortada e limpa (LOGO_ATESTADO_BASE64) ou fallback da URL
  let logoDataUrl = LOGO_ATESTADO_BASE64;
  if (!logoDataUrl) {
    logoDataUrl = await getBase64ImageFromUrl(DOCTOR_INFO.logoImage || '/logo-atestado.png') || '';
  }

  // 1. Moldura e Barra Superior Elegante posicionada no topo da folha
  doc.setFillColor(26, 60, 52); // #1A3C34 Verde Floresta
  doc.rect(margin, 5.5, contentWidth, 2.2, 'F');

  // Linha dourada sutil abaixo
  doc.setFillColor(197, 160, 89); // #C5A059 Ouro
  doc.rect(margin, 7.8, contentWidth, 0.6, 'F');

  // 2. Logo Oficial no Cabeçalho (Posicionado alto: y=9.5mm, h=17.3mm -> termina em 26.8mm)
  // Deixando espaço livre e garantindo que NUNCA encavala com o nome
  const logoWidth = 15;
  const logoHeight = 17.3;
  const logoY = 9.5;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - logoWidth / 2, logoY, logoWidth, logoHeight);
    } catch (e) {
      console.error('Erro ao inserir logo no PDF:', e);
    }
  }

  // 3. Cabeçalho Oficial com Nome e Especialidade da Médica
  // O nome começa em y=32.5mm (5.7mm abaixo do término da logo)
  // Grafia estritamente "Drª. Cibele Cristina" (sem caixa alta)
  let currentY = 32.5;
  doc.setTextColor(26, 60, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Drª. Cibele Cristina', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 95);
  doc.text(`${DOCTOR_INFO.specialty} • ${DOCTOR_INFO.crm} • ${DOCTOR_INFO.rqe}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 4;
  doc.text('Atenção Primária Integral • Cuidado Centrado na Pessoa • Rio Branco - AC', pageWidth / 2, currentY, { align: 'center' });

  // Divisor sutil
  currentY += 4.5;
  doc.setDrawColor(220, 220, 215);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 4. Título do Documento
  currentY += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 60, 52);

  const tituloFormatado = (validacao.tipo_documento || 'Atestado Médico').toUpperCase();
  doc.text(tituloFormatado, pageWidth / 2, currentY, { align: 'center' });

  // 5. Corpo do Documento
  currentY += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);

  const dataEmissao = new Date(validacao.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const horaEmissao = new Date(validacao.created_at).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  let textoDeclaratorio = validacao.conteudo_texto;
  if (!textoDeclaratorio) {
    if (validacao.tipo_documento === 'Declaração de Comparecimento') {
      textoDeclaratorio = `Declaro para os devidos fins trabalhistas e escolares que o(a) paciente ${validacao.paciente_nome} compareceu a este consultório médico em ${dataEmissao}, às ${horaEmissao} horas, para realização de consulta e procedimentos de saúde.`;
    } else if (validacao.tipo_documento === 'Declaração de Comparecimento de Acompanhante') {
      textoDeclaratorio = `Declaro para os devidos fins trabalhistas e escolares (Art. 473 da CLT) que o(a) acompanhante esteve presente neste consultório médico em ${dataEmissao}, prestando acompanhamento ao(à) paciente ${validacao.paciente_nome} durante a realização de consulta médica e avaliação de saúde.`;
    } else if (validacao.tipo_documento === 'Atestado Médico para Acompanhante' || validacao.tipo_documento === 'Atestado de Acompanhamento de Doente') {
      textoDeclaratorio = `Atesto para os devidos fins legais, trabalhistas e previdenciários (Art. 473 da CLT e resoluções do CFM) que o(a) acompanhante esteve prestando assistência e cuidados indispensáveis ao(à) paciente ${validacao.paciente_nome} nesta data em consulta médica ambulatorial, devendo permanecer afastado(a) de suas atividades laborais por ${validacao.dias_afastamento || 1} dia(s) a partir desta data para prestar suporte ao(à) paciente sob seus cuidados.`;
    } else {
      textoDeclaratorio = `Atesto para os devidos fins que o(a) paciente ${validacao.paciente_nome} esteve sob meus cuidados profissionais na presente data, necessitando de ${validacao.dias_afastamento || 1} dia(s) de repouso e afastamento de suas atividades habituais a partir desta data para recuperação de sua saúde.`;
    }
  }

  // Quebra de texto automática
  const splitText = doc.splitTextToSize(textoDeclaratorio, contentWidth);
  doc.text(splitText, margin, currentY, { lineHeightFactor: 1.6 });

  currentY = currentY + splitText.length * 7 + 10;

  if (validacao.cid) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`Classificação Internacional de Doenças (CID-10): ${validacao.cid}`, margin, currentY);
    currentY += 10;
  }

  // 6. Localidade e Data
  currentY = Math.max(currentY, 150);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Rio Branco - AC, ${dataEmissao}.`, pageWidth / 2, currentY, { align: 'center' });

  // 7. Bloco de Assinatura e Carimbo
  const signatureY = currentY + 10;
  if (signatureDataUrl) {
    try {
      doc.addImage(signatureDataUrl, 'PNG', pageWidth / 2 - 35, signatureY, 70, 24);
    } catch (e) {
      console.error('Erro ao renderizar imagem da assinatura:', e);
    }
  }

  const lineY = signatureY + 25;
  doc.setDrawColor(26, 60, 52);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 45, lineY, pageWidth / 2 + 45, lineY);

  // Assinatura com grafia corrigida "Drª. Cibele Cristina"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 60, 52);
  doc.text('Drª. Cibele Cristina', pageWidth / 2, lineY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 90, 85);
  doc.text(`${DOCTOR_INFO.specialty} • ${DOCTOR_INFO.crm} • ${DOCTOR_INFO.rqe}`, pageWidth / 2, lineY + 9.5, { align: 'center' });

  // 8. Bloco de Validação Pública com QR Code (sem nenhum texto vazando das bordas)
  const validationUrl = `${baseUrl}/validar/${validacao.id}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(validationUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 120,
      color: {
        dark: '#1A3C34',
        light: '#FFFFFF'
      }
    });

    const boxHeight = 31;
    const footerBoxY = pageHeight - 39; // 297 - 39 = 258mm, termina em 289mm
    // Fundo cinza suave de autenticidade
    doc.setFillColor(248, 249, 247);
    doc.roundedRect(margin, footerBoxY, contentWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(220, 225, 222);
    doc.roundedRect(margin, footerBoxY, contentWidth, boxHeight, 2, 2, 'S');

    // QR Code à esquerda: 25mm x 25mm
    doc.addImage(qrDataUrl, 'PNG', margin + 3.5, footerBoxY + 3, 25, 25);

    // Textos informativos de autenticidade dentro da largura disponível
    const textStartX = margin + 32;
    const availableTextWidth = contentWidth - 35; // 170 - 35 = 135mm

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(26, 60, 52);
    doc.text('DOCUMENTO MÉDICO COM AUTENTICIDADE VERIFICÁVEL', textStartX, footerBoxY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(80, 85, 82);
    doc.text('Aponte a câmera para o QR Code ao lado ou acesse o link para conferir os dados originais.', textStartX, footerBoxY + 9.5);

    doc.setFontSize(6.0);
    doc.text(`Identificador: ${validacao.id}`, textStartX, footerBoxY + 14);
    doc.text(`Código: ${validacao.hash_autenticidade} • Emitido em: ${dataEmissao} às ${horaEmissao} • Drª. Cibele Cristina`, textStartX, footerBoxY + 18);

    // Link clicável ajustado que NUNCA transborda da caixa (trunca display dinamicamente)
    doc.setFontSize(6.0);
    doc.setTextColor(180, 140, 60);
    let displayLink = `Acesse para validar: ${validationUrl}`;
    while (doc.getTextWidth(displayLink) > availableTextWidth && displayLink.length > 25) {
      displayLink = displayLink.slice(0, -4) + '...';
    }
    doc.textWithLink(displayLink, textStartX, footerBoxY + 22.5, { url: validationUrl });

    doc.setFontSize(5.3);
    doc.setTextColor(130, 135, 132);
    doc.text('Assinatura eletrônica em conformidade com a MP nº 2.200-2/2001 e Resolução CFM nº 2.299/2021.', textStartX, footerBoxY + 26.5);
  } catch (err) {
    console.error('Erro ao gerar QR Code:', err);
  }

  // Salva o PDF no navegador
  const fileName = `${validacao.tipo_documento.toLowerCase().replace(/\s+/g, '_')}_${validacao.paciente_nome.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}

// Gerador de PDF para Prescrições e Solicitações de Exames
export interface GeneratePrescricaoPdfOptions {
  pacienteNome: string;
  tipo: 'Receita Médica' | 'Pedido de Exames' | 'Plano de Cuidado';
  itens: PrescricaoItem[];
  observacoes?: string;
  dataEmissao?: string;
  signatureDataUrl?: string;
  baseUrl?: string;
}

export async function generatePrescricaoPdf({
  pacienteNome,
  tipo,
  itens,
  observacoes,
  dataEmissao = new Date().toLocaleDateString('pt-BR'),
  signatureDataUrl
}: GeneratePrescricaoPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Carrega a logo oficial recortada e limpa
  let logoDataUrl = LOGO_ATESTADO_BASE64;
  if (!logoDataUrl) {
    logoDataUrl = await getBase64ImageFromUrl(DOCTOR_INFO.logoImage || '/logo-atestado.png') || '';
  }

  // Moldura decorativa no topo da folha
  doc.setFillColor(26, 60, 52);
  doc.rect(margin, 5.5, contentWidth, 2.2, 'F');
  doc.setFillColor(197, 160, 89);
  doc.rect(margin, 7.8, contentWidth, 0.6, 'F');

  // Logo Oficial no Cabeçalho (Posicionado alto: y=9.5mm, h=17.3mm -> termina em 26.8mm)
  const logoWidth = 15;
  const logoHeight = 17.3;
  const logoY = 9.5;

  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', pageWidth / 2 - logoWidth / 2, logoY, logoWidth, logoHeight);
    } catch {
      // ignore
    }
  }

  // Cabeçalho da prescrição sem caixa alta
  let currentY = 32.5;
  doc.setTextColor(26, 60, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Drª. Cibele Cristina', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 95);
  doc.text(`${DOCTOR_INFO.specialty} • ${DOCTOR_INFO.crm} • ${DOCTOR_INFO.rqe}`, pageWidth / 2, currentY, { align: 'center' });
  
  currentY += 4;
  doc.text('Clínica & Consultório Médico • Rio Branco - AC', pageWidth / 2, currentY, { align: 'center' });

  currentY += 4.5;
  doc.setDrawColor(220, 220, 215);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // Faixa do Paciente
  currentY += 5;
  doc.setFillColor(248, 250, 248);
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(225, 230, 226);
  doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 60, 52);
  doc.text(`Paciente: ${pacienteNome}`, margin + 5, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 110, 105);
  doc.text(`Data: ${dataEmissao}`, pageWidth - margin - 5, currentY + 7, { align: 'right' });

  // Título da Receita / Pedido
  currentY += 21;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(26, 60, 52);
  doc.text(tipo.toUpperCase(), margin, currentY);

  // Itens
  currentY += 8;
  doc.setFont('helvetica', 'normal');

  itens.forEach((item, index) => {
    if (currentY > pageHeight - 65) {
      doc.addPage();
      currentY = 25;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(26, 60, 52);
    const itemHeader = `${index + 1}. ${item.nome} ${item.quantidade ? `(${item.quantidade})` : ''} ${item.via ? `[Via ${item.via}]` : ''}`;
    doc.text(itemHeader, margin, currentY);

    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 55, 52);

    const instrucaoLines = doc.splitTextToSize(item.posologia_ou_instrucao, contentWidth - 8);
    doc.text(instrucaoLines, margin + 5, currentY);

    currentY += instrucaoLines.length * 4.8 + 4;
  });

  if (observacoes && observacoes.trim()) {
    if (currentY > pageHeight - 55) {
      doc.addPage();
      currentY = 25;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(197, 160, 89);
    doc.text('ORIENTAÇÕES COMPLEMENTARES:', margin, currentY + 2);
    currentY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(70, 75, 72);
    const obsLines = doc.splitTextToSize(observacoes, contentWidth);
    doc.text(obsLines, margin, currentY);
    currentY += obsLines.length * 4.5 + 8;
  }

  // Bloco de Assinatura com grafia corrigida "Drª. Cibele Cristina"
  const signBlockY = pageHeight - 45;
  if (signatureDataUrl) {
    try {
      doc.addImage(signatureDataUrl, 'PNG', pageWidth / 2 - 30, signBlockY - 18, 60, 20);
    } catch {
      // ignore
    }
  }

  doc.setDrawColor(26, 60, 52);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 40, signBlockY, pageWidth / 2 + 40, signBlockY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 60, 52);
  doc.text('Drª. Cibele Cristina', pageWidth / 2, signBlockY + 4.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 90, 85);
  doc.text(`${DOCTOR_INFO.specialty} • ${DOCTOR_INFO.crm} • ${DOCTOR_INFO.rqe}`, pageWidth / 2, signBlockY + 8.5, { align: 'center' });

  const fileName = `${tipo.toLowerCase().replace(/\s+/g, '_')}_${pacienteNome.toLowerCase().replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
}
