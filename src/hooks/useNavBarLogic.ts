import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useNavBarLogic = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/");
  const sessionCode = pathParts[1] === "session" && pathParts.length > 2 ? pathParts[2] : null;

  const copyToClipboard = async () => {
    if (!sessionCode) return;
    
    try {
      await navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const handleMouseEnter = () => {
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    setShowProfile(false);
  };

  return {
    // State
    showProfile,
    copied,
    sessionCode,
    
    // Actions
    copyToClipboard,
    toggleProfile,
    closeProfile,
    navigateToHome,
    handleMouseEnter,
    handleMouseLeave,
  };
}; 