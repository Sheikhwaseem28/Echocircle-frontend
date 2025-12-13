import { Box, Typography, useTheme, CircularProgress, IconButton, Avatar, Button } from "@mui/material";
import Friend, { FriendCompact } from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  UserMinus,
  RefreshCw,
  ChevronRight,
  Grid,
  List,
  CheckCircle,
  XCircle,
} from "lucide-react";

const FriendListWidget = ({ userId, viewMode = "detailed", maxDisplay = 3 }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const [friends, setLocalFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, online, recent
  const [displayMode, setDisplayMode] = useState(viewMode);
  const [showAll, setShowAll] = useState(false);

  // Mock friends data for fallback
  const mockFriends = [
    {
      _id: "1",
      firstName: "Jane",
      lastName: "Smith",
      occupation: "Senior Designer",
      picturePath: "",
      location: "New York",
      isOnline: true,
      lastSeen: "2 min ago",
    },
    {
      _id: "2",
      firstName: "Mike",
      lastName: "Johnson",
      occupation: "Software Engineer",
      picturePath: "",
      location: "San Francisco",
      isOnline: false,
      lastSeen: "2 hours ago",
    },
    {
      _id: "3",
      firstName: "Sarah",
      lastName: "Williams",
      occupation: "Product Manager",
      picturePath: "",
      location: "Chicago",
      isOnline: true,
      lastSeen: "5 min ago",
    },
    {
      _id: "4",
      firstName: "Alex",
      lastName: "Brown",
      occupation: "Data Scientist",
      picturePath: "",
      location: "Austin",
      isOnline: true,
      lastSeen: "Just now",
    },
    {
      _id: "5",
      firstName: "Emma",
      lastName: "Davis",
      occupation: "Marketing Director",
      picturePath: "",
      location: "Boston",
      isOnline: false,
      lastSeen: "1 day ago",
    },
  ];

  const getFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}/friends`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Add mock online status for demo
        const friendsWithStatus = data.map((friend, index) => ({
          ...friend,
          isOnline: index % 2 === 0,
          lastSeen: index % 2 === 0 ? "Just now" : `${index + 1} hours ago`,
        }));
        setLocalFriends(friendsWithStatus);
        dispatch(setFriends({ friends: friendsWithStatus }));
      } else {
        // Use mock data if API fails
        setLocalFriends(mockFriends);
        dispatch(setFriends({ friends: mockFriends }));
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      // Use mock data on error
      setLocalFriends(mockFriends);
      dispatch(setFriends({ friends: mockFriends }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getFriends();
    }
  }, [dispatch, token, userId]);

  const handleRefresh = () => {
    getFriends();
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`https://echocircle-backend.vercel.app/users/${currentUser._id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove from local state
        setLocalFriends(prev => prev.filter(friend => friend._id !== friendId));
        // Update Redux state
        dispatch(setFriends({ friends: friends.filter(friend => friend._id !== friendId) }));
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const filteredFriends = () => {
    let filtered = [...friends];
    
    switch (filter) {
      case "online":
        return filtered.filter(friend => friend.isOnline);
      case "recent":
        // Sort by online status and recency
        return filtered.sort((a, b) => {
          if (a.isOnline && !b.isOnline) return -1;
          if (!a.isOnline && b.isOnline) return 1;
          return 0;
        });
      default:
        return filtered;
    }
  };

  const displayedFriends = showAll ? filteredFriends() : filteredFriends().slice(0, maxDisplay);
  const onlineCount = friends.filter(f => f.isOnline).length;
  const totalCount = friends.length;

  if (displayMode === "compact") {
    return (
      <WidgetWrapper className="!p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Users size={16} className="text-blue-600" />
            </div>
            <Typography variant="subtitle1" fontWeight="600">
              Friends ({totalCount})
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">{onlineCount} online</span>
          </div>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <CircularProgress size={24} />
            </div>
          ) : displayedFriends.length > 0 ? (
            displayedFriends.map((friend) => (
              <FriendCompact
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                userPicturePath={friend.picturePath}
                isFriend={true}
              />
            ))
          ) : (
            <Typography color="textSecondary" className="text-center py-4">
              No friends yet
            </Typography>
          )}
        </div>
        
        {!showAll && totalCount > maxDisplay && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-3 text-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Show all {totalCount} friends
          </button>
        )}
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <Typography variant="h6" fontWeight="600" color={palette.neutral.dark}>
              Your Friends
            </Typography>
            <Typography variant="caption" color={palette.neutral.medium}>
              {totalCount} connections • {onlineCount} online now
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </IconButton>
          <IconButton
            size="small"
            className="bg-gray-100 hover:bg-gray-200"
          >
            <MoreHorizontal size={16} />
          </IconButton>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          All ({totalCount})
        </button>
        <button
          onClick={() => setFilter("online")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "online"
              ? "bg-emerald-50 text-emerald-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <span className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            Online ({onlineCount})
          </span>
        </button>
        <button
          onClick={() => setFilter("recent")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "recent"
              ? "bg-purple-50 text-purple-600"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Recent
        </button>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDisplayMode("detailed")}
            className={`p-2 rounded-lg ${displayMode === "detailed" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setDisplayMode("compact")}
            className={`p-2 rounded-lg ${displayMode === "compact" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            <List size={18} />
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {displayMode === "detailed" ? "Detailed view" : "Compact view"}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <CircularProgress size={48} className="mb-4" />
          <Typography color={palette.neutral.medium}>
            Loading your friends...
          </Typography>
        </div>
      ) : (
        <>
          {/* Friends List */}
          <Box className="space-y-4">
            {displayedFriends.length > 0 ? (
              displayedFriends.map((friend) => (
                <div key={friend._id} className="relative group">
                  <Friend
                    friendId={friend._id}
                    name={`${friend.firstName} ${friend.lastName}`}
                    subtitle={friend.occupation}
                    userPicturePath={friend.picturePath}
                    occupation={friend.occupation}
                    location={friend.location}
                  />
                  
                  {/* Quick Actions */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveFriend(friend._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600"
                    >
                      <UserMinus size={14} />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <UserX size={24} className="text-gray-400" />
                </div>
                <Typography variant="h6" fontWeight="500" className="mb-2">
                  No friends found
                </Typography>
                <Typography color={palette.neutral.medium} className="mb-6">
                  {filter !== "all" 
                    ? `No friends match your "${filter}" filter`
                    : "Connect with people to build your network"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={18} />}
                  sx={{
                    backgroundColor: palette.primary.main,
                    '&:hover': {
                      backgroundColor: palette.primary.dark,
                    }
                  }}
                >
                  Find Friends
                </Button>
              </div>
            )}
          </Box>

          {/* Footer Actions */}
          {!showAll && totalCount > maxDisplay && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowAll(true)}
                className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-2"
              >
                <span>Show all {totalCount} friends</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Stats Summary */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck size={16} className="text-blue-600" />
                  <span className="text-xs text-gray-600">Online</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{onlineCount}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={16} className="text-gray-600" />
                  <span className="text-xs text-gray-600">Total</span>
                </div>
                <div className="text-xl font-bold text-gray-900">{totalCount}</div>
              </div>
            </div>
          </div>

          {/* Add Friend CTA */}
          <div className="mt-6">
            <Button
              fullWidth
              variant="outlined"
              startIcon={<UserPlus size={18} />}
              sx={{
                borderColor: palette.primary.light,
                color: palette.primary.main,
                '&:hover': {
                  borderColor: palette.primary.main,
                  backgroundColor: palette.primary.light + '20',
                }
              }}
            >
              Add New Friends
            </Button>
          </div>
        </>
      )}
    </WidgetWrapper>
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