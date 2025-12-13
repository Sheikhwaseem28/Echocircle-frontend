import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { 
  Box, 
  Typography, 
  Divider, 
  useTheme, 
  IconButton,
  CircularProgress,
  Avatar,
  Button,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Briefcase,
  Eye,
  TrendingUp,
  Users,
  Link,
  Mail,
  Calendar,
  Award,
  Star,
  CheckCircle,
  Edit,
  MoreVertical,
  Share2,
  Bell,
  MessageSquare,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  GitHub,
} from "lucide-react";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    posts: 24,
    connections: 156,
    recommendations: 12,
    achievements: 5,
  });
  
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  
  const isOwnProfile = currentUser?._id === userId;
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const primaryColor = palette.primary.main;

  const mockUser = {
    _id: userId,
    firstName: currentUser?.firstName || "John",
    lastName: currentUser?.lastName || "Doe",
    location: "San Francisco, California",
    occupation: "Senior Software Engineer",
    company: "TechCorp Inc.",
    viewedProfile: 428,
    impressions: 1284,
    friends: ["friend1", "friend2", "friend3", "friend4", "friend5"],
    joinedDate: "March 2023",
    email: currentUser?.email || "john.doe@example.com",
    bio: "Passionate about building amazing products and connecting with like-minded professionals.",
    skills: ["React", "Node.js", "TypeScript", "UI/UX", "AWS"],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}`, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Fetching user failed:', error);
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
      <WidgetWrapper>
        <div className="flex flex-col items-center justify-center py-12">
          <CircularProgress size={48} className="mb-4" />
          <Typography color="textSecondary">
            Loading profile...
          </Typography>
        </div>
      </WidgetWrapper>
    );
  }

  if (!user) {
    return (
      <WidgetWrapper>
        <div className="text-center py-12">
          <User size={48} className="text-gray-400 mx-auto mb-4" />
          <Typography variant="h6" className="mb-2">
            User not found
          </Typography>
          <Typography color="textSecondary">
            This user profile is unavailable
          </Typography>
        </div>
      </WidgetWrapper>
    );
  }

  const {
    firstName = 'User',
    lastName = '',
    location = 'Location not specified',
    occupation = 'Occupation not specified',
    company,
    viewedProfile = 0,
    impressions = 0,
    friends = [],
    joinedDate,
    email,
    bio,
    skills = [],
  } = user;

  const fullName = `${firstName} ${lastName}`;
  const friendCount = Array.isArray(friends) ? friends.length : 0;

  return (
    <WidgetWrapper className="relative group">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
        {/* Cover Photo Area */}
        <div className="relative w-full h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl -mx-6 -mt-6 mb-16">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-2xl"></div>
        </div>
        
        {/* Profile Picture */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <UserImage 
            image={picturePath || currentUser?.picturePath} 
            size="100px"
            border
            borderColor="white"
            borderSize="4px"
            elevate
            showStatus
            isOnline={true}
          />
        </div>
        
        {/* Name and Badge */}
        <div className="mt-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Typography variant="h5" fontWeight="600" color={dark}>
              {fullName}
            </Typography>
            {isOwnProfile && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                You
              </span>
            )}
            <CheckCircle size={16} className="text-blue-500" />
          </div>
          
          {/* Occupation */}
          <Typography color={primaryColor} fontWeight="500" className="mb-1">
            {occupation}
            {company && ` • ${company}`}
          </Typography>
          
          {/* Location */}
          <Typography color={medium} className="flex items-center justify-center gap-1 mb-3">
            <MapPin size={14} />
            {location}
          </Typography>
          
          {/* Stats */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <Typography variant="h6" fontWeight="600">
                {friendCount}
              </Typography>
              <Typography variant="caption" color={medium}>
                Connections
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" fontWeight="600">
                {stats.posts}
              </Typography>
              <Typography variant="caption" color={medium}>
                Posts
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" fontWeight="600">
                {viewedProfile}
              </Typography>
              <Typography variant="caption" color={medium}>
                Profile Views
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 my-6">
        {isOwnProfile ? (
          <>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Edit size={18} />}
              onClick={() => navigate(`/profile/edit/${userId}`)}
              sx={{
                backgroundColor: primaryColor,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: '500',
              }}
            >
              Edit Profile
            </Button>
            <IconButton className="bg-gray-100 hover:bg-gray-200">
              <MoreVertical size={20} />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              startIcon={<MessageSquare size={18} />}
              sx={{
                backgroundColor: primaryColor,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: '500',
              }}
            >
              Message
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Users size={18} />}
              sx={{
                borderColor: palette.divider,
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: '500',
              }}
            >
              Connect
            </Button>
            <IconButton className="bg-gray-100 hover:bg-gray-200">
              <MoreVertical size={20} />
            </IconButton>
          </>
        )}
      </div>

      {/* About Section */}
      {bio && (
        <div className="mb-6">
          <Typography variant="subtitle1" fontWeight="600" className="mb-3 flex items-center gap-2">
            <User size={18} />
            About
          </Typography>
          <Typography color={medium} className="leading-relaxed">
            {bio}
          </Typography>
        </div>
      )}

      {/* Details Grid */}
      <div className="mb-6">
        <Typography variant="subtitle1" fontWeight="600" className="mb-3 flex items-center gap-2">
          <Briefcase size={18} />
          Details
        </Typography>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Briefcase size={16} className="text-blue-600" />
            </div>
            <div>
              <Typography variant="caption" color={medium}>
                Occupation
              </Typography>
              <Typography fontWeight="500">{occupation}</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <MapPin size={16} className="text-emerald-600" />
            </div>
            <div>
              <Typography variant="caption" color={medium}>
                Location
              </Typography>
              <Typography fontWeight="500">{location}</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar size={16} className="text-purple-600" />
            </div>
            <div>
              <Typography variant="caption" color={medium}>
                Joined
              </Typography>
              <Typography fontWeight="500">{joinedDate || "March 2023"}</Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Mail size={16} className="text-amber-600" />
            </div>
            <div>
              <Typography variant="caption" color={medium}>
                Email
              </Typography>
              <Typography fontWeight="500">{email || "Not provided"}</Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <Typography variant="subtitle1" fontWeight="600" className="mb-3 flex items-center gap-2">
            <Award size={18} />
            Skills & Expertise
          </Typography>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={16} className="text-blue-600" />
            <Typography variant="caption" color={medium}>
              Profile Views
            </Typography>
          </div>
          <Typography variant="h5" fontWeight="600">
            {viewedProfile.toLocaleString()}
          </Typography>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-600" />
            <Typography variant="caption" color={medium}>
              Post Impressions
            </Typography>
          </div>
          <Typography variant="h5" fontWeight="600">
            {impressions.toLocaleString()}
          </Typography>
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-6">
        <Typography variant="subtitle1" fontWeight="600" className="mb-3 flex items-center gap-2">
          <Globe size={18} />
          Social Links
        </Typography>
        
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Linkedin size={16} className="text-blue-600" />
              </div>
              <div className="text-left">
                <Typography fontWeight="500">LinkedIn</Typography>
                <Typography variant="caption" color={medium}>
                  Professional Network
                </Typography>
              </div>
            </div>
            <EditOutlined sx={{ color: main, fontSize: '18px' }} />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 rounded-lg">
                <Twitter size={16} className="text-sky-600" />
              </div>
              <div className="text-left">
                <Typography fontWeight="500">Twitter</Typography>
                <Typography variant="caption" color={medium}>
                  Social Network
                </Typography>
              </div>
            </div>
            <EditOutlined sx={{ color: main, fontSize: '18px' }} />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <GitHub size={16} className="text-purple-600" />
              </div>
              <div className="text-left">
                <Typography fontWeight="500">GitHub</Typography>
                <Typography variant="caption" color={medium}>
                  Code Portfolio
                </Typography>
              </div>
            </div>
            <EditOutlined sx={{ color: main, fontSize: '18px' }} />
          </button>
        </div>
      </div>

      {/* Share Profile */}
      <div className="pt-6 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all group">
          <Share2 size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
          <Typography fontWeight="500" className="text-blue-600">
            Share Profile
          </Typography>
        </button>
      </div>
    </WidgetWrapper>
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