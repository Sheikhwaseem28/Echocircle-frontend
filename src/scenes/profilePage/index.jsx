import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import { API_URL } from "../../api";
import { Loader2 } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const isOwnProfile = userId === loggedInUserId;

  const getUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) {
      getUser();
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-rose-500/30">
      <Navbar />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-900/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left Column - User Info (Desktop: Sticky) */}
          <div className="lg:col-span-3 lg:col-start-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <UserWidget userId={userId} picturePath={user.picturePath} />

              {/* Only show friend list for desktop here, mobile can be different if needed */}
              <div className="hidden lg:block">
                <FriendListWidget userId={userId} />
              </div>
            </div>
          </div>

          {/* Middle Column - Feed */}
          <div className="lg:col-span-6 lg:col-start-4 space-y-6">
            {/* Only show "MyPostWidget" if it's the logged-in user's profile */}
            {isOwnProfile && (
              <MyPostWidget picturePath={user.picturePath} />
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent my-8" />

            <PostsWidget userId={userId} isProfile />
          </div>

          {/* Right Column - Additional Info or Friends (Mobile: Order changes) */}
          <div className="lg:col-span-3 lg:col-start-10 space-y-6">
            {/* Show friend list here on specific responsive breakpoints if needed, or other widgets */}
            <div className="block lg:hidden">
              <FriendListWidget userId={userId} />
            </div>


          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;