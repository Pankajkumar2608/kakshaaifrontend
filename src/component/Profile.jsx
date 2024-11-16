import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link, Navigate, NavLink } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-700 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {isAuthenticated ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-sm w-full">
          <img
            src={user.picture}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-500"
          />
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Welcome, {user.name}!</h2>
          <p className="text-gray-600 text-sm mb-3">{user.email}</p>
          <p className="text-gray-700 mb-4">
            This is your profile page on Kaksha AI. Here you can see your details and access all the personalized resources we offer!
          </p>
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Kaksha AI</h2>
          <p className="text-gray-600 mb-4">
            Please log in to access your profile and personalized features.
          </p>
          <button
            onClick={loginWithRedirect}
            className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;

