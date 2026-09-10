import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, Shield, FileText, CheckCircle2, 
  MessageSquare, AlertCircle, Sparkles, MapPin, Video, Home, 
  ChevronRight, Check, Info, HeartHandshake
} from 'lucide-react';
import { DOCTOR_PROFILE, INSURANCE_PLANS } from '../data/initialData';
import { apiService } from '../services/api';
import { Appointment } from '../types';

interface AppointmentBookingProps {
  initialService?: string;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ initialService }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: '',
    serviceType: initialService || 'Medicina da Família & Check-up',
    modality: 'presencial' as 'presencial' | 'telemedicina' | 'domiciliar',
    date: '',
    timeSlot: '09:30',
    insurance: 'Unimed',
    notes: ''
  });

  const [periodFilter, setPeriodFilter] = useState<'all' | 'morning' | 'afternoon'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Time slots categorized by period
  const morningSlots = ['08:00', '08:45', '09:30', '10:15', '11:00', '11:45'];
  const afternoonSlots = ['14:00', '14:45', '15:30', '16:15', '17:00', '17:45'];

  const displayedSlots = 
    periodFilter === 'morning' ? morningSlots :
    periodFilter === 'afternoon' ? afternoonSlots :
    [...morningSlots, ...afternoonSlots];

  const serviceOptions = [
    'Medicina da Família & Check-up Preventivo',
    'Puericultura & Desenvolvimento Infantil',
    'Hipertensão, Diabetes & Doenças Crônicas',
    'Saúde Integral da Mulher',
    'Saúde do Idoso & Avaliação Geriátrica',
    'Consulta Clínica Geral & Sintomas Agudos',
    'Acompanhamento de Exames & Laudos'
  ];

  const formatWhatsAppMessage = (data: typeof formData, id: string) => {
    const modalityLabel = 
      data.modality === 'presencial' ? 'Presencial (Consultório Espaço Médico Integrado)' :
      data.modality === 'telemedicina' ? 'Telemedicina (Consulta Online)' : 'Visita Domiciliar';

    const text = `*SOLICITAÇÃO DE AGENDAMENTO MÉDICO*
Olá, Dra. Cibele Cristina e equipe! Gostaria de confirmar um horário de consulta:

📌 *Protocolo:* ${id}
👤 *Paciente:* ${data.patientName} ${data.patientAge ? `(${data.patientAge} anos)` : ''}
📞 *WhatsApp:* ${data.patientPhone}
🩺 *Tipo de Atendimento:* ${data.serviceType}
📍 *Modalidade:* ${modalityLabel}
🗓️ *Data Escolhida:* ${data.date}
⏰ *Horário:* ${data.timeSlot}
💳 *Convênio / Pagamento:* ${data.insurance}
${data.notes ? `📝 *Observações / Sintomas:* ${data.notes}` : ''}

Por favor, poderiam confirmar a disponibilidade na agenda? Muito obrigado(a)!`;

    return encodeURIComponent(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.patientPhone.trim() || !formData.date) {
      alert('Por favor, informe seu nome completo, telefone para contato e escolha a data.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save into the system database
      const created = await apiService.createAppointment({
        patientName: formData.patientName.trim(),
        patientPhone: formData.patientPhone.trim(),
        patientAge: formData.patientAge ? parseInt(formData.patientAge, 10) : undefined,
        serviceType: formData.serviceType,
        modality: formData.modality,
        date: formData.date,
        timeSlot: formData.timeSlot,
        insurance: formData.insurance,
        notes: formData.notes.trim(),
        sourceWhatsAppSent: true
      });

      setConfirmedBooking(created);

      // 2. Open WhatsApp with pre-formatted message
      const message = formatWhatsAppMessage(formData, created.id);
      const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${message}`;
      
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('Houve um erro ao processar o agendamento. Tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setFormData({
      patientName: '',
      patientPhone: '',
      patientAge: '',
      serviceType: 'Medicina da Família & Check-up',
      modality: 'presencial',
      date: '',
      timeSlot: '09:30',
      insurance: 'Unimed',
      notes: ''
    });
  };

  return (
    <section id="agendamento" className="py-16 lg:py-24 bg-[#FDFCFB] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE7E5]/50 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            <Calendar className="w-3.5 h-3.5 text-[#2D5A54]" />
            <span>Agendamento Online Descomplicado</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Agenda de Consultas da Dra. Cibele Cristina Cunha Brígido
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Selecione o horário mais conveniente e o seu convênio médico. O agendamento é registrado em nosso sistema e confirmado diretamente via WhatsApp pela nossa recepção.
          </p>
        </div>

        {/* Informative Guidance: Horários de Consulta & Convênios Claros */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          
          {/* Horários de Atendimento Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E5E1DA] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#E5E1DA] pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#DCE7E5] text-[#2D5A54] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-sm text-[#1A3A36]">
                  Horários de Consulta da Dra. Cibele
                </h3>
                <p className="text-[11px] text-[#636E72]">Atendimento humanizado com duração de 45 a 60 minutos</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#2D3436]">
              <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                <div>
                  <strong className="block text-[#1A3A36]">Segunda a Sexta — Manhã</strong>
                  <span className="text-[#636E72] text-[11px]">Check-up, puericultura e acompanhamento</span>
                </div>
                <span className="font-semibold text-[#2D5A54] bg-white px-2.5 py-1 rounded-md border border-[#E5E1DA]">
                  08:00 às 12:00
                </span>
              </div>

              <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                <div>
                  <strong className="block text-[#1A3A36]">Segunda a Sexta — Tarde</strong>
                  <span className="text-[#636E72] text-[11px]">Consultas clínicas, telemedicina e retornos</span>
                </div>
                <span className="font-semibold text-[#2D5A54] bg-white px-2.5 py-1 rounded-md border border-[#E5E1DA]">
                  14:00 às 18:00
                </span>
              </div>

              <div className="flex items-start justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                <div>
                  <strong className="block text-[#1A3A36]">Sábados (Quinzenais)</strong>
                  <span className="text-[#636E72] text-[11px]">Vagas especiais sob agendamento prévio</span>
                </div>
                <span className="font-semibold text-[#2D5A54] bg-white px-2.5 py-1 rounded-md border border-[#E5E1DA]">
                  08:00 às 12:00
                </span>
              </div>
            </div>
          </div>

          {/* Convênios Aceitos Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-[#E5E1DA] shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#E5E1DA] pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#DCE7E5] text-[#2D5A54] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-sm text-[#1A3A36]">
                  Convênios Médicos Aceitos & Reembolso
                </h3>
                <p className="text-[11px] text-[#636E72]">Cobertura direta e emissão de relatório para reembolso</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {INSURANCE_PLANS.map((ins) => (
                <button
                  key={ins.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, insurance: ins.name })}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    formData.insurance === ins.name
                      ? 'bg-[#2D5A54] text-white border-[#2D5A54] shadow-xs'
                      : 'bg-[#FAF8F5] text-[#2D3436] border-[#E5E1DA] hover:border-[#2D5A54]/50'
                  }`}
                >
                  <strong className="block text-[11px] leading-tight truncate">{ins.name}</strong>
                  <span className={`text-[9px] block mt-0.5 truncate ${formData.insurance === ins.name ? 'text-[#DCE7E5]' : 'text-[#636E72]'}`}>
                    {ins.tagline}
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-[#636E72] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E5E1DA] leading-relaxed">
              💡 <strong>Tem outro plano (ex: Bradesco, Amil, Care Plus)?</strong> Emitimos recibo e relatório com CID para reembolso de até 100% no seu plano de saúde.
            </p>
          </div>

        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          
          {confirmedBooking ? (
            /* Success Receipt View */
            <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-10 border border-[#E5E1DA] shadow-xs text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#DCE7E5] text-[#2D5A54] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5] px-3 py-1 rounded-full">
                  Agendamento Registrado!
                </span>
                <h3 className="text-2xl font-serif italic font-bold text-[#1A3A36]">
                  Agradecemos a sua preferência, {confirmedBooking.patientName}!
                </h3>
                <p className="text-sm text-[#4A5568] max-w-lg mx-auto font-light">
                  Seu pedido foi registrado no sistema com o protocolo <strong className="text-[#1A3A36] font-semibold">{confirmedBooking.id}</strong>. 
                  A confirmação será feita pelo WhatsApp da recepção da Dra. Cibele.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-xl p-5 max-w-md mx-auto border border-[#E5E1DA] text-left space-y-2.5 text-xs sm:text-sm text-[#2D3436] shadow-xs">
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span className="text-[#636E72]">Serviço:</span>
                  <strong className="text-[#1A3A36]">{confirmedBooking.serviceType}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span className="text-[#636E72]">Modalidade:</span>
                  <strong className="capitalize text-[#1A3A36]">{confirmedBooking.modality}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span className="text-[#636E72]">Data e Horário:</span>
                  <strong className="text-[#2D5A54] font-semibold">{confirmedBooking.date} às {confirmedBooking.timeSlot}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span className="text-[#636E72]">Convênio / Pagamento:</span>
                  <strong className="text-[#1A3A36]">{confirmedBooking.insurance}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#636E72]">WhatsApp de Contato:</span>
                  <strong className="text-[#1A3A36]">{confirmedBooking.patientPhone}</strong>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${formatWhatsAppMessage(formData, confirmedBooking.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#4ADE80]" />
                  <span>Reabrir Conversa no WhatsApp</span>
                </a>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-[#E5E1DA] hover:bg-[#FAF8F5] text-[#2D3436] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Fazer Outro Agendamento
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E5E1DA] shadow-xs space-y-8">
              
              {/* 1. Modality Selection */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36]">
                  1. Escolha a Modalidade de Consulta
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, modality: 'presencial' })}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      formData.modality === 'presencial'
                        ? 'bg-[#FAF8F5] border-[#2D5A54] text-[#1A3A36] ring-1 ring-[#2D5A54]'
                        : 'bg-white border-[#E5E1DA] text-[#636E72] hover:border-[#2D5A54]/40'
                    }`}
                  >
                    <MapPin className={`w-5 h-5 mt-0.5 ${formData.modality === 'presencial' ? 'text-[#2D5A54]' : 'text-[#636E72]'}`} />
                    <div>
                      <strong className="block text-sm font-semibold text-[#1A3A36]">Presencial</strong>
                      <span className="text-xs text-[#636E72]">Consultório Espaço Médico</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, modality: 'telemedicina' })}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      formData.modality === 'telemedicina'
                        ? 'bg-[#FAF8F5] border-[#2D5A54] text-[#1A3A36] ring-1 ring-[#2D5A54]'
                        : 'bg-white border-[#E5E1DA] text-[#636E72] hover:border-[#2D5A54]/40'
                    }`}
                  >
                    <Video className={`w-5 h-5 mt-0.5 ${formData.modality === 'telemedicina' ? 'text-[#2D5A54]' : 'text-[#636E72]'}`} />
                    <div>
                      <strong className="block text-sm font-semibold text-[#1A3A36]">Telemedicina</strong>
                      <span className="text-xs text-[#636E72]">Videoconsulta Segura</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, modality: 'domiciliar' })}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      formData.modality === 'domiciliar'
                        ? 'bg-[#FAF8F5] border-[#2D5A54] text-[#1A3A36] ring-1 ring-[#2D5A54]'
                        : 'bg-white border-[#E5E1DA] text-[#636E72] hover:border-[#2D5A54]/40'
                    }`}
                  >
                    <Home className={`w-5 h-5 mt-0.5 ${formData.modality === 'domiciliar' ? 'text-[#2D5A54]' : 'text-[#636E72]'}`} />
                    <div>
                      <strong className="block text-sm font-semibold text-[#1A3A36]">Visita Domiciliar</strong>
                      <span className="text-xs text-[#636E72]">Idosos & Pós-parto</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Service & Insurance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1.5">
                    2. Serviço ou Queixa Principal
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                  >
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1.5">
                    Convênio Médico Selecionado
                  </label>
                  <select
                    value={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                  >
                    {INSURANCE_PLANS.map((ins) => (
                      <option key={ins.id} value={ins.name}>{ins.name}</option>
                    ))}
                    <option value="Outro Convênio (Reembolso)">Outro Convênio (Com Recibo p/ Reembolso)</option>
                  </select>
                </div>
              </div>

              {/* 3. Date & Time Selection with Period Filters */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36]">
                    3. Selecione a Data e o Horário Desejado
                  </label>
                  
                  {/* Period filter */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-[#636E72] mr-1">Filtrar horários:</span>
                    <button
                      type="button"
                      onClick={() => setPeriodFilter('all')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer ${
                        periodFilter === 'all' ? 'bg-[#2D5A54] text-white' : 'bg-[#FAF8F5] text-[#636E72] border border-[#E5E1DA]'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeriodFilter('morning')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer ${
                        periodFilter === 'morning' ? 'bg-[#2D5A54] text-white' : 'bg-[#FAF8F5] text-[#636E72] border border-[#E5E1DA]'
                      }`}
                    >
                      Manhã
                    </button>
                    <button
                      type="button"
                      onClick={() => setPeriodFilter('afternoon')}
                      className={`px-2 py-0.5 rounded-md cursor-pointer ${
                        periodFilter === 'afternoon' ? 'bg-[#2D5A54] text-white' : 'bg-[#FAF8F5] text-[#636E72] border border-[#E5E1DA]'
                      }`}
                    >
                      Tarde
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  
                  {/* Date Input */}
                  <div className="sm:col-span-5">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                    />
                    <span className="text-[11px] text-[#636E72] mt-1.5 block font-light leading-snug">
                      Consultas regulares de 2ª a 6ª-feira e sábados quinzenais.
                    </span>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="sm:col-span-7">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {displayedSlots.map((slot) => {
                        const isSelected = formData.timeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData({ ...formData, timeSlot: slot })}
                            className={`py-2 px-1 text-xs font-semibold rounded-lg text-center transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#2D5A54] text-white shadow-xs ring-1 ring-[#2D5A54]'
                                : 'bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] hover:bg-[#DCE7E5]/30'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-[#636E72] mt-2">
                      Horário selecionado: <strong className="text-[#2D5A54] font-semibold">{formData.timeSlot}</strong>
                    </p>
                  </div>

                </div>
              </div>

              {/* 4. Patient Information */}
              <div className="space-y-4 pt-4 border-t border-[#E5E1DA]">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36]">
                  4. Dados do Paciente para Confirmação
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#636E72] mb-1">Nome Completo do Paciente *</label>
                    <input
                      type="text"
                      placeholder="Ex: Maria Clara dos Santos"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#636E72] mb-1">Idade</label>
                    <input
                      type="number"
                      placeholder="Ex: 35"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#636E72] mb-1">WhatsApp de Contato *</label>
                    <input
                      type="tel"
                      placeholder="Ex: (68) 99999-8888"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#636E72] mb-1">Observações ou Sintomas (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Check-up de rotina, tosse, renovação..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] text-sm focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54] focus:border-[#2D5A54]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-[#E5E1DA]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white font-bold text-xs uppercase tracking-widest shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 text-[#4ADE80]" />
                  <span>{isSubmitting ? 'Registrando Agendamento...' : 'Confirmar e Enviar via WhatsApp'}</span>
                </button>
                <p className="text-[11px] text-[#636E72] text-center mt-2.5 font-light">
                  Seus dados serão gravados com segurança em nossa agenda e o WhatsApp será aberto para a recepção da Dra. Cibele confirmar o horário.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
