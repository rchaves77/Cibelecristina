import React from 'react';
import { ShieldCheck, CheckCircle2, FileSpreadsheet, Info, MessageSquare } from 'lucide-react';
import { INSURANCE_PLANS, DOCTOR_PROFILE } from '../data/initialData';

export const InsuranceSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de verificar se o meu convênio médico é aceito para consulta com a Dra. Cibele Cristina.')}`;

  return (
    <section id="convenios" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            Convênios & Facilidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Planos de Saúde Atendidos e Reembolso
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Oferecemos atendimento por ampla rede credenciada e fornecemos toda a documentação necessária para reembolso integral ou parcial em consultas particulares.
          </p>
        </div>

        {/* Insurance Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {INSURANCE_PLANS.map((plan) => (
            <div
              key={plan.id}
              className="p-5 rounded-2xl bg-white border border-[#E5E1DA] hover:border-[#2D5A54] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D5A54] font-black text-xs flex items-center justify-center mb-3 group-hover:bg-[#2D5A54] group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif italic font-bold text-[#1A3A36] text-base group-hover:text-[#2D5A54] transition-colors">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#636E72] mt-0.5 font-light">
                  {plan.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E5E1DA]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-[#2D5A54]" />
                  Atendimento Aceito
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Reimbursement Explanation Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E1DA] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-[#1A3A36] font-serif italic font-bold text-base">
                <FileSpreadsheet className="w-5 h-5 text-[#2D5A54]" />
                <span>Como funciona a Consulta Particular com Reembolso?</span>
              </div>
              <p className="text-sm text-[#4A5568] leading-relaxed font-light">
                Se o seu plano de saúde (como <strong className="text-[#1A3A36] font-semibold">Amil, SulAmérica, Bradesco, Omint, Care Plus, Porto Seguro</strong>) não possui convênio direto ou você prefere uma consulta com tempo estendido e dedicação exclusiva, emitimos <strong className="text-[#1A3A36] font-semibold">Nota Fiscal de Serviços Médicos e Laudo Clínico detalhado</strong> com CRM e CID. Com esses documentos, a maioria dos planos ressarce o valor investido na sua conta em até 10 a 30 dias.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-[#636E72] pt-1 font-light">
                <span className="flex items-center gap-1.5 font-medium text-[#2D3436]">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A54]" />
                  Sem filas de autorização
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#2D3436]">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A54]" />
                  Nota fiscal emitida no mesmo dia
                </span>
                <span className="flex items-center gap-1.5 font-medium text-[#2D3436]">
                  <CheckCircle2 className="w-4 h-4 text-[#2D5A54]" />
                  Suporte da equipe para orientar no aplicativo do seu convênio
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-colors text-center"
              >
                <MessageSquare className="w-4 h-4 text-[#4ADE80]" />
                <span>Consultar Cobertura do Meu Plano</span>
              </a>
              <span className="text-[11px] text-[#636E72] text-center font-light">
                Tire suas dúvidas diretamente com a recepção.
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
