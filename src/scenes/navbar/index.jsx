import { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state/index";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fullName = `${user.firstName} ${user.lastName}`;

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  const navItems = [
    { icon: <Home size={20} />, label: "Home", action: () => navigate("/home") },
    { icon: <User size={20} />, label: "Profile", action: () => navigate(`/profile/${user._id}`) },
  ];

  const userMenuItems = [
    { icon: <User size={18} />, label: "My Profile", action: () => navigate(`/profile/${user._id}`) },
    { icon: <LogOut size={18} />, label: "Logout", action: handleLogout, danger: true },
  ];



  return (
    <header className="sticky top-0 z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-shadow">
                <span className="text-sm font-bold tracking-wider text-white">
                  EC
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
                EchoCircle
              </h1>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/30 transition-all text-sm font-medium"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search EchoCircle..."
                className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(setMode())}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all"
              >
                {document.documentElement.classList.contains("dark") ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>


              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 px-3 py-2 hover:bg-gray-800/50 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold">
                    {user.firstName?.[0]}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-white">{fullName}</p>
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400 group-hover:text-white" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-semibold">
                            {user.firstName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{fullName}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        {userMenuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              item.action();
                              setShowUserMenu(false);
                            }}
                            className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm transition-all ${item.danger
                              ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                              }`}
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuToggled(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="border-t border-gray-800/50 px-4 py-3 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search EchoCircle..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optimized for Mobile */}
      {isMobileMenuToggled && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop with smooth fade */}
          <div
            className="absolute inset-0 bg-black/80 transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsMobileMenuToggled(false)}
          />

          {/* Main Menu Container - Slide in animation */}
          <div className="absolute right-0 top-0 h-[65vh] w-full max-w-xs
      bg-gradient-to-b from-gray-950 via-black to-gray-950
      border-x border-gray-800/50
      shadow-2xl shadow-black/50
      animate-slideInRight
      flex flex-col">

            {/* Header - Compact design */}
            <div className="border-b border-gray-800/50 p-4 bg-black/80 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg 
              bg-gradient-to-br from-rose-500 to-pink-600
              shadow-lg shadow-rose-900/30">
                    <span className="text-xs font-bold text-white">
                      EC
                    </span>
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white font-sans">Menu</h2>
                    <p className="text-[10px] text-gray-400 font-sans tracking-wider">EchoCircle</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuToggled(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg 
              border border-gray-800 
              bg-gray-900/80 
              text-gray-400 
              hover:text-white 
              hover:bg-gray-800
              hover:border-gray-700
              transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable content area - Fixed height with proper scroll */}
            <div className="flex-1 overflow-y-auto">
              {/* User Info - Compact */}
              <div className="border-b border-gray-800/50 p-4 bg-black/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full 
              bg-gradient-to-r from-rose-500 to-pink-600
              shadow-lg shadow-rose-900/30">
                    <span className="text-sm font-semibold text-white font-sans">
                      {user.firstName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white font-sans truncate">{fullName}</h3>
                    <p className="text-xs text-gray-400 font-sans truncate mt-0.5">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Combined Navigation - Compact layout */}
              <div className="p-4 space-y-2 pb-20"> {/* Added bottom padding for logout */}
                {/* Main Navigation Items */}
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setIsMobileMenuToggled(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-lg 
                text-gray-300 hover:text-white 
                transition-all duration-200
                bg-gray-900/50
                border border-gray-800/50 
                hover:border-rose-500/30
                hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-900/50
                active:scale-[0.98]"
                  >
                    <div className="text-rose-400">
                      {React.cloneElement(item.icon, { size: 18 })}
                    </div>
                    <span className="text-sm font-medium text-white/90 font-sans">{item.label}</span>
                  </button>
                ))}

                {/* Settings & Actions - Smaller buttons */}
                <div className="pt-2 space-y-2">
                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      dispatch(setMode());
                      setIsMobileMenuToggled(false);
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-lg 
                text-gray-300 hover:text-white 
                transition-all duration-200
                bg-gray-900/50
                border border-gray-800/50 
                hover:border-amber-500/30
                active:scale-[0.98]"
                  >
                    <div className="text-amber-400">
                      {document.documentElement.classList.contains("dark") ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </div>
                    <span className="text-sm font-medium text-white/90 font-sans">Theme</span>
                  </button>


                </div>
              </div>
            </div>

            {/* Fixed Logout Button at Bottom - Always Visible */}
            <div className="border-t border-gray-800/50 p-4 bg-black/80 flex-shrink-0">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full p-3 rounded-lg 
            text-red-400 hover:text-red-300 
            transition-all duration-200
            bg-gradient-to-r from-red-900/20 to-red-900/10
            border border-red-800/50 
            hover:border-red-600
            hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-900/20
            active:scale-[0.98]"
              >
                <div className="text-red-400">
                  <LogOut size={18} />
                </div>
                <span className="text-sm font-medium text-red-300 font-sans">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;