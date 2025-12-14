import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends) || [];

  const isFriend =
    Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const handlePatchFriend = async () => {
    try {
      const response = await fetch(
        `https://echocircle-backend.vercel.app/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update friend status");
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error updating friend status:", error);
    }
  };

  const handleNavigate = () => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Left: avatar + name */}
      <button
        type="button"
        onClick={handleNavigate}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <UserImage image={userPicturePath} size="55px" />
        <div>
          <p className="text-sm font-semibold text-neutral-100 hover:text-red-400">
            {name}
          </p>
          <p className="text-[11px] text-neutral-400">{subtitle}</p>
        </div>
      </button>

      {/* Right: add/remove friend button */}
      <button
        type="button"
        onClick={handlePatchFriend}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-black shadow-[0_0_16px_rgba(248,113,113,0.55)] hover:bg-red-400"
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ fontSize: 18 }} />
        ) : (
          <PersonAddOutlined sx={{ fontSize: 18 }} />
        )}
      </button>
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
