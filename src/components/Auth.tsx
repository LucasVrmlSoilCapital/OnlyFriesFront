import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card } from "./ui";

const Auth: React.FC = () => {
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


  return (
    <div className="bg-cream-300 min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md">
        {/* Auth Card */}
        <Card 
          variant="elevated" 
          padding="xl"
          rounded="lg"
          className="bg-gradient-to-br from-white to-cream-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-3">
              {isSignUp ? "Créer un compte" : "Connexion"}
            </h2>
            <p className="text-neutral-600">
              {isSignUp 
                ? "Rejoignez OnlyFries pour commencer 🍟" 
                : "Connectez-vous pour accéder à vos sessions"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Adresse email"
                type="email"
                autoComplete="email"
                required
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                inputSize="lg"
              />

              <Input
                label="Mot de passe"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputSize="lg"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-2xl p-4">
                <p className="text-error-700 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {message && (
              <div className="bg-success-50 border border-success-200 rounded-2xl p-4">
                <p className="text-success-700 text-sm text-center font-medium">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              size="xl"
              className="w-full"
              variant="primary"
            >
              {loading
                ? "Chargement..."
                : isSignUp
                ? "S'inscrire"
                : "Se connecter"}
            </Button>
          </form>

          {/* Action Links */}
          <div className="mt-8 space-y-4">
            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-neutral-500 font-medium">ou</span>
              </div>
            </div>

            {/* Toggle Sign Up/Sign In */}
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? "Déjà un compte ? Se connecter"
                : "Pas de compte ? S'inscrire"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
