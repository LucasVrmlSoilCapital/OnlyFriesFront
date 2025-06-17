import React from "react";
import { createSession, getUser } from "../utils/getUser";
import { useNavigate } from "react-router-dom";

export const Start = () => {
  const [sessionId, setSessionId] = React.useState<string>("");

  const navigate = useNavigate();

  const handleCreateSession = async () => {
    // Logic to create a new session
    const user = await getUser();
    if (!user.data.user?.id) {
      throw new Error("User ID is undefined");
    }
    const session = await createSession(user.data.user.id);

    console.log(session);

    if (session.data.code) {
      navigate(`/${session.data.code}`); // Redirect to the session page
      // Redirect to the menu page or handle session creation success
    } else {
      alert("Erreur lors de la création de la session.");
    }
  };

  const handleJoinSession = async () => {
    if (!sessionId) {
      alert("Veuillez entrer un ID de session valide.");
      return;
    }
    // Logic to join an existing session
  };

  return (
    <div>
      <button onClick={handleCreateSession}>Nouvelle Session</button>

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
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
        <button onClick={handleJoinSession}>Rejoindre une session</button>
      </div>
    </div>
  );
};
