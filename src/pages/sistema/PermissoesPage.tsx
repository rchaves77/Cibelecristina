import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Send,
  Copy,
  ExternalLink,
  Search,
  Globe,
  FileCode,
  KeyRound,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Database,
  Download,
  Check,
  UserPlus,
  Trash2,
  X,
  Key
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { Perfil, GoogleSearchConsoleConfig } from '../../types/clinical';
import { DOCTOR_INFO } from '../../data/medicinarteData';
import { 
  testSupabaseConnection, 
  syncCredentialsToSupabase,
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_SQL_SCHEMA 
} from '../../services/supabaseClient';

export const PermissoesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'perfis' | 'gsc' | 'supabase'>('perfis');
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [selectedPerfil, setSelectedPerfil] = useState<Perfil | null>(null);

  // Estados do Supabase Cloud
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    message: string;
    latencyMs?: number;
    testedAt?: string;
  } | null>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [backupFeedback, setBackupFeedback] = useState('');

  // Estados de Senha e Credenciais (Usuário, E-mail e Senha)
  const [editUsuario, setEditUsuario] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editSenha, setEditSenha] = useState('');
  const [showEditSenha, setShowEditSenha] = useState(false);
  const [isSavingCredenciais, setIsSavingCredenciais] = useState(false);
  const [credenciaisFeedback, setCredenciaisFeedback] = useState<{
    type: 'success' | 'error';
    msg: string;
  } | null>(null);

  // Estados do Modal de Criação de Novo Usuário
  const [showNovoUsuarioModal, setShowNovoUsuarioModal] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newUsuario, setNewUsuario] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'profissional' | 'secretaria' | 'admin'>('profissional');
  const [newSenhaInicial, setNewSenhaInicial] = useState('');
  const [showNewSenha, setShowNewSenha] = useState(false);
  const [newExigirTroca, setNewExigirTroca] = useState(true);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserError, setNewUserError] = useState('');
  const [newUserSuccess, setNewUserSuccess] = useState('');

  // Estados legados mantidos para compatibilidade
  const [novaSenha, setNovaSenha] = useState('');
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Estados de Disparo de E-mail de Reset
  const [resetEmailFeedback, setResetEmailFeedback] = useState<{
    perfil: Perfil;
    link: string;
    mensagemPreview: string;
    disparadoEm: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados do Google Search Console
  const [gscConfig, setGscConfig] = useState<GoogleSearchConsoleConfig>({
    token: '',
    sitemapUrl: '',
    propriedadeUrl: '',
    status: 'pendente'
  });
  const [gscTokenInput, setGscTokenInput] = useState('');
  const [gscFeedback, setGscFeedback] = useState('');
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedMetaTag, setCopiedMetaTag] = useState(false);

  // Grade Horária
  const [gradeFeedback, setGradeFeedback] = useState('');
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    const list = clinicalDb.getPerfis();
    setPerfis(list);
    if (list.length > 0) {
      setSelectedPerfil(list[0]);
      setEditUsuario(list[0].usuario || list[0].id.replace('perfil-', ''));
      setEditEmail(list[0].email);
      setEditNome(list[0].nome);
    }

    const gsc = clinicalDb.getGoogleSearchConsoleConfig();
    setGscConfig(gsc);
    setGscTokenInput(gsc.token);

    // Testa status da conexão com o Supabase Cloud
    handleTestSupabase();
  }, []);

  // Sincroniza campos quando o perfil selecionado muda
  useEffect(() => {
    if (selectedPerfil) {
      setEditUsuario(selectedPerfil.usuario || selectedPerfil.id.replace('perfil-', ''));
      setEditEmail(selectedPerfil.email);
      setEditNome(selectedPerfil.nome);
      setEditSenha('');
      setCredenciaisFeedback(null);
    }
  }, [selectedPerfil?.id]);

  // --- SUPABASE CLOUD HANDLERS ---
  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    const res = await testSupabaseConnection();
    setSupabaseStatus({
      ...res,
      testedAt: new Date().toLocaleTimeString('pt-BR')
    });
    setTestingSupabase(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExportBackup = () => {
    const data = {
      clinica: DOCTOR_INFO.clinicLegalName,
      medica: DOCTOR_INFO.name,
      crm: DOCTOR_INFO.crm,
      exportadoEm: new Date().toISOString(),
      perfis: clinicalDb.getPerfis(),
      pacientes: clinicalDb.getPacientes(),
      agendamentos: clinicalDb.getAgendamentos(),
      prontuarios: clinicalDb.getProntuarios(),
      prescricoes: clinicalDb.getPrescricoesEmitidas(),
      validacoesAtestados: clinicalDb.getValidacoes()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_medicinarte_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupFeedback('Backup JSON da clínica gerado e baixado com sucesso!');
    setTimeout(() => setBackupFeedback(''), 4000);
  };

  // --- SALVAR USUÁRIO, E-MAIL E SENHA DE ACESSO ---
  const handleSaveCredenciais = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfil) return;

    const cleanUsuario = editUsuario.trim().toLowerCase().replace(/\s+/g, '');
    const cleanEmail = editEmail.trim().toLowerCase();

    if (!cleanUsuario) {
      setCredenciaisFeedback({
        type: 'error',
        msg: 'Por favor, defina um nome de usuário para o login (ex: admin, cibele, recepcao).'
      });
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setCredenciaisFeedback({
        type: 'error',
        msg: 'Por favor, informe um endereço de e-mail válido para manter no cadastro.'
      });
      return;
    }

    setIsSavingCredenciais(true);
    setCredenciaisFeedback(null);

    try {
      // 1. Atualiza no banco clínico local e atualiza a sessão se for o usuário ativo
      const { perfil: updatedPerfil } = clinicalDb.updateCredenciaisPerfil(
        selectedPerfil.id,
        cleanEmail,
        editSenha.trim() || undefined,
        editNome.trim() || undefined,
        cleanUsuario
      );

      // 2. Sincroniza em segundo plano com o Supabase Cloud
      await syncCredentialsToSupabase({
        perfilId: updatedPerfil.id,
        email: cleanEmail,
        password: editSenha.trim() || updatedPerfil.senha,
        nome: updatedPerfil.nome,
        role: updatedPerfil.role,
        usuario: updatedPerfil.usuario
      });

      // 3. Atualiza estado da UI
      const refreshed = clinicalDb.getPerfis();
      setPerfis(refreshed);
      setSelectedPerfil(updatedPerfil);
      setEditSenha('');

      setCredenciaisFeedback({
        type: 'success',
        msg: `Usuário "${updatedPerfil.usuario}" e credenciais de "${updatedPerfil.nome}" salvos com sucesso!`
      });
      setTimeout(() => setCredenciaisFeedback(null), 5000);
    } catch (err: any) {
      setCredenciaisFeedback({
        type: 'error',
        msg: err?.message || 'Erro ao atualizar dados de acesso do perfil.'
      });
    } finally {
      setIsSavingCredenciais(false);
    }
  };

  // --- ALTERAÇÃO DIRETA DE SENHA (FÁCIL, SEM BUROCRACIA) ---
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfil) return;
    if (!novaSenha.trim()) {
      setPasswordFeedback({ type: 'error', msg: 'Informe a nova senha desejada.' });
      return;
    }

    const updated = clinicalDb.updateSenhaPerfil(selectedPerfil.id, novaSenha.trim());
    if (updated) {
      const refreshed = clinicalDb.getPerfis();
      setPerfis(refreshed);
      setSelectedPerfil(updated);
      setNovaSenha('');
      setPasswordFeedback({
        type: 'success',
        msg: `Senha de ${updated.nome} alterada com sucesso! Sem validações complexas.`
      });
      setTimeout(() => setPasswordFeedback(null), 5000);
    }
  };

  // --- ENVIO DE E-MAIL COM LINK DE RESET ---
  const handleDispararEmailReset = () => {
    if (!selectedPerfil) return;

    const res = clinicalDb.gerarResetSenha(selectedPerfil.email);
    if (res.success && res.perfil) {
      setResetEmailFeedback({
        perfil: res.perfil,
        link: res.link,
        mensagemPreview: res.mensagemPreview,
        disparadoEm: new Date().toLocaleTimeString('pt-BR')
      });
      // Atualiza lista de perfis para pegar o token gravado
      setPerfis(clinicalDb.getPerfis());
    }
  };

  const handleCopyResetLink = () => {
    if (!resetEmailFeedback) return;
    navigator.clipboard.writeText(resetEmailFeedback.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // --- CRIAÇÃO DE NOVO USUÁRIO ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');
    setNewUserSuccess('');

    if (!newNome.trim()) {
      setNewUserError('Por favor, informe o nome completo do colaborador.');
      return;
    }
    if (!newUsuario.trim()) {
      setNewUserError('Por favor, defina um nome de usuário (login simples).');
      return;
    }
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setNewUserError('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!newSenhaInicial.trim() || newSenhaInicial.trim().length < 4) {
      setNewUserError('A senha inicial deve possuir no mínimo 4 caracteres.');
      return;
    }

    setIsCreatingUser(true);
    try {
      const created = clinicalDb.criarNovoUsuario({
        nome: newNome.trim(),
        usuario: newUsuario.trim().toLowerCase().replace(/\s+/g, ''),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        senhaInicial: newSenhaInicial.trim(),
        exigirTrocaPrimeiroAcesso: newExigirTroca
      });

      // Tenta sincronizar com o Supabase Cloud
      try {
        await syncCredentialsToSupabase({
          perfilId: created.id,
          email: created.email,
          password: created.senha,
          nome: created.nome,
          role: created.role,
          usuario: created.usuario
        });
      } catch {
        // Segue localmente
      }

      const refreshed = clinicalDb.getPerfis();
      setPerfis(refreshed);
      setSelectedPerfil(created);

      setNewUserSuccess(`Usuário "@${created.usuario}" criado com sucesso!`);
      setTimeout(() => {
        setShowNovoUsuarioModal(false);
        setNewNome('');
        setNewUsuario('');
        setNewEmail('');
        setNewSenhaInicial('');
        setNewUserSuccess('');
      }, 1200);
    } catch (err: any) {
      setNewUserError(err.message || 'Erro ao criar novo usuário.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // --- EXCLUSÃO DE USUÁRIO ---
  const handleDeleteUser = (perfilId: string) => {
    const target = perfis.find(p => p.id === perfilId);
    if (!target) return;
    if (target.id === 'perfil-master') {
      alert('O perfil Master de diretoria não pode ser removido.');
      return;
    }

    if (window.confirm(`Tem certeza que deseja remover o usuário "${target.nome}" (@${target.usuario})? Esta ação excluirá permanentemente suas credenciais de acesso.`)) {
      try {
        clinicalDb.deletePerfil(perfilId);
        const refreshed = clinicalDb.getPerfis();
        setPerfis(refreshed);
        if (refreshed.length > 0) {
          setSelectedPerfil(refreshed[0]);
        }
      } catch (err: any) {
        alert(err.message || 'Erro ao remover usuário.');
      }
    }
  };

  // --- ALTERAR EXIGÊNCIA DE PRIMEIRO ACESSO ---
  const handleToggleFirstAccess = (perfil: Perfil) => {
    const nextVal = !perfil.primeiro_acesso;
    const updated: Perfil = {
      ...perfil,
      primeiro_acesso: nextVal
    };
    clinicalDb.savePerfil(updated);
    const refreshed = clinicalDb.getPerfis();
    setPerfis(refreshed);
    setSelectedPerfil(updated);
  };

  // --- CONFIGURAÇÃO GOOGLE SEARCH CONSOLE ---
  const handleSaveGSC = (e: React.FormEvent) => {
    e.preventDefault();
    const saved = clinicalDb.saveGoogleSearchConsoleConfig(gscTokenInput);
    setGscConfig(saved);
    setGscFeedback('Configuração do Google Search Console atualizada com sucesso no site!');
    setTimeout(() => setGscFeedback(''), 4000);
  };

  const handleCopyMetaTag = () => {
    const metaString = `<meta name="google-site-verification" content="${gscConfig.token}" />`;
    navigator.clipboard.writeText(metaString);
    setCopiedMetaTag(true);
    setTimeout(() => setCopiedMetaTag(false), 3000);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(gscConfig.sitemapUrl);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 3000);
  };

  // --- GRADE HORÁRIA ---
  const handleToggleDia = (dia: string) => {
    if (!selectedPerfil) return;
    const current = selectedPerfil.dias_atendimento || [];
    const updated = current.includes(dia)
      ? current.filter(d => d !== dia)
      : [...current, dia];
    setSelectedPerfil({ ...selectedPerfil, dias_atendimento: updated });
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerfil) return;

    clinicalDb.savePerfil(selectedPerfil);
    setPerfis(clinicalDb.getPerfis());
    setGradeFeedback(`Grade horária salva com sucesso para ${selectedPerfil.nome}!`);
    setTimeout(() => setGradeFeedback(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* CABEÇALHO */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Administração do Sistema & SEO
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">Gestão de Perfis, Senhas e Indexação Google</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Gestão de Usuários, Senhas & Google Search Console
          </h2>
        </div>

        {/* ABAS */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('perfis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'perfis'
                ? 'bg-white text-[#1A3C34] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Perfis, Senhas & Grade</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gsc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gsc'
                ? 'bg-white text-[#1A3C34] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe size={15} className="text-[#C5A059]" />
            <span>Google Search Console</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'supabase'
                ? 'bg-white text-[#1A3C34] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database size={15} className="text-emerald-600" />
            <span>Banco de Dados & Nuvem</span>
          </button>
        </div>
      </div>

      {/* ABA 1: PERFIS, SENHAS & PERMISSÕES */}
      {activeTab === 'perfis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUNA ESQUERDA: LISTA DE PERFIS */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3 h-fit">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-800">
                  Colaboradores Cadastrados
                </h3>
                <span className="text-[11px] text-stone-500">
                  {perfis.length} perfis ativos
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowNovoUsuarioModal(true);
                  setNewUserError('');
                  setNewUserSuccess('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <UserPlus size={14} className="text-[#C5A059]" />
                <span>Novo Usuário</span>
              </button>
            </div>

            <div className="space-y-2">
              {perfis.map((p) => {
                const isSelected = selectedPerfil?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPerfil(p);
                      setNovaSenha('');
                      setPasswordFeedback(null);
                      setResetEmailFeedback(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1A3C34] bg-[#1A3C34]/5 shadow-sm font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.cor || '#1A3C34' }}
                        />
                        <span className="text-xs text-stone-900 font-medium truncate">{p.nome}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#C5A059]/20 text-[#8F7030] shrink-0">
                        {p.role === 'admin' ? 'Geral' : p.role === 'secretaria' ? 'Administrativo' : 'Profissional'}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between gap-1">
                      <span className="truncate">
                        <strong className="text-stone-800 font-mono">@{p.usuario || p.id.replace('perfil-', '')}</strong> • {p.email}
                      </span>
                      {p.primeiro_acesso ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold border border-amber-200 shrink-0">
                          1º Acesso Pendente
                        </span>
                      ) : p.senha && (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium shrink-0">
                          Senha ativa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-[11px] text-stone-600 leading-relaxed">
              💡 <strong>Dica de Segurança:</strong> Selecione o perfil para alterar o usuário de login, e-mail cadastrado ou senha de acesso.
            </div>
          </div>

          {/* COLUNA DIREITA: GERENCIADOR DE SENHAS & GRADE */}
          <div className="lg:col-span-8 space-y-6">
            {selectedPerfil ? (
              <>
                {/* CABEÇALHO DO PERFIL SELECIONADO */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0"
                      style={{ backgroundColor: selectedPerfil.cor || '#1A3C34' }}
                    >
                      {selectedPerfil.nome.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        {selectedPerfil.nome}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded">
                          Usuário: @{selectedPerfil.usuario || selectedPerfil.id.replace('perfil-', '')}
                        </span>
                        <span>•</span>
                        <span>{selectedPerfil.email}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold text-[#8F7030]">
                          {selectedPerfil.role === 'admin' ? 'Geral' : selectedPerfil.role === 'secretaria' ? 'Administrativo' : 'Profissional'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <button
                      type="button"
                      onClick={() => handleToggleFirstAccess(selectedPerfil)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPerfil.primeiro_acesso
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                      title="Exigir que este colaborador altere a senha no primeiro/próximo login"
                    >
                      <Key size={13} className={selectedPerfil.primeiro_acesso ? 'text-amber-700' : 'text-stone-500'} />
                      <span>{selectedPerfil.primeiro_acesso ? '1º Acesso Ativado' : 'Exigir Troca no 1º Acesso'}</span>
                    </button>

                    {selectedPerfil.id !== 'perfil-master' && (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(selectedPerfil.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors cursor-pointer"
                        title="Remover este usuário do sistema"
                      >
                        <Trash2 size={13} />
                        <span>Excluir</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* MÓDULO 1: EDITAR USUÁRIO, E-MAIL E SENHA */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <KeyRound size={18} className="text-[#C5A059]" />
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          Editar Usuário, E-mail e Senha de Acesso
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Defina o nome de usuário para acesso simples ao sistema, mantendo o e-mail cadastrado e a senha de segurança.
                      </p>
                    </div>
                  </div>

                  {credenciaisFeedback && (
                    <div
                      className={`p-3.5 rounded-xl text-xs font-medium animate-in fade-in flex items-center gap-2 ${
                        credenciaisFeedback.type === 'success'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                          : 'bg-red-50 border border-red-200 text-red-800'
                      }`}
                    >
                      {credenciaisFeedback.type === 'success' ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="text-red-600 shrink-0" />
                      )}
                      <span>{credenciaisFeedback.msg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveCredenciais} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CAMPO: USUÁRIO DE ACESSO (LOGIN SIMPLES) */}
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">
                          Nome de Usuário (Login Direto)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-stone-400 font-mono font-bold text-xs">@</span>
                          <input
                            type="text"
                            required
                            value={editUsuario}
                            onChange={(e) => setEditUsuario(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                            placeholder="ex: admin, cibele, recepcao"
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34] font-mono font-medium text-stone-800"
                          />
                        </div>
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Identificador rápido para digitar na tela de login.
                        </span>
                      </div>

                      {/* CAMPO: E-MAIL DE CADASTRO */}
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">
                          E-mail Cadastrado no Sistema
                        </label>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-3 text-stone-400" />
                          <input
                            type="email"
                            required
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="exemplo@medicinarte.com.br"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34] font-medium text-stone-800"
                          />
                        </div>
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Permanecerá cadastrado para segurança e comunicações.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* CAMPO: NOME DO PERFIL */}
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">
                          Nome de Exibição
                        </label>
                        <div className="relative">
                          <UserCheck size={15} className="absolute left-3 top-3 text-stone-400" />
                          <input
                            type="text"
                            required
                            value={editNome}
                            onChange={(e) => setEditNome(e.target.value)}
                            placeholder="Nome do usuário"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34] font-medium text-stone-800"
                          />
                        </div>
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Identificação visível em prontuários e assinaturas.
                        </span>
                      </div>

                      {/* CAMPO: SENHA DE ACESSO */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-stone-700">
                            Senha de Acesso
                          </label>
                          <span className="text-[10px] text-stone-400">
                            {selectedPerfil.senha ? 'Preencha só se quiser alterar' : 'Definir senha'}
                          </span>
                        </div>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-3 text-stone-400" />
                          <input
                            type={showEditSenha ? 'text' : 'password'}
                            value={editSenha}
                            onChange={(e) => setEditSenha(e.target.value)}
                            placeholder="Deixe em branco para manter a atual"
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowEditSenha(!showEditSenha)}
                            className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                          >
                            {showEditSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        <span className="text-[11px] text-stone-400 mt-1 block">
                          Senha confidencial para autenticação.
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                      <button
                        type="submit"
                        disabled={isSavingCredenciais}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSavingCredenciais ? (
                          <>
                            <RefreshCw size={14} className="animate-spin text-[#C5A059]" />
                            <span>Salvando Alterações...</span>
                          </>
                        ) : (
                          <>
                            <Save size={14} className="text-[#C5A059]" />
                            <span>Salvar Dados de Acesso</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sugestao = 'Med' + Math.floor(1000 + Math.random() * 9000);
                          setEditSenha(sugestao);
                          setShowEditSenha(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs font-medium transition-all cursor-pointer"
                      >
                        <Sparkles size={14} className="text-[#C5A059]" />
                        <span>Sugerir Senha</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* MÓDULO 2: DISPARO DE E-MAIL COM LINK DE RESET */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-[#1A3C34]" />
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          Mandar Mensagem para Resetar Senha no E-mail
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Dispare um e-mail oficial de redefinição para o endereço cadastrado do colaborador ({selectedPerfil.email}).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div>
                      <div className="text-xs font-semibold text-stone-800">
                        Destinatário: <span className="font-mono text-[#1A3C34]">{selectedPerfil.email}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Um link seguro e individual com validade de 24 horas será gerado.
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleDispararEmailReset}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#9E7B36] hover:brightness-105 text-[#0E231E] text-xs font-bold shadow-sm transition-all shrink-0"
                    >
                      <Send size={14} />
                      <span>Disparar E-mail de Redefinição</span>
                    </button>
                  </div>

                  {/* PREVIEW DA MENSAGEM DISPARADA */}
                  {resetEmailFeedback && (
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300/80 space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                          <CheckCircle2 size={16} className="text-emerald-600" />
                          <span>E-mail de Reset Gerado às {resetEmailFeedback.disparadoEm}!</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Enviado para {resetEmailFeedback.perfil.email}
                        </span>
                      </div>

                      {/* Box com o Link e botão de copiar */}
                      <div className="bg-white p-3 rounded-lg border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs font-mono text-stone-700 truncate">
                          {resetEmailFeedback.link}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleCopyResetLink}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1A3C34] text-white text-xs font-semibold hover:bg-[#142E28] transition-all"
                          >
                            <Copy size={13} />
                            <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                          </button>

                          <a
                            href={resetEmailFeedback.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all"
                          >
                            <ExternalLink size={13} />
                            <span>Abrir Página</span>
                          </a>
                        </div>
                      </div>

                      {/* Pré-visualização da Mensagem */}
                      <details className="text-xs text-stone-600 bg-white/60 p-2.5 rounded-lg border border-emerald-200/60">
                        <summary className="cursor-pointer font-semibold text-emerald-900">
                          Ver Conteúdo Formatado da Mensagem Enviada
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-stone-700 bg-stone-50 p-2.5 rounded border border-stone-200">
                          {resetEmailFeedback.mensagemPreview}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>

                {/* MÓDULO 3: GRADE HORÁRIA DE ATENDIMENTO */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-[#1A3C34]" />
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          Grade Horária & Dias de Atendimento
                        </h4>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Define os horários permitidos de agendamento na agenda do consultório.
                      </p>
                    </div>
                  </div>

                  {gradeFeedback && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>{gradeFeedback}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveGrade} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">
                          Horário de Início
                        </label>
                        <input
                          type="time"
                          value={selectedPerfil.hora_inicio || '08:00'}
                          onChange={(e) => setSelectedPerfil({ ...selectedPerfil, hora_inicio: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-stone-700 block mb-1">
                          Horário de Término
                        </label>
                        <input
                          type="time"
                          value={selectedPerfil.hora_fim || '18:00'}
                          onChange={(e) => setSelectedPerfil({ ...selectedPerfil, hora_fim: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700 block mb-2">
                        Dias da Semana Liberados para Agendamento
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {diasSemana.map((dia) => {
                          const active = selectedPerfil.dias_atendimento?.includes(dia);
                          return (
                            <button
                              key={dia}
                              type="button"
                              onClick={() => handleToggleDia(dia)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                                active
                                  ? 'bg-[#1A3C34] text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {dia} {active ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <Save size={14} />
                        <span>Salvar Grade Horária</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center text-stone-400 p-8 bg-white rounded-2xl border border-stone-200">
                Selecione um colaborador à esquerda para gerenciar credenciais e grade horária.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ABA 2: GOOGLE SEARCH CONSOLE & SEO LOCAL */}
      {activeTab === 'gsc' && (
        <div className="space-y-6">
          
          {/* BANNER PRINCIPAL GSC */}
          <div className="bg-gradient-to-r from-[#142E28] to-[#1A3C34] text-white p-6 rounded-3xl border border-[#27574B] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-xs font-semibold">
                <Globe size={14} />
                <span>Google Search Console Oficial</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-white">
                Indexação & Ranqueamento de Rio Branco - AC
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Configure a tag de verificação do Google e envie o sitemap XML para que o consultório da 
                Dra. Cibele Cristina seja encontrado no topo do Google para buscas como "Médica de Família em Rio Branco" 
                e "Lavagem de Ouvido em Rio Branco - AC".
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#0E231E] font-bold text-xs shadow-md transition-all"
              >
                <span>Abrir Google Search Console</span>
                <ExternalLink size={15} />
              </a>

              <div className="text-center text-[11px] text-stone-400">
                Acesse com sua conta Google
              </div>
            </div>
          </div>

          {gscFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{gscFeedback}</span>
            </div>
          )}

          {/* PAINEL DE CONFIGURAÇÃO DO TOKEN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CARD: TOKEN DA META TAG DE VERIFICAÇÃO */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode size={18} className="text-[#C5A059]" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    1. Meta Tag de Verificação HTML
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {gscConfig.status === 'configurado' ? 'Ativo no Site' : 'Pendente'}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                O Google Search Console fornece um código de verificação para o método <strong>Tag HTML</strong>. 
                Cole o token abaixo para injetar automaticamente no cabeçalho do site.
              </p>

              <form onSubmit={handleSaveGSC} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Código de Verificação Google Search Console
                  </label>
                  <input
                    type="text"
                    value={gscTokenInput}
                    onChange={(e) => setGscTokenInput(e.target.value)}
                    placeholder="Ex: google-site-verification=abc123xyz... ou o token"
                    className="w-full text-xs font-mono p-3 rounded-xl border border-stone-300 focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Save size={14} />
                    <span>Salvar e Atualizar no Site</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMetaTag}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-all"
                  >
                    <Copy size={14} />
                    <span>{copiedMetaTag ? 'Tag Copiada!' : 'Copiar Tag HTML'}</span>
                  </button>
                </div>
              </form>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 font-mono text-[11px] text-stone-600 break-all">
                &lt;meta name="google-site-verification" content="{gscConfig.token}" /&gt;
              </div>
            </div>

            {/* CARD: SITEMAP XML & ARQUIVO DE VERIFICAÇÃO */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-[#1A3C34]" />
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    2. Envio do Sitemap XML & Robots.txt
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#1A3C34]/10 text-[#1A3C34]">
                  Indexação Ativa
                </span>
              </div>

              <p className="text-xs text-stone-600">
                O arquivo de mapa do site instrui os robôs do Google sobre todas as páginas de alta relevância clínica e procedimentos.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    URL Oficial do Sitemap XML
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={gscConfig.sitemapUrl || 'https://dracibelecristina.med.br/sitemap.xml'}
                      className="w-full text-xs font-mono p-2.5 rounded-xl bg-stone-50 border border-stone-300 text-stone-700 select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopySitemap}
                      className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-[#1A3C34] text-white text-xs font-semibold hover:bg-[#142E28] transition-all shrink-0"
                    >
                      <Copy size={13} />
                      <span>{copiedSitemap ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-1 text-xs text-amber-900">
                  <div className="font-semibold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-600" />
                    <span>Como submeter no Google Search Console:</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-amber-800 space-y-1 mt-1">
                    <li>No menu esquerdo do GSC, clique em <strong>"Sitemaps"</strong>.</li>
                    <li>No campo <em>"Adicionar novo sitemap"</em>, digite apenas: <strong>sitemap.xml</strong></li>
                    <li>Clique em <strong>"Enviar"</strong>. O status mudará para "Sucesso".</li>
                  </ol>
                </div>
              </div>
            </div>

          </div>

          {/* CARD EXPLICATIVO: CHECKLIST DE VALIDAÇÃO GSC */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
            <h4 className="font-serif font-bold text-sm text-stone-900">
              Checklist de SEO Local para Rio Branco - AC
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#1A3C34]/10 text-[#1A3C34] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h5 className="font-semibold text-xs text-stone-900">Páginas Indexadas</h5>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  A home page e a página especializada em <strong>Lavagem de Ouvido em Rio Branco</strong> já estão estruturadas com meta tags e dados do Schema.org.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 text-[#8F7030] flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h5 className="font-semibold text-xs text-stone-900">Diretrizes do CFM</h5>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Conformidade com a Resolução CFM nº 2.314/2022 e 2.336/2023, exibindo CRM-AC 1810 e RQE 1078 em todas as meta tags.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h5 className="font-semibold text-xs text-stone-900">Robots.txt Seguro</h5>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  O painel interno (<code>/sistema/</code>) e o login (<code>/login</code>) estão bloqueados para robôs, garantindo privacidade e LGPD para os pacientes.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ABA 3: BANCO SUPABASE CLOUD (POSTGRESQL) */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          
          {/* CARD PRINCIPAL DE STATUS DA CONEXÃO */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <Database size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Supabase Cloud Database & Auth
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Conectado
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Banco de dados relacional PostgreSQL e autenticação na nuvem para a clínica
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={testingSupabase}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={14} className={testingSupabase ? 'animate-spin text-emerald-600' : 'text-stone-600'} />
                  <span>{testingSupabase ? 'Testando...' : 'Testar Conexão'}</span>
                </button>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <span>Abrir Painel Supabase</span>
                  <ExternalLink size={13} className="text-[#C5A059]" />
                </a>
              </div>
            </div>

            {/* DADOS TÉCNICOS DA CONEXÃO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  ID do Projeto
                </span>
                <span className="text-sm font-mono font-bold text-stone-800">
                  {SUPABASE_PROJECT_ID}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  Endpoint da API
                </span>
                <span className="text-xs font-mono text-stone-800 truncate block" title={SUPABASE_URL}>
                  {SUPABASE_URL}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                  Status da API
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-stone-800">
                    {supabaseStatus?.latencyMs ? `${supabaseStatus.latencyMs} ms de latência` : 'Ativo e Responsivo'}
                  </span>
                </div>
              </div>
            </div>

            {supabaseStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
                  supabaseStatus.connected
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border border-red-200 text-red-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {supabaseStatus.connected ? (
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                  )}
                  <span>{supabaseStatus.message}</span>
                </div>
                {supabaseStatus.testedAt && (
                  <span className="text-[11px] text-stone-500">
                    Testado às {supabaseStatus.testedAt}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* SCRIPT DDL: CRIAÇÃO AUTOMÁTICA DE TABELAS */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Script SQL Oficial para o Supabase
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Execute este script no SQL Editor do seu projeto Supabase para criar as tabelas com RLS e índices.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#142E28] font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSql ? 'SQL Copiado!' : 'Copiar Script SQL'}</span>
                </button>

                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors"
                >
                  <span>Abrir SQL Editor</span>
                  <ExternalLink size={13} className="text-stone-500" />
                </a>
              </div>
            </div>

            {/* Passo a Passo Rápido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-[#1A3C34] block">Passo 1</span>
                <p className="text-stone-600">
                  Clique no botão <strong>"Copiar Script SQL"</strong> acima.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-[#1A3C34] block">Passo 2</span>
                <p className="text-stone-600">
                  Clique em <strong>"Abrir SQL Editor"</strong> para ir direto ao seu projeto.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-[#1A3C34] block">Passo 3</span>
                <p className="text-stone-600">
                  Cole o código e clique em <strong>"Run"</strong> (ou pressione Ctrl+Enter).
                </p>
              </div>
            </div>

            {/* Prévia do Script SQL */}
            <div className="relative">
              <pre className="p-4 rounded-xl bg-[#0E231E] text-stone-200 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto border border-[#1E4339]">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>

          {/* BACKUP COMPLETO DOS DADOS CLÍNICOS */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Backup e Exportação dos Dados Médicos
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Exporte cópia completa de segurança em formato JSON com todos os pacientes, consultas e prontuários.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer shrink-0"
              >
                <Download size={15} className="text-[#C5A059]" />
                <span>Exportar Backup Completo</span>
              </button>
            </div>

            {backupFeedback && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{backupFeedback}</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE NOVO USUÁRIO */}
      {showNovoUsuarioModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1A3C34] text-[#C5A059] flex items-center justify-center shadow-sm">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Criar Novo Usuário
                  </h3>
                  <p className="text-xs text-stone-500">
                    Cadastre novos colaboradores, defina a senha inicial e o perfil de acesso.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNovoUsuarioModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {newUserError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <span>{newUserError}</span>
              </div>
            )}

            {newUserSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{newUserSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Nome Completo do Colaborador *
                </label>
                <input
                  type="text"
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="ex: Dr. Fernando Souza ou Mariana Santos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34] font-medium text-stone-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Nome de Usuário (Login) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-mono text-xs font-bold">@</span>
                    <input
                      type="text"
                      required
                      value={newUsuario}
                      onChange={(e) => setNewUsuario(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="ex: fernando, mariana"
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-mono font-semibold text-stone-800 focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    E-mail Cadastrado *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="exemplo@medicinarte.com.br"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34] font-medium text-stone-800"
                  />
                </div>
              </div>

              {/* SELEÇÃO DO PERFIL DE ACESSO */}
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Perfil de Acesso (Função) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      newRole === 'profissional'
                        ? 'border-[#1A3C34] bg-[#1A3C34]/5 ring-1 ring-[#1A3C34]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value="profissional"
                      checked={newRole === 'profissional'}
                      onChange={() => setNewRole('profissional')}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-stone-900">Profissional</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Médica / Saúde</div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      newRole === 'secretaria'
                        ? 'border-[#C5A059] bg-[#C5A059]/10 ring-1 ring-[#C5A059]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value="secretaria"
                      checked={newRole === 'secretaria'}
                      onChange={() => setNewRole('secretaria')}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-stone-900">Administrativo</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Recepção / Agenda</div>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      newRole === 'admin'
                        ? 'border-[#142E28] bg-[#142E28]/5 ring-1 ring-[#142E28]'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userRole"
                      value="admin"
                      checked={newRole === 'admin'}
                      onChange={() => setNewRole('admin')}
                      className="sr-only"
                    />
                    <div className="text-xs font-bold text-stone-900">Geral</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Administrador Geral</div>
                  </label>
                </div>
              </div>

              {/* SENHA INICIAL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Senha Inicial de Acesso *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const sugerida = 'Med' + Math.floor(1000 + Math.random() * 9000);
                      setNewSenhaInicial(sugerida);
                      setShowNewSenha(true);
                    }}
                    className="text-[10px] text-[#C5A059] font-bold hover:underline cursor-pointer"
                  >
                    Sugerir Senha
                  </button>
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-stone-400" />
                  <input
                    type={showNewSenha ? 'text' : 'password'}
                    required
                    value={newSenhaInicial}
                    onChange={(e) => setNewSenhaInicial(e.target.value)}
                    placeholder="Digite a senha temporária inicial"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs font-medium focus:ring-1 focus:ring-[#1A3C34] focus:border-[#1A3C34]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewSenha(!showNewSenha)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showNewSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* CHECKBOX PRIMEIRO ACESSO */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newExigirTroca}
                    onChange={(e) => setNewExigirTroca(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-[#1A3C34] focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-semibold text-stone-800 block">
                      Exigir alteração de senha no primeiro acesso
                    </span>
                    <span className="text-[11px] text-stone-500 block leading-snug">
                      Ao fazer login pela primeira vez, o colaborador verá um pop-up obrigatório para cadastrar sua nova senha pessoal.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNovoUsuarioModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="px-5 py-2.5 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isCreatingUser ? 'Criando Usuário...' : 'Cadastrar Novo Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
