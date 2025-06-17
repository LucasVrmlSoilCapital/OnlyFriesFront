import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { Menu } from "./components/Menu";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="App">
        <main className="container mx-auto mt-8 px-4">
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
