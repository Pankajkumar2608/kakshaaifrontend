import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginModal from './component/LoginModal';  
import Ai from './component/Ai';
import Profile from './component/Profile';
import LogOut from './component/LogoutButton';



const router = createBrowserRouter([
  {
    path: "/",
    element: < Ai/>,
  },
  {
    path: "/ai",
    element: <Ai />,
  },
  {
    path: "/login",
    element: <LoginModal />,
  },{
    path: "/profile",
    element: <Profile />,
  },{
    path: "/logout",
    element: <LogOut />,
  },
  
  

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <RouterProvider router={router} />
  </StrictMode>,
)
