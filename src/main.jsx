import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Ai from './component/Ai';
import Profile from './component/Profile';
import LogOut from './component/LogoutButton';
import Signup from './component/Signup';
import Login from './component/Login';
import Contributors from './component/Contributors';
import LoadingPage from './component/LoadingPage';
import Chat from './component/Ai2';



const router = createBrowserRouter([
  {
    path: "/",
    element: <LoadingPage />,
  },
  {
    path: "/ai",
    element: <Ai />,
  },
  
  {
    path: "/login",
    element: <Login />,
  },{
    path: "/profile",
    element: <Profile />,
  },{
    path: "/logout",
    element: <LogOut />,
  },{
    path: "/signup",
    element: <Signup />,
  },{
    path: "/contributors",
    element: <Contributors />,
  },{
    path: "/ai2",
    element: <Chat />,
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>  
    <RouterProvider router={router} />
  </StrictMode>,
)
