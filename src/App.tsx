import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { LoginPage } from './pages/LoginPage';
import { ValidarAtestadoPage } from './pages/ValidarAtestadoPage';
import { SistemaLayout } from './components/sistema/SistemaLayout';
import { AgendaDashboard } from './pages/sistema/AgendaDashboard';
import { TaxasPage } from './pages/sistema/TaxasPage';
import { PacientesProntuariosPage } from './pages/sistema/PacientesProntuariosPage';
import { PrescricoesPage } from './pages/sistema/PrescricoesPage';
import { AtestadosPage } from './pages/sistema/AtestadosPage';
import { FinanceiroPage } from './pages/sistema/FinanceiroPage';
import { RelatoriosPage } from './pages/sistema/RelatoriosPage';
import { PermissoesPage } from './pages/sistema/PermissoesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Site Oficial Público da Dra. Cibele Cristina */}
        <Route path="/" element={<PublicLandingPage />} />

        {/* Autenticação */}
        <Route path="/login" element={<LoginPage />} />

        {/* Validação Pública de Atestados e Laudos via QR Code */}
        <Route path="/validar/:id" element={<ValidarAtestadoPage />} />

        {/* Sistema Clínico Operacional */}
        <Route
          path="/sistema"
          element={
            <SistemaLayout>
              <AgendaDashboard />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/taxas"
          element={
            <SistemaLayout>
              <TaxasPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/pacientes"
          element={
            <SistemaLayout>
              <PacientesProntuariosPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/prescricoes"
          element={
            <SistemaLayout>
              <PrescricoesPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/atestados"
          element={
            <SistemaLayout>
              <AtestadosPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/financeiro"
          element={
            <SistemaLayout>
              <FinanceiroPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/relatorios"
          element={
            <SistemaLayout>
              <RelatoriosPage />
            </SistemaLayout>
          }
        />
        <Route
          path="/sistema/permissoes"
          element={
            <SistemaLayout>
              <PermissoesPage />
            </SistemaLayout>
          }
        />

        {/* Redirecionamento fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
