import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";
import { API_URL } from "../../api";
import { Filter, RefreshCw, Sparkles, Loader2, TrendingUp, Users, Globe, Clock, Lock } from "lucide-react";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: "recent", icon: <Clock size={16} />, label: "Most Recent" },
    { id: "popular", icon: <TrendingUp size={16} />, label: "Most Popular" },
    { id: "friends", icon: <Users size={16} />, label: "Friends Only" },
    { id: "public", icon: <Globe size={16} />, label: "Public Posts" },
  ];

  useEffect(() => {
    fetchPosts();
  }, [dispatch, isProfile, userId, token]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const url = isProfile
        ? `${API_URL}/posts/${userId}/posts`
        : `${API_URL}/posts`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched posts:", data);
        dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
      } else {
        console.error("Failed to fetch posts");
        dispatch(setPosts({ posts: [] }));
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      dispatch(setPosts({ posts: [] }));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const getFilteredPosts = () => {
    if (!Array.isArray(posts)) return [];

    let filtered = [...posts];

    switch (activeFilter) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "popular":
        filtered.sort((a, b) => {
          const aLikes = Object.keys(a.likes || {}).length;
          const bLikes = Object.keys(b.likes || {}).length;
          const aComments = (a.comments || []).length;
          const bComments = (b.comments || []).length;
          return (bLikes + bComments) - (aLikes + aComments);
        });
        break;
      case "friends":
        filtered = filtered.filter(post => post.audience === "friends");
        break;
      case "public":
        filtered = filtered.filter(post => post.audience === "public");
        break;
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats and Filters */}
      <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
              <Sparkles size={20} className="text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {isProfile ? "Profile Echoes" : "Latest Echoes"}
              </h2>
              <p className="text-sm text-gray-400">
                {isProfile
                  ? "All posts from this profile"
                  : "Updates from your circles"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-800 bg-gray-900/30 text-gray-300 hover:text-white hover:border-gray-700 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">{filteredPosts.length}</div>
            <div className="text-xs text-gray-400">Total Posts</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {filteredPosts.reduce((acc, post) => acc + Object.keys(post.likes || {}).length, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Likes</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {filteredPosts.reduce((acc, post) => acc + (post.comments || []).length, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Comments</div>
          </div>
          <div className="p-4 rounded-xl bg-gray-900/30 border border-gray-800">
            <div className="text-2xl font-bold text-white">
              {new Set(filteredPosts.map(post => post.userId)).size}
            </div>
            <div className="text-xs text-gray-400">Unique Authors</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${activeFilter === filter.id
                ? "border-rose-500 bg-rose-500/10 text-white"
                : "border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-rose-400 mb-4" />
          <p className="text-gray-400">Loading echoes...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm overflow-hidden hover:border-gray-700 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/60 to-transparent">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                      <div className="h-8 w-8 rounded-xl bg-gray-800 flex items-center justify-center text-white font-semibold">
                        {post.firstName?.[0]}
                        {post.lastName?.[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {post.firstName} {post.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-300">
                          {post.audience === "private" ? <Lock size={10} /> :
                            post.audience === "friends" ? <Users size={10} /> :
                              <Globe size={10} />}
                        </span>
                      </div>
                    </div>
                  </div>
                  {post.location && (
                    <div className="text-xs text-gray-500">
                      📍 {post.location}
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <PostWidget
                  postId={post._id}
                  postUserId={post.userId}
                  name={`${post.firstName} ${post.lastName}`}
                  description={post.description}
                  location={post.location}
                  picturePath={post.picturePath}
                  userPicturePath={post.userPicturePath}
                  likes={post.likes || {}}
                  comments={post.comments || []}
                  audience={post.audience}
                  tags={post.tags}
                />
              </div>

              {/* Engagement Stats */}
              <div className="px-6 py-3 border-t border-gray-800/50 bg-gradient-to-r from-transparent to-gray-900/20">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      ❤️ {Object.keys(post.likes || {}).length} likes
                    </span>
                    <span className="flex items-center gap-1">
                      💬 {(post.comments || []).length} comments
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {post.audience === "private" ? "Private" :
                      post.audience === "friends" ? "Friends Only" :
                        "Public"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Filter className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No posts found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {activeFilter !== "recent"
              ? `No posts match the "${filters.find(f => f.id === activeFilter)?.label}" filter`
              : isProfile
                ? "This user hasn't shared any echoes yet"
                : "Your feed is empty. Start following people to see their posts!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsWidget;