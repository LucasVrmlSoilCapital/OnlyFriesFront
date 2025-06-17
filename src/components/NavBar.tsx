import { useState } from "react";
import UserProfile from "./UserProfile";
import { useLocation } from "react-router-dom";

export const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const sessionCode = pathParts.length > 1 ? pathParts[1] : null;

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
    <header className="bg-amber-950 text-[#FFEDCD] p-1 flex gap-2 items-center pr-14 pl-6 fixed w-full z-50">
      <img src="./logo.png" className="w-16 rounded-md" alt="happy fries" />
      {sessionCode ? (
        <>
          <p
            onClick={handleCopyCode}
            className="cursor-pointer "
            title="Click to copy session code"
          >
            Code de session: {sessionCode}
          </p>
          {copied && (
            <span className="absolute top-8 left-40 bg-green-600 text-white text-xs px-2 py-1 rounded mt-1">
              Copié!
            </span>
          )}
        </>
      ) : (
        <h1 className="text-2xl font-bold ">Only Fries</h1>
      )}
      <img
        src="./user.png"
        className="w-12 cursor-pointer rounded-full ml-auto p-1"
        alt="user icon"
        onClick={() => setShowProfile(!showProfile)}
      />
      {showProfile && <UserProfile />}
    </header>
  );
};
