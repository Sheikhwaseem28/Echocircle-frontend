import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friend from "../../components/Friend";
import { setFriends } from "../../state/index";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [friends, setLocalFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockFriends = [
    {
      _id: "1",
      firstName: "Jane",
      lastName: "Smith",
      occupation: "Designer",
      picturePath: "",
    },
    {
      _id: "2",
      firstName: "Mike",
      lastName: "Johnson",
      occupation: "Engineer",
      picturePath: "",
    },
    {
      _id: "3",
      firstName: "Sarah",
      lastName: "Williams",
      occupation: "Manager",
      picturePath: "",
    },
  ];

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://echocircle-backend.vercel.app/users/${userId}/friends`,
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
          setLocalFriends(data);
          dispatch(setFriends({ friends: data }));
        } else {
          console.log("Using mock friends data");
          setLocalFriends(mockFriends);
          dispatch(setFriends({ friends: mockFriends }));
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLocalFriends(mockFriends);
        dispatch(setFriends({ friends: mockFriends }));
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchFriends();
    }
  }, [dispatch, token, userId]);

  return (
    <div className="rounded-2xl border border-red-900/70 bg-neutral-950/90 p-4 text-neutral-100 shadow-[0_0_24px_rgba(127,29,29,0.45)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-300">
          Friend List
        </h2>
        <span className="text-[11px] text-neutral-500">
          {friends?.length ? `${friends.length} friends` : ""}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-xs text-neutral-400">Loading friends...</p>
      ) : friends.length > 0 ? (
        <div className="flex flex-col gap-3">
          {friends.map((friend) => (
            <div
              key={friend._id}
              className="rounded-xl border border-red-900/40 bg-black/60 px-3 py-2 hover:border-red-600 hover:bg-black/80"
            >
              <Friend
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">No friends found</p>
      )}
    </div>
  );
};

export default FriendListWidget;



// import { Box, Typography, useTheme } from "@mui/material";
// import Friend from "../../components/Friend";
// import WidgetWrapper from "../../components/WidgetWrapper";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setFriends } from "../../state/index";

// const FriendListWidget = ({ userId }) => {
//   const dispatch = useDispatch();
//   const { palette } = useTheme();
//   const token = useSelector((state) => state.token);
//   const [friends, setLocalFriends] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Mock friends data
//   const mockFriends = [
//     {
//       _id: "1",
//       firstName: "Jane",
//       lastName: "Smith",
//       occupation: "Designer",
//       picturePath: "",
//     },
//     {
//       _id: "2",
//       firstName: "Mike",
//       lastName: "Johnson",
//       occupation: "Engineer",
//       picturePath: "",
//     },
//     {
//       _id: "3",
//       firstName: "Sarah",
//       lastName: "Williams",
//       occupation: "Manager",
//       picturePath: "",
//     },
//   ];

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}/friends`, {
//           method: "GET",
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setLocalFriends(data);
//           dispatch(setFriends({ friends: data }));
//         } else {
//           // Use mock data if API fails
//           console.log("Using mock friends data");
//           setLocalFriends(mockFriends);
//           dispatch(setFriends({ friends: mockFriends }));
//         }
//       } catch (error) {
//         console.error('Error fetching friends:', error);
//         // Use mock data on error
//         setLocalFriends(mockFriends);
//         dispatch(setFriends({ friends: mockFriends }));
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId && token) {
//       fetchFriends();
//     }
//   }, [dispatch, token, userId]);

//   return (
//     <WidgetWrapper>
//       <Typography
//         color={palette.neutral.dark}
//         variant="h5"
//         fontWeight="500"
//         sx={{ mb: "1.5rem" }}
//       >
//         Friend List
//       </Typography>
      
//       {loading ? (
//         <Typography color={palette.neutral.medium}>Loading friends...</Typography>
//       ) : (
//         <Box display="flex" flexDirection="column" gap="1.5rem">
//           {friends.length > 0 ? (
//             friends.map((friend) => (
//               <Friend
//                 key={friend._id}
//                 friendId={friend._id}
//                 name={`${friend.firstName} ${friend.lastName}`}
//                 subtitle={friend.occupation}
//                 userPicturePath={friend.picturePath}
//               />
//             ))
//           ) : (
//             <Typography color={palette.neutral.medium}>No friends found</Typography>
//           )}
//         </Box>
//       )}
//     </WidgetWrapper>
//   );
// };

// export default FriendListWidget;