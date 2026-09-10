import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import { CID_DATABASE, CidItem, searchCid } from '../../data/cidDatabase';

interface CidAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectCid?: (cid: CidItem) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  formatStyle?: 'full' | 'codeOnly' | 'cid10Only' | 'cid11Only';
  className?: string;
}

export const CidAutocompleteInput: React.FC<CidAutocompleteInputProps> = ({
  value,
  onChange,
  onSelectCid,
  placeholder = 'Buscar por código ou diagnóstico (ex: I10, BA00, cerume, gripe, ansiedade)...',
  label,
  helperText,
  required = false,
  formatStyle = 'full',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CidItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Todas',
    'Cardiovascular',
    'Respiratório',
    'Ouvido & Otorrino',
    'Saúde Mental',
    'Endocrinologia',
    'Musculoesquelético',
    'Atestados & Preventivo'
  ];

  // Dispara busca sempre que o valor mudar
  useEffect(() => {
    let filtered = searchCid(value || '', 25);
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(f => f.categoria.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    setResults(filtered);
    setHighlightedIndex(0);
  }, [value, selectedCategory]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: CidItem) => {
    let formatted = '';
    if (formatStyle === 'full') {
      formatted = `CID-10: ${item.cid10} | CID-11: ${item.cid11} — ${item.nome}`;
    } else if (formatStyle === 'codeOnly') {
      formatted = `${item.cid10} / ${item.cid11}`;
    } else if (formatStyle === 'cid10Only') {
      formatted = `${item.cid10} - ${item.nome}`;
    } else if (formatStyle === 'cid11Only') {
      formatted = `${item.cid11} - ${item.nome}`;
    }

    onChange(formatted);
    if (onSelectCid) onSelectCid(item);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightedIndex]) {
        handleSelect(results[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.focus();
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
            <BookOpen size={13} className="text-[#1A3C34]" />
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            CID-10 & CID-11 Oficiais
          </span>
        </div>
      )}

      {/* CAMPO DE ENTRADA */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-3 text-stone-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] shadow-xs transition-all"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Limpar campo"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-stone-500 mt-1">{helperText}</p>
      )}

      {/* DROPDOWN FLUTUANTE DE SUGESTÕES E RESULTADOS */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-96 flex flex-col">
          {/* BARRA DE FILTROS POR ESPECIALIDADE/CATEGORIA */}
          <div className="p-2.5 bg-stone-50 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Filtro:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1A3C34] text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTA DE RESULTADOS */}
          <div className="overflow-y-auto p-1.5 divide-y divide-stone-100 flex-1">
            {results.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs">
                <Search size={24} className="mx-auto text-stone-300 mb-2" />
                Nenhum código ou diagnóstico encontrado para &ldquo;{value}&rdquo;.
                <div className="text-[11px] text-stone-400 mt-1">
                  Tente digitar o nome da doença (ex: hipertensão, cefaleia, otite, ansiedade).
                </div>
              </div>
            ) : (
              results.map((item, index) => {
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isHighlighted
                        ? 'bg-[#1A3C34]/5 text-stone-900 border border-[#1A3C34]/20'
                        : 'hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* BADGE CID-10 */}
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px] tracking-wide">
                          CID-10: {item.cid10}
                        </span>

                        {/* BADGE CID-11 */}
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-[10px] tracking-wide">
                          CID-11: {item.cid11}
                        </span>

                        {/* CATEGORIA */}
                        <span className="text-[10px] text-stone-400 font-medium">
                          • {item.categoria}
                        </span>
                      </div>

                      {/* NOME DA PATOLOGIA */}
                      <p className="text-xs font-semibold text-stone-900 leading-snug">
                        {item.nome}
                      </p>

                      {/* SINÔNIMOS OU DESCRIÇÃO SUTIL */}
                      {item.sinonimos && item.sinonimos.length > 0 && (
                        <p className="text-[10px] text-stone-500 truncate">
                          Termos comuns: {item.sinonimos.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      className="shrink-0 p-1.5 rounded-lg bg-stone-100 hover:bg-[#1A3C34] hover:text-white text-stone-600 transition-colors text-[10px] font-bold"
                    >
                      Inserir
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* RODAPÉ DO DROPDOWN */}
          <div className="p-2 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between shrink-0 px-3">
            <span>
              Mostrando {results.length} diagnósticos catalogados (OMS/DATASUS)
            </span>
            <span className="text-stone-400">
              Use as setas ↑ ↓ e [Enter] para selecionar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
