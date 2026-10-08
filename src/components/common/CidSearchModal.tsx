import React, { useState, useEffect } from 'react';
import { Search, X, Copy, Check, BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import { CID_DATABASE, CidItem, searchCid, loadFullCidDatabase, cleanCidCode } from '../../data/cidDatabase';

interface CidSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (cid: CidItem) => void;
}

export const CidSearchModal: React.FC<CidSearchModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFullCidDatabase().then(() => setIsLoaded(true)).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    'Todas',
    'Cardiovascular',
    'Respiratório',
    'Ouvido & Otorrino',
    'Saúde Mental',
    'Endocrinologia',
    'Digestivo',
    'Musculoesquelético',
    'Infeccioso & Arboviroses',
    'Geniturinário',
    'Neurologia',
    'Pele & Alergias',
    'Atestados & Preventivo'
  ];

  let results = searchCid(query, 50);
  if (selectedCategory !== 'Todas') {
    results = results.filter(item =>
      item.categoria.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* CABEÇALHO DO MODAL */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1A3C34] text-white flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Classificação Internacional de Doenças (CID-10)
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Consulta de códigos, doenças relacionadas e grupos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* CAMPO DE BUSCA */}
        <div className="p-4 border-b border-stone-100 bg-white space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o código (ex: k041, j00) ou patologia (ex: gripe, cerume, ansiedade)..."
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:border-[#1A3C34]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 p-1 text-stone-400 hover:text-stone-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* CHIPS DE CATEGORIAS */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1A3C34] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LISTAGEM DE RESULTADOS */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-stone-100 space-y-1">
          {results.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-xs">
              Nenhum diagnóstico encontrado para o termo pesquisado.
            </div>
          ) : (
            results.map((item) => {
              const isExactCode = cleanCidCode(item.cid10) === cleanCidCode(query);
              return (
              <div
                key={item.id}
                className={`py-3 px-3 rounded-xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isExactCode ? 'bg-emerald-50/80 border border-emerald-300/80' : 'hover:bg-stone-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                      isExactCode ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.cid10}
                    </span>
                    {item.grupo && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium text-[10px]">
                        {item.grupo}
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400 font-medium">
                      • {item.categoria}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-stone-900">
                    {item.nome}
                  </h4>

                  {item.sinonimos && (
                    <p className="text-[11px] text-stone-500">
                      Termos clínicos comuns: {item.sinonimos.join(', ')}
                    </p>
                  )}

                  {item.descricaoDetalhada && (
                    <p className="text-[10px] text-stone-500 italic">
                      {item.descricaoDetalhada}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(`CID-10: ${item.cid10} - ${item.nome}`, item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-[#1A3C34] text-stone-700 hover:text-[#1A3C34] text-[10px] font-semibold transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span className="text-emerald-700">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copiar Código</span>
                      </>
                    )}
                  </button>

                  {onSelect && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1A3C34] text-white text-[10px] font-semibold hover:bg-[#142E28] transition-colors"
                    >
                      Selecionar
                    </button>
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>

        {/* RODAPÉ */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 px-5">
          <span>
            {results.length} diagnósticos disponíveis para prescrições, atestados e prontuário
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
