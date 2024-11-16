import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSignInForm, setIsSignInForm] = useState(true);
  
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const username = useRef(null);
  const navigate = useNavigate();

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  const checkValidateData = (email, password, username, fullname) => {
    if (!username || !password) return "Username and password are required.";
    if (!isSignInForm && (!email || !fullname)) return "Email and full name are required for signup.";
    return null;
  };

  const handleButtonData = () => {
    const message = checkValidateData(
      email.current?.value,
      password.current?.value,
      username.current?.value,
      fullname.current?.value
    );
    setErrorMessage(message);
    if (message !== null) return;

    const url = isSignInForm
      ? "https://user-service-ptwk.onrender.com/v1/login"
      : "https://user-service-ptwk.onrender.com/v1/signup";

    const bodyData = isSignInForm
      ? { userName: username.current.value, password: password.current.value }
      : {
          userName: username.current.value,
          fullName: fullname.current.value,
          email: email.current.value,
          password: password.current.value,
        };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData),
      
    })
  
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success'){
          
          navigate(isSignInForm ? '/ai' : '/login');
        } else {
          setErrorMessage(result.message || "Something went wrong");
        }
      })
      .catch(error => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-6">
      <div className="w-full max-w-md p-8 bg-gray-500 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <img src='https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png' className=" mx-auto  w-42 h-16  " /> 
        </h2>

        <form className="space-y-4">
          {!isSignInForm && (
            <>
              <div>
                <label className="block text-gray-800">Full Name</label>
                <input
                  type="text"
                  ref={fullname}
                  required
                  className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-gray-800">Email</label>
                <input
                  type="email"
                  ref={email}
                  required
                  className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-800">Username</label>
            <input
              type="text"
              ref={username}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-gray-800">Password</label>
            <input
              type="password"
              ref={password}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>
          )}
          <button
            type="button"
            onClick={handleButtonData}
            className="w-full py-2 mt-4 bg-blue-700 text-white rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {isSignInForm ? "Login" : "Sign Up"}
          </button>
        </form>

        <p
          onClick={toggleSignInForm}
          className="mt-4 text-center text-yellow-400 cursor-pointer hover:underline"
        >
          {isSignInForm ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </p>
      </div>
    </div>
  );
};

export default Login;




