import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Download,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  Paperclip,
  KeyRound,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react';
import { clinicalDb } from '../../services/clinicalDatabase';
import { AuditoriaLog } from '../../types/clinical';
import { DOCTOR_INFO } from '../../data/medicinarteData';

export const AuditoriaTab: React.FC = () => {
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroAcao, setFiltroAcao] = useState<string>('TODAS');
  const [feedback, setFeedback] = useState('');

  const reloadLogs = () => {
    setLogs(clinicalDb.getAuditoriaLogs());
  };

  useEffect(() => {
    reloadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.usuario_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detalhes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.paciente_nome && log.paciente_nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.ip_ou_origem && log.ip_ou_origem.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAcao = filtroAcao === 'TODAS' || log.acao === filtroAcao;

    return matchesSearch && matchesAcao;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Data/Hora', 'Usuário', 'Perfil', 'Ação', 'Paciente', 'Detalhes', 'Origem'];
    const rows = filteredLogs.map(l => [
      l.id,
      new Date(l.created_at).toLocaleString('pt-BR'),
      `"${l.usuario_nome}"`,
      l.role,
      l.acao,
      `"${l.paciente_nome || 'N/A'}"`,
      `"${l.detalhes.replace(/"/g, '""')}"`,
      `"${l.ip_ou_origem || 'Sessão Web Segura'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_medicinarte_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setFeedback('Trilha de auditoria exportada com sucesso em CSV padronizado!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const getAcaoBadge = (acao: AuditoriaLog['acao']) => {
    switch (acao) {
      case 'CRIACAO_EVOLUCAO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Evolução SOAP</span>;
      case 'CRIACAO_ADENDO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Adendo CFM</span>;
      case 'ACESSO_PRONTUARIO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">Acesso Prontuário</span>;
      case 'UPLOAD_ANEXO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">Anexo de Exame</span>;
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-800">Login</span>;
      case '2FA_CONFIGURADO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-900">2FA Ativado</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">{acao}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* BANNER PRINCIPAL DE AUDITORIA */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1A3C34]/10 text-[#1A3C34]">
              Segurança e Rastreabilidade CFM & LGPD
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-mono">Art. 37 LGPD / Res. CFM 1.821</span>
          </div>
          <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
            Trilha de Auditoria & Logs de Acesso ao Prontuário
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Registro cronológico inalterável de todos os acessos, evoluções SOAP, inclusões de adendos, uploads de exames e sessões ativas.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={reloadLogs}
            className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs transition-colors cursor-pointer"
            title="Atualizar registros de auditoria"
          >
            <RefreshCw size={15} />
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A3C34] hover:bg-[#142E28] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Exportar Trilha (CSV)</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por usuário, paciente, termo do evento ou estação..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#1A3C34]"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter size={14} className="text-stone-400" />
          <select
            value={filtroAcao}
            onChange={(e) => setFiltroAcao(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#1A3C34] cursor-pointer"
          >
            <option value="TODAS">Todas as Operações ({logs.length})</option>
            <option value="ACESSO_PRONTUARIO">Acesso ao Prontuário</option>
            <option value="CRIACAO_EVOLUCAO">Evoluções Clínicas (SOAP)</option>
            <option value="CRIACAO_ADENDO">Adendos / Retificações CFM</option>
            <option value="UPLOAD_ANEXO">Uploads de Exames / Laudos</option>
            <option value="CRIACAO_PACIENTE">Cadastro de Pacientes</option>
            <option value="LOGIN">Logins & Autenticações</option>
            <option value="2FA_CONFIGURADO">Configuração de 2FA</option>
          </select>
        </div>
      </div>

      {/* TABELA DE AUDITORIA RESPONSIVA */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="p-3.5 pl-5">Data e Horário</th>
                <th className="p-3.5">Usuário / Operador</th>
                <th className="p-3.5">Ação Realizada</th>
                <th className="p-3.5">Paciente Relacionado</th>
                <th className="p-3.5">Descrição da Operação</th>
                <th className="p-3.5 pr-5">Origem / Estação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400 text-xs">
                    Nenhum registro de auditoria encontrado para o filtro aplicado.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3.5 pl-5 font-mono text-[11px] text-stone-600 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">
                        {new Date(log.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(log.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{log.usuario_nome}</div>
                      <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                        log.role === 'profissional' ? 'bg-[#1A3C34]/10 text-[#1A3C34]' :
                        log.role === 'admin' ? 'bg-stone-200 text-stone-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {log.role}
                      </span>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      {getAcaoBadge(log.acao)}
                    </td>

                    <td className="p-3.5 whitespace-nowrap font-medium text-stone-800">
                      {log.paciente_nome ? (
                        <span>{log.paciente_nome}</span>
                      ) : (
                        <span className="text-stone-400 italic">Geral / Não se aplica</span>
                      )}
                    </td>

                    <td className="p-3.5 text-stone-600 max-w-md">
                      {log.detalhes}
                    </td>

                    <td className="p-3.5 pr-5 text-[11px] font-mono text-stone-500 whitespace-nowrap">
                      {log.ip_ou_origem || 'Bosque, Rio Branco - AC'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
