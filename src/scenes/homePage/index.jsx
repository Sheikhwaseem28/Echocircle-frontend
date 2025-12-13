import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../../scenes/navbar/index";
import UserWidget from "../../scenes/widgets/UserWidget";
import MyPostWidget from "../../scenes/widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import AdvertWidget from "../../scenes/widgets/AdvertWidget";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import {
  Home,
  Users,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  Grid,
  LayoutGrid,
  List,
  TrendingUp
} from "lucide-react";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const isTablet = useMediaQuery("(min-width:768px)");
  const { _id, picturePath, firstName, lastName } = useSelector((state) => state.user);
  const [viewMode, setViewMode] = useState("grid");

  return (
    <Box className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Box className="w-full px-4 py-4 md:px-6 lg:px-8">
        {/* Welcome Header with Breadcrumb */}
        <Box className="mb-8">
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Home size={16} />
            <ChevronRight size={14} />
            <span className="text-sm font-medium text-gray-600">Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-sm text-gray-400">Home</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your network today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <List size={18} />
                </button>
              </div>
              
              {/* Stats Indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200">
                <TrendingUp size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-900">Online</span>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </Box>

        {/* Main Content Grid */}
        <Box
          className="w-full"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="1rem"
          justifyContent="space-between"
        >
          {/* Left Column - User Profile & Stats */}
          <Box 
            className={`${isNonMobileScreens ? "flex-shrink-0" : "mb-6"}`}
            width={isNonMobileScreens ? "25%" : "100%"}
          >
            <div className="sticky top-6 space-y-6">
              {/* User Profile Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-20"></div>
                <div className="px-4 pb-6 relative">
                  <div className="flex justify-center">
                    <div className="relative -top-10">
                      <div className="h-20 w-20 rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        {picturePath ? (
                          <img 
                            src={picturePath} 
                            alt={`${firstName} ${lastName}`}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-blue-600">
                            {firstName?.charAt(0)}{lastName?.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <UserWidget userId={_id} picturePath={picturePath} />
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Grid size={18} />
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Posts</p>
                    <p className="text-xl font-bold text-gray-900">24</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Friends</p>
                    <p className="text-xl font-bold text-gray-900">156</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Likes</p>
                    <p className="text-xl font-bold text-gray-900">1.2K</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="text-xl font-bold text-gray-900">5.4K</p>
                  </div>
                </div>
              </div>
            </div>
          </Box>

          {/* Middle Column - Posts */}
          <Box 
            className={`${isNonMobileScreens ? "flex-grow" : ""}`}
            width={isNonMobileScreens ? "48%" : "100%"}
            mt={isNonMobileScreens ? 0 : "1.5rem"}
          >
            <div className="space-y-6">
              {/* Create Post Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5">
                  <MyPostWidget picturePath={picturePath} />
                </div>
              </div>
              
              {/* Posts Feed */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MessageSquare size={18} />
                      Recent Posts
                    </h2>
                    <div className="text-sm text-gray-500">
                      {viewMode === "grid" ? "Grid View" : "List View"}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <PostsWidget userId={_id} viewMode={viewMode} />
                </div>
              </div>
            </div>
          </Box>

          {/* Right Column - Ads & Friends (Desktop only) */}
          {isNonMobileScreens && (
            <Box 
              className="flex-shrink-0"
              width="25%"
            >
              <div className="sticky top-6 space-y-6">
                {/* Advert Widget */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp size={18} />
                      Sponsored
                    </h3>
                  </div>
                  <div className="p-5">
                    <AdvertWidget />
                  </div>
                </div>
                
                {/* Friend List */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Users size={18} />
                        Your Friends
                      </h3>
                      <span className="text-xs font-medium bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        156
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <FriendListWidget userId={_id} />
                  </div>
                  <div className="border-t border-gray-100 px-6 py-3">
                    <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      View All Friends →
                    </button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users size={16} className="text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Find Friends</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <Bell size={16} className="text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Notifications</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </Box>
          )}
        </Box>
        
        {/* Mobile Bottom Navigation */}
        {!isNonMobileScreens && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 z-50">
            <div className="flex justify-between items-center">
              <button className="flex flex-col items-center">
                <Home size={20} className="text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Home</span>
              </button>
              <button className="flex flex-col items-center">
                <Search size={20} className="text-gray-500" />
                <span className="text-xs text-gray-500">Search</span>
              </button>
              <button className="flex flex-col items-center">
                <MessageSquare size={20} className="text-gray-500" />
                <span className="text-xs text-gray-500">Messages</span>
              </button>
              <button className="flex flex-col items-center">
                <Users size={20} className="text-gray-500" />
                <span className="text-xs text-gray-500">Friends</span>
              </button>
              <button className="flex flex-col items-center">
                <Bell size={20} className="text-gray-500" />
                <span className="text-xs text-gray-500">Alerts</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Ad Section */}
        {!isNonMobileScreens && (
          <Box mt="1.5rem" mb="5rem">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Sponsored</h3>
              <AdvertWidget />
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;


// import { Box, useMediaQuery } from "@mui/material";
// import { useSelector } from "react-redux";
// import Navbar from "../../scenes/navbar/index";
// import UserWidget from "../../scenes/widgets/UserWidget";
// import MyPostWidget from "../../scenes/widgets/MyPostWidget";
// import PostsWidget from "../../scenes/widgets/PostsWidget";
// import AdvertWidget from "../../scenes/widgets/AdvertWidget";
// import FriendListWidget from "../../scenes/widgets/FriendListWidget";

// const HomePage = () => {
//   const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
//   const { _id, picturePath } = useSelector((state) => state.user);

//   return (
//     <Box>
//       <Navbar />
//       <Box
//         width="100%"
//         padding="2rem 6%"
//         display={isNonMobileScreens ? "flex" : "block"}
//         gap="0.5rem"
//         justifyContent="space-between"
//       >
//         <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
//           <UserWidget userId={_id} picturePath={picturePath} />
//         </Box>
//         <Box
//           flexBasis={isNonMobileScreens ? "42%" : undefined}
//           mt={isNonMobileScreens ? undefined : "2rem"}
//         >
//           <MyPostWidget picturePath={picturePath} />
//           <PostsWidget userId={_id} />
//         </Box>
//         {isNonMobileScreens && (
//           <Box flexBasis="26%">
//             <AdvertWidget />
//             <Box m="2rem 0" />
//             <FriendListWidget userId={_id} />
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };


// export default HomePage;