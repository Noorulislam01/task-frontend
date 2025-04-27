import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
const navigate=useNavigate()
  // Check if token is in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate("/login")
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate('/login'); // Redirect to login page
  };

  // Handle profile icon click to toggle menu
  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* App Name */}
        <h1 className="text-white text-xl sm:text-2xl font-bold">Task Trackers</h1>

        {/* User Icon */}
        {isLoggedIn && (
          <div className="relative">
            <FaUserCircle
              className="text-white text-3xl cursor-pointer"
              onClick={handleProfileClick}
            />

            {/* Profile Options Menu */}
            {showMenu && (
  <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg p-2 w-40 z-50">
    <button
      onClick={() => navigate('/profile')}
      className="w-full text-left text-gray-700 py-2 px-4 hover:bg-gray-200"
    >
      View Profile
    </button>
    <button
      onClick={handleLogout}
      className="w-full text-left text-red-500 py-2 px-4 hover:bg-gray-200"
    >
      Logout
    </button>
  </div>
)}

          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
