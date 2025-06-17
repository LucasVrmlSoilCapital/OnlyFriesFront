import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Order } from "./pages/Order";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import { getUser } from "./utils/getUser";
import { Start } from "./components/Start";
import { Confirmation } from "./pages/Confirmation";
import { NotFound } from "./pages/NotFound";

export type UserT = {
  id: string;
};

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getAuthenticatedUser = async () => {
      const user = getUser();
      return user;
    };
    getAuthenticatedUser().then((data) => {
      setUser(data.data.user);
    });
  }, []);

  useEffect(() => {
    console.log("User in App:", user);
  }, [user]);

  if (!user)
    return (
      <AuthProvider>
        <NavBar />
        <div className="App">
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Auth />} />
            </Routes>
          </ProtectedRoute>
        </div>
      </AuthProvider>
    );
  return (
    <AuthProvider>
      <NavBar />
      <div className="App">
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Start userId={user.id} />} />
            <Route path="/:sessionCode" element={<Order user={user} />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
