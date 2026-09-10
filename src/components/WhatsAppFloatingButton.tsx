import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/initialData';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${DOCTOR_PROFILE.whatsapp}?text=${encodeURIComponent('Olá Dra. Cibele Cristina! Gostaria de agendar uma consulta.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="bg-[#FDFCFB] px-3.5 py-2.5 rounded-xl shadow-lg border border-[#E5E1DA] text-xs text-[#2D3436] flex items-center gap-2 max-w-xs animate-bounce">
          <span className="font-light">Olá! Precisa agendar ou tirar dúvidas? <strong className="text-[#1A3A36] font-semibold">Fale com a recepção!</strong></span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-[#636E72] hover:text-[#1A3A36] p-0.5 cursor-pointer"
            aria-label="Fechar dica"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#2D5A54] hover:bg-[#1A3A36] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group border border-[#4ADE80]/30"
        aria-label="Agendamento rápido no WhatsApp"
        title="Agendar pelo WhatsApp"
      >
        <MessageSquare className="w-6 h-6 text-[#4ADE80] group-hover:rotate-6 transition-transform" />
      </a>
    </div>
  );
};
