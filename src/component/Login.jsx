import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkValidateData } from '../utils/Validate';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const username = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    const userName = username.current?.value;
    const pass = password.current?.value;

    if (!userName || !pass) {
      return setErrorMessage("Please enter your username and password.");
    }

    fetch("https://user-service-ptwk.onrender.com/v1/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', 
      body: JSON.stringify({ userName, password: pass }),
    })
      .then(async response => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }
        const result = await response.json();
        const userId = result.data?.[0]?.userId;

        if (!userId) {
          throw new Error("User ID not found in response");
        }
        localStorage.setItem('userId', userId);
        navigate('/ai');
      })
      .catch(error => {
        setErrorMessage(error.message || "An error occurred. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-6 font-body">
      <div className="w-full max-w-md p-8 bg-gray-500 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <img
            src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png"
            className="mx-auto w-42 h-16"
            alt="Logo"
          />
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block px-2 text-gray-800 font-body">Username</label>
            <input
              type="text"
              ref={username}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-body"
            />
          </div>

          <div>
            <label className="block px-2 text-gray-800 font-body">Password</label>
            <input
              type="password"
              ref={password}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-body"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-2 mt-4 bg-blue-700 text-white rounded-2xl font-body hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        <p
          onClick={() => navigate('/signup')}
          className="mt-4 text-center text-yellow-400 cursor-pointer hover:underline font-body"
        >
          Don't have an account? Sign up
        </p>
      </div>
    </div>
  );
};

export default Login;
