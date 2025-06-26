import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const useAuthPageLogic = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const { error: signInError } = await signIn(email, password);
      setLoading(false);

      if (signInError) {
        setMessage(
          "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."
        );
      } else {
        navigate("/");
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    }
  };

  const handleSlackLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "slack_oidc",
      options: {
        redirectTo: "https://onlyfries-ashy.vercel.app",
      },
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setMessage("");
  };

  return {
    // State
    isSignUp,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    message,
    error,

    // Actions
    handleSubmit,
    toggleMode,
    handleSlackLogin,
  };
};
