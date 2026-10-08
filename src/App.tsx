import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { LavagemOuvidoPage } from './pages/LavagemOuvidoPage';
import { PrivacidadePage } from './pages/PrivacidadePage';
import { LoginPage } from './pages/LoginPage';
import { ResetSenhaPage } from './pages/ResetSenhaPage';
import { ValidarAtestadoPage } from './pages/ValidarAtestadoPage';
import { SistemaLayout } from './components/sistema/SistemaLayout';
import { AgendaDashboard } from './pages/sistema/AgendaDashboard';
import { TaxasPage } from './pages/sistema/TaxasPage';
import { PacientesPage } from './pages/sistema/PacientesPage';
import { ProntuarioPage } from './pages/sistema/ProntuarioPage';
import { PrescricoesPage } from './pages/sistema/PrescricoesPage';
import { AtestadosPage } from './pages/sistema/AtestadosPage';
import { FinanceiroPage } from './pages/sistema/FinanceiroPage';
import { RelatoriosPage } from './pages/sistema/RelatoriosPage';
import { PermissoesPage } from './pages/sistema/PermissoesPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site Oficial Público da Dra. Cibele Cristina */}
        <Route path="/" element={<PublicLandingPage />} />

        {/* Landing Page de Conversão Local: Lavagem de Ouvido em Rio Branco - AC */}
        <Route path="/lavagem-de-ouvido-rio-branco" element={<LavagemOuvidoPage />} />
        <Route path="/lavagem-de-ouvido-rio-branco.html" element={<LavagemOuvidoPage />} />

        {/* Conformidade Legal e Ética: Política de Privacidade (LGPD) */}
        <Route path="/privacidade" element={<PrivacidadePage />} />
        <Route path="/privacidade.html" element={<PrivacidadePage />} />

        {/* Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-senha" element={<ResetSenhaPage />} />

        {/* Validação Pública de Atestados e Laudos via QR Code ou Código */}
        <Route path="/validar" element={<ValidarAtestadoPage />} />
        <Route path="/validar-atestado" element={<ValidarAtestadoPage />} />
        <Route path="/validar/:id" element={<ValidarAtestadoPage />} />

        {/* Rotas de Painel por Cargo (compatibilidade com redirecionamento de segurança) */}
        <Route path="/painel" element={<Navigate to="/sistema" replace />} />
        <Route path="/painel-master" element={<Navigate to="/sistema" replace />} />
        <Route path="/painel-admin" element={<Navigate to="/sistema" replace />} />
        <Route path="/atendimento-medico" element={<Navigate to="/sistema/prontuario" replace />} />

        {/* Sistema Clínico Operacional - Exclusivo para Usuários Autenticados */}
        <Route
          path="/sistema"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <AgendaDashboard />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/taxas"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <TaxasPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/pacientes"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <PacientesPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/prontuario"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <ProntuarioPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/prontuario/:patientId"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <ProntuarioPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/prescricoes"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <PrescricoesPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/atestados"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <AtestadosPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/financeiro"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <FinanceiroPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/relatorios"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <RelatoriosPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sistema/permissoes"
          element={
            <ProtectedRoute>
              <SistemaLayout>
                <PermissoesPage />
              </SistemaLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirecionamento fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
