import  { useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state/index";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  Menu,
  X,
  Home,
  User,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
    { icon: <Users size={20} />, label: "Circles", action: () => navigate("/circles") },
    { icon: <Sparkles size={20} />, label: "Discover", action: () => navigate("/discover") },
  ];

  const userMenuItems = [
    { icon: <User size={18} />, label: "My Profile", action: () => navigate(`/profile/${user._id}`) },
    { icon: <Settings size={18} />, label: "Settings", action: () => navigate("/settings") },
    { icon: <HelpCircle size={18} />, label: "Help & Support", action: () => {} },
    { icon: <LogOut size={18} />, label: "Logout", action: handleLogout, danger: true },
  ];

  const notifications = [
    { id: 1, text: "John liked your post", time: "2m ago", read: false },
    { id: 2, text: "Sarah added you to a circle", time: "1h ago", read: false },
    { id: 3, text: "New feature available", time: "3h ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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

              {/* Messages */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all">
                <MessageCircle size={18} />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50">
                      <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">Notifications</h3>
                          <button className="text-sm text-rose-400 hover:text-rose-300">
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer ${
                              !notification.read ? "bg-rose-500/5" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-100">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

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
                            className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm transition-all ${
                              item.danger
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

{/* Mobile Menu - Professional & Wider */}
{isMobileMenuToggled && (
  <div className="fixed inset-0 z-50 md:hidden">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/90 backdrop-blur-[100px]"
      onClick={() => setIsMobileMenuToggled(false)}
    />

    {/* Main Menu Container - Wider (85% of screen) */}
    <div className="absolute right-0 top-0 h-full w-[85vw] max-w-md
      bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-black/10 
      border-l border-gray-800/25 
      shadow-2xl 
      backdrop-blur-[60px]">
      
      {/* Header - Professional Typography */}
      <div className="border-b border-gray-800/25 p-5 
        bg-gradient-to-r from-gray-900/20 to-black/20 
        backdrop-blur-[40px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl 
              bg-gradient-to-br from-rose-500/75 to-red-600/75 
              backdrop-blur-[35px] 
              shadow-xl shadow-rose-900/25">
              <span className="text-sm font-bold tracking-wider text-white">
                EC
              </span>
            </div>
            <div className="bg-gradient-to-r from-gray-900/20 to-transparent 
              rounded-xl px-4 py-2.5 
              backdrop-blur-[35px]">
              <h2 className="text-lg font-semibold text-white font-sans">Menu</h2>
              <p className="text-xs text-gray-400/80 font-sans tracking-wide">EchoCircle</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuToggled(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl 
              border border-gray-800/25 
              bg-gray-900/25 
              text-gray-300 
              hover:text-white 
              hover:bg-gray-800/35 
              backdrop-blur-[35px] 
              transition-all duration-200"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* User Info - Professional Layout */}
      <div className="border-b border-gray-800/25 p-5 
        bg-gradient-to-r from-gray-900/20 via-gray-900/15 to-transparent 
        backdrop-blur-[40px]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full 
            bg-gradient-to-r from-rose-500/75 to-red-600/75 
            backdrop-blur-[35px] 
            shadow-xl shadow-rose-900/25">
            <span className="text-xl font-semibold text-white font-sans">
              {user.firstName?.[0]}
            </span>
          </div>
          <div className="flex-1 bg-gradient-to-r from-gray-900/20 to-transparent 
            rounded-xl px-4 py-3 
            backdrop-blur-[35px]">
            <h3 className="text-base font-semibold text-white font-sans leading-tight">{fullName}</h3>
            <p className="text-sm text-gray-400/80 font-sans mt-1 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation - Professional Menu Items */}
      <div className="p-5 space-y-3 backdrop-blur-[40px]">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              item.action();
              setIsMobileMenuToggled(false);
            }}
            className="flex items-center gap-4 w-full p-4 rounded-xl 
              text-gray-300 hover:text-white 
              transition-all duration-200
              bg-gradient-to-r from-gray-900/20 via-gray-900/15 to-transparent 
              border border-gray-800/25 
              hover:border-gray-700/35
              hover:bg-gradient-to-r hover:from-gray-800/30 hover:via-gray-800/20 hover:to-transparent
              backdrop-blur-[35px]
              active:scale-[0.98]
              shadow-lg shadow-black/25"
          >
            <div className="text-rose-400/85 backdrop-blur-[25px]">
              {React.cloneElement(item.icon, { size: 22 })}
            </div>
            <span className="font-medium text-white/90 font-sans text-base">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Actions - Professional Settings Items */}
      <div className="p-5 space-y-3 border-t border-gray-800/25 backdrop-blur-[40px]">
        <button
          onClick={() => {
            dispatch(setMode());
            setIsMobileMenuToggled(false);
          }}
          className="flex items-center gap-4 w-full p-4 rounded-xl 
            text-gray-300 hover:text-white 
            transition-all duration-200
            bg-gradient-to-r from-gray-900/20 via-gray-900/15 to-transparent 
            border border-gray-800/25 
            hover:border-gray-700/35
            hover:bg-gradient-to-r hover:from-gray-800/30 hover:via-gray-800/20 hover:to-transparent
            backdrop-blur-[35px]
            active:scale-[0.98]
            shadow-lg shadow-black/25"
        >
          <div className="text-rose-400/85 backdrop-blur-[25px]">
            {document.documentElement.classList.contains("dark") ? (
              <Sun size={22} />
            ) : (
              <Moon size={22} />
            )}
          </div>
          <span className="font-medium text-white/90 font-sans text-base">Toggle Theme</span>
        </button>

        <button 
          className="flex items-center gap-4 w-full p-4 rounded-xl 
            text-gray-300 hover:text-white 
            transition-all duration-200
            bg-gradient-to-r from-gray-900/20 via-gray-900/15 to-transparent 
            border border-gray-800/25 
            hover:border-gray-700/35
            hover:bg-gradient-to-r hover:from-gray-800/30 hover:via-gray-800/20 hover:to-transparent
            backdrop-blur-[35px]
            active:scale-[0.98]
            shadow-lg shadow-black/25"
        >
          <div className="text-rose-400/85 backdrop-blur-[25px]">
            <Settings size={22} />
          </div>
          <span className="font-medium text-white/90 font-sans text-base">Settings</span>
        </button>

        <button 
          className="flex items-center gap-4 w-full p-4 rounded-xl 
            text-gray-300 hover:text-white 
            transition-all duration-200
            bg-gradient-to-r from-gray-900/20 via-gray-900/15 to-transparent 
            border border-gray-800/25 
            hover:border-gray-700/35
            hover:bg-gradient-to-r hover:from-gray-800/30 hover:via-gray-800/20 hover:to-transparent
            backdrop-blur-[35px]
            active:scale-[0.98]
            shadow-lg shadow-black/25"
        >
          <div className="text-rose-400/85 backdrop-blur-[25px]">
            <HelpCircle size={22} />
          </div>
          <span className="font-medium text-white/90 font-sans text-base">Help & Support</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full p-4 rounded-xl 
            text-red-400 hover:text-red-300 
            transition-all duration-200
            bg-gradient-to-r from-red-900/10 via-red-900/8 to-transparent 
            border border-red-800/20 
            hover:border-red-700/30
            hover:bg-gradient-to-r hover:from-red-800/20 hover:via-red-800/12 hover:to-transparent
            backdrop-blur-[35px]
            active:scale-[0.98]
            shadow-lg shadow-black/25"
        >
          <div className="text-red-400/85 backdrop-blur-[25px]">
            <LogOut size={22} />
          </div>
          <span className="font-medium text-red-300/90 font-sans text-base">Logout</span>
        </button>
      </div>
    </div>
  </div>
)}
    </header>
  );
};

export default Navbar;