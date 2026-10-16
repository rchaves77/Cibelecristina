import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileText,
  Copy,
  FolderPlus,
  Bookmark,
  Layers,
  ArrowRight,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export interface FraseEvolucao {
  id: string;
  titulo: string;
  conteudo: string;
  categoriaId: string;
  campoPreferencial?: 'subjetivo' | 'objetivo' | 'avaliacao' | 'plano' | 'geral';
}

export interface CategoriaEvolucao {
  id: string;
  nome: string;
  isDefault?: boolean;
}

const DEFAULT_CATEGORIAS: CategoriaEvolucao[] = [
  { id: 'subjetivo', nome: 'S – Subjetivo (Anamnese)', isDefault: true },
  { id: 'objetivo', nome: 'O – Objetivo (Exame Físico)', isDefault: true },
  { id: 'avaliacao', nome: 'A – Avaliação & Diagnósticos', isDefault: true },
  { id: 'plano', nome: 'P – Plano & Orientações', isDefault: true },
  { id: 'rotina', nome: 'Consultas de Rotina & Check-up', isDefault: true },
  { id: 'otologia', nome: 'Procedimentos & Otologia', isDefault: true }
];

const DEFAULT_FRASES: FraseEvolucao[] = [
  {
    id: 'f1',
    titulo: 'Exame Físico Geral Normal (Adulto)',
    categoriaId: 'objetivo',
    campoPreferencial: 'objetivo',
    conteudo:
      'Bom estado geral, acianótico, anictérico, afebril ao toque, corado, hidratado, eupneico em ar ambiente.\nPA: 120x80 mmHg, FC: 72 bpm, SpO2: 98%.\nAusculta cardíaca: RCR em 2T, sem sopros.\nAusculta pulmonar: MV presente bilateralmente, sem ruídos adventícios.\nAbdome: plano, flácido, indolor à palpação superficial e profunda, RHA presentes.'
  },
  {
    id: 'f2',
    titulo: 'Anamnese de Acompanhamento HAS & DM2',
    categoriaId: 'subjetivo',
    campoPreferencial: 'subjetivo',
    conteudo:
      'Paciente em acompanhamento de rotina para Hipertensão Arterial e Diabetes Mellitus Tipo 2. Nega precordialgia, tonturas, palpitações ou dispneia aos esforços. Relata boa adesão à medicação de uso contínuo e acompanhamento nutricional. Nega episódios de hipoglicemia.'
  },
  {
    id: 'f3',
    titulo: 'Otoscopia & Lavagem Otológica Bilateral',
    categoriaId: 'otologia',
    campoPreferencial: 'objetivo',
    conteudo:
      'Otoscopia OD/OE: Presença de cerúmen obstrutivo com tampão ceruminoso bilateral, sem sinais de infecção local. Procedimento de lavagem otológica realizado com soro fisiológico morno sem intercorrências. Otoscopia pós-procedimento: condutos auditivos externos livres e pérvios, membranas timpânicas íntegras, translúcidas e normotróficas.'
  },
  {
    id: 'f4',
    titulo: 'Quadro de Síndrome Gripal / IVAS Viral',
    categoriaId: 'subjetivo',
    campoPreferencial: 'subjetivo',
    conteudo:
      'Paciente relata quadro de coriza hialina, odinofagia leve, obstrução nasal e febre baixa aferida (máx 38.0ºC) há 2 dias. Nega falta de ar, dor torácica ou prostração intensa. Ausência de comorbidades descompensadas.'
  },
  {
    id: 'f5',
    titulo: 'Avaliação Clínica – IVAS / Gripal Benigna',
    categoriaId: 'avaliacao',
    campoPreferencial: 'avaliacao',
    conteudo:
      'Quadro clínico compatível com Infecção das Vias Aéreas Superiores (IVAS) / Síndrome Gripal de provável etiologia viral. Sem sinais clínicos de complicação respiratória baixa ou infecção bacteriana secundária no momento.'
  },
  {
    id: 'f6',
    titulo: 'Plano Terapêutico & Orientações IVAS',
    categoriaId: 'plano',
    campoPreferencial: 'plano',
    conteudo:
      '1. Repouso relativo e ingestão hídrica abundante (2.5L a 3L de líquidos/dia).\n2. Lavagem nasal com Soro Fisiológico 0.9% abundante (10-20ml por narina, 4 a 6x/dia).\n3. Analgésico/Antipirético conforme receita para alívio sintomático.\n4. Orientado detalhadamente sobre sinais de alarme (falta de ar, febre >38.5ºC por mais de 72h, dor torácica, cianose) para reavaliação médica imediata.'
  },
  {
    id: 'f7',
    titulo: 'Check-up Preventivo Adulto Assintomático',
    categoriaId: 'rotina',
    campoPreferencial: 'subjetivo',
    conteudo:
      'Consulta para avaliação preventiva de saúde / check-up geral. Paciente assintomático, sem queixas no momento. Nega tabagismo, nega etilismo significativo. Pratica atividade física moderada regularmente. Solicitados exames de rastreio de rotina.'
  }
];

const STORAGE_KEY_FRASES = 'medicinarte_frases_evolucao_v2';
const STORAGE_KEY_CATS = 'medicinarte_categorias_evolucao_v2';

interface FrasesEvolucaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFrase: (
    conteudo: string,
    targetField?: 'subjetivo' | 'objetivo' | 'avaliacao' | 'plano'
  ) => void;
  currentActiveField?: 'subjetivo' | 'objetivo' | 'avaliacao' | 'plano';
  currentFieldContent?: string;
}

export const FrasesEvolucaoModal: React.FC<FrasesEvolucaoModalProps> = ({
  isOpen,
  onClose,
  onSelectFrase,
  currentActiveField = 'subjetivo',
  currentFieldContent = ''
}) => {
  const [categorias, setCategorias] = useState<CategoriaEvolucao[]>([]);
  const [frases, setFrases] = useState<FraseEvolucao[]>([]);
  const [activeCat, setActiveCat] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTargetField, setSelectedTargetField] = useState<
    'subjetivo' | 'objetivo' | 'avaliacao' | 'plano'
  >(currentActiveField);

  // Form para Criar/Editar Frase
  const [showFormFrase, setShowFormFrase] = useState(false);
  const [editingFraseId, setEditingFraseId] = useState<string | null>(null);
  const [formTitulo, setFormTitulo] = useState('');
  const [formConteudo, setFormConteudo] = useState('');
  const [formCatId, setFormCatId] = useState('subjetivo');
  const [formCampoPref, setFormCampoPref] = useState<
    'subjetivo' | 'objetivo' | 'avaliacao' | 'plano' | 'geral'
  >('subjetivo');

  // Gerenciamento de Categorias/Títulos
  const [showGerenciarCats, setShowGerenciarCats] = useState(false);
  const [novaCatNome, setNovaCatNome] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatNome, setEditingCatNome] = useState('');

  // Feedback de cópia ou inserção
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Carrega e inicializa dados do localStorage
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(STORAGE_KEY_CATS);
      if (savedCats) {
        setCategorias(JSON.parse(savedCats));
      } else {
        setCategorias(DEFAULT_CATEGORIAS);
        localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(DEFAULT_CATEGORIAS));
      }

      const savedFrases = localStorage.getItem(STORAGE_KEY_FRASES);
      if (savedFrases) {
        setFrases(JSON.parse(savedFrases));
      } else {
        setFrases(DEFAULT_FRASES);
        localStorage.setItem(STORAGE_KEY_FRASES, JSON.stringify(DEFAULT_FRASES));
      }
    } catch (e) {
      console.error('Erro ao carregar modelos do localStorage:', e);
      setCategorias(DEFAULT_CATEGORIAS);
      setFrases(DEFAULT_FRASES);
    }
  }, []);

  // Atualiza o target field preferencial se a prop mudar
  useEffect(() => {
    if (currentActiveField) {
      setSelectedTargetField(currentActiveField);
    }
  }, [currentActiveField]);

  // Salvar no LocalStorage
  const saveCategoriasToStorage = (newCats: CategoriaEvolucao[]) => {
    setCategorias(newCats);
    try {
      localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(newCats));
    } catch (e) {
      console.error(e);
    }
  };

  const saveFrasesToStorage = (newFrases: FraseEvolucao[]) => {
    setFrases(newFrases);
    try {
      localStorage.setItem(STORAGE_KEY_FRASES, JSON.stringify(newFrases));
    } catch (e) {
      console.error(e);
    }
  };

  // Restaurar Padrões de Fábrica
  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'Deseja restaurar as frases e títulos padrão originais? Suas frases personalizadas serão combinadas ou preservadas.'
      )
    ) {
      saveCategoriasToStorage(DEFAULT_CATEGORIAS);
      saveFrasesToStorage(DEFAULT_FRASES);
    }
  };

  // Submeter Frase (Criar ou Editar)
  const handleSaveFrase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formConteudo.trim()) return;

    if (editingFraseId) {
      const updated = frases.map((f) =>
        f.id === editingFraseId
          ? {
              ...f,
              titulo: formTitulo.trim(),
              conteudo: formConteudo.trim(),
              categoriaId: formCatId,
              campoPreferencial: formCampoPref
            }
          : f
      );
      saveFrasesToStorage(updated);
    } else {
      const newFrase: FraseEvolucao = {
        id: 'f_' + Date.now(),
        titulo: formTitulo.trim(),
        conteudo: formConteudo.trim(),
        categoriaId: formCatId,
        campoPreferencial: formCampoPref
      };
      saveFrasesToStorage([newFrase, ...frases]);
    }

    setFormTitulo('');
    setFormConteudo('');
    setShowFormFrase(false);
    setEditingFraseId(null);
  };

  // Abrir Formulário para Editar Frase
  const handleStartEditFrase = (f: FraseEvolucao, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFraseId(f.id);
    setFormTitulo(f.titulo);
    setFormConteudo(f.conteudo);
    setFormCatId(f.categoriaId);
    setFormCampoPref(f.campoPreferencial || 'subjetivo');
    setShowFormFrase(true);
  };

  // Excluir Frase
  const handleDeleteFrase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza de que deseja excluir este modelo de frase?')) {
      const updated = frases.filter((f) => f.id !== id);
      saveFrasesToStorage(updated);
    }
  };

  // Salvar Texto Atual da Evolução como Modelo
  const handleSaveCurrentTextAsTemplate = () => {
    if (!currentFieldContent || !currentFieldContent.trim()) {
      alert('O campo atual está vazio. Escreva algo na evolução antes de salvar como modelo.');
      return;
    }
    setEditingFraseId(null);
    setFormTitulo(`Modelo Salvo - ${new Date().toLocaleDateString('pt-BR')}`);
    setFormConteudo(currentFieldContent.trim());
    setFormCatId(currentActiveField || 'subjetivo');
    setFormCampoPref(currentActiveField || 'subjetivo');
    setShowFormFrase(true);
  };

  // Adicionar Nova Categoria/Título
  const handleAddCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCatNome.trim()) return;

    const newCat: CategoriaEvolucao = {
      id: 'cat_' + Date.now(),
      nome: novaCatNome.trim()
    };
    saveCategoriasToStorage([...categorias, newCat]);
    setNovaCatNome('');
  };

  // Salvar Edição de Categoria
  const handleSaveEditCategoria = (id: string) => {
    if (!editingCatNome.trim()) return;
    const updated = categorias.map((c) =>
      c.id === id ? { ...c, nome: editingCatNome.trim() } : c
    );
    saveCategoriasToStorage(updated);
    setEditingCatId(null);
    setEditingCatNome('');
  };

  // Excluir Categoria Customizada
  const handleDeleteCategoria = (id: string) => {
    if (window.confirm('Excluir esta categoria/título? As frases contidas nela continuarão visíveis em "Todas".')) {
      const updated = categorias.filter((c) => c.id !== id);
      saveCategoriasToStorage(updated);
      if (activeCat === id) setActiveCat('todas');
    }
  };

  // Copiar Frase para Área de Transferência
  const handleCopyText = (conteudo: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(conteudo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Inserir Frase na Evolução
  const handleInsert = (f: FraseEvolucao) => {
    const target =
      selectedTargetField ||
      (f.campoPreferencial !== 'geral' ? f.campoPreferencial : undefined) ||
      'subjetivo';
    onSelectFrase(f.conteudo, target);
    onClose();
  };

  // Filtragem de Frases
  const filteredFrases = frases.filter((f) => {
    const matchesCat = activeCat === 'todas' || f.categoriaId === activeCat;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      f.titulo.toLowerCase().includes(q) ||
      f.conteudo.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-stone-200 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO DO MODAL */}
        <div className="px-6 py-4 bg-[#1A3C34] text-white flex items-center justify-between border-b border-[#2A5247]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C5A059] text-[#0E231E] flex items-center justify-center font-bold shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                  MODELOS & FRASES RÁPIDAS DE EVOLUÇÃO
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0D211C] text-[#C5A059] border border-[#C5A059]/40 font-mono font-semibold">
                  Ctrl + Espaço
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Selecione frases salvas ou crie novos modelos organizados por títulos
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* BARRAS DE AÇÃO RÁPIDA E SELEÇÃO DE CAMPO DESTINO */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Seletor de Campo Destino */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-700 shrink-0 flex items-center gap-1">
              <ArrowRight size={14} className="text-[#1A3C34]" />
              <span>Inserir no campo:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'subjetivo', label: 'S – Subjetivo' },
                  { id: 'objetivo', label: 'O – Objetivo' },
                  { id: 'avaliacao', label: 'A – Avaliação' },
                  { id: 'plano', label: 'P – Plano' }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedTargetField(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedTargetField === f.id
                      ? 'bg-[#1A3C34] text-white shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Botões para Criar Novo Modelo ou Salvar Texto Atual */}
          <div className="flex items-center gap-2">
            {currentFieldContent && currentFieldContent.trim().length > 0 && (
              <button
                type="button"
                onClick={handleSaveCurrentTextAsTemplate}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs text-xs"
                title="Salvar o texto que você acabou de escrever na evolução como um modelo novo"
              >
                <Bookmark size={14} className="text-amber-700" />
                <span>Salvar Texto da Tela</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setEditingFraseId(null);
                setFormTitulo('');
                setFormConteudo('');
                setShowFormFrase(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1A3C34] hover:bg-[#122b25] text-white font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs text-xs"
            >
              <Plus size={14} />
              <span>Novo Modelo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowGerenciarCats(!showGerenciarCats)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-all text-xs"
            >
              <Layers size={14} className="text-stone-500" />
              <span>Títulos & Categorias</span>
            </button>
          </div>
        </div>

        {/* MODAL/SEÇÃO: GERENCIAR TÍTULOS E CATEGORIAS */}
        {showGerenciarCats && (
          <div className="p-4 bg-emerald-50/80 border-b border-emerald-200 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <FolderPlus size={15} className="text-emerald-700" />
                <span>GERENCIAR TÍTULOS E CATEGORIAS DE EVOLUÇÃO</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowGerenciarCats(false)}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Criar nova categoria */}
            <form onSubmit={handleAddCategoria} className="flex gap-2">
              <input
                type="text"
                placeholder="Nome do novo título/categoria (ex: Cardiologia, Atestados Padrão, Pediatria)..."
                value={novaCatNome}
                onChange={(e) => setNovaCatNome(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Criar Título</span>
              </button>
            </form>

            {/* Lista de categorias editáveis */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pt-1">
              {categorias.map((c) => (
                <div
                  key={c.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-xs shadow-2xs"
                >
                  {editingCatId === c.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editingCatNome}
                        onChange={(e) => setEditingCatNome(e.target.value)}
                        className="px-1.5 py-0.5 border border-emerald-400 rounded-md text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditCategoria(c.id)}
                        className="p-1 text-emerald-700 hover:bg-emerald-100 rounded-md"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="p-1 text-stone-400 hover:bg-stone-100 rounded-md"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-stone-800">{c.nome}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCatId(c.id);
                          setEditingCatNome(c.nome);
                        }}
                        className="p-0.5 text-stone-400 hover:text-emerald-700 cursor-pointer"
                        title="Editar nome"
                      >
                        <Edit2 size={12} />
                      </button>
                      {!c.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCategoria(c.id)}
                          className="p-0.5 text-stone-400 hover:text-red-600 cursor-pointer"
                          title="Excluir categoria"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL/FORMULÁRIO: CRIAR OU EDITAR FRASE */}
        {showFormFrase && (
          <form
            onSubmit={handleSaveFrase}
            className="p-4 bg-stone-100 border-b border-stone-200 space-y-3 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <FileText size={15} className="text-[#1A3C34]" />
                <span>
                  {editingFraseId ? 'EDITAR MODELO DE FRASE' : 'CRIAR NOVO MODELO DE FRASE'}
                </span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowFormFrase(false);
                  setEditingFraseId(null);
                }}
                className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Título Identificador do Modelo
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Exame Cardiorrespiratório Normal, Conduta Dengue..."
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Categoria / Título de Organização
                </label>
                <select
                  value={formCatId}
                  onChange={(e) => setFormCatId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20"
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Conteúdo do Texto (Será inserido no prontuário)
              </label>
              <textarea
                rows={4}
                required
                placeholder="Digite o texto padrão a ser reutilizado..."
                value={formConteudo}
                onChange={(e) => setFormConteudo(e.target.value)}
                className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 resize-y"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowFormFrase(false);
                  setEditingFraseId(null);
                }}
                className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-semibold cursor-pointer hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#1A3C34] text-white text-xs font-bold cursor-pointer hover:bg-[#122b25] flex items-center gap-1.5 shadow-2xs"
              >
                <Check size={14} />
                <span>Salvar Modelo</span>
              </button>
            </div>
          </form>
        )}

        {/* BUSCA E CATEGORIAS/TÍTULOS (TABS) */}
        <div className="p-4 border-b border-stone-200 bg-white space-y-3">
          {/* Campo de Busca */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar por palavra-chave no título ou conteúdo da frase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-100 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1A3C34]/20 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Abas de Categorias / Títulos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCat('todas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCat === 'todas'
                  ? 'bg-[#1A3C34] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Ver Todas ({frases.length})
            </button>

            {categorias.map((c) => {
              const count = frases.filter((f) => f.categoriaId === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCat(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCat === c.id
                      ? 'bg-[#1A3C34] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {c.nome} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* LISTA DE MODELOS / FRASES DE EVOLUÇÃO */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 min-h-[250px]">
          {filteredFrases.length === 0 ? (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <FileText size={32} className="mx-auto opacity-50" />
              <p className="text-xs font-medium">Nenhum modelo de frase encontrado.</p>
              <button
                type="button"
                onClick={() => {
                  setEditingFraseId(null);
                  setFormTitulo('');
                  setFormConteudo('');
                  setShowFormFrase(true);
                }}
                className="text-xs text-[#1A3C34] font-bold underline cursor-pointer"
              >
                Clique aqui para criar um novo modelo
              </button>
            </div>
          ) : (
            filteredFrases.map((f) => {
              const catObj = categorias.find((c) => c.id === f.categoriaId);
              return (
                <div
                  key={f.id}
                  onClick={() => handleInsert(f)}
                  className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1A3C34] hover:shadow-md transition-all cursor-pointer group space-y-2.5 relative"
                >
                  {/* Cabeçalho da Frase */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-[#1A3C34] transition-colors">
                        {f.titulo}
                      </span>
                      {catObj && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                          {catObj.nome}
                        </span>
                      )}
                    </div>

                    {/* Ações Rápidas */}
                    <div
                      className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleCopyText(f.conteudo, f.id, e)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Copiar texto"
                      >
                        {copiedId === f.id ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span className="text-emerald-700">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleStartEditFrase(f, e)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-700 transition-colors cursor-pointer"
                        title="Editar modelo"
                      >
                        <Edit2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteFrase(f.id, e)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Excluir modelo"
                      >
                        <Trash2 size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInsert(f)}
                        className="ml-1 px-3 py-1.5 rounded-xl bg-[#1A3C34] hover:bg-[#122b25] text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-2xs transition-all"
                      >
                        <span>Inserir</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Prévia do Conteúdo do Texto */}
                  <p className="text-xs text-stone-600 whitespace-pre-wrap leading-relaxed font-sans line-clamp-4 bg-stone-50/80 p-3 rounded-xl border border-stone-100">
                    {f.conteudo}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-stone-200 text-[11px]">
              Dica: Pressione Ctrl + Espaço
            </span>
            <span>para abrir este quadro a qualquer momento no prontuário.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="text-[#1A3C34] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              title="Restaurar modelos padrões de fábrica"
            >
              <RotateCcw size={13} />
              <span>Restaurar Padrões</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold cursor-pointer transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
