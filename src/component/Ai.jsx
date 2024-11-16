import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import remarkMath from 'remark-math';
import rehypeMathjax from 'rehype-mathjax';
import DropDownMenu from './DropDownMenu';
import { useNavigate } from 'react-router-dom';

function Ai() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Kaksha AI is ready to help you with math, physics, chemistry, and more.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user authentication
  const fetchUserAuthentication = async () => {
    try {
      const response = await axios.get('https://user-service-ptwk.onrender.com/v1/user', {
        withCredentials: true
      });
      if (!response.data || !response.data.userId) {
        throw new Error('User not authenticated');
      }
    } catch (error) {
      const isSessionExpired = error.response?.status === 401;
      alert(isSessionExpired ? 'Session expired. Please log in again.' : 'Login/Signup to continue');
      localStorage.clear();
      navigate('/login');
    }
  };

  // Send a message and handle response
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // Check user authentication
      await fetchUserAuthentication();

      // Fetch conversation history
      const history = await fetchHistory();

      // Prepare API request
      const url = 'https://kaksha.motivationkaksha.xyz/chat';
      const bodyData = { prompt: `${input}\n\n${history}` };

      // Update UI for user input
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: input },
        { role: 'assistant', content: 'Kaksha AI is thinking...' },
      ]);
      setInput('');

      // Fetch AI response
      const response = await axios.post(url, bodyData, { headers: { 'Content-Type': 'application/json' } });
      const aiResponse = response.data.response;

      // Update messages
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1] = { role: 'assistant', content: aiResponse };
        return updatedMessages;
      });

      // Save history
      await saveHistory(aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Oops! Something went wrong. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch conversation history
  const fetchHistory = async () => {
    try {
      const response = await axios.get('https://historyapi.onrender.com/fetchHistory', {
        headers: { Authorization: `Bearer ${localStorage.getItem('sessionToken')}` },
      });
      return response.data.history || '';
    } catch (error) {
      console.error('Error fetching history:', error);
      return '';
    }
  };

  // Save conversation history
  const saveHistory = async (responseContent) => {
    if (messages.length > 1) {
      const historyUrl = 'https://historyapi.onrender.com/addHistory';
      const body = {
        userId: localStorage.getItem('userId'),
        question: input,
        answer: responseContent,
      };

      try {
        await axios.post(historyUrl, body);
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
  };

  // Handle feedback submission
  const handleFeedback = async (isCorrect, message) => {
    const feedbackUrl = 'https://feedbackapi.motivationkaksha.xyz/feedback';
    const body = {
      userId: localStorage.getItem('userId'),
      question: message.content,
      response: message.content,
      isCorrect,
    };

    try {
      const response = await axios.post(feedbackUrl, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert(`Feedback recorded: ${isCorrect ? 'Correct' : 'Incorrect'}`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error recording feedback.');
    }
  };

  // Render message content with feedback buttons
  const renderMessageContent = (message, index) => (
    <div>
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeMathjax]}>
        {message.content}
      </ReactMarkdown>
      {message.role === 'assistant' && index === messages.length - 1 && (
        <div className="flex mt-2">
          <button
            onClick={() => handleFeedback(true, message)}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Correct
          </button>
          <button
            onClick={() => handleFeedback(false, message)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Incorrect
          </button>
        </div>
      )}
    </div>
  );

  return (
    <MathJaxContext>
      <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-r from-gray-700 to-gray-900 p-4">
        {/* Header */}
        <div className="w-full flex items-start justify-between mb-4 fixed top-0 p-2 bg-gray-800">
          <img src="https://i.ibb.co/5RF1Xmj/motivation-kaksha-ai.png" className="w-28 h-8 ml-2 sm:ml-4" alt="logo" />
          <DropDownMenu />
        </div>

        {/* Chat Messages */}
        <div className="flex-grow w-full max-w-3xl overflow-y-auto p-4 mt-16 sm:mt-20">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 ${message.role === 'user' ? 'text-right bg-gray-600' : 'text-left bg-gray-700'} m-2 rounded-xl text-white`}
            >
              {renderMessageContent(message, index)}
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="w-full max-w-2xl flex items-center bg-gray-500 p-2 rounded-lg shadow-lg">
          <input
            className="flex-grow bg-white p-2 rounded-full text-gray-800"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kaksha AI..."
          />
          <button className="bg-white p-2 rounded-full ml-2" onClick={handleSend}>
            <img src="https://cdn-icons-png.flaticon.com/512/15680/15680374.png" className="w-5 h-5" alt="send" />
          </button>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default Ai;
