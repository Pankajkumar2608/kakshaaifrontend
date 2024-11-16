import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Ai from './component/Ai';
import Login from './component/LoginModal';

import Profile from './component/Profile';
import LogOut from './component/LogoutButton';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ai" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ai" element={<Ai />} />
        <Route path="/profile" element={<Profile />} />
        <Route path= "/logout" element={<LogOut />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;

