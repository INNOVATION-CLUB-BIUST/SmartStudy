import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BookOpen,
  Calendar,
  BarChart,
  Target,
  Clock,
  HelpCircle
} from 'lucide-react';
import { signOut } from '../../services/auth';
import { useUser } from '../../hooks/useUser';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const userName = user?.firstName || 'Student';

  const handleLogout = () => {
    // Handle logout logic - use firebase sighout and remove localstorage
    signOut();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('refreshToken');
    

    navigate('/');
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BookOpen },
    { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
    { name: 'Goals', href: '/dashboard/goals', icon: Target },
    { name: 'Study Time', href: '/dashboard/study-time', icon: Clock },
  ];

  return (
    <header className="bg-black/90 backdrop-blur-md shadow-lg border-b border-orange-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side: Logo + Welcome */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Bot className="h-6 w-6 text-black" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  SmartStudy
                </span>
                <span className="text-[10px] text-orange-300">by BIUST Innovation Club</span>
              </div>
            </Link>

            {/* Welcome Message */}
            <div className="hidden lg:block border-l border-slate-700 pl-6">
              <h2 className="text-lg font-semibold text-white">
                Welcome back, <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">{userName}</span>!
              </h2>
              <p className="text-xs text-slate-400">Ready to make today productive?</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Help & Support */}
            <Link to="/dashboard/help" className="hidden md:block p-2 text-slate-300 hover:text-orange-400 transition-colors duration-300">
              <HelpCircle className="h-5 w-5" />
            </Link>

            {/* Settings */}
            <Link to="/dashboard/settings" className="hidden md:block p-2 text-slate-300 hover:text-orange-400 transition-colors duration-300">
              <Settings className="h-5 w-5" />
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-slate-300 hover:text-orange-400 transition-colors duration-300">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-black" />
                </div>
                <span className="hidden md:block text-sm text-slate-300">{userName}</span>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-orange-500/20 py-2 z-50">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-orange-400 transition-colors duration-300"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-orange-400 transition-colors duration-300"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-red-400 transition-colors duration-300 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-orange-400 transition-colors duration-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-orange-500/20 py-4">
            {/* Mobile Welcome Message */}
            <div className="px-4 py-3 mb-3 bg-slate-800/50 rounded-lg border border-orange-500/20">
              <p className="text-sm font-semibold text-white">
                Welcome back, <span className="text-orange-400">{userName}</span>!
              </p>
              <p className="text-xs text-slate-400 mt-1">Ready to make today productive?</p>
            </div>

            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 px-4 py-2 text-slate-300 hover:text-orange-400 hover:bg-slate-800/50 rounded-lg transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
