import React, { useEffect, useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Order } from "./pages/Order";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import { getUser } from "./utils/getUser";

function App() {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const getAuthenticatedUser = async () => {
  //     const user = getUser();
  //     return user;
  //   };
  //   getAuthenticatedUser().then((data) => {
  //     setUser(data.user);
  //   });
  // }, []);

  return (
    <AuthProvider>
      <NavBar />
      <div className="App">
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
