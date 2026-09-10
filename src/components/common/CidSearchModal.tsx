import React, { useState } from 'react';
import { Search, X, Copy, Check, BookOpen, ExternalLink } from 'lucide-react';
import { CID_DATABASE, CidItem, searchCid } from '../../data/cidDatabase';

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
                  Classificação Internacional de Doenças (CID-10 & CID-11)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#8F7030]">
                  OMS / DATASUS
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Consulta instantânea de códigos e diagnósticos homologados
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
              placeholder="Digite o código ou nome da doença (ex: I10, BA00, diabetes, cerume, febre, ansiedade)..."
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
            results.map((item) => (
              <div
                key={item.id}
                className="py-3 px-3 rounded-xl hover:bg-stone-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono font-bold text-[11px]">
                      CID-10: {item.cid10}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono font-bold text-[11px]">
                      CID-11: {item.cid11}
                    </span>
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
                    onClick={() => handleCopy(`CID-10: ${item.cid10} | CID-11: ${item.cid11} - ${item.nome}`, item.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-[#1A3C34] text-stone-700 hover:text-[#1A3C34] text-[10px] font-semibold transition-colors"
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
            ))
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
