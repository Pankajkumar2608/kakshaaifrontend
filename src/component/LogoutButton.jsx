import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const logoutUrl = 'https://user-service-ptwk.onrender.com/v1/logout';

  const handleLogout = async () => {
    console.log("Logout button clicked");
    try {
      const response = await fetch(logoutUrl, { method: 'GET' });
      

      if (result.status === '200') {
        
        setTimeout(() => navigate('/login'), 0); // Ensure navigation after logout
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Log Out
    </button>
  );
};

export default Logout;
