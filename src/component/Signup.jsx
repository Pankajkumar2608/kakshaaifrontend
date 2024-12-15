import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkValidateData } from "../utils/Validate";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const username = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const typingTextRef = useRef(null);

  const handleToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSignup = () => {
    const userName = username.current?.value;
    const pass = password.current?.value;
    const fullName = fullname.current?.value;
    const mail = email.current?.value;

    if (checkValidateData(mail, pass, userName, fullName))
      return setErrorMessage(checkValidateData(mail, pass, userName, fullName));

    fetch("https://user-service-ptwk.onrender.com/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ userName, fullName, email: mail, password: pass }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          alert("Signup successful! Please log in.");
          navigate("/login");
        } else {
          setErrorMessage(result.message || "Something went wrong");
        }
      })
      .catch(() => setErrorMessage("An error occurred. Please try again."));
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
      {/* Signup Form - Left side on large screens */}
      <div className="w-full max-w-md bg-gray-700 shadow-lg rounded-xl p-8 md:w-1/3 md:mr-8 z-10">
        <h2 className="text-2xl font-semibold text-center mb-4">
          <img
            src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png"
            className="mx-auto w-42 h-16"
            alt="Logo"
          />
        </h2>
        

        <form className="space-y-4">
          <div>
            <label className="block px-2 text-black font-body">
              Full Name:
            </label>
            <input
              type="text"
              ref={fullname}
              required
              className="w-full px-3 py-2 mt-1 border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block px-2 text-black font-body">Email:</label>
            <input
              type="email"
              ref={email}
              required
              className="w-full px-3 py-2 mt-1 border font-body bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block px-2 text-black font-body">Username:</label>
            <input
              type="text"
              ref={username}
              required
              className="w-full px-3 py-2 mt-1 font-black border bg-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="relative">
            <label className="block px-2 text-black font-body">Password:</label>
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

          {errorMessage && (
            <p className="text-red-500 text-sm text-center font-body mt-4">
              {errorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={handleSignup}
            className="justify-center bg-yellow-500 text-black hover:bg-yellow-600 btn w-full rounded-full py-2"
          >
            Sign Up
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          className="mt-4 text-center text-yellow-400 cursor-pointer font-body hover:underline"
        >
          Already have an account? Log in
        </p>
      </div>

      {/* Typing Effect Container - Only on large screens */}
      <div className="hidden md:block ml-8 text-left w-1/2">
        <h2 className="font-body text-3xl ">Welcome</h2>
        <div className="h-20">
          <h3
            ref={typingTextRef}
            className="text-white text-4xl font-semibold min-h-[2.5rem]"
          >
            Motivation Kaksha — Where Learning Meets AI
          </h3>
        </div>
        <p className="mt-4 text-white">Signup to continue</p>
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

export default Signup;
