import React from 'react';
import { HeartPulse, Baby, Activity, Sparkles, UserPlus, Home, Video, CheckCircle, ArrowRight } from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const services = [
    {
      id: 'prevencao',
      icon: HeartPulse,
      title: 'Medicina da Família & Check-up',
      subtitle: 'Prevenção Primária e Rastreamento',
      description: 'Avaliação clínica completa, estratificação de risco cardiovascular, solicitação criteriosa de exames e plano individual de promoção à saúde.',
      highlights: ['Exame físico detalhado', 'Rastreio de hipertensão e diabetes', 'Atualização vacinal'],
      recommendedFor: 'Adultos, jovens e famílias que desejam prevenir doenças.'
    },
    {
      id: 'puericultura',
      icon: Baby,
      title: 'Puericultura & Saúde da Criança',
      subtitle: 'Desenvolvimento e Crescimento',
      description: 'Acompanhamento carinhoso dos marcos motores, ganho de peso e estatura, suporte à amamentação, introdução alimentar e prevenção de acidentes.',
      highlights: ['Curvas de crescimento OMS', 'Orientação aos pais com acolhimento', 'Acompanhamento do neurodesenvolvimento'],
      recommendedFor: 'Bebês desde os primeiros dias até a adolescência.'
    },
    {
      id: 'cronicos',
      icon: Activity,
      title: 'Hipertensão, Diabetes & Crônicos',
      subtitle: 'Controle Metabólico Estável',
      description: 'Manejo contínuo e acolhedor de doenças crônicas para evitar complicações renais, oculares e cardíacas, com metas realistas e remédios adequados.',
      highlights: ['Ajuste medicamentoso individualizado', 'Menos efeitos colaterais', 'Prevenção de crises agudas'],
      recommendedFor: 'Pacientes com pressão alta, diabetes, colesterol e tireoide.'
    },
    {
      id: 'mulher',
      icon: Sparkles,
      title: 'Saúde Integral da Mulher',
      subtitle: 'Cuidado em Todas as Fases',
      description: 'Rastreamento ginecológico preventivo, orientação contraceptiva, climatério e menopausa, além de acolhimento em saúde emocional.',
      highlights: ['Preventivo (Papanicolau)', 'Mamografia e rastreio de mama', 'Transição menopáusica'],
      recommendedFor: 'Mulheres jovens, adultas e na maturidade.'
    },
    {
      id: 'idoso',
      icon: UserPlus,
      title: 'Saúde do Idoso & Longevidade',
      subtitle: 'Autonomia e Envelhecimento Ativo',
      description: 'Avaliação geriátrica ampla, revisão de múltiplos medicamentos (desprescrição), prevenção de quedas e suporte aos familiares e cuidadores.',
      highlights: ['Desprescrição de excesso de remédios', 'Prevenção de perdas cognitivas', 'Preservação da autonomia'],
      recommendedFor: 'Pessoas com 60 anos ou mais e seus familiares.'
    },
    {
      id: 'domiciliar-tele',
      icon: Home,
      title: 'Atendimento Domiciliar & Telemedicina',
      subtitle: 'Cuidado Onde Você Estiver',
      description: 'Consultas no conforto do lar para acamados ou idosos com dificuldade de locomoção, além de telemedicina segura com receitas digitais ICP-Brasil.',
      highlights: ['Visitas domiciliares agendadas', 'Telemedicina segura e ágil', 'Receitas e atestados digitais válidos'],
      recommendedFor: 'Pacientes acamados, idosos ou que buscam praticidade online.'
    }
  ];

  return (
    <section id="servicos" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            Serviços Médicos Oferecidos
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Atenção integral pensada para cada momento da sua vida
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Como médica de família, meu foco é resolver suas demandas com precisão técnica e profunda empatia, sem encaminhamentos desnecessários.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-[#E5E1DA] hover:border-[#2D5A54] transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-4">
                  {/* Icon & Subtitle */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-lg bg-[#DCE7E5]/40 text-[#2D5A54] border border-[#DCE7E5] flex items-center justify-center group-hover:bg-[#2D5A54] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5]/40 px-2.5 py-1 rounded-full border border-[#DCE7E5]">
                      {service.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-serif italic font-bold text-[#1A3A36] group-hover:text-[#2D5A54] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#4A5568] mt-2 leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-3 border-t border-[#E5E1DA]">
                    {service.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#2D3436]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2D5A54] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer CTA button */}
                <div className="pt-5 mt-5 border-t border-[#E5E1DA]">
                  <button
                    onClick={() => onSelectServiceForBooking(service.title)}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[#2D5A54] bg-[#FAF8F5] border border-[#E5E1DA] hover:bg-[#2D5A54] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Agendar esta Consulta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
