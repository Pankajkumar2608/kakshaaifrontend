import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import DropDownMenu from "./DropDownMenu";
import { useNavigate } from "react-router-dom";

function Ai() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Kaksha AI is ready to help you with math, physics, chemistry, and more.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserAuthentication = async () => {
    try {
      const response = await axios.get(
        "https://user-service-ptwk.onrender.com/v1/user",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return;
      }
    } catch (error) {
      const isSessionExpired = error.response?.status === 401;
      alert(
        isSessionExpired
          ? "Session expired. Please log in again."
          : "Login/Signup to continue"
      );
      localStorage.clear();
      navigate("/login");
    }
  };
  window.onload = fetchUserAuthentication;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const historyMessage = await fetchHistory();
      console.log(historyMessage);

      const url = "https://kakshaai.motivationkaksha.xyz/chat";

      const bodyData = { prompt: `${historyMessage}\n${input}` };

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
        { role: "assistant", content: "Kaksha AI is thinking..." },
      ]);
      setInput("");

      // Fetch AI response
      const response = await axios.post(url, bodyData, {
        headers: { "Content-Type": "application/json" },
      });
      const aiResponse = response.data.response;

      // Update messages
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = {
          role: "assistant",
          content: aiResponse,
        };
        return updatedMessages;
      });

      // Save history
      await saveHistory(aiResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID is not available in localStorage");
      }
      const fetchUrl = `https://historyapi.onrender.com/getHistory?userId=${userId}`;
      const response = await axios.get(fetchUrl);
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.history)
      ) {
        const history = response.data.data.history;

        if (history.length === 0) {
          return "";
        }

        // Format the history as a string
        const formattedHistory = history
          .map(
            (entry) =>
              `User: ${entry.question}\nAI_response: ${entry.ai_response}`
          )
          .join("\n\n");

        return `Previous conversation:\n${formattedHistory}\n\nNew question:`;
      } else {
        console.error("Unexpected response structure:", response.data);
        return "";
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const saveHistory = async (aiResponse) => {
    if (messages.length > 1) {
      const historyUrl = "https://historyapi.onrender.com/addHistory";
      const body = {
        userId: localStorage.getItem("userId"),
        question: input,
        aiResponse: aiResponse,
      };

      try {
        await axios.post(historyUrl, body);
      } catch (error) {
        console.error("Error saving history:", error);
      }
    }
  };

  const handleFeedback = async (isCorrect, message) => {
    const feedbackUrl = "https://feedbackapi.motivationkaksha.xyz/feedback";
    const body = {
      userId: localStorage.getItem("userId"),
      question: message.content,
      response: message.content,
      isCorrect,
    };

    try {
      const response = await axios.post(feedbackUrl, body, {
        headers: { "Content-Type": "application/json" },
      });
      alert(`Feedback recorded: ${isCorrect ? "Correct" : "Incorrect"}`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const renderMessageContent = (message, index) => (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeMathjax]}
      >
        {message.content}
      </ReactMarkdown>
      {message.role === "assistant" && index === messages.length - 1}
    </div>
  );

  return (
    <MathJaxContext>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-4 font-body">
        <div className="w-full flex items-start justify-between mb-4 fixed top-0 p-2 bg-gray-800">
          <img
            src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png"
            className="w-28 h-8 ml-2 sm:ml-4"
            alt="logo"
          />
          <DropDownMenu />
        </div>

        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS chat bubble component"
                src="https://cdn-icons-png.flaticon.com/512/16921/16921785.png"
              />
            </div>
          </div>
          <div className="chat-bubble">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 ${
                  message.role === "user"
                    ? "text-right  "
                    : "text-left"
                } m-2 rounded-xl text-white font-body`}
              >
                {renderMessageContent(message, index)}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl flex items-center p-2 rounded-lg shadow-lg font-body">
          <input
            className="flex-grow bg-white p-2 rounded-full text-gray-800"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask Kaksha AI..."
          />
          <button
            className="bg-white p-2 rounded-full ml-2"
            onClick={handleSend}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/15680/15680374.png"
              className="w-5 h-5"
              alt="send"
            />
          </button>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default Ai;
