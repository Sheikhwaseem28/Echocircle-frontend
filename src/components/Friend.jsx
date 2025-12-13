import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  ChevronRight,
  MapPin,
  Briefcase,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";

const Friend = ({ friendId, name, subtitle, userPicturePath, occupation, location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Check if friends is an array before using .some
  const isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const handlePatchFriend = async () => {
    try {
      const response = await fetch(`https://echocircle-backend.vercel.app/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update friend status');
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error('Error updating friend status:', error);
    }
  };

  const handleNavigate = () => {
    navigate(`/profile/${friendId}`);
  };

  const handleMessage = () => {
    // Handle message functionality
    console.log(`Message ${name}`);
  };

  return (
    <Box className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all duration-300 p-5">
      <div className="flex items-start justify-between gap-4">
        {/* Left Section - User Info */}
        <div className="flex items-start gap-4 flex-1">
          {/* User Avatar */}
          <div 
            onClick={handleNavigate}
            className="relative cursor-pointer"
          >
            <div className="h-16 w-16 rounded-xl border-2 border-white bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden shadow-sm">
              <UserImage image={userPicturePath} size="64px" />
            </div>
            {isFriend && (
              <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white">
                <CheckCircle size={12} className="text-white" />
              </div>
            )}
          </div>
          
          {/* User Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Typography
                onClick={handleNavigate}
                variant="h6"
                fontWeight="600"
                sx={{
                  color: palette.neutral.dark,
                  "&:hover": {
                    color: palette.primary.main,
                    cursor: "pointer",
                  },
                }}
              >
                {name}
              </Typography>
              
              {/* Friend Status Badge */}
              {isFriend && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-full">
                  Friend
                </span>
              )}
            </div>
            
            {/* Subtitle */}
            <Typography 
              color={medium} 
              fontSize="0.875rem"
              className="mb-2"
            >
              {subtitle}
            </Typography>
            
            {/* Additional Info */}
            <div className="flex flex-wrap gap-3">
              {occupation && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase size={14} />
                  <span>{occupation}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  <span>{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-2">
          {/* Friend Action Button */}
          <IconButton
            onClick={handlePatchFriend}
            className={`rounded-xl transition-all ${
              isFriend 
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
            }`}
            size="medium"
          >
            {isFriend ? (
              <>
                <UserMinus size={18} />
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  Remove
                </span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span className="ml-2 text-sm font-medium hidden sm:inline">
                  Add Friend
                </span>
              </>
            )}
          </IconButton>
          
          {/* Message Button */}
          <IconButton
            onClick={handleMessage}
            className="bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl transition-all"
            size="medium"
          >
            <MessageSquare size={18} />
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              Message
            </span>
          </IconButton>
          
          {/* View Profile Button */}
          <button
            onClick={handleNavigate}
            className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            View profile
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Divider (only visible on hover) */}
      <div className="h-px bg-gray-100 mt-4 group-hover:bg-blue-100 transition-colors"></div>

      {/* Online Status & Mutual Friends */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${true ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-xs text-gray-500">
            {true ? 'Online now' : 'Last seen 2h ago'}
          </span>
        </div>
        
        <div className="text-xs text-gray-500">
          <span className="font-medium text-gray-700">12</span> mutual friends
        </div>
      </div>
    </Box>
  );
};

// Simple variant for list view
export const FriendCompact = ({ friendId, name, userPicturePath, isFriend: isFriendProp }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handlePatchFriend = async () => {
    try {
      const response = await fetch(`https://echocircle-backend.vercel.app/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error('Failed to update friend status');
      
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error('Error updating friend status:', error);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${friendId}`)}
      >
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          <UserImage image={userPicturePath} size="40px" />
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      
      <IconButton
        onClick={handlePatchFriend}
        size="small"
        className={isFriendProp ? 'text-red-500 hover:bg-red-50' : 'text-blue-500 hover:bg-blue-50'}
      >
        {isFriendProp ? <UserMinus size={18} /> : <UserPlus size={18} />}
      </IconButton>
    </div>
  );
};

export default Friend;


// import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
// import { Box, IconButton, Typography, useTheme } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setFriends } from "../state";
// import FlexBetween from "./FlexBetween";
// import UserImage from "./UserImage";

// const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { _id } = useSelector((state) => state.user);
//   const token = useSelector((state) => state.token);
//   const friends = useSelector((state) => state.user.friends) || []; // Ensure friends is an array

//   const { palette } = useTheme();
//   const primaryLight = palette.primary.light;
//   const primaryDark = palette.primary.dark;
//   const main = palette.neutral.main;
//   const medium = palette.neutral.medium;


//   // Check if friends is an array before using .some
//   const isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

//   const handlePatchFriend = async () => {
//     try {
//       const response = await fetch(`https://echocircle-backend.vercel.app/users/${_id}/${friendId}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update friend status');
//       }

//       const data = await response.json();
//       dispatch(setFriends({ friends: data }));
//     } catch (error) {
//       console.error('Error updating friend status:', error);
//     }
//   };

//   const handleNavigate = () => {
//     navigate(`/profile/${friendId}`);
//     // The line below is not needed unless you want to force refresh
//     // navigate(0); 
//   };

//   return (
//     <FlexBetween>
//       <FlexBetween gap="1rem">
//         <UserImage image={userPicturePath} size="55px" />
//         <Box onClick={handleNavigate}>
//           <Typography
//             color={main}
//             variant="h5"
//             fontWeight="500"
//             sx={{
//               "&:hover": {
//                 color: primaryLight,
//                 cursor: "pointer",
//               },
//             }}
//           >
//             {name}
//           </Typography>
//           <Typography color={medium} fontSize="0.75rem">
//             {subtitle}
//           </Typography>
//         </Box>
//       </FlexBetween>
//       <IconButton
//         onClick={handlePatchFriend}
//         sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
//       >
//         {isFriend ? (
//           <PersonRemoveOutlined sx={{ color: primaryDark }} />
//         ) : (
//           <PersonAddOutlined sx={{ color: primaryDark }} />
//         )}
//       </IconButton>
//     </FlexBetween>
//   );
// };

// export default Friend;
