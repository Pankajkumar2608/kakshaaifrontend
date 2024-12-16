import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import DropDownMenu from "./DropDownMenu";
import { useNavigate } from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! Kaksha AI is ready to help you with math, physics, chemistry, and more.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Improved math configuration
  const mathJaxConfig = {
    "fast-preview": {
      disabled: true,
    },
    SVG: {
      linebreaks: { automatic: true },
      scale: 80,
    },
  };

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setInput(`Uploaded file: ${file.name}`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSend = async () => {
    // if ((!input.trim() && !uploadedFile) || isLoading) return;
    if (!input.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const historyMessage = await fetchHistory();
      const url = "https://kakshaai.motivationkaksha.xyz/chat";

      const bodyData = { prompt: `${historyMessage}\n${input}` };

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: input },
        { role: "assistant", content: "Kaksha AI is thinking..." },
      ]);
      //   setInput("");

      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     { role: "user", content: input || `File: ${uploadedFile.name}` },
      //     { role: "assistant", content: "Kaksha AI is thinking..." },
      //   ]);
      setInput("");
      //   setUploadedFile(null);

      // Fetch AI response
      //   const response = await axios.post(url, formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   });
      //   const aiResponse = response.data.response;
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
      return "";
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

  const renderMessageContent = (message) => {
    return (
      <MathJaxContext config={mathJaxConfig}>
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeMathjax]}
          components={{
            // Improved code block rendering
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomOneDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg overflow-x-auto"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className={`${
                    inline
                      ? "bg-gray-200 text-red-600 px-1 rounded"
                      : "block bg-gray-100 p-2 rounded"
                  } ${className}`}
                  {...props}
                >
                  {children}
                </code>
              );
            },
            // Inline and block math rendering
            math({ value }) {
              return (
                <MathJax>
                  <span className="math inline">{`\\(${value}\\)`}</span>
                </MathJax>
              );
            },
            mathblock({ value }) {
              return (
                <MathJax>
                  <div className="math block">{`\\[${value}\\]`}</div>
                </MathJax>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </MathJaxContext>
    );
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 font-sans">
      {/* Header */}
      <div className="w-full flex items-start justify-between mb-4 fixed top-0 z-10 p-2 bg-gray-800/80 backdrop-blur-sm">
        <img
          src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png"
          className="w-32 h-10 ml-2 sm:ml-4"
          alt="logo"
        />
        <DropDownMenu />
      </div>
      

      {/* Messages Container */}
      <div className="w-full max-w-3xl flex flex-col space-y-4 mb-4 mt-16 overflow-y-auto px-4 pb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
                max-w-[80%] 
                rounded-2xl 
                shadow-md 
                p-3 
                ${
                  message.role === "user"
                    ? "bg-gray-700 text-white rounded-tr-sm"
                    : " text-gray-100 rounded-tl-sm"
                }
              `}
            >
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="w-full max-w-3xl flex justify-center items-center space-x-2 p-2 fixed bottom-0  backdrop-blur-sm">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* <button
          className="bg-white/10 hover:bg-white/20 p-2 items-center justify-center rounded-full transition-colors"
          onClick={triggerFileInput}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2550/2550287.png"
            className="w-5 h-5 opacity-70"
            alt="upload"
          />
        </button> */}

        <input
          className="flex-grow bg-white/10 text-white placeholder-gray-400 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Kaksha AI..."
        />

        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white p-3 rounded-full transition-colors"
          onClick={handleSend}
          disabled={isLoading}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/15680/15680374.png"
            className="w-5 h-5"
            alt="send"
          />
        </button>
      </div>
    </div>
  );
}

export default Chat;
