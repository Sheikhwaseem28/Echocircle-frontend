import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
import { API_URL } from "../../api";
import {
  User,
  MapPin,
  Briefcase,
  Eye,
  Calendar,
  Globe,
  Settings,
  Award,
  Sparkles,
  Loader2,
} from "lucide-react";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/users/${userId}`,
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
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-rose-500" size={24} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800/50">
        <User size={32} className="mx-auto text-gray-600 mb-2" />
        <p className="text-gray-400">User not found</p>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,

    createdAt,
  } = user;

  const joinDate = new Date(createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Profile Header Block */}
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <div className="relative">
            <UserImage image={picturePath} size="lg" mobileSize="md" />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-900 ring-2 ring-gray-900/50"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-2">
              {firstName} {lastName}
              {isOwnProfile && <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">YOU</span>}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="truncate max-w-[150px]">{friends?.length || 0} friends</span>
              <span>•</span>
              <Globe size={12} />
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <button
            className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-all"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="py-2">
        <div className="space-y-5">
          {/* Info Items */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300 group hover:bg-gray-800/20 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400 group-hover:text-rose-400 transition-colors">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p>{location || "No location set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300 group hover:bg-gray-800/20 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400 group-hover:text-blue-400 transition-colors">
                <Briefcase size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Occupation</p>
                <p>{occupation || "No occupation set"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-300 group hover:bg-gray-800/20 p-2 rounded-lg transition-colors">
              <div className="p-2 rounded-lg bg-gray-800/50 text-gray-400 group-hover:text-purple-400 transition-colors">
                <Calendar size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Joined</p>
                <p>{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Verification Badge (Decorative) */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 flex items-center gap-3">
            <Award size={18} className="text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-400">Verified Member</p>
              <p className="text-xs text-green-500/60">Identity confirmed</p>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-gray-800/20 border border-gray-800/50">
              <p className="text-xs text-gray-500 mb-1">Profile Views</p>
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-gray-400" />
                <span className="text-lg font-bold text-white">{viewedProfile}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-800/20 border border-gray-800/50">
              <p className="text-xs text-gray-500 mb-1">Impressions</p>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-gray-400" />
                <span className="text-lg font-bold text-white">{impressions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;