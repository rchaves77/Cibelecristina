import React, { useState, useRef, useEffect } from 'react';
import { Pill, Sparkles, ChevronDown, ShieldAlert, Check } from 'lucide-react';
import { MedicamentoPrescricao } from '../../data/medicamentosBrasil';
import { clinicalDb } from '../../services/clinicalDatabase';

interface MedicamentoAutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectMedicamento: (med: MedicamentoPrescricao) => void;
  placeholder?: string;
  required?: boolean;
}

export const MedicamentoAutocompleteInput: React.FC<MedicamentoAutocompleteInputProps> = ({
  value,
  onChange,
  onSelectMedicamento,
  placeholder = 'Buscar por medicamento ou categoria (ex: Losartana, Antibióticos, Hipertensão, Dipirona)...',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MedicamentoPrescricao[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Regra 1: No campo de busca de medicamentos, filtre pelo label ou categoria conforme o médico digita
  useEffect(() => {
    const results = clinicalDb.getMedicamentos(value);
    setSuggestions(results.slice(0, 15));
    setSelectedIndex(-1);
  }, [value]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Regra 2: Quando o médico CLICAR em qualquer item da lista, preencha automaticamente os campos
  const handleSelect = (med: MedicamentoPrescricao) => {
    onChange(med.medicamento);
    onSelectMedicamento(med);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <Pill size={15} className="absolute left-3 text-stone-400 pointer-events-none" />
        {/* Regra 3: Permita também que o médico edite qualquer texto preenchido ou digite um medicamento novo manualmente */}
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-medium placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] focus:bg-white transition-all shadow-2xs"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          title="Ver medicamentos disponíveis"
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-80 overflow-y-auto bg-white rounded-2xl border border-stone-200 shadow-xl divide-y divide-stone-100 animate-in fade-in slide-in-from-top-1">
          <div className="p-2.5 bg-stone-50/95 sticky top-0 z-10 text-[10px] font-bold text-stone-600 uppercase tracking-wider flex items-center justify-between border-b border-stone-100">
            <span className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[#C5A059]" />
              Base RENAME & Medicina de Família (215 Medicamentos)
            </span>
            <span className="text-[10px] font-mono text-stone-400">{suggestions.length} resultados</span>
          </div>

          {suggestions.map((med, idx) => {
            const isSelected = idx === selectedIndex;
            const isControl = med.controlado;

            return (
              <button
                key={med.id}
                type="button"
                onClick={() => handleSelect(med)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left p-3 flex flex-col gap-1 transition-colors cursor-pointer ${
                  isSelected ? 'bg-emerald-50/80' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-stone-900">
                      {med.label}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-600 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
                      {med.categoria}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isControl
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isControl ? '💊 Controle Especial (2 Vias)' : 'Receita Simples'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 flex-wrap">
                  <span className="text-[#1A3C34] font-semibold">{med.via}</span>
                  <span>•</span>
                  <span>Qtd: {med.quantidade}</span>
                  <span>•</span>
                  <span className="text-stone-400">Duração: {med.duracao}</span>
                </div>

                <div className="text-[10px] text-stone-600 italic bg-stone-50/80 p-1.5 rounded-lg border border-stone-200/50 mt-0.5">
                  <span className="font-semibold text-stone-700">Posologia: </span>
                  {med.posologia}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
