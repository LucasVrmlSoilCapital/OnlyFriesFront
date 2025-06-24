import { useState } from "react";
import UserProfile from "./UserProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, StyledOnlyFries } from "./ui";

export const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split("/");
  const sessionCode = pathParts[1] === "session" && pathParts.length > 2 ? pathParts[2] : null;

  const handleCopyCode = () => {
    if (sessionCode) {
      navigator.clipboard
        .writeText(sessionCode)
        .then(() => {
          setCopied(true);
          // Reset the copied state after 2 seconds
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };
  return (
    <header className="bg-warm-500 text-cream-10 h-[8vh] p-4 flex gap-4 items-center fixed w-full z-50 shadow-soft border-b border-warm-600">
      <img
        src="/logo.png"
        className="w-12 h-12 rounded-2xl cursor-pointer transition-transform hover:scale-105 shadow-soft"
        alt="happy fries"
        onClick={() => navigate("/")}
      />
      
      {sessionCode ? (
        <div className="flex items-center gap-3 bg-cream-100/90 px-3 py-2 rounded-xl border border-cream-200/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-neutral-600 font-medium text-xs">Actif</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-lg border border-neutral-200/50">
            <span className="text-neutral-500 font-medium text-xs">Code:</span>
            <span className="font-bold text-sm text-neutral-800 tracking-wide">{sessionCode}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            className="text-neutral-500 hover:text-neutral-700 hover:bg-cream-200/60 p-1.5 rounded-lg transition-all duration-200"
            title="Copier le code"
          >
            {!copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
            ) : (
              <div className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-success-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                <span className="text-xs font-medium text-success-600">Copié</span>
              </div>
            )}
          </Button>
        </div>
      ) : (
        <StyledOnlyFries size="md" className="!text-cream-100" />
      )}
      
      <div 
        className="ml-auto relative flex items-center justify-center"
        onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      >
        <button className="transition-all duration-200 hover:scale-105">
          <img
            src="/user.png"
            className="w-12 h-12 rounded-2xl border-2 border-warm-400 hover:border-warm-300 transition-colors shadow-soft"
            alt="Profil utilisateur"
          />
        </button>
        
        {showProfile && <UserProfile />}
      </div>
    </header>
  );
};
