
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import { User, Settings, Calendar, MapPin, Briefcase, Mail, Edit, MoreVertical, Camera, Grid, List, Bookmark } from "lucide-react";
import { MessageSquare, UserPlus } from "lucide-react";


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isOwnProfile = currentUser?._id === userId;

  const tabs = [
    { id: "posts", icon: <Grid size={18} />, label: "Echoes" },
    { id: "about", icon: <User size={18} />, label: "About" },
    { id: "friends", icon: <User size={18} />, label: "Friends" },
    { id: "media", icon: <Camera size={18} />, label: "Media" },
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
      {/* Navigation */}
      <Navbar />

      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 lg:h-64 bg-gradient-to-r from-rose-900/20 via-red-900/20 to-pink-900/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-black/70 transition-all">
              <Edit size={16} className="inline mr-2" />
              Edit Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={user.picturePath || "https://via.placeholder.com/150"}
                alt={user.firstName}
                className="h-32 w-32 lg:h-40 lg:w-40 rounded-2xl border-4 border-gray-900 object-cover shadow-2xl"
              />
              {isOwnProfile && (
                <button className="absolute bottom-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all">
                  <Camera size={16} />
                </button>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-400 mt-1">@{user.firstName?.toLowerCase()}</p>
                </div>
                <div className="flex gap-3">
                  {isOwnProfile ? (
                    <>
                      <button className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700/50 transition-all">
                        <Settings size={18} className="inline mr-2" />
                        Edit Profile
                      </button>
                      <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg text-white hover:shadow-lg hover:shadow-red-500/25 transition-all">
                        Share Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg text-white hover:shadow-lg hover:shadow-red-500/25 transition-all">
                        <MessageSquare size={18} className="inline mr-2" />
                        Message
                      </button>
                      <button className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg text-white hover:bg-gray-700/50 transition-all">
                        <UserPlus size={18} className="inline mr-2" />
                        Add Friend
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">47</span>
                  <span className="text-gray-400">Friends</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">12</span>
                  <span className="text-gray-400">Echoes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">3</span>
                  <span className="text-gray-400">Circles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* About Card */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
              <h3 className="font-semibold text-white mb-4">About</h3>
              <div className="space-y-4">
                {user.location && (
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-300">Lives in</p>
                      <p className="text-white">{user.location}</p>
                    </div>
                  </div>
                )}
                {user.occupation && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-300">Works as</p>
                      <p className="text-white">{user.occupation}</p>
                    </div>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-300">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Friends Widget */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Friends</h3>
                <button 
                  onClick={() => navigate(`/profile/${userId}/friends`)}
                  className="text-sm text-rose-400 hover:text-rose-300"
                >
                  See all
                </button>
              </div>
              <FriendListWidget userId={userId} />
            </div>

            {/* Photos Widget */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">Photos</h3>
                <button className="text-sm text-rose-400 hover:text-rose-300">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-gray-800/50"></div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm overflow-hidden">
              <div className="flex border-b border-gray-800/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all flex-1 justify-center ${
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
              <div className="p-6">
                {activeTab === "posts" && (
                  <div className="space-y-6">
                    {isOwnProfile && (
                      <div className="mb-6">
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
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
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