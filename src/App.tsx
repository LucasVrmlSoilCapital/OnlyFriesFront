import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Order } from "./pages/Order";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="App">
        <ProtectedRoute>
          <Routes>
            <Route path="/order" element={<Order />} />
          </Routes>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
