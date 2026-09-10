import React from 'react';
import { Clock, MapPin, Phone, Mail, MessageSquare, AlertCircle, Navigation, Calendar } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

interface ContactSectionProps {
  onOpenBooking: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBooking }) => {
  const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consulta com a Dra. Cibele Cristina.')}`;

  return (
    <section id="contato" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            Canais de Atendimento
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Horários de Consulta e Informações de Contato
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Atendimento presencial no consultório, visitas domiciliares programadas e telemedicina com agendamento prévio.
          </p>
        </div>

        {/* Grid: Schedule Table (Left) + Contact Details & Emergency (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Schedule Table (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E1DA] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2D5A54]" />
                <h3 className="font-serif italic font-bold text-[#1A3A36] text-base">Horários de Atendimento Semanal</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5]/40 px-2.5 py-1 rounded-full border border-[#DCE7E5]">
                Consultório & Domiciliar
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#E5E1DA] text-[#636E72] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="pb-2.5">Dia da Semana</th>
                    <th className="pb-2.5">Turno e Horários</th>
                    <th className="pb-2.5 text-right">Modalidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA] text-[#4A5568]">
                  {DOCTOR_PROFILE.schedule.map((item) => (
                    <tr key={item.day} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 font-serif italic font-bold text-[#1A3A36]">{item.day}</td>
                      <td className="py-3 font-light text-[#2D3436]">{item.hours}</td>
                      <td className="py-3 text-right">
                        <span className="inline-block px-2 py-0.5 rounded-sm bg-[#FAF8F5] text-[#2D5A54] font-bold text-[10px] uppercase tracking-wider border border-[#E5E1DA]">
                          {item.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#636E72] border-t border-[#E5E1DA] font-light">
              <span>* Horários sujeitos a confirmação de disponibilidade.</span>
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar Horário</span>
              </button>
            </div>
          </div>

          {/* Contact Details & Emergency Alert (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Direct Contact Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E1DA] shadow-xs space-y-4">
              <h3 className="font-serif italic font-bold text-[#1A3A36] text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2D5A54]" />
                <span>Localização e Canais Diretos</span>
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-[#4A5568]">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                  <MapPin className="w-4 h-4 text-[#2D5A54] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-serif italic font-bold text-[#1A3A36]">{DOCTOR_PROFILE.address.clinic}</strong>
                    <p className="text-[#4A5568] font-light text-xs mt-0.5">{DOCTOR_PROFILE.address.street} - {DOCTOR_PROFILE.address.room}</p>
                    <p className="text-[#636E72] text-[11px] font-light">{DOCTOR_PROFILE.address.neighborhood} • {DOCTOR_PROFILE.address.cityState}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                  <Phone className="w-4 h-4 text-[#2D5A54] shrink-0" />
                  <div>
                    <span className="text-[#636E72] text-[11px] block uppercase tracking-wider font-semibold">Telefone Fixo:</span>
                    <a href={`tel:${DOCTOR_PROFILE.phone.replace(/\D/g, '')}`} className="font-bold text-[#1A3A36] hover:text-[#2D5A54] transition-colors">
                      {DOCTOR_PROFILE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#DCE7E5]/20 border border-[#2D5A54]/30">
                  <MessageSquare className="w-4 h-4 text-[#2D5A54] shrink-0" />
                  <div className="flex-1">
                    <span className="text-[#2D5A54] text-[11px] block font-bold uppercase tracking-wider">WhatsApp da Recepção:</span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#1A3A36] hover:text-[#2D5A54] transition-colors"
                    >
                      (68) 99988-1122
                    </a>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#2D5A54] text-white text-[11px] uppercase tracking-wider font-bold hover:bg-[#1A3A36] transition-colors"
                  >
                    Conversar
                  </a>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1DA]">
                  <Mail className="w-4 h-4 text-[#2D5A54] shrink-0" />
                  <div>
                    <span className="text-[#636E72] text-[11px] block uppercase tracking-wider font-semibold">E-mail de Contato:</span>
                    <a href={`mailto:${DOCTOR_PROFILE.email}`} className="font-medium text-[#1A3A36] hover:text-[#2D5A54] transition-colors">
                      {DOCTOR_PROFILE.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Info Notice */}
            <div className="p-4 rounded-xl bg-white border border-[#E5E1DA] text-[#2D3436] space-y-1 text-xs shadow-xs">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-[#2D5A54]">
                <AlertCircle className="w-4 h-4 text-[#2D5A54]" />
                <span>Em casos de Urgência e Emergência Aguda:</span>
              </div>
              <p className="text-[#4A5568] leading-relaxed text-[11px] font-light">
                Para queixas graves com risco iminente à vida (dor súbita no peito, falta de ar severa, desmaio, suspeita de AVC), ligue imediatamente para o <strong>SAMU 192</strong> ou dirija-se ao pronto-socorro ou serviço de emergência hospitalar mais próximo.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
