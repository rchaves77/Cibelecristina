import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { clinicalDb } from '../../services/clinicalDatabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Guarda de Rota Estrita:
 * Assegura que nenhuma tela interna do sistema clínico seja montada ou renderizada
 * a menos que o usuário esteja efetivamente autenticado (sessão válida ativa).
 * Caso não esteja autenticado, redireciona de imediato para a tela de login (/login).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuth = clinicalDb.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
