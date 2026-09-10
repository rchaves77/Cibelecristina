import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, Share2, Search, ArrowRight, X, User, Check, MessageSquare } from 'lucide-react';
import { BlogPost, BlogCategory } from '../types';
import { DOCTOR_PROFILE } from '../data/initialData';

interface BlogSectionProps {
  posts: BlogPost[];
  onOpenBooking: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, onOpenBooking }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories: (string | BlogCategory)[] = [
    'Todos',
    'Prevenção',
    'Crianças',
    'Adultos',
    'Idosos',
    'Estilo de Vida'
  ];

  // Filter only published posts for the public view
  const publishedPosts = posts.filter(p => p.status === 'published');

  const filteredPosts = publishedPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleShareWhatsApp = (article: BlogPost) => {
    const shareText = `*${article.title}*\n\nOrientação de saúde preventiva da Dra. Cibele Cristina (Medicina da Família e Comunidade):\n\n"${article.excerpt}"\n\nLeia mais e cuide da sua saúde!`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleCopyArticleLink = (article: BlogPost) => {
    navigator.clipboard.writeText(window.location.origin + '#blog-' + article.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section id="blog" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE7E5]/40 border border-[#DCE7E5] text-[#2D5A54] text-[11px] uppercase tracking-[0.2em] font-bold">
            Blog de Saúde & Bem-Estar
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#1A3A36] tracking-tight">
            Orientações de Saúde Preventiva para Você e Sua Família
          </h2>
          <p className="text-base sm:text-lg text-[#4A5568] leading-relaxed font-light">
            Artigos informativos escritos com carinho pela Dra. Cibele Cristina para esclarecer dúvidas, prevenir doenças e incentivar hábitos saudáveis.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#2D5A54] text-white shadow-xs'
                    : 'bg-white border border-[#E5E1DA] text-[#636E72] hover:bg-[#FAF8F5] hover:text-[#1A3A36]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#636E72] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar orientações ou temas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-[#E5E1DA] text-[#2D3436] focus:outline-hidden focus:ring-1 focus:ring-[#2D5A54]"
            />
          </div>

        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E1DA]">
            <BookOpen className="w-10 h-10 text-[#636E72] mx-auto mb-2" />
            <p className="text-[#4A5568] font-medium text-sm">Nenhum artigo encontrado para o filtro selecionado.</p>
            <button
              onClick={() => { setSelectedCategory('Todos'); setSearchTerm(''); }}
              className="mt-3 text-xs text-[#2D5A54] font-bold uppercase tracking-wider underline cursor-pointer"
            >
              Limpar filtros de busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-[#E5E1DA] shadow-xs hover:border-[#2D5A54] transition-all flex flex-col overflow-hidden group cursor-pointer"
                onClick={() => setActiveArticle(post)}
              >
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-[#FDFCFB]/95 text-[#2D5A54] border border-[#E5E1DA] shadow-xs backdrop-blur-xs">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-[#636E72]">
                      <span className="flex items-center gap-1 font-light">
                        <Calendar className="w-3.5 h-3.5 text-[#2D5A54]" />
                        {post.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-light">
                        <Clock className="w-3.5 h-3.5 text-[#2D5A54]" />
                        {post.readTimeMinutes} min de leitura
                      </span>
                    </div>

                    <h3 className="text-base font-serif italic font-bold text-[#1A3A36] group-hover:text-[#2D5A54] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#4A5568] line-clamp-3 leading-relaxed font-light">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#E5E1DA] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#E5E1DA]"
                      />
                      <span className="text-xs font-semibold text-[#1A3A36]">{post.author.name}</span>
                    </div>

                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A54] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Ler <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A3A36]/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#FDFCFB] rounded-2xl max-w-3xl w-full my-auto max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E1DA] overflow-hidden">
            
            {/* Modal Header Bar */}
            <div className="sticky top-0 bg-[#FDFCFB] border-b border-[#E5E1DA] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#DCE7E5] text-[#2D5A54]">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-[#636E72] font-light">
                  {activeArticle.readTimeMinutes} min de leitura
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShareWhatsApp(activeArticle)}
                  className="p-2 rounded-lg text-[#2D5A54] hover:bg-[#DCE7E5]/30 transition-colors cursor-pointer"
                  title="Compartilhar no WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-lg text-[#636E72] hover:text-[#1A3A36] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Cover Image in Modal */}
              <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#E5E1DA]">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A3A36] tracking-tight leading-tight">
                  {activeArticle.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#636E72] border-b border-[#E5E1DA] pb-4 font-light">
                  <div className="flex items-center gap-2">
                    <img
                      src={activeArticle.author.avatar}
                      alt={activeArticle.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-[#E5E1DA]"
                    />
                    <div>
                      <strong className="block text-[#1A3A36] font-semibold">{activeArticle.author.name}</strong>
                      <span className="text-[#636E72] text-[10px]">{activeArticle.author.role} • CRM 3482/AC</span>
                    </div>
                  </div>
                  <span>•</span>
                  <span>Publicado em {activeArticle.publishedAt}</span>
                </div>
              </div>

              {/* Excerpt Lead */}
              <blockquote className="text-base font-serif italic bg-white border-l-2 border-[#2D5A54] p-4 rounded-r-xl text-[#2D5A54] shadow-xs">
                "{activeArticle.excerpt}"
              </blockquote>

              {/* Formatted Content */}
              <div className="prose prose-slate max-w-none text-[#2D3436] font-serif text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                {activeArticle.content}
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#E5E1DA]">
                  <span className="text-xs font-semibold text-[#636E72]">Tags:</span>
                  {activeArticle.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-[#FAF8F5] border border-[#E5E1DA] text-[#2D3436] px-2.5 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Banner inside article */}
              <div className="bg-[#1A3A36] text-white rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#2D5A54]">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-serif italic font-bold text-base">Gostou deste conteúdo preventivo?</h4>
                  <p className="text-xs text-[#DCE7E5] font-light">
                    Cuide da sua saúde com uma avaliação médica humanizada e individualizada.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveArticle(null);
                    onOpenBooking();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#4ADE80] text-[#1A3A36] font-bold text-xs uppercase tracking-wider hover:bg-emerald-300 transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  Agendar Consulta
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF8F5] border-t border-[#E5E1DA] px-6 py-3 flex items-center justify-between text-xs">
              <span className="text-[#636E72] font-light">Conteúdo informativo para pacientes • Dra. Cibele Cristina</span>
              <button
                onClick={() => handleShareWhatsApp(activeArticle)}
                className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs text-[#2D5A54] hover:text-[#1A3A36] cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Enviar pelo WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
