import { useState } from "react";
import UserProfile from "./UserProfile";

export const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <header className="bg-amber-950 text-white p-2 flex gap-2 items-center">
      <img src="./logo.png" className="w-16 rounded-md" alt="happy fries" />
      <h1 className="text-2xl font-bold ">Only Fries</h1>
      <img
        src="./user.png"
        className="w-12 cursor-pointer rounded-full ml-auto"
        alt="user icon"
        onClick={() => setShowProfile(!showProfile)}
      />
      {showProfile && <UserProfile />}
    </header>
  );
};
