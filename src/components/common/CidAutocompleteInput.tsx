import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check, BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import {
  CID_DATABASE,
  CidItem,
  searchCid,
  loadFullCidDatabase,
  cleanCidCode,
  formatCidCanonical,
  isCidCodeFormat,
  findCidByCode,
  resolveCidString
} from '../../data/cidDatabase';

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
  placeholder = 'Digite o código (ex: k041, j00) ou patologia (ex: gripe, cerume)...',
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

  // Carrega a base completa do DATASUS no componente ao carregar
  useEffect(() => {
    loadFullCidDatabase().then(() => {
      let filtered = searchCid(value || '', 25);
      if (selectedCategory !== 'Todas') {
        filtered = filtered.filter(f => f.categoria.toLowerCase().includes(selectedCategory.toLowerCase()));
      }
      setResults(filtered);
    }).catch(() => {});
  }, []);

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

  // Detecta se o valor digitado corresponde diretamente a um código CID (ex: 'k041' -> K04.1)
  const isRawCodeTyped = Boolean(value && isCidCodeFormat(value) && !value.includes(' - '));
  const detectedCid = isRawCodeTyped ? findCidByCode(value) : undefined;
  const canonicalCode = isRawCodeTyped ? formatCidCanonical(value) : '';

  const handleSelect = (item: CidItem) => {
    let formatted = '';
    if (formatStyle === 'codeOnly') {
      formatted = item.cid10;
    } else {
      formatted = `${item.cid10} - ${item.nome}`;
    }

    onChange(formatted);
    if (onSelectCid) onSelectCid(item);
    setIsOpen(false);
  };

  const handleBlur = () => {
    // Se o médico digitou um código sem ponto (ex: 'k041') e saiu do campo
    if (isRawCodeTyped) {
      if (detectedCid) {
        handleSelect(detectedCid);
      } else {
        const canonical = formatCidCanonical(value);
        if (canonical && canonical !== value) {
          onChange(canonical);
        }
      }
    }
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
      } else if (detectedCid) {
        handleSelect(detectedCid);
      } else if (isRawCodeTyped) {
        onChange(formatCidCanonical(value));
        setIsOpen(false);
      }
    } else if (e.key === 'Tab') {
      // Se tiver correspondência exata de código, seleciona automaticamente ao tabular
      if (detectedCid) {
        handleSelect(detectedCid);
      } else if (results.length > 0 && highlightedIndex >= 0) {
        const topItem = results[highlightedIndex];
        if (cleanCidCode(topItem.cid10) === cleanCidCode(value)) {
          handleSelect(topItem);
        }
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
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34] shadow-xs transition-all font-medium"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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
          <div className="p-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1 shrink-0">
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
          </div>

          {/* LISTA DE RESULTADOS */}
          <div className="overflow-y-auto p-1.5 divide-y divide-stone-100 flex-1">
            {results.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs">
                <Search size={24} className="mx-auto text-stone-300 mb-2" />
                Nenhum código ou diagnóstico encontrado para &ldquo;{value}&rdquo;.
                <div className="text-[11px] text-stone-400 mt-1">
                  Você pode digitar o código sem ponto (ex: <strong>k041</strong> para K04.1) ou o nome da patologia.
                </div>
              </div>
            ) : (
              results.map((item, index) => {
                const isHighlighted = index === highlightedIndex;
                const isExactCode = cleanCidCode(item.cid10) === cleanCidCode(value);

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(item)}
                    className={`p-3 rounded-xl cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                      isExactCode
                        ? 'bg-emerald-50/70 border border-emerald-300/80 text-stone-900'
                        : isHighlighted
                        ? 'bg-[#1A3C34]/5 text-stone-900 border border-[#1A3C34]/20'
                        : 'hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* BADGE CID-10 */}
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] tracking-wide ${
                          isExactCode
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {item.cid10}
                        </span>

                        {/* GRUPO RELACIONADO */}
                        {item.grupo && (
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium text-[10px]">
                            {item.grupo}
                          </span>
                        )}

                        {/* CATEGORIA / CAPÍTULO */}
                        <span className="text-[10px] text-stone-400 font-medium">
                          • {item.categoria}
                        </span>
                      </div>

                      {/* NOME DA PATOLOGIA / DOENÇA RELACIONADA */}
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
                      className={`shrink-0 px-2.5 py-1.5 rounded-lg transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                        isExactCode
                          ? 'bg-emerald-800 text-white shadow-xs hover:bg-emerald-900'
                          : 'bg-stone-100 hover:bg-[#1A3C34] hover:text-white text-stone-600'
                      }`}
                    >
                      <span>Inserir</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* RODAPÉ DO DROPDOWN */}
          <div className="p-2 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-500 flex items-center justify-between shrink-0 px-3">
            <span className="flex items-center gap-1">
              <Sparkles size={11} className="text-[#1A3C34]" />
              Digite sem ponto: <strong>k041</strong> compreende <strong>K04.1</strong> automaticamente
            </span>
            <span className="text-stone-400 hidden sm:inline">
              Use as setas ↑ ↓ e [Enter] para selecionar
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
