import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkValidateData } from '../utils/Validate';

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const username = useRef(null);
  const navigate = useNavigate();

  const handleSignup = () => {
    const userName = username.current?.value;
    const pass = password.current?.value;
    const fullName = fullname.current?.value;
    const mail = email.current?.value;

    if(checkValidateData(mail, pass, userName, fullName)) return setErrorMessage(checkValidateData(mail, pass, userName, fullName));

    fetch("https://user-service-ptwk.onrender.com/v1/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ userName, fullName, email: mail, password: pass }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          alert("Signup successful! Please log in.");
          navigate('/login');
        } else {
          setErrorMessage(result.message || "Something went wrong");
        }
      })
      .catch(() => setErrorMessage("An error occurred. Please try again."));
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-6">
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
            <label className="block px-2 text-gray-800 font-body">Full Name</label>
            <input
              type="text"
              ref={fullname}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block px-2 text-gray-800 font-body">Email</label>
            <input
              type="email"
              ref={email}
              required
              className="w-full px-3 py-2 mt-1 border font-body bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block px-2 text-gray-800 font-body">Username</label>
            <input
              type="text"
              ref={username}
              required
              className="w-full px-3 py-2 mt-1 font-body border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block px-2 text-gray-800">Password</label>
            <input
              type="password"
              ref={password}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded-2xl font-body focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center font-body mt-4">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={handleSignup}
            className="w-full py-2 mt-4 bg-blue-700 text-white rounded-2xl font-body hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </form>

        <p
          onClick={() => navigate('/login')}
          className="mt-4 text-center text-yellow-400 cursor-pointer font-body hover:underline"
        >
          Already have an account? Log in
        </p>
      </div>
    </div>
  );
};

export default Signup;
