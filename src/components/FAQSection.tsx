import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MessageSquare, 
  Search, Calendar, Stethoscope, ShieldCheck, Sparkles, Check 
} from 'lucide-react';
import { FAQ_ITEMS, DOCTOR_PROFILE } from '../data/initialData';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = ['Todos', 'Agendamento', 'Tipos de Consulta', 'Convênios', 'Serviços Oferecidos', 'Diferencial Particular'];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const whatsappDoubtUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${encodeURIComponent('Olá Dra. Cibele e equipe! Gostaria de tirar uma dúvida sobre horários, convênios ou atendimentos.')}`;

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#FDFCFB] border-b border-[#E5E1DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE7E5]/50 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#2D5A54]" />
            <span>Perguntas Frequentes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Dúvidas Comuns • Dra. Cibele Cristina Cunha Brígido
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light max-w-2xl mx-auto">
            Informações claras sobre o agendamento, modalidades de consulta, convênios aceitos, serviços e os diferenciais do atendimento privado.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-[#636E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave (ex: convênio, horário, domiciliar, tempo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white border border-[#E5E1DA] text-[#2D3436] placeholder-[#636E72]/70 focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#636E72] hover:text-[#1A3A36]"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#2D5A54] text-white border-[#2D5A54] shadow-xs'
                    : 'bg-white text-[#636E72] border-[#E5E1DA] hover:border-[#2D5A54]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E1DA]">
              <p className="text-sm text-[#636E72]">Nenhuma pergunta encontrada com o termo "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                className="mt-3 text-xs font-bold text-[#2D5A54] hover:underline"
              >
                Ver todas as perguntas
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-[#2D5A54] shadow-xs' : 'border-[#E5E1DA] shadow-xs hover:border-[#2D5A54]/40'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-2 h-2 rounded-full bg-[#2D5A54] mt-2 shrink-0"></span>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5]/30 px-2 py-0.5 rounded-md border border-[#DCE7E5]/60 inline-block mb-1">
                          {item.category}
                        </span>
                        <h3 className="font-serif italic font-bold text-[#1A3A36] text-sm sm:text-base leading-snug">
                          {item.question}
                        </h3>
                      </div>
                    </div>
                    <div className={`p-1.5 rounded-lg border shrink-0 transition-colors ${
                      isOpen ? 'bg-[#2D5A54] text-white border-[#2D5A54]' : 'bg-[#FAF8F5] text-[#636E72] border-[#E5E1DA]'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-3 text-sm leading-relaxed border-t border-[#E5E1DA] bg-[#FAF8F5]">
                      <div className="pl-4 border-l-2 border-[#2D5A54] py-1 text-[#2D3436]">
                        <p className="font-sans text-[14px] sm:text-[15px] leading-relaxed text-[#2D3436]">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support CTA */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E1DA] text-center space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#DCE7E5] text-[#2D5A54] flex items-center justify-center mx-auto">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-serif italic font-bold text-[#1A3A36]">
              Ainda tem alguma dúvida específica?
            </h4>
            <p className="text-xs sm:text-sm text-[#636E72] max-w-lg mx-auto font-light leading-relaxed">
              Nossa equipe da recepção está pronta para orientar você sobre horários, modalidades e preparo para a sua consulta pelo WhatsApp.
            </p>
          </div>
          <a
            href={whatsappDoubtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#4ADE80]" />
            <span>Falar com a Recepção no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
