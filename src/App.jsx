import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Ai from './component/Ai';
import Login from './component/Login';
import Profile from './component/Profile';
import LogOut from './component/LogoutButton';
import Signup from './component/Signup';
import LoadingPage from './component/LoadingPage';
import Chat from './component/Ai2';


function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Navigate to="/LoadingPage" />} />
        <Route path="/LoadingPage" element={<LoadingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/ai" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path= "/logout" element={<LogOut />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;

