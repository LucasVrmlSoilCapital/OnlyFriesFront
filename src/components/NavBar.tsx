import { useState } from "react";
import UserProfile from "./UserProfile";
import { useLocation, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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
      <img
        src="/logo.png"
        className="w-16 rounded-md cursor-pointer"
        alt="happy fries"
        onClick={() => navigate("/")}
      />
      {sessionCode ? (
        <>
          <p className=" " title="Click to copy session code">
            Code de session: {sessionCode}
          </p>

          {!copied ? (
            <svg
              onClick={handleCopyCode}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
              />
            </svg>
          ) : (
            <span className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                />
              </svg>
              Copié!
            </span>
          )}
        </>
      ) : (
        <h1 className="text-2xl font-bold ">Only Fries</h1>
      )}
      <img
        src="/user.png"
        className="w-16 h-16 cursor-pointer rounded-full overflow-hidden ml-auto p-1"
        alt="user icon"
        onMouseEnter={() => setShowProfile(true)}
        onMouseLeave={() => setShowProfile(false)}
      />
      {showProfile && <UserProfile />}
    </header>
  );
};
