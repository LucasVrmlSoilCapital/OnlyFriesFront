import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Order } from "./pages/Order";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import { Start } from "./components/Start";
import { Confirmation } from "./pages/Confirmation";
import { NotFound } from "./pages/NotFound";

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
          <Route path="/auth" element={<Auth />} />
          
          {/* Routes protégées */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Start userId={user?.id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionCode/confirmation"
            element={
              <ProtectedRoute>
                <Confirmation userId={user?.id} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session/:sessionCode"
            element={
              <ProtectedRoute>
                <Order user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
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
