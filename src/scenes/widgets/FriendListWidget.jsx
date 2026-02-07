import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import { API_URL } from "../../api";
import { Loader2, UserMinus } from "lucide-react";
import Friend from "../../components/Friend";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${API_URL}/users/${userId}/friends`,
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
          dispatch(setFriends({ friends: data }));
        } else {
          console.error("Failed to fetch friends");
          dispatch(setFriends({ friends: [] }));
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        dispatch(setFriends({ friends: [] }));
      }
    };

    if (userId && token) {
      fetchFriends();
    }
  }, [dispatch, token, userId]);

  return (
    <div className="rounded-xl sm:rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-white flex items-center gap-2">
          Friend List
        </h3>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2 custom-scrollbar">
        {Array.isArray(friends) && friends.length > 0 ? (
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
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <UserMinus size={32} className="mb-2 opacity-50" />
            <p className="text-sm">No friends yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendListWidget;