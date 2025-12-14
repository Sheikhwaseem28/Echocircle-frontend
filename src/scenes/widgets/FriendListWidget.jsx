import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import { useNavigate } from "react-router-dom";
import { UserPlus, Users, MoreVertical, MessageCircle, UserX, Search, UserCheck, Loader2 } from "lucide-react";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const [friends, setLocalFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);

  const mockFriends = [
    {
      _id: "1",
      firstName: "Alex",
      lastName: "Morgan",
      occupation: "UI/UX Designer",
      picturePath: "",
      isOnline: true,
      lastActive: "2 min ago",
    },
    {
      _id: "2",
      firstName: "Taylor",
      lastName: "Swift",
      occupation: "Software Engineer",
      picturePath: "",
      isOnline: false,
      lastActive: "1 hour ago",
    },
    {
      _id: "3",
      firstName: "Jordan",
      lastName: "Lee",
      occupation: "Product Manager",
      picturePath: "",
      isOnline: true,
      lastActive: "Just now",
    },
    {
      _id: "4",
      firstName: "Casey",
      lastName: "Kim",
      occupation: "Data Scientist",
      picturePath: "",
      isOnline: true,
      lastActive: "5 min ago",
    },
    {
      _id: "5",
      firstName: "Riley",
      lastName: "Patel",
      occupation: "Marketing Lead",
      picturePath: "",
      isOnline: false,
      lastActive: "3 hours ago",
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
          const friendsWithStatus = data.map(friend => ({
            ...friend,
            isOnline: Math.random() > 0.5, // Mock online status
            lastActive: getRandomTime(),
          }));
          setLocalFriends(friendsWithStatus);
          setFilteredFriends(friendsWithStatus);
          dispatch(setFriends({ friends: friendsWithStatus }));
        } else {
          console.log("Using mock friends data");
          setLocalFriends(mockFriends);
          setFilteredFriends(mockFriends);
          dispatch(setFriends({ friends: mockFriends }));
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        setLocalFriends(mockFriends);
        setFilteredFriends(mockFriends);
        dispatch(setFriends({ friends: mockFriends }));
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchFriends();
    }
  }, [dispatch, token, userId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(friend =>
        `${friend.firstName} ${friend.lastName} ${friend.occupation}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchQuery, friends]);

  const getRandomTime = () => {
    const times = ["Just now", "2 min ago", "5 min ago", "1 hour ago", "3 hours ago"];
    return times[Math.floor(Math.random() * times.length)];
  };

  const handleFriendAction = (action, friendId) => {
    console.log(`${action} friend ${friendId}`);
    // Implement friend actions here
  };

  const handleViewProfile = (friendId) => {
    navigate(`/profile/${friendId}`);
  };

  const renderFriendItem = (friend) => (
    <div
      key={friend._id}
      className="group p-3 rounded-xl border border-gray-800 hover:border-gray-700 bg-gradient-to-r from-gray-900/40 to-black/40 hover:from-gray-800/40 hover:to-gray-900/40 transition-all duration-300 cursor-pointer"
      onClick={() => handleViewProfile(friend._id)}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
            <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center text-white font-semibold">
              {friend.firstName?.[0]}
              {friend.lastName?.[0]}
            </div>
          </div>
          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-gray-900 ${
            friend.isOnline ? "bg-green-500" : "bg-gray-500"
          }`}></div>
        </div>

        {/* Friend Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-white truncate">
                {friend.firstName} {friend.lastName}
              </h4>
              <p className="text-xs text-gray-400 truncate">{friend.occupation}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFriendAction("message", friend._id);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-gray-800/50 transition-colors"
              >
                <MessageCircle size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFriendAction("more", friend._id);
                }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
          
          {/* Status */}
          <div className="flex items-center gap-2 mt-2">
            <div className={`text-xs px-2 py-0.5 rounded-full ${
              friend.isOnline 
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-gray-800/50 text-gray-400 border border-gray-700/50"
            }`}>
              {friend.isOnline ? "Online" : friend.lastActive}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
            <Users size={20} className="text-rose-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Your Circle</h2>
            <p className="text-sm text-gray-400">People you connect with</p>
          </div>
        </div>
        <button className="p-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-rose-400 hover:border-gray-700 transition-colors">
          <UserPlus size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-rose-500/50 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-500/20">
          <div className="text-2xl font-bold text-white">{friends.length}</div>
          <div className="text-xs text-gray-400">Total</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/30 border border-gray-800">
          <div className="text-2xl font-bold text-white">
            {friends.filter(f => f.isOnline).length}
          </div>
          <div className="text-xs text-gray-400">Online</div>
        </div>
        <div className="p-3 rounded-xl bg-gray-900/30 border border-gray-800">
          <div className="text-2xl font-bold text-white">
            {friends.filter(f => !f.isOnline).length}
          </div>
          <div className="text-xs text-gray-400">Offline</div>
        </div>
      </div>

      {/* Friend List */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
            <span className="ml-2 text-gray-400">Loading friends...</span>
          </div>
        ) : filteredFriends.length > 0 ? (
          <>
            {/* Online Friends */}
            {filteredFriends.some(f => f.isOnline) && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <h3 className="text-sm font-medium text-gray-300">Online Now</h3>
                  <span className="text-xs text-gray-500 ml-auto">
                    {filteredFriends.filter(f => f.isOnline).length}
                  </span>
                </div>
                <div className="space-y-2">
                  {filteredFriends
                    .filter(friend => friend.isOnline)
                    .map(renderFriendItem)}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {filteredFriends.some(f => !f.isOnline) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                  <h3 className="text-sm font-medium text-gray-300">Recently Active</h3>
                  <span className="text-xs text-gray-500 ml-auto">
                    {filteredFriends.filter(f => !f.isOnline).length}
                  </span>
                </div>
                <div className="space-y-2">
                  {filteredFriends
                    .filter(friend => !friend.isOnline)
                    .map(renderFriendItem)}
                </div>
              </div>
            )}
          </>
        ) : searchQuery ? (
          <div className="text-center py-8">
            <UserX className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No friends match your search</p>
            <p className="text-sm text-gray-500 mt-1">Try a different name</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Your circle is empty</p>
            <p className="text-sm text-gray-500 mt-1">Start adding friends to connect</p>
            <button className="mt-4 px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all">
              Find Friends
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {filteredFriends.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <UserCheck size={16} />
              <span>Friend Requests</span>
            </button>
            <button className="text-sm text-rose-400 hover:text-rose-300 transition-colors">
              View All
            </button>
          </div>
        </div>
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