import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data from an API
    fetch("https://user-service-ptwk.onrender.com/v1/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Required for cookies
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("Failed to fetch user data.");
      })
      .then((data) => setUserData(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleLogout = () => {
    fetch("https://user-service-ptwk.onrender.com/v1/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        navigate("/login");
      })
      .catch(() => setError("Failed to logout. Please try again."));
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <p className="text-lg text-red-500">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 text-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 text-white">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
        <div className="space-y-4">
          <div>
            <p className="text-lg font-semibold">Full Name:</p>
            <p>{userData.fullName}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Username:</p>
            <p>{userData.userName}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Email:</p>
            <p>{userData.email}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Joined:</p>
            <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
