import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const username = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate();
  const typingTextRef = useRef(null);

  const handleToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleLogin = () => {
    const userName = username.current?.value;
    const pass = password.current?.value;

    if (!userName || !pass) {
      return setErrorMessage("Please enter your username and password.");
    }

    fetch("https://user-service-ptwk.onrender.com/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userName, password: pass }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Login failed");
        }
        const result = await response.json();
        const userId = result.data?.[0]?.userId;

        if (!userId) {
          throw new Error("User ID not found in response");
        }
        localStorage.setItem("userId", userId);
        navigate("/ai2");
      })
      .catch((error) => {
        setErrorMessage(
          error.message || "An error occurred. Please try again."
        );
      });
  };

  useEffect(() => {
    const typingEffect = (element, words, period = 2000) => {
      let i = 0;
      let txt = "";
      let isDeleting = false;
      const loopTyping = () => {
        const fullTxt = words[i];
        if (isDeleting) {
          txt = fullTxt.substring(0, txt.length - 1);
        } else {
          txt = fullTxt.substring(0, txt.length + 1);
        }

        if (element.current) {
          element.current.innerHTML = `<span class="wrap">${
            txt || "&nbsp;"
          }</span>`;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && txt === fullTxt) {
          typeSpeed = period;
          isDeleting = true;
        } else if (isDeleting && txt === "") {
          isDeleting = false;
          i = (i + 1) % words.length;
          typeSpeed = 500;
        }

        setTimeout(loopTyping, typeSpeed);
      };

      loopTyping();
    };

    const words = ["Motivation Kaksha — Where Learning Meets AI"];
    typingEffect(typingTextRef, words);
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 font-body">
      {/* Login Form - Left side on large screens */}
      <div className="w-full max-w-md bg-gray-700 shadow-lg rounded-xl p-8 md:w-1/3 md:mr-8 z-10">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <img
            src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png"
            className="mx-auto w-42 h-16"
            alt="Logo"
          />
        </h2>

        <form className="space-y-4">
          {/* Username Input */}
          <div>
            <label className="block px-2 text-gray-200 font-body">
              Username:
            </label>
            <input
              type="text"
              ref={username}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 text-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-body"
            />
            
          </div>

          {/* Password Input with Toggle */}
          <div className="relative">
            <label className="block px-2 text-gray-200 font-body">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              ref={password}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 text-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-body"
            />
            
            {/* Eye Icon */}
            <span
              className="absolute right-4 top-9 text-gray-500 cursor-pointer"
              onClick={handleToggle}
            >
              {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
            </span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-4">
              {errorMessage}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="justify-center bg-yellow-500 text-black hover:bg-yellow-600 btn w-full rounded-full py-2"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <p
          onClick={() => navigate("/signup")}
          className="mt-4 text-center text-yellow-400 cursor-pointer hover:underline font-body"
        >
          Don't have an account? Sign up
        </p>
      </div>

      {/* Typing Effect Container - Only on large screens */}
      <div className="hidden md:block ml-8 text-left w-1/2 font-body">
        <h2 className="font-body text-3xl ">Welcome Back!</h2>
        <div className="h-20">
          <h3
            ref={typingTextRef}
            className="text-white text-4xl font-body min-h-[2.5rem]"
          >
            Motivation Kaksha — Where Learning Meets AI
          </h3>
        </div>
        <p className="mt-4 text-white font-body">
          Welcome to continue learning and exploring!
        </p>
      </div>

      {/* Custom CSS for typing effect */}
      <style jsx>{`
        .wrap {
          border-right: 0.08em solid #fff;
          animation: blink 0.7s step-end infinite;
          display: inline-block;
          min-width: 1ch;
        }
        @keyframes blink {
          0%,
          100% {
            border-color: transparent;
          }
          50% {
            border-color: #fff;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
