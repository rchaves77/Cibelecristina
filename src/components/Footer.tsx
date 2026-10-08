import React from 'react';
import { Stethoscope, Heart, Lock, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
  onOpenLattes: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenBooking, onOpenLattes }) => {
  return (
    <footer className="bg-[#1A3A36] text-[#DCE7E5] border-t border-[#2D5A54]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Identity & Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Logo Dra. Cibele Cristina" 
                className="w-11 h-11 rounded-xl object-contain bg-[#FAF8F5] p-1 border border-[#C5A059]/40 shadow-xs"
              />
              <div>
                <span className="block font-serif italic font-bold text-white text-base leading-tight">
                  {DOCTOR_PROFILE.name}
                </span>
                <span className="block text-[11px] text-[#4ADE80] font-bold uppercase tracking-wider">
                  {DOCTOR_PROFILE.specialty}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#CBD5E0] font-light leading-relaxed">
              Atendimento médico humanizado, longitudinal e preventivo. Formação pela Universidad de Cádiz (Espanha) revalidada pela UFPB e pós-graduação pela UFPeL.
            </p>

            <div className="pt-2 text-xs text-[#CBD5E0] space-y-1 font-light">
              <p><strong className="text-white font-semibold">Registro:</strong> {DOCTOR_PROFILE.crm}</p>
              <p><strong className="text-white font-semibold">Qualificação:</strong> {DOCTOR_PROFILE.rqe}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4ADE80]">
              Navegação do Site
            </h4>
            <ul className="space-y-2 text-xs text-[#CBD5E0]">
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">Sobre a Dra. Cibele</a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-white transition-colors">Serviços e Consultas</a>
              </li>
              <li>
                <a href="#agendamento" className="hover:text-white transition-colors">Agendamento Online WhatsApp</a>
              </li>
              <li>
                <a href="#convenios" className="hover:text-white transition-colors">Convênios e Reembolso</a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos de Pacientes</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">Blog de Saúde Preventiva</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Perguntas Frequentes (FAQ)</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Consultation & Contact */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4ADE80]">
              Atendimento e Contato
            </h4>
            <div className="space-y-2.5 text-xs text-[#CBD5E0]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                <span>{DOCTOR_PROFILE.address.clinic} • {DOCTOR_PROFILE.address.street}, {DOCTOR_PROFILE.address.room} - Rio Branco/AC</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>{DOCTOR_PROFILE.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#4ADE80] shrink-0" />
                <span>{DOCTOR_PROFILE.email}</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#2D5A54] hover:bg-[#234641] text-white text-xs uppercase tracking-wider font-bold text-center border border-[#4ADE80]/30 transition-colors cursor-pointer shadow-xs"
                >
                  Agendar Consulta Agora
                </button>
              </div>
            </div>
          </div>

          {/* Col 4: Academic Transparency & CMS access */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4ADE80]">
              Transparência & Gestão
            </h4>
            <p className="text-xs text-[#CBD5E0] font-light leading-relaxed">
              Consulte a formação acadêmica completa cadastrada na Plataforma Lattes do CNPq.
            </p>
            <button
              onClick={onOpenLattes}
              className="inline-flex items-center gap-1.5 text-xs text-[#4ADE80] hover:text-white underline cursor-pointer"
            >
              Visualizar Currículo Lattes
            </button>

            <div className="pt-2">
              <a
                href="/validar-atestado"
                className="inline-flex items-center gap-1.5 text-xs text-[#CBD5E0] hover:text-[#4ADE80] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Validador de Atestado & Laudos</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#2D5A54]/50 space-y-2">
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-[#CBD5E0]/70">Área Exclusiva:</span>
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 px-3 rounded-xl bg-[#122421] hover:bg-[#152a26] border border-[#2D5A54] text-[#DCE7E5] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Painel Admin (CMS Blog & Agenda)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Medical Ethics & CFM Compliance Disclaimer */}
        <div className="mt-12 pt-8 border-t border-[#2D5A54]/40 text-[11px] text-[#A0AEC0] font-light space-y-3">
          <p className="leading-relaxed">
            <strong className="text-[#DCE7E5] font-semibold">Aviso Legal e Ética Médica:</strong> As informações contidas neste site possuem finalidade exclusivamente educativa e informativa, de acordo com o Manual de Publicidade Médica do Conselho Federal de Medicina (CFM). Nenhuma informação aqui veiculada deve ser utilizada para auto-diagnóstico ou auto-medicação. O diagnóstico definitivo e o plano terapêutico só podem ser estabelecidos em consulta médica individualizada.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p>© {new Date().getFullYear()} Dra. Cibele Cristina Cunha Brígido • Todos os direitos reservados.</p>
            <p className="text-[#DCE7E5] flex items-center gap-1">
              <span>Medicina de Família e Comunidade • Cuidado Integral e Humanizado</span>
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};
