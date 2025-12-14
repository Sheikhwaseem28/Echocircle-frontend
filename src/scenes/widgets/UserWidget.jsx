import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import UserImage from "../../components/UserImage";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);

  const mockUser = {
    _id: userId,
    firstName: "John",
    lastName: "Doe",
    location: "New York, USA",
    occupation: "Software Developer",
    viewedProfile: 42,
    impressions: 128,
    friends: ["friend1", "friend2", "friend3"],
  };

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
      <div className="rounded-2xl border border-red-900/70 bg-neutral-950/90 p-4 text-xs text-neutral-300">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-red-900/70 bg-neutral-950/90 p-4 text-xs text-neutral-300">
        User not found
      </div>
    );
  }

  const {
    firstName = "User",
    lastName = "",
    location = "Unknown Location",
    occupation = "Unknown Occupation",
    viewedProfile = 0,
    impressions = 0,
    friends = [],
  } = user;

  const friendCount = Array.isArray(friends) ? friends.length : 0;

  return (
    <aside className="rounded-2xl border border-red-900/70 bg-neutral-950/95 p-4 text-neutral-100 shadow-[0_0_28px_rgba(127,29,29,0.45)]">
      {/* ROW 1: header */}
      <button
        type="button"
        onClick={() => navigate(`/profile/${userId}`)}
        className="flex w-full items-center justify-between gap-2 pb-3"
      >
        <div className="flex items-center gap-3">
          <UserImage image={picturePath || currentUser?.picturePath} />
          <div className="text-left">
            <p className="text-sm font-semibold text-neutral-50 hover:text-red-400">
              {firstName} {lastName}
            </p>
            <p className="text-[11px] text-neutral-400">
              {friendCount} friends
            </p>
          </div>
        </div>
        <ManageAccountsOutlined sx={{ fontSize: 20 }} className="text-neutral-400" />
      </button>

      <div className="my-3 h-px w-full bg-neutral-800/80" />

      {/* ROW 2: location + occupation */}
      <div className="space-y-2 py-2 text-xs">
        <div className="flex items-center gap-2">
          <LocationOnOutlined sx={{ fontSize: 18 }} className="text-red-400" />
          <p className="text-neutral-300">{location}</p>
        </div>
        <div className="flex items-center gap-2">
          <WorkOutlineOutlined sx={{ fontSize: 18 }} className="text-red-400" />
          <p className="text-neutral-300">{occupation}</p>
        </div>
      </div>

      <div className="my-3 h-px w-full bg-neutral-800/80" />

      {/* ROW 3: stats */}
      <div className="space-y-1 py-2 text-xs">
        <div className="flex items-center justify-between">
          <p className="text-neutral-400">Who&apos;s viewed your profile</p>
          <p className="font-semibold text-neutral-50">{viewedProfile}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-neutral-400">Impressions of your posts</p>
          <p className="font-semibold text-neutral-50">{impressions}</p>
        </div>
      </div>

      <div className="my-3 h-px w-full bg-neutral-800/80" />

      {/* ROW 4: social profiles */}
      <div className="space-y-3 py-2">
        <p className="text-xs font-semibold text-neutral-200">Social Profiles</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600" />
            <div className="text-[11px]">
              <p className="font-semibold text-neutral-100">Twitter</p>
              <p className="text-neutral-500">Social Network</p>
            </div>
          </div>
          <EditOutlined sx={{ fontSize: 16 }} className="text-neutral-400" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-red-600" />
            <div className="text-[11px]">
              <p className="font-semibold text-neutral-100">LinkedIn</p>
              <p className="text-neutral-500">Network Platform</p>
            </div>
          </div>
          <EditOutlined sx={{ fontSize: 16 }} className="text-neutral-400" />
        </div>
      </div>
    </aside>
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