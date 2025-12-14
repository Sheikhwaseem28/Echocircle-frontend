import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import {
  User,
  MapPin,
  Briefcase,
  Eye,
  BarChart3,
  Users,
  Calendar,
  Mail,
  Globe,
  Edit3,
  Settings,
  Link,
  Award,
  Sparkles,
  Loader2,
  Shield,
  Clock,
} from "lucide-react";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const isOwnProfile = currentUser?._id === userId;

  const mockUser = {
    _id: userId,
    firstName: "Alex",
    lastName: "Morgan",
    location: "San Francisco, CA",
    occupation: "Senior UI/UX Designer",
    email: "alex.morgan@example.com",
    joined: "2023-06-15",
    viewedProfile: 1287,
    impressions: 5423,
    friends: ["friend1", "friend2", "friend3", "friend4", "friend5"],
    bio: "Design enthusiast with a passion for creating beautiful, functional interfaces. Always learning and exploring new trends in digital design.",
    skills: ["UI Design", "UX Research", "Figma", "Prototyping", "User Testing"],
    badges: ["Early Adopter", "Top Contributor", "Circle Creator"],
  };

  const tabs = [
    { id: "overview", icon: <User size={16} />, label: "Overview" },
    { id: "activity", icon: <BarChart3 size={16} />, label: "Activity" },
    { id: "connections", icon: <Users size={16} />, label: "Connections" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://echocircle-backend.vercel.app/users/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.log("Using mock user data");
          setUser(mockUser);
        }
      } catch (error) {
        console.error("Fetching user failed:", error);
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
          <span className="ml-2 text-gray-400">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
        <div className="text-center py-8">
          <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">User not found</p>
        </div>
      </div>
    );
  }

  const {
    firstName = "User",
    lastName = "",
    location = "Location not set",
    occupation = "Occupation not set",
    email = "",
    viewedProfile = 0,
    impressions = 0,
    friends = [],
    bio = "No bio added yet.",
    skills = [],
    badges = [],
    joined = new Date().toISOString(),
  } = user;

  const friendCount = Array.isArray(friends) ? friends.length : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserImage image={picturePath || currentUser?.picturePath} size="xl" />
            <div>
              <h2 className="text-lg font-bold text-white">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-400">{occupation}</p>
            </div>
          </div>
          {isOwnProfile && (
            <button
              onClick={() => navigate(`/profile/${userId}/edit`)}
              className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 transition-colors"
            >
              <Settings size={18} />
            </button>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <div className="mb-6">
            <p className="text-sm text-gray-300 leading-relaxed">{bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
            <div className="text-2xl font-bold text-white">{friendCount}</div>
            <div className="text-xs text-gray-400">Friends</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatNumber(viewedProfile)}</div>
            <div className="text-xs text-gray-400">Profile Views</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">{formatNumber(impressions)}</div>
            <div className="text-xs text-gray-400">Impressions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-800/50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-rose-500 bg-gradient-to-t from-rose-500/10 to-transparent"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/30"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-300">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-sm text-white">{location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-400">Occupation</p>
                    <p className="text-sm text-white">{occupation}</p>
                  </div>
                </div>
                {email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-400">Email</p>
                      <p className="text-sm text-white">{email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-400">Joined</p>
                    <p className="text-sm text-white">{formatDate(joined)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1.5 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Badges</h3>
                <div className="space-y-2">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/5 to-amber-600/5 border border-amber-500/20">
                      <Award size={16} className="text-amber-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{badge}</p>
                        <p className="text-xs text-gray-400">Achievement unlocked</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Recent Activity</h3>
                <Sparkles size={16} className="text-rose-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center">
                      <Eye size={12} className="text-rose-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Profile viewed 12 times today</p>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center">
                      <BarChart3 size={12} className="text-rose-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Post reached 247 impressions</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Engagement Stats</h3>
                <BarChart3 size={16} className="text-blue-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Posts Created</span>
                  <span className="text-sm font-medium text-white">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Comments Made</span>
                  <span className="text-sm font-medium text-white">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Likes Received</span>
                  <span className="text-sm font-medium text-white">128</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Active Streak</span>
                  <span className="text-sm font-medium text-white">7 days</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "connections" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-medium text-white">Mutual Connections</h3>
                  <p className="text-xs text-gray-400">People you both know</p>
                </div>
                <span className="text-xs text-rose-400">{friendCount} total</span>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-red-600"></div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Friend {i}</p>
                      <p className="text-xs text-gray-400">Mutual friend</p>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Connection Network</h3>
                <Globe size={16} className="text-green-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Circles Joined</span>
                  <span className="text-sm font-medium text-white">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Groups</span>
                  <span className="text-sm font-medium text-white">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Following</span>
                  <span className="text-sm font-medium text-white">128</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Followers</span>
                  <span className="text-sm font-medium text-white">96</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-800/50 p-6">
        {isOwnProfile ? (
          <div className="space-y-3">
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all">
              Edit Profile
            </button>
            <button className="w-full py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:border-gray-700 transition-all">
              Share Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all">
              <User size={16} className="inline mr-2" />
              Connect
            </button>
            <button className="py-3 rounded-xl border border-gray-800 bg-gray-900/50 text-gray-300 hover:text-white hover:border-gray-700 transition-all">
              <Mail size={16} className="inline mr-2" />
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserWidget;



// import {
//   ManageAccountsOutlined,
//   EditOutlined,
//   LocationOnOutlined,
//   WorkOutlineOutlined,
// } from "@mui/icons-material";
// import { Box, Typography, Divider, useTheme } from "@mui/material";
// import UserImage from "../../components/UserImage";
// import FlexBetween from "../../components/FlexBetween";
// import WidgetWrapper from "../../components/WidgetWrapper";
// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const UserWidget = ({ userId, picturePath }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { palette } = useTheme();
//   const navigate = useNavigate();
//   const token = useSelector((state) => state.token);
//   const currentUser = useSelector((state) => state.user); // Get current user from state
  
//   const dark = palette.neutral.dark;
//   const medium = palette.neutral.medium;
//   const main = palette.neutral.main;

//   // Mock user data for testing
//   const mockUser = {
//     _id: userId,
//     firstName: "John",
//     lastName: "Doe",
//     location: "New York, USA",
//     occupation: "Software Developer",
//     viewedProfile: 42,
//     impressions: 128,
//     friends: ["friend1", "friend2", "friend3"]
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         setLoading(true);
        
//         // First try to fetch from API
//         const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}`, {
//           method: "GET",
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUser(data);
//         } else {
//           // If API fails, use mock data
//           console.log("Using mock user data");
//           setUser(mockUser);
//         }
//       } catch (error) {
//         console.error('Fetching user failed:', error);
//         // Fallback to mock data
//         setUser(mockUser);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUser();
//     }
//   }, [userId, token]);

//   if (loading) {
//     return (
//       <WidgetWrapper>
//         <Typography>Loading user...</Typography>
//       </WidgetWrapper>
//     );
//   }

//   if (!user) {
//     return (
//       <WidgetWrapper>
//         <Typography>User not found</Typography>
//       </WidgetWrapper>
//     );
//   }

//   const {
//     firstName = 'User',
//     lastName = '',
//     location = 'Unknown Location',
//     occupation = 'Unknown Occupation',
//     viewedProfile = 0,
//     impressions = 0,
//     friends = [],
//   } = user;

//   return (
//     <WidgetWrapper>
//       {/* FIRST ROW */}
//       <FlexBetween
//         gap="0.5rem"
//         pb="1.1rem"
//         onClick={() => navigate(`/profile/${userId}`)}
//         sx={{ cursor: "pointer" }}
//       >
//         <FlexBetween gap="1rem">
//           <UserImage image={picturePath || currentUser?.picturePath} />
//           <Box>
//             <Typography
//               variant="h4"
//               color={dark}
//               fontWeight="500"
//               sx={{ "&:hover": { color: palette.primary.light } }}
//             >
//               {firstName} {lastName}
//             </Typography>
//             <Typography color={medium}>
//               {Array.isArray(friends) ? friends.length : 0} friends
//             </Typography>
//           </Box>
//         </FlexBetween>
//         <ManageAccountsOutlined />
//       </FlexBetween>

//       <Divider />

//       {/* SECOND ROW */}
//       <Box p="1rem 0">
//         <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
//           <LocationOnOutlined fontSize="large" sx={{ color: main }} />
//           <Typography color={medium}>{location}</Typography>
//         </Box>
//         <Box display="flex" alignItems="center" gap="1rem">
//           <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
//           <Typography color={medium}>{occupation}</Typography>
//         </Box>
//       </Box>

//       <Divider />

//       {/* THIRD ROW */}
//       <Box p="1rem 0">
//         <FlexBetween mb="0.5rem">
//           <Typography color={medium}>Who's viewed your profile</Typography>
//           <Typography color={main} fontWeight="500">{viewedProfile}</Typography>
//         </FlexBetween>
//         <FlexBetween>
//           <Typography color={medium}>Impressions of your post</Typography>
//           <Typography color={main} fontWeight="500">{impressions}</Typography>
//         </FlexBetween>
//       </Box>

//       <Divider />

//       {/* FOURTH ROW */}
//       <Box p="1rem 0">
//         <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
//           Social Profiles
//         </Typography>

//         <FlexBetween gap="1rem" mb="0.5rem">
//           <FlexBetween gap="1rem">
//             <div style={{ width: 24, height: 24, backgroundColor: main, borderRadius: '50%' }} />
//             <Box>
//               <Typography color={main} fontWeight="500">Twitter</Typography>
//               <Typography color={medium}>Social Network</Typography>
//             </Box>
//           </FlexBetween>
//           <EditOutlined sx={{ color: main }} />
//         </FlexBetween>

//         <FlexBetween gap="1rem">
//           <FlexBetween gap="1rem">
//             <div style={{ width: 24, height: 24, backgroundColor: main, borderRadius: '50%' }} />
//             <Box>
//               <Typography color={main} fontWeight="500">LinkedIn</Typography>
//               <Typography color={medium}>Network Platform</Typography>
//             </Box>
//           </FlexBetween>
//           <EditOutlined sx={{ color: main }} />
//         </FlexBetween>
//       </Box>
//     </WidgetWrapper>
//   );
// };

// export default UserWidget;