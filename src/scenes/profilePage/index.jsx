import { Box, useMediaQuery, CircularProgress, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar/index";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import {
  User,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Link,
  Edit,
  Camera,
  ChevronRight,
  Home,
  Grid,
  MoreVertical,
  Share2,
  Bell,
  MessageSquare,
} from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState("grid");
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isTablet = useMediaQuery("(min-width:768px)");

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <Box className="flex items-center justify-center min-h-[60vh]">
          <CircularProgress size={60} />
        </Box>
      </Box>
    );
  }

  if (!user) return null;

  const isOwnProfile = currentUser._id === userId;
  const tabs = [
    { id: "posts", label: "Posts", count: user.posts?.length || 0 },
    { id: "friends", label: "Friends", count: user.friends?.length || 0 },
    { id: "photos", label: "Photos", count: 24 },
    { id: "about", label: "About" },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Box className="w-full px-4 py-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <Home size={16} />
            <ChevronRight size={14} />
            <span className="text-sm">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-sm">Profiles</span>
            <ChevronRight size={14} />
            <span className="text-sm font-medium text-gray-600">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-6 md:left-8">
              <div className="relative">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl border-4 border-white bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg overflow-hidden">
                  <img 
                    src={user.picturePath} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                          <span class="text-4xl font-bold text-blue-600">
                            ${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}
                          </span>
                        </div>
                      `;
                    }}
                  />
                </div>
                {isOwnProfile && (
                  <IconButton className="absolute bottom-2 right-2 bg-white hover:bg-gray-100 shadow-md">
                    <Camera size={18} />
                  </IconButton>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute right-6 md:right-8 bottom-6 flex items-center gap-3">
              {isOwnProfile ? (
                <>
                  <button className="px-4 py-2 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
                    <Edit size={16} />
                    Edit Profile
                  </button>
                  <IconButton className="bg-white hover:bg-gray-100">
                    <MoreVertical size={20} />
                  </IconButton>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <MessageSquare size={16} />
                    Message
                  </button>
                  <button className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Users size={16} />
                    Add Friend
                  </button>
                  <IconButton className="bg-white hover:bg-gray-100">
                    <MoreVertical size={20} />
                  </IconButton>
                </>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 md:pt-24 pb-6 px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  {isOwnProfile && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      You
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  {user.occupation && (
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      <span>{user.occupation}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Joined March 2024</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {user.friends?.length || 0}
                    </span>
                    <span className="text-gray-600">Friends</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {user.posts?.length || 0}
                    </span>
                    <span className="text-gray-600">Posts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      156
                    </span>
                    <span className="text-gray-600">Following</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <IconButton className="bg-gray-100 hover:bg-gray-200 rounded-xl">
                  <Share2 size={18} />
                </IconButton>
                {!isOwnProfile && (
                  <IconButton className="bg-gray-100 hover:bg-gray-200 rounded-xl">
                    <Bell size={18} />
                  </IconButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Friends */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Widget Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={18} />
                  Profile Information
                </h3>
              </div>
              <div className="p-6">
                <UserWidget userId={userId} picturePath={user.picturePath} />
              </div>
            </div>

            {/* Friends Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users size={18} />
                    Friends
                  </h3>
                  <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {user.friends?.length || 0}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <FriendListWidget userId={userId} />
              </div>
              <div className="border-t border-gray-100 px-6 py-4">
                <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View All Friends →
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500">Post Likes</p>
                  <p className="text-2xl font-bold text-gray-900">1.2K</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500">Comments</p>
                  <p className="text-2xl font-bold text-gray-900">356</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-2xl font-bold text-gray-900">5.4K</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-xs text-gray-500">Shares</p>
                  <p className="text-2xl font-bold text-gray-900">128</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Posts & Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="border-b border-gray-100">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-1 py-2 relative ${
                          activeTab === tab.id
                            ? "text-blue-600 font-semibold"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            activeTab === tab.id
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        {activeTab === tab.id && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        <Grid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                      >
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Post */}
              <div className="p-6 border-b border-gray-100">
                <MyPostWidget picturePath={user.picturePath} />
              </div>

              {/* Posts Content */}
              <div className="p-6">
                <PostsWidget userId={userId} isProfile viewMode={viewMode} />
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Briefcase size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Work & Education</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {user.occupation || "Not specified"}
                    </p>
                    <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      Add details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-50/50 rounded-2xl border border-purple-100 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MapPin size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Places Lived</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {user.location || "Not specified"}
                    </p>
                    <button className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      Add places <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default ProfilePage;


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