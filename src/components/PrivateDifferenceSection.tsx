import React from 'react';
import { 
  Clock, ShieldCheck, HeartHandshake, UserCheck, 
  Sparkles, CheckCircle2, XCircle, ArrowRight, Stethoscope 
} from 'lucide-react';

interface PrivateDifferenceSectionProps {
  onOpenBooking: () => void;
}

export const PrivateDifferenceSection: React.FC<PrivateDifferenceSectionProps> = ({ onOpenBooking }) => {
  const comparisonPoints = [
    {
      title: 'Tempo de Consulta & Escuta',
      privateDesc: '45 a 60 minutos de escuta atenta e sem pressa. Tempo para examinar, tirar dúvidas e compreender a sua rotina por completo.',
      publicDesc: 'Consultas corridas de 5 a 10 minutos, focadas apenas na queixa pontual do momento.',
      icon: Clock,
      highlight: 'Dedicação Exclusiva'
    },
    {
      title: 'Pontualidade & Conforto',
      privateDesc: 'Atendimento com horário rigorosamente marcado. Espaço calmo, climatizado, aconchegante e sem salas de espera lotadas.',
      publicDesc: 'Filas de espera imprevisíveis de várias horas e necessidade de chegar de madrugada.',
      icon: Sparkles,
      highlight: 'Respeito ao seu Tempo'
    },
    {
      title: 'Vínculo Médico & Continuidade',
      privateDesc: 'A mesma médica que conhece todo o seu histórico e da sua família. Canal de suporte para orientações e dúvidas entre as consultas.',
      publicDesc: 'A cada visita um plantonista diferente, reiniciando o histórico do zero a cada consulta.',
      icon: UserCheck,
      highlight: 'Acompanhamento Contínuo'
    },
    {
      title: 'Prevenção Integral vs. Apagar Incêndios',
      privateDesc: 'Rastreamento metabólico e check-up preventivo individualizado para evitar doenças crônicas e promover longevidade com qualidade.',
      publicDesc: 'Atendimento restrito à prescrição de alívio rápido de sintomas no momento da crise aguda.',
      icon: Stethoscope,
      highlight: 'Saúde para o Futuro'
    },
    {
      title: 'Acolhimento da Família Inteira',
      privateDesc: 'Possibilidade de agendamento sequencial para crianças (puericultura), adultos e idosos no mesmo dia, integrando o cuidado do lar.',
      publicDesc: 'Encaminhamentos dispersos em serviços distintos, com grande sobrecarga para os familiares.',
      icon: HeartHandshake,
      highlight: 'Cuidado Multigeracional'
    },
    {
      title: 'Convênios & Reembolso Ágil',
      privateDesc: 'Atendimento direto por operadoras credenciadas e emissão de laudo médico completo com CID e CRM para reembolso no seu plano de saúde.',
      publicDesc: 'Incerteza na disponibilidade de guias, exames e medicamentos necessários.',
      icon: ShieldCheck,
      highlight: 'Transparência & Facilidade'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE7E5]/50 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#2D5A54]" />
            <span>Por Que Escolher o Atendimento Particular?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            O Diferencial da Consulta com a Dra. Cibele
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Entenda como um atendimento médico estruturado com tempo, profundidade e atenção integral transforma o cuidado com a sua saúde.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {comparisonPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[#E5E1DA] bg-[#FAF8F5] p-6 shadow-xs hover:border-[#2D5A54]/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#DCE7E5] text-[#2D5A54] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E1DA]">
                      {point.highlight}
                    </span>
                  </div>

                  <h3 className="text-base font-serif italic font-bold text-[#1A3A36]">
                    {point.title}
                  </h3>

                  {/* Private Consult Benefit */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#DCE7E5] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2D5A54]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A54] shrink-0" />
                      <span>No Consultório da Dra. Cibele</span>
                    </div>
                    <p className="text-xs text-[#2D3436] leading-relaxed">
                      {point.privateDesc}
                    </p>
                  </div>

                  {/* Public System Contrast */}
                  <div className="p-3 rounded-xl bg-white/60 border border-[#E5E1DA] space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#636E72]">
                      <XCircle className="w-3 h-3 text-[#E07A5F] shrink-0" />
                      <span>Na correria do atendimento comum</span>
                    </div>
                    <p className="text-[11px] text-[#636E72] leading-relaxed">
                      {point.publicDesc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Banner CTA */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1A3A36] to-[#2D5A54] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-serif italic font-bold">
              Sua saúde merece atenção minuciosa, sem pressa e com acolhimento.
            </h4>
            <p className="text-xs sm:text-sm text-[#DCE7E5] font-light max-w-2xl">
              Agende sua consulta particular ou pelo convênio e sinta a diferença de um acompanhamento médico verdadeiramente humanizado.
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1A3A36] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-widest shadow-xs transition-colors cursor-pointer"
          >
            <span>Agendar Minha Consulta</span>
            <ArrowRight className="w-4 h-4 text-[#2D5A54]" />
          </button>
        </div>

      </div>
    </section>
  );
};
