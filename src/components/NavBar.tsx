import { useState } from "react";
import UserProfile from "./UserProfile";

export const NavBar = () => {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <header className="bg-amber-950 text-[#FFEDCD] p-1 flex gap-2 items-center pr-14 pl-6 fixed w-full z-50">
      <img src="./logo.png" className="w-16 rounded-md" alt="happy fries" />
      <h1 className="text-2xl font-bold ">Only Fries</h1>
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
