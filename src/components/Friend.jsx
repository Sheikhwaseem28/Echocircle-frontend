import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import UserImage from "./UserImage";
import { API_URL } from "../api";

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
        `${API_URL}/users/${_id}/${friendId}`,
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
    <div className="flex items-center justify-between gap-3 p-2 sm:p-3 rounded-xl hover:bg-gray-800/30 transition-colors duration-200">
      {/* Left: avatar + name - Mobile optimized */}
      <button
        type="button"
        onClick={handleNavigate}
        className="flex flex-1 items-center gap-3 text-left min-h-[60px] active:bg-gray-800/50 rounded-lg p-2 -ml-2"
        aria-label={`View ${name}'s profile`}
      >
        <div className="relative">
          <UserImage
            image={userPicturePath}
            size="48px"
            mobileSize="48px"
          />
          {/* Online indicator for mobile */}
          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-gray-900 bg-gray-500">
            {/* Status indicator - you can add logic for online/offline */}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate hover:text-red-400 transition-colors">
            {name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {subtitle}
          </p>
        </div>
      </button>

      {/* Right: add/remove friend button - Mobile touch optimized */}
      <button
        type="button"
        onClick={handlePatchFriend}
        className="flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 active:scale-95 transition-all duration-200 min-h-[44px] min-w-[44px]"
        aria-label={isFriend ? `Remove ${name} from friends` : `Add ${name} as friend`}
      >
        <div className="p-2">
          {isFriend ? (
            <PersonRemoveOutlined
              sx={{
                fontSize: { xs: 20, sm: 22 },
                color: "white"
              }}
            />
          ) : (
            <PersonAddOutlined
              sx={{
                fontSize: { xs: 20, sm: 22 },
                color: "white"
              }}
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default Friend;
