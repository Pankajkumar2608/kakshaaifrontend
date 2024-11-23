import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


function DropDownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDropdown = () => setIsOpen(!isOpen);
    


    return (
        <div className="relative inline-block text-left">
          
            <div
                className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                onClick={toggleDropdown}
            >
                P
            </div>

            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/profile", { replace: true })}>Profile</div>
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/contributors", { replace: true })}>Contributors</div>
                    <div className="px-4 py-2 hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/logout", { replace: true })}>Logout</div>
                </div>
            )}
        </div>
    );
}

export default DropDownMenu;

