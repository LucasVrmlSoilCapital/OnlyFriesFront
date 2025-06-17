import React from "react";
import { createSession, getUser } from "../utils/getUser";
import { useNavigate } from "react-router-dom";
import { joinSession } from "../utils/joinSession";

export const Start = (userId: any) => {
  const [sessionCode, setSessionCode] = React.useState<string>("");
  const [iban, setIban] = React.useState<string>("");

  const navigate = useNavigate();

  const handleCreateSession = async () => {
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
  };

  const handleJoinSession = async () => {
    if (!sessionCode) {
      alert("Veuillez entrer un ID de session valide.");
      return;
    }

    console.log("userId", userId);
    const { data } = await joinSession(sessionCode, userId.userId);
    if (data) {
      navigate(`/${sessionCode}`);
    } else {
      alert("Erreur lors de la connexion à la session.");
    }
  };

  return (
    <div className="p-20">
      <div>
        <input
          id="iban"
          name="iban"
          type="text"
          required
          className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="IBAN"
          value={iban}
          onChange={(e) => setIban(e.target.value)}
        />
        <button onClick={handleCreateSession}>Nouvelle Session</button>
      </div>

      <div>
        <label htmlFor="session" className="sr-only">
          Rejoindre une session
        </label>
        <input
          id="session"
          name="session"
          type="text"
          required
          className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          placeholder="ID de session"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
        />

        <button onClick={handleJoinSession}>Rejoindre une session</button>
      </div>
    </div>
  );
};
