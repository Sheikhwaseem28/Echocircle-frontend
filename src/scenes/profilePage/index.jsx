import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import { User, Settings, Calendar, MapPin, Briefcase, Mail, Edit, MoreVertical, Camera, Grid, List, Bookmark, Home, ChevronLeft } from "lucide-react";
import { MessageSquare, UserPlus } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // Changed back to "posts"
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isOwnProfile = currentUser?._id === userId;

  const tabs = [
    { id: "posts", icon: <Grid size={16} className="sm:w-4 sm:h-4" />, label: "Posts" }, // Changed from "Echoes" to "Posts"
    { id: "about", icon: <User size={16} className="sm:w-4 sm:h-4" />, label: "About" },
    { id: "friends", icon: <User size={16} className="sm:w-4 sm:h-4" />, label: "Friends" },
    { id: "media", icon: <Camera size={16} className="sm:w-4 sm:h-4" />, label: "Media" },
  ];

  const getUser = async () => {
    try {
      const response = await fetch(
        `https://echocircle-backend.vercel.app/users/${userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  if (!user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-gray-100">
      {/* Navigation - Responsive */}
      <Navbar />

      {/* Back Button for Mobile */}
      <button 
        onClick={() => navigate(-1)}
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Profile Header */}
      <div className="relative pt-4 lg:pt-0">
        {/* Cover Photo - Responsive Height */}
        <div className="h-32 sm:h-40 md:h-48 lg:h-64 bg-gradient-to-r from-rose-900/20 via-red-900/20 to-pink-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {isOwnProfile && (
            <button className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-black/70 transition-all">
              <Edit size={14} className="inline mr-1 sm:mr-2 sm:w-4 sm:h-4" />
              Edit Cover
            </button>
          )}
        </div>

        {/* Profile Info - Responsive */}
        <div className="relative -mt-12 sm:-mt-16 mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4 sm:gap-6">
            {/* Profile Image - Responsive Sizing */}
            <div className="relative ml-3 sm:ml-4">
              <img
                src={user.picturePath || "https://via.placeholder.com/150"}
                alt={user.firstName}
                className="h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 rounded-xl sm:rounded-2xl border-4 border-gray-900 object-cover shadow-xl sm:shadow-2xl"
              />
              {isOwnProfile && (
                <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-rose-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-rose-600 transition-all">
                  <Camera size={12} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>

            {/* Profile Details - Responsive */}
            <div className="flex-1 space-y-2 sm:space-y-3 px-3 sm:px-0">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">@{user.firstName?.toLowerCase()}</p>
                </div>
                
                {/* Action Buttons - Responsive Stacking */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {isOwnProfile ? (
                    <>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700/50 transition-all text-xs sm:text-sm">
                        <Settings size={14} className="inline mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                        Edit Profile
                      </button>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg text-white hover:shadow-lg hover:shadow-red-500/25 transition-all text-xs sm:text-sm">
                        Share Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg text-white hover:shadow-lg hover:shadow-red-500/25 transition-all text-xs sm:text-sm flex items-center">
                        <MessageSquare size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                        Message
                      </button>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700/50 transition-all text-xs sm:text-sm flex items-center">
                        <UserPlus size={14} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                        Add Friend
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats - Responsive */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-white">47</span>
                  <span className="text-gray-400">Friends</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-white">12</span>
                  <span className="text-gray-400">Posts</span> {/* Changed from "Echoes" to "Posts" */}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-semibold text-white">3</span>
                  <span className="text-gray-400">Circles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Left Sidebar - Hidden on mobile unless in tab view */}
          <aside className={`lg:col-span-1 space-y-4 sm:space-y-6 ${activeTab === 'about' || activeTab === 'friends' ? 'block' : 'hidden lg:block'}`}>
            {/* About Card */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">About</h3>
              <div className="space-y-3 sm:space-y-4">
                {user.location && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MapPin size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-300">Lives in</p>
                      <p className="text-white text-sm sm:text-base truncate">{user.location}</p>
                    </div>
                  </div>
                )}
                {user.occupation && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Briefcase size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-300">Works as</p>
                      <p className="text-white text-sm sm:text-base truncate">{user.occupation}</p>
                    </div>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail size={16} className="sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-300">Email</p>
                      <p className="text-white text-sm sm:text-base truncate">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Friends Widget - Only show on lg or when friends tab active */}
            {(activeTab === 'friends' || window.innerWidth >= 1024) && (
              <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Friends</h3>
                  <button 
                    onClick={() => navigate(`/profile/${userId}/friends`)}
                    className="text-xs sm:text-sm text-rose-400 hover:text-rose-300"
                  >
                    See all
                  </button>
                </div>
                <FriendListWidget userId={userId} />
              </div>
            )}

            {/* Photos Widget */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="font-semibold text-white text-sm sm:text-base">Photos</h3>
                <button className="text-xs sm:text-sm text-rose-400 hover:text-rose-300">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-800/50"></div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Responsive width */}
          <main className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Tabs - Responsive */}
            <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm overflow-hidden">
              <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-800/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-white border-b-2 border-rose-500 bg-gradient-to-t from-rose-500/10 to-transparent"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {activeTab === "posts" && (
                  <div className="space-y-4 sm:space-y-6">
                    {isOwnProfile && (
                      <div className="mb-4 sm:mb-6">
                        <MyPostWidget picturePath={user.picturePath} />
                      </div>
                    )}
                    <PostsWidget userId={userId} isProfile />
                  </div>
                )}
                {activeTab === "about" && (
                  <UserWidget userId={userId} picturePath={user.picturePath} />
                )}
                {activeTab === "friends" && (
                  <FriendListWidget userId={userId} />
                )}
                {activeTab === "media" && (
                  <div className="text-center py-8">
                    <Camera className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No media yet</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile */}
          <aside className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* User Widget */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
              <UserWidget userId={userId} picturePath={user.picturePath} />
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
              <h3 className="font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-rose-400"></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-300">
                        Liked a post in <span className="text-rose-400">Tech Circle</span>
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Desktop Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="hidden lg:block fixed top-24 left-8 z-20 p-3 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Add scrollbar hiding utility to your CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import Navbar from "../../scenes/navbar";
// import FriendListWidget from "../../scenes/widgets/FriendListWidget";
// import MyPostWidget from "../../scenes/widgets/MyPostWidget";
// import PostsWidget from "../../scenes/widgets/PostsWidget";
// import UserWidget from "../../scenes/widgets/UserWidget";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const { userId } = useParams();
//   const token = useSelector((state) => state.token);

//   const getUser = async () => {
//     try {
//       const response = await fetch(
//         `https://echocircle-backend.vercel.app/users/${userId}`,
//         {
//           method: "GET",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       setUser(data);
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//     }
//   };

//   useEffect(() => {
//     getUser();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-black text-neutral-100">
//       <Navbar />

//       <main className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
//         {/* Header strip */}
//         <header className="mb-4 border-b border-red-900/60 pb-3">
//           <h1 className="text-lg font-semibold text-neutral-50">
//             {user.firstName} {user.lastName}
//           </h1>
//           <p className="text-xs text-neutral-500">
//             {user.location || "Profile overview"}
//           </p>
//         </header>

//         {/* Layout: mobile single column, desktop 2 columns */}
//         <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr,1.7fr]">
//           {/* Left column: user + friends */}
//           <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
//             <UserWidget userId={userId} picturePath={user.picturePath} />
//             <FriendListWidget userId={userId} />
//           </aside>

//           {/* Right column: posts */}
//           <section className="space-y-4">
//             {/* Only show MyPostWidget if viewing own profile */}
//             <MyPostWidget picturePath={user.picturePath} />
//             <PostsWidget userId={userId} isProfile />
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ProfilePage;


// import { Box, useMediaQuery } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import Navbar from "../../scenes/navbar/index";
// import FriendListWidget from "../../scenes/widgets/FriendListWidget";
// import MyPostWidget from "../../scenes/widgets/MyPostWidget";
// import PostsWidget from "../../scenes/widgets/PostsWidget";
// import UserWidget from "../../scenes/widgets/UserWidget";

// const ProfilePage = () => {
//   const [user, setUser] = useState(null);
//   const { userId } = useParams();
//   const token = useSelector((state) => state.token);
//   const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

//   const getUser = async () => {
//     const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}`, {
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await response.json();
//     setUser(data);
//   };

//   useEffect(() => {
//     getUser();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   if (!user) return null;

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreens ? "flex" : "block"}
//         gap="2rem"
//         justifyContent="center"
//       >
//         <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
//           <UserWidget userId={userId} picturePath={user.picturePath} />
//           <Box m="2rem 0" />
//           <FriendListWidget userId={userId} />
//         </Box>
//         <Box
//           flexBasis={isNonMobileScreens ? "42%" : undefined}
//           mt={isNonMobileScreens ? undefined : "2rem"}
//         >
//           <MyPostWidget picturePath={user.picturePath} />
//           <Box m="2rem 0" />
//           <PostsWidget userId={userId} isProfile />
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ProfilePage;