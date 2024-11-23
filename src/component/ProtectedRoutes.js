import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoutes(props) {
    const component = props;
    const navigate = useNavigate();
    
  return (
    <div>ProtectedRoutes</div>
  )
}



export default ProtectedRoutes
