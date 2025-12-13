import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friends, setLocalFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock friends data
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
        const response = await fetch(`https://echocircle-backend.vercel.app/users/${userId}/friends`, {
          method: "GET",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLocalFriends(data);
          dispatch(setFriends({ friends: data }));
        } else {
          // Use mock data if API fails
          console.log("Using mock friends data");
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

    if (userId && token) {
      fetchFriends();
    }
  }, [dispatch, token, userId]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      
      {loading ? (
        <Typography color={palette.neutral.medium}>Loading friends...</Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          ) : (
            <Typography color={palette.neutral.medium}>No friends found</Typography>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;