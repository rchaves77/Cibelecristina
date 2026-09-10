import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Key, LogOut, Plus, Edit3, Trash2, Eye, CheckCircle, 
  Clock, AlertCircle, FileText, Calendar, MessageSquare, Image, 
  Sparkles, Save, X, ArrowLeft, RefreshCw, Layers, ShieldCheck, Tag
} from 'lucide-react';
import { BlogPost, BlogCategory, PostStatus, Appointment, AppointmentStatus } from '../types';
import { apiService, AdminSession } from '../services/api';
import { PRESET_IMAGE_LIBRARY } from '../data/initialData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPostsUpdated: (posts: BlogPost[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onPostsUpdated }) => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'appointments'>('posts');

  // Posts State
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [showImagePresets, setShowImagePresets] = useState(false);

  // Form State for Post Editor
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    category: 'Prevenção' as BlogCategory,
    excerpt: '',
    content: '',
    coverImage: PRESET_IMAGE_LIBRARY[0].url,
    readTimeMinutes: 4,
    status: 'published' as PostStatus,
    seoTitle: '',
    seoDescription: '',
    tagsString: 'Prevenção, Saúde da Família'
  });

  // Appointments State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | AppointmentStatus>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Categories list
  const categories: BlogCategory[] = ['Prevenção', 'Crianças', 'Adultos', 'Idosos', 'Estilo de Vida'];

  // Check existing session
  useEffect(() => {
    const existing = apiService.getSession();
    if (existing) {
      setSession(existing);
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    const fetchedPosts = await apiService.getPosts();
    setPosts(fetchedPosts);
    const fetchedAppointments = await apiService.getAppointments();
    setAppointments(fetchedAppointments);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const s = await apiService.login(usernameInput, passwordInput);
      setSession(s);
      await loadData();
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    }
  };

  const handleQuickLogin = async (user: string, pass: string) => {
    setUsernameInput(user);
    setPasswordInput(pass);
    try {
      const s = await apiService.login(user, pass);
      setSession(s);
      await loadData();
    } catch (err: any) {
      setLoginError(err.message || 'Erro ao realizar login.');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setSession(null);
    setEditingPost(null);
    setIsCreatingNew(false);
  };

  // Open editor for a new post
  const startNewPost = () => {
    setIsCreatingNew(true);
    setEditingPost(null);
    setPostForm({
      title: '',
      slug: '',
      category: 'Prevenção',
      excerpt: '',
      content: '',
      coverImage: PRESET_IMAGE_LIBRARY[0].url,
      readTimeMinutes: 4,
      status: 'published',
      seoTitle: '',
      seoDescription: '',
      tagsString: 'Prevenção, Saúde da Família'
    });
  };

  // Open editor for existing post
  const startEditPost = (post: BlogPost) => {
    setIsCreatingNew(false);
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      readTimeMinutes: post.readTimeMinutes,
      status: post.status,
      seoTitle: post.seoTitle || '',
      seoDescription: post.seoDescription || '',
      tagsString: (post.tags || []).join(', ')
    });
  };

  // Handle Image File Upload (converts to base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPostForm({ ...postForm, coverImage: reader.result });
          showToast('Imagem carregada com sucesso!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save / Update Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      alert('Por favor, informe ao menos o título e o conteúdo do artigo.');
      return;
    }

    setIsSaving(true);
    const tags = postForm.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const generatedSlug = postForm.slug || postForm.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const postPayload = {
      title: postForm.title,
      slug: generatedSlug,
      category: postForm.category,
      excerpt: postForm.excerpt || postForm.content.slice(0, 150) + '...',
      content: postForm.content,
      coverImage: postForm.coverImage,
      author: {
        name: 'Dra. Cibele Cristina',
        role: 'Médica de Família e Comunidade',
        avatar: '/cibele.png'
      },
      readTimeMinutes: Number(postForm.readTimeMinutes) || 4,
      status: postForm.status,
      seoTitle: postForm.seoTitle || postForm.title,
      seoDescription: postForm.seoDescription || postForm.excerpt,
      tags
    };

    try {
      let updatedList: BlogPost[];
      if (editingPost) {
        await apiService.updatePost(editingPost.id, postPayload);
        showToast('Artigo atualizado com sucesso!');
      } else {
        await apiService.createPost(postPayload);
        showToast('Artigo publicado e já visível no site!');
      }

      updatedList = await apiService.getPosts();
      setPosts(updatedList);
      onPostsUpdated(updatedList);
      setEditingPost(null);
      setIsCreatingNew(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar o post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir o artigo "${title}"?`)) return;
    await apiService.deletePost(id);
    const updated = await apiService.getPosts();
    setPosts(updated);
    onPostsUpdated(updated);
    showToast('Artigo excluído do blog.');
  };

  const handleUpdateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    await apiService.updateAppointmentStatus(id, status);
    const updated = await apiService.getAppointments();
    setAppointments(updated);
    showToast(`Status atualizado para: ${status.toUpperCase()}`);
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A3A36]/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FDFCFB] rounded-2xl max-w-5xl w-full my-auto max-h-[95vh] flex flex-col shadow-2xl border border-[#E5E1DA] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#1A3A36] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-[#2D5A54]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2D5A54] border border-[#4ADE80]/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <div>
              <h2 className="text-base font-serif italic font-bold tracking-tight text-white">
                Painel Administrativo & CMS
              </h2>
              <p className="text-[11px] text-[#DCE7E5] font-light">
                Gestão de Conteúdo (Blog) & Agenda Médica • Dra. Cibele Cristina
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#122421] border border-[#2D5A54] text-xs text-[#DCE7E5]">
                <User className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>{session.user.name}</span>
                <span className="text-[10px] text-[#4ADE80] font-bold">({session.user.role})</span>
              </div>
            )}
            {session && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-[#DCE7E5] hover:text-white hover:bg-[#2D5A54]/50 transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#CBD5E0] hover:text-white hover:bg-[#2D5A54]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {successToast && (
          <div className="bg-[#2D5A54] text-white px-6 py-2.5 text-xs font-semibold flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle className="w-4 h-4 text-[#4ADE80]" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          
          {!session ? (
            /* Login Screen */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#DCE7E5]/50 border border-[#DCE7E5] text-[#2D5A54] flex items-center justify-center mx-auto shadow-xs">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif italic font-bold text-[#1A3A36]">Acesso Restrito</h3>
                <p className="text-xs text-[#4A5568] font-light">
                  Área exclusiva para <strong>Rômulo / ClienteBox</strong> e <strong>Dra. Cibele Cristina</strong> gerenciarem posts do blog e agendamentos.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A3A36] mb-1">Usuário</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: romulo ou cibele"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1DA] bg-white text-sm focus:ring-2 focus:ring-[#2D5A54] focus:outline-hidden text-[#2D3436]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A3A36] mb-1">Senha de Acesso</label>
                  <input
                    type="password"
                    required
                    placeholder="Sua senha de administrador"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E1DA] bg-white text-sm focus:ring-2 focus:ring-[#2D5A54] focus:outline-hidden text-[#2D3436]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2D5A54] hover:bg-[#1A3A36] text-white text-xs uppercase tracking-wider font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Entrar no Painel
                </button>
              </form>

              {/* Quick Access Helper Buttons */}
              <div className="pt-4 border-t border-[#E5E1DA] space-y-2">
                <p className="text-[10px] font-bold text-[#636E72] text-center uppercase tracking-widest">
                  Atalhos de Acesso Rápido
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('romulo', 'clientebox2026')}
                    className="p-3 rounded-xl border border-[#E5E1DA] hover:border-[#2D5A54] bg-white hover:bg-[#DCE7E5]/20 text-left transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="block text-xs font-serif italic font-bold text-[#1A3A36]">Rômulo (ClienteBox)</span>
                    <span className="text-[10px] text-[#636E72]">Gestão CMS & Publicação</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('cibele', 'cibele2026')}
                    className="p-3 rounded-xl border border-[#E5E1DA] hover:border-[#2D5A54] bg-white hover:bg-[#DCE7E5]/20 text-left transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="block text-xs font-serif italic font-bold text-[#1A3A36]">Dra. Cibele Cristina</span>
                    <span className="text-[10px] text-[#636E72]">Médica Titular</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated Admin Workspace */
            <div className="space-y-6">
              
              {/* Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setActiveTab('posts'); setEditingPost(null); setIsCreatingNew(false); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'posts'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Gerenciar Blog ({posts.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      activeTab === 'appointments'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendamentos Recebidos ({appointments.length})</span>
                  </button>
                </div>

                {activeTab === 'posts' && !isCreatingNew && !editingPost && (
                  <button
                    onClick={startNewPost}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Artigo</span>
                  </button>
                )}
              </div>

              {/* TAB 1: POSTS CMS */}
              {activeTab === 'posts' && (
                <div>
                  {isCreatingNew || editingPost ? (
                    /* POST EDITOR FORM */
                    <form onSubmit={handleSavePost} className="space-y-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                      
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => { setIsCreatingNew(false); setEditingPost(null); }}
                            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>
                          <h3 className="text-base font-bold text-slate-900">
                            {editingPost ? 'Editar Artigo' : 'Criar Novo Artigo para o Blog'}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewPost({
                              id: 'preview',
                              slug: postForm.slug || 'preview',
                              title: postForm.title || 'Título de Exemplo',
                              excerpt: postForm.excerpt,
                              content: postForm.content,
                              category: postForm.category,
                              coverImage: postForm.coverImage,
                              author: {
                                name: 'Dra. Cibele Cristina',
                                role: 'Médica de Família e Comunidade',
                                avatar: '/cibele.png'
                              },
                              publishedAt: new Date().toISOString().split('T')[0],
                              readTimeMinutes: postForm.readTimeMinutes,
                              status: postForm.status,
                              tags: postForm.tagsString.split(',').map(t => t.trim())
                            })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Salvando...' : 'Publicar no Site'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Title & Slug */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Título do Artigo *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Como manter sua imunidade alta no inverno amazônico"
                            value={postForm.title}
                            onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Categoria Obrigatória *
                          </label>
                          <select
                            value={postForm.category}
                            onChange={(e) => setPostForm({ ...postForm, category: e.target.value as BlogCategory })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Image Picker */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700">
                            Imagem de Capa do Post
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowImagePresets(!showImagePresets)}
                            className="text-xs text-emerald-700 hover:underline font-semibold flex items-center gap-1"
                          >
                            <Image className="w-3.5 h-3.5" />
                            <span>{showImagePresets ? 'Ocultar Galeria de Imagens' : 'Escolher da Galeria Médica'}</span>
                          </button>
                        </div>

                        {showImagePresets && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white rounded-xl border border-slate-200">
                            {PRESET_IMAGE_LIBRARY.map((img, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setPostForm({ ...postForm, coverImage: img.url })}
                                className="group relative rounded-lg overflow-hidden border-2 text-left transition-all cursor-pointer"
                                style={{ borderColor: postForm.coverImage === img.url ? '#059669' : 'transparent' }}
                              >
                                <img src={img.url} alt={img.label} className="w-full h-20 object-cover" />
                                <span className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-[10px] text-white font-medium">
                                  {img.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-8">
                            <input
                              type="url"
                              placeholder="URL da imagem (https://...)"
                              value={postForm.coverImage}
                              onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                            />
                          </div>

                          <div className="sm:col-span-4 flex items-center gap-2">
                            <label className="flex-1 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 text-center cursor-pointer">
                              <span>Fazer Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                            {postForm.coverImage && (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                                <img src={postForm.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Resumo / Lead (exibido no card e nas redes sociais)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Breve introdução atraente que explica do que se trata o artigo..."
                          value={postForm.excerpt}
                          onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        />
                      </div>

                      {/* Content Body Editor */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            Corpo do Artigo (Texto Rico / Parágrafos) *
                          </label>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <span>Dica: Use linhas em branco para separar parágrafos e ### para subtítulos.</span>
                          </div>
                        </div>
                        <textarea
                          rows={10}
                          required
                          placeholder="Escreva aqui o artigo completo..."
                          value={postForm.content}
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-sans leading-relaxed focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                        />
                      </div>

                      {/* Meta SEO & Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Status de Publicação</label>
                          <select
                            value={postForm.status}
                            onChange={(e) => setPostForm({ ...postForm, status: e.target.value as PostStatus })}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold"
                          >
                            <option value="published">Publicado Imediatamente</option>
                            <option value="draft">Rascunho (Privado)</option>
                            <option value="scheduled">Agendado</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tempo de Leitura (minutos)</label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={postForm.readTimeMinutes}
                            onChange={(e) => setPostForm({ ...postForm, readTimeMinutes: parseInt(e.target.value) || 4 })}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Tags (separadas por vírgula)</label>
                          <input
                            type="text"
                            placeholder="Ex: Prevenção, Hipertensão, Alimentação"
                            value={postForm.tagsString}
                            onChange={(e) => setPostForm({ ...postForm, tagsString: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs"
                          />
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => { setIsCreatingNew(false); setEditingPost(null); }}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {isSaving ? 'Salvando...' : 'Salvar e Publicar no Blog'}
                        </button>
                      </div>

                    </form>
                  ) : (
                    /* POSTS LIST TABLE */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Gerenciando <strong>{posts.length} artigos</strong> cadastrados.</span>
                        <span className="text-emerald-700 font-medium">Revalidação instantânea no site ao salvar.</span>
                      </div>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                            <tr>
                              <th className="p-3.5">Artigo</th>
                              <th className="p-3.5">Categoria</th>
                              <th className="p-3.5">Data</th>
                              <th className="p-3.5">Status</th>
                              <th className="p-3.5 text-right">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {posts.map((post) => (
                              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={post.coverImage}
                                      alt=""
                                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                    />
                                    <div>
                                      <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                                      <p className="text-[11px] text-slate-500 line-clamp-1">{post.excerpt}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                                    {post.category}
                                  </span>
                                </td>
                                <td className="p-3.5 text-slate-500 whitespace-nowrap">
                                  {post.publishedAt}
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                    post.status === 'published'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setPreviewPost(post)}
                                      className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                                      title="Visualizar Artigo"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => startEditPost(post)}
                                      className="p-1.5 rounded-md text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                                      title="Editar Artigo"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePost(post.id, post.title)}
                                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                                      title="Excluir Artigo"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: APPOINTMENTS AGENDA */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      {(['all', 'pendente', 'confirmado', 'atendido', 'cancelado'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setAppointmentFilter(st)}
                          className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                            appointmentFilter === st
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st === 'all' ? 'Todos os Agendamentos' : st}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={loadData}
                      className="flex items-center gap-1 text-slate-500 hover:text-emerald-700"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Atualizar Lista</span>
                    </button>
                  </div>

                  {/* Appointments Table */}
                  {appointments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                      <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 text-sm font-semibold">Nenhum agendamento registrado até o momento.</p>
                      <p className="text-xs text-slate-500 mt-1">Os agendamentos feitos no formulário do site aparecerão aqui automaticamente.</p>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                          <tr>
                            <th className="p-3.5">Paciente & Contato</th>
                            <th className="p-3.5">Consulta & Modalidade</th>
                            <th className="p-3.5">Data & Hora</th>
                            <th className="p-3.5">Convênio</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Ação Rápida WhatsApp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {appointments
                            .filter(a => appointmentFilter === 'all' || a.status === appointmentFilter)
                            .map((app) => {
                              const cleanPhone = (app.patientPhone || '').replace(/\D/g, '');
                              const patientWhatsAppUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(`Olá, ${app.patientName}! Aqui é da equipe da Dra. Cibele Cristina. Estamos entrando em contato a respeito da sua solicitação de consulta para o dia ${app.date} às ${app.timeSlot}.`)}`;

                              return (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-3.5">
                                    <div>
                                      <strong className="block text-slate-900">{app.patientName}</strong>
                                      <span className="text-[11px] text-slate-500">{app.patientPhone}</span>
                                      {app.patientAge && (
                                        <span className="text-[10px] text-slate-400 block">• {app.patientAge} anos</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3.5">
                                    <div>
                                      <p className="font-semibold text-slate-800">{app.serviceType}</p>
                                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[10px] capitalize">
                                        {app.modality}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <p className="font-bold text-slate-900">{app.date}</p>
                                    <span className="text-[11px] text-emerald-800 font-semibold">{app.timeSlot}</span>
                                  </td>
                                  <td className="p-3.5">
                                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                                      {app.insurance}
                                    </span>
                                  </td>
                                  <td className="p-3.5">
                                    <select
                                      value={app.status}
                                      onChange={(e) => handleUpdateAppointmentStatus(app.id, e.target.value as AppointmentStatus)}
                                      className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${
                                        app.status === 'confirmado' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                        app.status === 'atendido' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                        app.status === 'cancelado' ? 'bg-red-50 text-red-800 border-red-300' :
                                        'bg-amber-50 text-amber-800 border-amber-300'
                                      }`}
                                    >
                                      <option value="pendente">Pendente</option>
                                      <option value="confirmado">Confirmado</option>
                                      <option value="atendido">Atendido</option>
                                      <option value="cancelado">Cancelado</option>
                                    </select>
                                  </td>
                                  <td className="p-3.5 text-right whitespace-nowrap">
                                    <a
                                      href={patientWhatsAppUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      <span>WhatsApp</span>
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* ARTICLE PREVIEW MODAL */}
      {previewPost && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                PREVIEW EM TEMPO REAL: {previewPost.category}
              </span>
              <button
                onClick={() => setPreviewPost(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-60 w-full rounded-xl overflow-hidden bg-slate-100">
              <img src={previewPost.coverImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">{previewPost.title}</h2>
              <p className="text-xs text-slate-500">Por {previewPost.author.name} • {previewPost.readTimeMinutes} min de leitura</p>
            </div>

            <p className="text-sm font-medium italic text-slate-700 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
              "{previewPost.excerpt}"
            </p>

            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3">
              {previewPost.content}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewPost(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-bold"
              >
                Fechar Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
