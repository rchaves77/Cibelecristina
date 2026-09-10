import React, { useState } from 'react';
import { 
  Star, MessageSquareQuote, CheckCircle, PlusCircle, X, 
  ThumbsUp, Calendar, Heart, Sparkles, User 
} from 'lucide-react';
import { Testimonial } from '../types';
import { apiService } from '../services/api';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onTestimonialAdded: (t: Testimonial) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, onTestimonialAdded }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    date: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
    roleOrRelation: '',
    treatmentType: '',
    comment: '',
    rating: 5
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.name.trim() || !newFeedback.comment.trim()) return;

    const formattedDate = newFeedback.date || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const created = apiService.addTestimonial({
      name: newFeedback.name.trim(),
      date: formattedDate,
      roleOrRelation: newFeedback.roleOrRelation.trim() || 'Paciente Atendido',
      treatmentType: newFeedback.treatmentType.trim() || 'Consulta Médica de Família',
      comment: newFeedback.comment.trim(),
      rating: newFeedback.rating
    });

    onTestimonialAdded(created);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setNewFeedback({
        name: '',
        date: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        roleOrRelation: '',
        treatmentType: '',
        comment: '',
        rating: 5
      });
    }, 1800);
  };

  return (
    <section id="depoimentos" className="py-16 lg:py-24 bg-[#FDFCFB] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCE7E5]/50 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            <Heart className="w-3.5 h-3.5 text-[#2D5A54]" />
            <span>Vínculo Terapêutico & Confiança</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Depoimentos de Pacientes da Dra. Cibele Cristina Cunha Brígido
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Experiências reais de quem encontrou na Dra. Cibele uma médica atenta, dedicada e focada na saúde integral de toda a família.
          </p>

          {/* Social Proof Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-[#2D3436]">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1 rounded-full border border-[#E5E1DA] shadow-xs">
              <span className="flex text-[#2D5A54]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#2D5A54]" />
                ))}
              </span>
              <strong className="font-semibold text-[#1A3A36]">5.0 de Avaliação Média</strong>
            </span>
            <span className="bg-white px-3.5 py-1 rounded-full border border-[#E5E1DA] shadow-xs text-[#636E72]">
              Tempo médio de consulta: <strong className="text-[#2D5A54]">45 a 60 minutos</strong>
            </span>
            <span className="bg-white px-3.5 py-1 rounded-full border border-[#E5E1DA] shadow-xs text-[#636E72]">
              <strong className="text-[#1A3A36]">100% de escuta atenta</strong> sem pressa
            </span>
          </div>
        </div>

        {/* Testimonials Grid with High Contrast & Clear Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((test) => (
            <article
              key={test.id}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E5E1DA] shadow-xs hover:border-[#2D5A54]/50 transition-all flex flex-col justify-between space-y-5 group"
            >
              {/* Card Header: Rating, Treatment Badge & Date */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-[#E5E1DA] pb-3">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[#2D5A54]" title={`${test.rating} estrelas`}>
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#2D5A54]" />
                    ))}
                  </div>

                  {/* Campo: Data do Depoimento */}
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#636E72] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E5E1DA]">
                    <Calendar className="w-3 h-3 text-[#2D5A54]" />
                    <time dateTime={test.date}>{test.date}</time>
                  </div>
                </div>

                {/* Treatment Type Tag if available */}
                {test.treatmentType && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5]/40 px-2.5 py-0.5 rounded-md border border-[#DCE7E5]/60">
                    {test.treatmentType}
                  </span>
                )}

                {/* Campo: Texto do Depoimento */}
                <div className="relative pt-1">
                  <MessageSquareQuote className="w-6 h-6 text-[#DCE7E5] absolute -top-1 -left-1 -z-0 opacity-60" />
                  <p className="text-[14px] sm:text-[15px] text-[#2D3436] leading-relaxed italic font-serif relative z-10 pl-2">
                    "{test.comment}"
                  </p>
                </div>
              </div>

              {/* Card Footer: Campo Nome do Paciente & Identificação */}
              <div className="pt-4 border-t border-[#E5E1DA] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCE7E5]/60 text-[#2D5A54] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    {/* Campo: Nome do Paciente */}
                    <h4 className="text-xs sm:text-sm font-serif italic font-bold text-[#1A3A36] leading-snug">
                      {test.name}
                    </h4>
                    {test.roleOrRelation && (
                      <p className="text-[11px] text-[#636E72] font-light mt-0.5">
                        {test.roleOrRelation}
                      </p>
                    )}
                  </div>
                </div>

                <span 
                  className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#2D5A54] bg-[#DCE7E5]/30 px-2 py-0.5 rounded-full border border-[#DCE7E5]/50 shrink-0"
                  title="Paciente atendido na clínica da Dra. Cibele"
                >
                  <CheckCircle className="w-3 h-3 text-[#2D5A54]" />
                  <span>Verificado</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA to leave a testimonial */}
        <div className="text-center pt-2">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#2D5A54] hover:bg-[#FAF8F5] text-[#2D5A54] text-xs font-bold uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#2D5A54]" />
            <span>Já é paciente da Dra. Cibele? Compartilhe seu depoimento</span>
          </button>
        </div>

      </div>

      {/* Leave Testimonial Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A3A36]/50 backdrop-blur-xs p-4">
          <div className="bg-[#FDFCFB] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E5E1DA] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#E5E1DA] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-[#2D5A54]" />
                <h3 className="text-base font-serif italic font-bold text-[#1A3A36]">Enviar Depoimento de Paciente</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#636E72] hover:text-[#1A3A36] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-2">
                <ThumbsUp className="w-12 h-12 text-[#2D5A54] mx-auto animate-bounce" />
                <h4 className="text-lg font-serif italic font-bold text-[#1A3A36]">Depoimento Publicado com Sucesso!</h4>
                <p className="text-xs text-[#4A5568] font-light">
                  Agradecemos imensamente por compartilhar como foi a sua consulta com a Dra. Cibele Cristina.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* Campo 1: Nome do Paciente */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                    Nome do Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Carolina Silva"
                    value={newFeedback.name}
                    onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                  />
                </div>

                {/* Campo 2: Data do Depoimento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                      Data do Depoimento *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Setembro de 2026"
                      value={newFeedback.date}
                      onChange={(e) => setNewFeedback({ ...newFeedback, date: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                      Tipo de Atendimento
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Check-up Preventivo, Puericultura..."
                      value={newFeedback.treatmentType}
                      onChange={(e) => setNewFeedback({ ...newFeedback, treatmentType: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                      Identificação / Tempo de Paciente
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Paciente há 1 ano"
                      value={newFeedback.roleOrRelation}
                      onChange={(e) => setNewFeedback({ ...newFeedback, roleOrRelation: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                      Avaliação (Estrelas)
                    </label>
                    <select
                      value={newFeedback.rating}
                      onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                    >
                      <option value="5">5 estrelas (Excelente)</option>
                      <option value="4">4 estrelas (Muito bom)</option>
                      <option value="3">3 estrelas (Bom)</option>
                    </select>
                  </div>
                </div>

                {/* Campo 3: Texto do Depoimento */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A3A36] mb-1">
                    Texto do Depoimento *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Conte como foi sua experiência com a Dra. Cibele, o tempo dedicado à consulta, o acolhimento, a clareza nas orientações e o cuidado com a sua saúde..."
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] focus:ring-1 focus:ring-[#2D5A54] focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#E5E1DA]">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#636E72] hover:bg-[#FAF8F5] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#2D5A54] hover:bg-[#1A3A36] shadow-xs cursor-pointer"
                  >
                    Publicar Depoimento
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
