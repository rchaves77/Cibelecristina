import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, Heart, Stethoscope, CheckCircle2, FileText, ExternalLink, X } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

interface AboutDoctorProps {
  isLattesModalOpen: boolean;
  onCloseLattes: () => void;
  onOpenLattes: () => void;
  onOpenBooking: () => void;
}

export const AboutDoctor: React.FC<AboutDoctorProps> = ({
  isLattesModalOpen,
  onCloseLattes,
  onOpenLattes,
  onOpenBooking
}) => {
  return (
    <section id="sobre" className="py-16 lg:py-24 bg-[#FDFCFB] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            <Stethoscope className="w-3.5 h-3.5 text-[#2D5A54]" />
            <span>Perfil Profissional • Filosofia de Cuidado</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Conheça a Dra. Cibele Cristina Cunha Brígido
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Uma trajetória de excelência médica dedicada à medicina humanizada, atenção primária e ao acolhimento contínuo de famílias em todas as fases da vida.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Doctor Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-slate max-w-none text-[#4A5568] space-y-4 leading-relaxed font-light text-base sm:text-lg">
              <p>
                Com formação médica internacional na renomada <strong className="text-[#1A3A36] font-semibold">Universidad de Cádiz (2008), na Espanha</strong>, revalidada pela <strong className="text-[#1A3A36] font-semibold">Universidade Federal da Paraíba (UFPB)</strong> e especialização com pós-graduação em <strong className="text-[#1A3A36] font-semibold">Saúde da Família pela Universidade Federal de Pelotas (UFPeL)</strong>, a Dra. Cibele Cristina alia sólido rigor científico a uma prática clínica profundamente empática.
              </p>

              <blockquote className="p-5 bg-white border-l-2 border-[#2D5A54] rounded-r-xl italic font-serif text-[#2D5A54] my-5 text-base sm:text-lg leading-relaxed shadow-xs">
                "A verdadeira medicina não fragmenta a pessoa em queixas isoladas. Quando atendo um paciente, escuto sua história, compreendo seu núcleo familiar e construo junto com ele um caminho de saúde e bem-estar que cabe na sua realidade."
              </blockquote>

              <p className="text-[#4A5568]">
                Com uma sólida e ampla prática clínica consolidada no manejo de casos clínicos complexos, medicina interna e urgências, a Dra. Cibele acumula uma vivência técnica indispensável para diagnósticos precisos e planos de cuidado resolutivos. Como <strong className="text-[#1A3A36] font-semibold">professora de Práticas de Integração em Saúde (PIS) do Centro Universitário Uninorte</strong>, dedica-se também à formação de novos médicos com ênfase na ética médica, na clínica integral e na comunicação compassiva centrada na pessoa.
              </p>
            </div>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA]">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A54] shrink-0 mt-0.5" />
                <span className="text-xs text-[#2D3436]">
                  <strong className="text-[#1A3A36]">Escuta Qualificada:</strong> Tempo dedicado para conversar e esclarecer dúvidas sem jargões.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA]">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A54] shrink-0 mt-0.5" />
                <span className="text-xs text-[#2D3436]">
                  <strong className="text-[#1A3A36]">Cuidado Longitudinal:</strong> Acompanhamento contínuo ao longo dos anos, não apenas na crise.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA]">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A54] shrink-0 mt-0.5" />
                <span className="text-xs text-[#2D3436]">
                  <strong className="text-[#1A3A36]">Coordenação do Cuidado:</strong> Apoio na interlocução com outros especialistas e exames.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-[#E5E1DA]">
                <CheckCircle2 className="w-4 h-4 text-[#2D5A54] shrink-0 mt-0.5" />
                <span className="text-xs text-[#2D3436]">
                  <strong className="text-[#1A3A36]">Foco em Prevenção:</strong> Rastreamento individualizado para viver mais e melhor.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onOpenLattes}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold text-[#2D5A54] bg-white hover:bg-[#FAF8F5] border border-[#2D5A54] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#2D5A54]" />
                <span>Currículo Lattes Completo</span>
              </button>
              
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold text-white bg-[#2D5A54] hover:bg-[#1A3A36] transition-colors shadow-xs cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#4ADE80]" />
                <span>Agendar com Dra. Cibele</span>
              </button>
            </div>
          </div>

          {/* Right Column: Academic & Professional Timeline Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E1DA] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-4">
                <div>
                  <h3 className="text-base font-serif italic font-bold text-[#1A3A36]">Credenciais & Formação</h3>
                  <p className="text-xs text-[#636E72]">Histórico acadêmico e institucional</p>
                </div>
                <Award className="w-5 h-5 text-[#2D5A54]" />
              </div>

              {/* Timeline steps */}
              <div className="space-y-4">
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE7E5]/50 text-[#2D5A54] flex items-center justify-center shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A3A36]">Graduação em Medicina (2008)</h4>
                    <p className="text-xs text-[#636E72] mt-0.5">Universidad de Cádiz (Espanha)</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-[#2D5A54] bg-[#DCE7E5]/60 px-2 py-0.5 rounded-sm">
                      Revalidada pela UFPB
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE7E5]/50 text-[#2D5A54] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A3A36]">Pós-Graduação em Saúde da Família</h4>
                    <p className="text-xs text-[#636E72] mt-0.5">Universidade Federal de Pelotas (UFPeL)</p>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider text-[#2D5A54] bg-[#DCE7E5]/60 px-2 py-0.5 rounded-sm">
                      Especialização em MFC & Clínica Médica
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE7E5]/50 text-[#2D5A54] flex items-center justify-center shrink-0 mt-0.5">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A3A36]">Sólida Prática Clínica & Urgências</h4>
                    <p className="text-xs text-[#636E72] mt-0.5">Ampla vivência em medicina interna, atendimento resolutivo e manejo de casos complexos</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE7E5]/50 text-[#2D5A54] flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A3A36]">Centro Universitário Uninorte</h4>
                    <p className="text-xs text-[#636E72] mt-0.5">Professora de Práticas de Integração em Saúde (PIS) e preceituação médica</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lattes Modal */}
      {isLattesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A3A36]/50 backdrop-blur-xs p-4">
          <div className="bg-[#FDFCFB] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E5E1DA]">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#FDFCFB] border-b border-[#E5E1DA] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2D5A54]" />
                <div>
                  <h3 className="text-base font-serif italic font-bold text-[#1A3A36]">Currículo Lattes • CNPq</h3>
                  <p className="text-xs text-[#636E72]">Cibele Cristina Cunha Brígido</p>
                </div>
              </div>
              <button
                onClick={onCloseLattes}
                className="p-1.5 rounded-lg text-[#636E72] hover:text-[#1A3A36] hover:bg-[#DCE7E5]/30 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-[#2D3436] text-sm">
              <div className="p-4 rounded-xl bg-white border border-[#E5E1DA]">
                <p className="font-serif italic font-bold text-[#1A3A36] text-sm mb-1">Resumo Acadêmico Oficial:</p>
                <p className="text-xs text-[#4A5568] leading-relaxed font-light">
                  "Possuo graduação em Medicina - Universidad de Cádiz (2008), Espanha, revalidada pela UFPB. Atuo com sólida prática clínica em medicina interna, urgências e atenção integral à saúde, e sou professora de PIS do Centro Universitário Uninorte. Tenho vasta experiência na área de Medicina de Família e Comunidade, com ênfase em Clínica Médica. Possuo pós-graduação em Saúde da Família pela UFPeL."
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#2D5A54]">Dados Gerais</h4>
                <ul className="space-y-1.5 text-xs text-[#636E72]">
                  <li><strong>Nome em citações bibliográficas:</strong> BRÍGIDO, C. C. C.</li>
                  <li><strong>Nacionalidade:</strong> Brasileira</li>
                  <li><strong>Registro Profissional:</strong> CRM 3482 / AC</li>
                  <li><strong>Área de atuação CNPq:</strong> Ciências da Saúde → Medicina → Medicina de Família e Comunidade / Clínica Médica</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#2D5A54]">Formação Acadêmica</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg border border-[#E5E1DA] bg-white">
                    <p className="font-semibold text-[#1A3A36]">2010 - 2012: Especialização em Saúde da Família</p>
                    <p className="text-[#636E72]">Universidade Federal de Pelotas (UFPeL)</p>
                  </div>
                  <div className="p-3 rounded-lg border border-[#E5E1DA] bg-white">
                    <p className="font-semibold text-[#1A3A36]">2002 - 2008: Graduação em Medicina</p>
                    <p className="text-[#636E72]">Universidad de Cádiz (Espanha) • Revalidação: Universidade Federal da Paraíba (UFPB)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-widest text-[#2D5A54]">Atuação Profissional e Docência</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5E1DA]">
                    <p className="font-semibold text-[#1A3A36]">Centro Universitário Uninorte</p>
                    <p className="text-[#636E72]">Professora do módulo de Práticas de Integração em Saúde (PIS)</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-[#E5E1DA]">
                    <p className="font-semibold text-[#1A3A36]">Prática Clínica Especializada & Medicina de Família</p>
                    <p className="text-[#636E72]">Atendimento clínico individualizado, medicina preventiva e gestão do cuidado familiar</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-between">
                <span className="text-xs text-[#636E72]">Dados cadastrados na Plataforma Lattes / CNPq</span>
                <button
                  onClick={onCloseLattes}
                  className="px-4 py-2 rounded-lg bg-[#2D5A54] hover:bg-[#1A3A36] text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
