import React from "react";
import { createSession, getUser } from "../utils/getUser";
import { useNavigate } from "react-router-dom";
import { joinSession } from "../utils/joinSession";

export const Start = (userId: any) => {
  const [sessionCode, setSessionCode] = React.useState<string>("");
  const [iban, setIban] = React.useState<string>("");
  const [isCreatingSession, setIsCreatingSession] = React.useState<boolean>(false);
  const [isJoiningSession, setIsJoiningSession] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleCreateSession = async () => {
    setIsCreatingSession(true);
    try {
      const user = await getUser();
      if (!user.data.user?.id) {
        throw new Error("User ID is undefined");
      }
      const session = await createSession(user.data.user.id, iban);

      if (session.data.code) {
        navigate(`/${session.data.code}`);
      } else {
        alert("Erreur lors de la création de la session.");
      }
    } catch (error) {
      alert("Erreur lors de la création de la session.");
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleJoinSession = async () => {
    if (!sessionCode) {
      alert("Veuillez entrer un ID de session valide.");
      return;
    }

    setIsJoiningSession(true);
    try {
      console.log("userId", userId);
      const { data } = await joinSession(sessionCode, userId.userId);
      if (data) {
        navigate(`/${sessionCode}`);
      } else {
        alert("Erreur lors de la connexion à la session.");
      }
    } catch (error) {
      alert("Erreur lors de la connexion à la session.");
    } finally {
      setIsJoiningSession(false);
    }
  };

  return (
    <div className="bg-[#FFEDCD] flex items-center justify-center pt-20 h-[100vh] pb-10">
      <div className="w-full max-w-6xl space-y-8 px-4">
        {/* Header */}


        {/* Cards Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Create Session Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Créer une nouvelle session</h2>
              <p className="text-sm text-gray-600">Démarrez une nouvelle session de partage</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-800 mb-1">
                  IBAN
                </label>
                <input
                  id="iban"
                  name="iban"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  placeholder="Votre IBAN"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleCreateSession}
                disabled={isCreatingSession}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md flex items-center justify-center"
              >
                {isCreatingSession ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  "Créer la session"
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center lg:flex-col">
            <div className="hidden lg:block w-px h-full bg-gray-400" />
            <div className="lg:hidden w-full border-t border-gray-400" />
            <span className="px-4 py-2 bg-yellow-400 text-black text-sm rounded-full font-medium shadow-sm">
              ou
            </span>
            <div className="hidden lg:block w-px h-full bg-gray-400" />
            <div className="lg:hidden w-full border-t border-gray-400" />
          </div>

          {/* Join Session Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Rejoindre une session</h2>
              <p className="text-sm text-gray-600">Entrez le code d'une session existante</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="session" className="block text-sm font-medium text-gray-800 mb-1">
                  Code de session
                </label>
                <input
                  id="session"
                  name="session"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white"
                  placeholder="Entrez le code de session"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                />
              </div>
              
              <button 
                onClick={handleJoinSession}
                disabled={isJoiningSession}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 shadow-md flex items-center justify-center"
              >
                {isJoiningSession ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  "Rejoindre la session"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
