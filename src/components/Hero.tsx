import React from 'react';
import { Calendar, HeartHandshake, ShieldCheck, Award, GraduationCap, MapPin, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

interface HeroProps {
  onOpenBooking: () => void;
  onOpenLattes: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onOpenLattes }) => {
  return (
    <section className="relative overflow-hidden bg-[#FDFCFB] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
              <HeartHandshake className="w-3.5 h-3.5 text-[#2D5A54]" />
              <span>Medicina Centrada na Pessoa • Cuidado Humanizado</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1A3A36] tracking-tight leading-[1.15]">
                Cuidado médico que escuta sua história e acolhe toda a sua família.
              </h1>
              <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
                Consultas atenciosas com <strong className="text-[#1A3A36] font-semibold">Dra. Cibele Cristina Cunha Brígido</strong>. 
                Atenção médica integral da infância à maturidade, promovendo saúde preventiva, diagnóstico individualizado e acompanhamento continuado.
              </p>
            </div>

            {/* Medical Credentials Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA] shadow-xs">
                <GraduationCap className="w-5 h-5 text-[#2D5A54] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1A3A36] leading-snug">Graduação Internacional & UFPB</h2>
                  <p className="text-[11px] text-[#636E72]">Univ. de Cádiz (Espanha, 2008) • Revalidada UFPB</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA] shadow-xs">
                <Award className="w-5 h-5 text-[#2D5A54] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1A3A36] leading-snug">Pós-Graduação UFPeL</h2>
                  <p className="text-[11px] text-[#636E72]">Especialista em Saúde da Família e Comunidade</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA] shadow-xs">
                <UserCheck className="w-5 h-5 text-[#2D5A54] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1A3A36] leading-snug">Docência & Sólida Prática Clínica</h2>
                  <p className="text-[11px] text-[#636E72]">Professora Uninorte • Ampla Vivência Médica & MFC</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA] shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#2D5A54] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#1A3A36] leading-snug">Convênios & Particular</h2>
                  <p className="text-[11px] text-[#636E72]">Unimed, Bradesco, Cassi + Recibo para Reembolso</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold text-white bg-[#2D5A54] hover:bg-[#1A3A36] shadow-xs transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#4ADE80]" />
                <span>Agendar Consulta Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLattes}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold text-[#2D5A54] bg-white hover:bg-[#FAF8F5] border border-[#2D5A54] shadow-xs transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#2D5A54]" />
                <span>Ver Currículo Lattes</span>
              </button>
            </div>

            {/* Trust badge row */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#636E72] font-medium border-t border-[#E5E1DA]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#2D5A54]" />
                Consultas com tempo estendido e sem pressa
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2D5A54]" />
                Consultório Presencial & Telemedicina
              </span>
            </div>

          </div>

          {/* Visual Showcase / Doctor Card (Right Column) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              
              <div className="relative rounded-2xl bg-white border border-[#E5E1DA] shadow-md overflow-hidden">
                {/* Doctor Photo */}
                <div className="relative h-80 sm:h-96 w-full bg-[#FAF8F5]">
                  <img
                    src="/cibele.png"
                    alt="Dra. Cibele Cristina Cunha Brígido"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A36]/85 via-transparent to-transparent" />
                  
                  {/* Floating Overlay Badge on Photo */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="inline-block px-2.5 py-1 rounded-md bg-[#2D5A54]/90 backdrop-blur-xs text-[10px] uppercase tracking-wider font-semibold mb-1.5">
                      Atendimento Humanizado
                    </div>
                    <p className="text-xl font-serif italic font-bold tracking-tight">Dra. Cibele Cristina Cunha Brígido</p>
                    <p className="text-xs text-[#DCE7E5] font-light">Médica de Família e Comunidade • CRM-AC 1810 • RQE 1078</p>
                  </div>
                </div>

                {/* Quick Info Box beneath photo */}
                <div className="p-5 bg-[#FAF8F5] border-t border-[#E5E1DA] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#4A5568]">
                    <span className="font-medium text-[#636E72]">Próximos horários disponíveis:</span>
                    <span className="font-semibold text-[#2D5A54] bg-[#DCE7E5] px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">Esta Semana</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#4A5568]">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#E5E1DA]">
                      <span>Presencial (Consultório):</span>
                      <strong className="text-[#1A3A36]">Seg, Ter, Qua, Sex</strong>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[#E5E1DA]">
                      <span>Telemedicina / Domiciliar:</span>
                      <strong className="text-[#1A3A36]">Horários flexíveis</strong>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBooking}
                    className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#2D5A54] hover:bg-[#1A3A36] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span>Verificar Horários Disponíveis</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
