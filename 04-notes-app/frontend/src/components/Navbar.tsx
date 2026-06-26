import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FileText className="h-6 w-6 text-blue-400" />
            <span>Markdown Notes</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="flex items-center text-sm text-gray-300">
                  <User className="h-4 w-4 mr-1" />
                  {user?.username}
                  {user?.role === 'ADMIN' && (
                    <span className="ml-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded font-medium">
                      ADMIN
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
