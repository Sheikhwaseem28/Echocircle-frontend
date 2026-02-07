import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import UserWidget from "../../scenes/widgets/UserWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import { Home, User, Users, Bell, Search, Plus, MessageSquare, Sparkles } from "lucide-react";

const HomePage = () => {
  const { _id, picturePath, firstName, lastName } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  const quickActions = [
    { icon: <Plus size={18} />, label: "New Echo", action: () => { } },
    { icon: <Users size={18} />, label: "Friends", action: () => navigate("/friends") },
    { icon: <MessageSquare size={18} />, label: "Messages", action: () => { } },
    { icon: <Bell size={18} />, label: "Notifications", action: () => { } },
  ];

  const navigationTabs = [
    { id: "home", icon: <Home size={20} />, label: "Home" },
    { id: "profile", icon: <User size={20} />, label: "Profile" },
    { id: "discover", icon: <Sparkles size={20} />, label: "Discover" },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Enhanced Background with Mobile Optimization */}
      <div className="fixed inset-0 -z-10">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />

        {/* Subtle pattern overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />

        {/* Gradient accents (mobile-optimized) */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-rose-900/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />

        {/* Subtle radial gradients for depth */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Fixed Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 pb-20 pt-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar - Profile & Quick Actions (Hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate(`/profile/${_id}`)}
              >
                <div className="relative">
                  <img
                    src={picturePath || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="h-14 w-14 rounded-xl object-cover border-2 border-rose-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-900"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-sm text-gray-400">View profile</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-gray-800/30">
                  <div className="font-bold text-white">12</div>
                  <div className="text-xs text-gray-400">Echoes</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-800/30">
                  <div className="font-bold text-white">47</div>
                  <div className="text-xs text-gray-400">Friends</div>
                </div>
                <div className="p-2 rounded-lg bg-gray-800/30">
                  <div className="font-bold text-white">3</div>
                  <div className="text-xs text-gray-400">Circles</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6">
              <h4 className="font-medium text-gray-300 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-300 hover:bg-gray-800/40 hover:text-white transition-all"
                  >
                    <div className="text-rose-400">{action.icon}</div>
                    <span className="text-sm">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Mobile Profile Header */}
            <div className="lg:hidden rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/profile/${_id}`)}
                >
                  <div className="relative">
                    <img
                      src={picturePath || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="h-12 w-12 rounded-xl object-cover border-2 border-rose-500/30"
                    />
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {firstName} {lastName}
                    </h3>
                    <p className="text-xs text-gray-400">View profile</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-gray-800/40 text-gray-300">
                    <Search size={18} />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800/40 text-gray-300">
                    <Bell size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-2">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 rounded-xl flex-1 justify-center transition-all ${activeTab === tab.id
                      ? "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-white border border-rose-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                    }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Create Post */}
            <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-4 sm:p-6">
              <MyPostWidget picturePath={picturePath} />
            </div>

            {/* Posts Feed */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-white">Latest Echoes</h2>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                  <Sparkles size={14} className="sm:size-4" />
                  <span>From your circles</span>
                </div>
              </div>
              <PostsWidget userId={_id} />
            </div>
          </main>

          {/* Right Sidebar (Hidden on mobile) */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            {/* Friends List */}
            <div className="rounded-2xl border border-gray-800/50 bg-gray-900/30 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-white">Your Circles</h4>
                <button className="text-sm text-rose-400 hover:text-rose-300">
                  See all
                </button>
              </div>
              <FriendListWidget userId={_id} />
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800/50 bg-black/95 backdrop-blur-xl lg:hidden z-50">
        <div className="flex justify-around items-center p-3">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center p-2 min-w-[60px] ${activeTab === tab.id ? "text-rose-400" : "text-gray-400"
                }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
          <button className="flex flex-col items-center p-2 min-w-[60px] text-gray-400">
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </button>
        </div>
      </div>

      {/* Mobile Quick Actions FAB */}
      <button className="lg:hidden fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-rose-900/50 flex items-center justify-center">
        <Plus size={24} className="text-white" />
      </button>
    </div>
  );
};

export default HomePage;