import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProtectedRoute, NavBar } from "./components/layout";
import { SessionRouter } from "./components/session";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { 
  StartPage, 
  AuthPage, 
  ConfirmationPage, 
  TooLatePage,
  NotFoundPage 
} from "./pages";

export type UserT = {
  id: string;
};

// Composant interne qui utilise le contexte d'auth
const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="App">
        <Routes>
          {/* Route publique pour l'authentification */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StartPage userId={user?.id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionCode/confirmation"
            element={
              <ProtectedRoute>
                <ConfirmationPage userId={user?.id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionCode/too-late"
            element={
              <ProtectedRoute>
                <TooLatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionCode"
            element={
              <ProtectedRoute>
                <SessionRouter user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
