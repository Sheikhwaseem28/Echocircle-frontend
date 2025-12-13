import { useEffect, useState } from "react";
import { 
  Typography, 
  Box, 
  CircularProgress,
  IconButton,
  Button,
  useMediaQuery
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";
import {
  MessageSquare,
  RefreshCw,
  Filter,
  Grid,
  List,
  TrendingUp,
  Flame,
  Clock,
  Users,
  Newspaper,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Hash,
} from "lucide-react";

const PostsWidget = ({ userId, isProfile = false, viewMode = "detailed" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("latest"); // latest, trending, popular
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const currentUser = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  // Enhanced mock posts data
  const mockPosts = [
    {
      _id: "1",
      userId: "mockUser1",
      firstName: "Alex",
      lastName: "Johnson",
      description: "Just completed an amazing project! The journey taught me so much about collaboration and innovation. Grateful for the team and the opportunity to grow.",
      location: "San Francisco, CA",
      picturePath: "",
      userPicturePath: "",
      likes: { "user1": true, "user2": true, "user3": true },
      comments: [
        { user: "Jane Smith", text: "Amazing work! 🎉" },
        { user: "Mike Brown", text: "Congrats on the launch!" }
      ],
      shares: 12,
      views: 245,
      tags: ["design", "innovation", "teamwork"],
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      _id: "2",
      userId: "mockUser2",
      firstName: "Sarah",
      lastName: "Williams",
      description: "Beautiful sunset from our hike today. Nature always has a way of putting things in perspective. Remember to take time for yourself!",
      location: "Rocky Mountains",
      picturePath: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
      userPicturePath: "",
      likes: { "user1": true, "user2": true, "user3": true, "user4": true, "user5": true },
      comments: [
        { user: "John Doe", text: "Stunning view! 😍" },
        { user: "Emma Davis", text: "Where is this?" },
        { user: "Sarah Williams", text: "@Emma Davis It's in Colorado!" }
      ],
      shares: 24,
      views: 512,
      tags: ["nature", "hiking", "photography"],
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    },
    {
      _id: "3",
      userId: "mockUser3",
      firstName: "Michael",
      lastName: "Chen",
      description: "Just published a new article about web development trends for 2024. Check it out and let me know your thoughts!",
      location: "New York, NY",
      picturePath: "",
      userPicturePath: "",
      likes: { "user1": true, "user2": true },
      comments: [
        { user: "Tech Enthusiast", text: "Great insights!" },
        { user: "Developer Pro", text: "Looking forward to reading this." }
      ],
      shares: 8,
      views: 187,
      tags: ["webdev", "technology", "2024"],
      createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    },
  ];

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const url = isProfile 
        ? `https://echocircle-backend.vercel.app/posts/${userId}/posts`
        : "https://echocircle-backend.vercel.app/posts";

      const response = await fetch(url, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched posts:", data);
        
        // If page 1, replace posts, otherwise append
        if (pageNum === 1) {
          dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
        } else {
          // Append logic for pagination
          const currentPosts = posts || [];
          dispatch(setPosts({ posts: [...currentPosts, ...(Array.isArray(data) ? data : [])] }));
        }
        
        // Check if there are more posts
        setHasMore(data.length === 10); // Assuming 10 posts per page
      } else {
        // Use mock data if API fails
        console.log("Using mock posts data");
        dispatch(setPosts({ posts: pageNum === 1 ? mockPosts : [...posts, ...mockPosts] }));
        setHasMore(pageNum < 3); // Mock pagination
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Use mock data on error
      dispatch(setPosts({ posts: pageNum === 1 ? mockPosts : [...posts, ...mockPosts] }));
      setHasMore(pageNum < 3); // Mock pagination
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, [dispatch, isProfile, userId, token]);

  const handleRefresh = () => {
    fetchPosts(1);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const filteredPosts = () => {
    let filtered = [...(posts || [])];
    
    switch (filter) {
      case "trending":
        return filtered.sort((a, b) => {
          const aScore = (a.likes ? Object.keys(a.likes).length : 0) + (a.comments?.length || 0) * 2;
          const bScore = (b.likes ? Object.keys(b.likes).length : 0) + (b.comments?.length || 0) * 2;
          return bScore - aScore;
        });
      case "popular":
        return filtered.sort((a, b) => {
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          const aTimeScore = Date.now() - aDate.getTime();
          const bTimeScore = Date.now() - bDate.getTime();
          const aPopularity = (a.likes ? Object.keys(a.likes).length : 0) / (aTimeScore / 3600000 + 1);
          const bPopularity = (b.likes ? Object.keys(b.likes).length : 0) / (bTimeScore / 3600000 + 1);
          return bPopularity - aPopularity;
        });
      default: // latest
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const displayPosts = filteredPosts();
  const totalPosts = displayPosts.length;

  if (loading && page === 1) {
    return (
      <Box className="text-center py-12">
        <CircularProgress size={48} className="mb-4" />
        <Typography color="textSecondary">
          Loading posts...
        </Typography>
      </Box>
    );
  }

  if (!displayPosts || displayPosts.length === 0) {
    return (
      <Box className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <div className="p-4 bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Newspaper size={32} className="text-gray-400" />
        </div>
        <Typography variant="h6" fontWeight="500" className="mb-2">
          {isProfile ? "No posts yet" : "No posts to show"}
        </Typography>
        <Typography color="textSecondary" className="mb-6">
          {isProfile 
            ? "This user hasn't shared any posts yet."
            : "Be the first to share something with the community!"
          }
        </Typography>
        {!isProfile && (
          <Button
            variant="contained"
            startIcon={<MessageSquare size={18} />}
            sx={{
              backgroundColor: "primary.main",
              '&:hover': {
                backgroundColor: "primary.dark",
              }
            }}
          >
            Create First Post
          </Button>
        )}
      </Box>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <Typography variant="h6" fontWeight="600">
                {isProfile ? "User Posts" : "Community Feed"}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {totalPosts} posts • Updated just now
              </Typography>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <Button
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderColor: "divider",
                color: "text.primary",
                textTransform: "none",
              }}
            >
              {filter === "latest" && "Latest"}
              {filter === "trending" && "Trending"}
              {filter === "popular" && "Popular"}
            </Button>
            
            <IconButton
              onClick={handleRefresh}
              className="bg-gray-100 hover:bg-gray-200"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setFilter("latest"); setShowFilters(false); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === "latest" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <Clock size={16} />
                Latest
              </button>
              <button
                onClick={() => { setFilter("trending"); setShowFilters(false); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === "trending" 
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <Flame size={16} />
                Trending
              </button>
              <button
                onClick={() => { setFilter("popular"); setShowFilters(false); }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  filter === "popular" 
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <TrendingUp size={16} />
                Popular
              </button>
              <button className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-200 hover:border-gray-300 flex items-center gap-2">
                <Hash size={16} />
                Following
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={16} className="text-blue-600" />
              <span className="text-sm text-gray-600">Total Posts</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{totalPosts}</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-emerald-600" />
              <span className="text-sm text-gray-600">Interactions</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {displayPosts.reduce((sum, post) => sum + (post.comments?.length || 0), 0)}
            </div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-purple-600" />
              <span className="text-sm text-gray-600">Active Users</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {new Set(displayPosts.map(p => p.userId)).size}
            </div>
          </div>
          <div className="bg-amber-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-amber-600" />
              <span className="text-sm text-gray-600">Engagement</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {Math.round(displayPosts.reduce((sum, post) => sum + (post.likes ? Object.keys(post.likes).length : 0), 0) / totalPosts * 100) / 100 || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid/List */}
      <div className={viewMode === "grid" && isNonMobileScreens ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-6"}>
        {displayPosts.map((post) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            postUserId={post.userId}
            name={`${post.firstName} ${post.lastName}`}
            description={post.description}
            location={post.location}
            picturePath={post.picturePath}
            userPicturePath={post.userPicturePath}
            likes={post.likes || {}}
            comments={post.comments || []}
            shares={post.shares || 0}
            views={post.views || 0}
            tags={post.tags || []}
            createdAt={post.createdAt}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More / Refresh */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={handleLoadMore}
            variant="outlined"
            startIcon={loading ? <CircularProgress size={16} /> : <ChevronDown size={18} />}
            disabled={loading}
            sx={{
              borderColor: "divider",
              color: "text.primary",
              textTransform: "none",
              padding: "10px 32px",
              borderRadius: "12px",
              '&:hover': {
                borderColor: "primary.main",
                backgroundColor: "primary.light + '20'",
              }
            }}
          >
            {loading ? "Loading..." : "Load More Posts"}
          </Button>
        </div>
      )}

      {/* End of Feed */}
      <div className="text-center py-8">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 max-w-md mx-auto">
          <Sparkles size={24} className="text-blue-600 mx-auto mb-2" />
          <Typography variant="subtitle2" fontWeight="500" className="mb-1">
            You're all caught up! 🎉
          </Typography>
          <Typography variant="caption" color="textSecondary">
            You've seen all {totalPosts} posts in your feed
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PostsWidget;


// import { useEffect } from "react";
// import { Typography } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "../../state/index";
// import PostWidget from "./PostWidget";

// const PostsWidget = ({ userId, isProfile = false }) => {
//   const dispatch = useDispatch();
//   const posts = useSelector((state) => state.posts);
//   const token = useSelector((state) => state.token);

//   // Mock posts data
//   const mockPosts = [
//     {
//       _id: "1",
//       userId: "mockUser1",
//       firstName: "John",
//       lastName: "Doe",
//       description: "This is a sample post to test the feed!",
//       location: "New York",
//       picturePath: "",
//       userPicturePath: "",
//       likes: {},
//       comments: ["Great post!", "Thanks for sharing"],
//       createdAt: new Date().toISOString(),
//     },
//     {
//       _id: "2",
//       userId: "mockUser2",
//       firstName: "Jane",
//       lastName: "Smith",
//       description: "Another test post with some content.",
//       location: "Los Angeles",
//       picturePath: "",
//       userPicturePath: "",
//       likes: {},
//       comments: [],
//       createdAt: new Date().toISOString(),
//     },
//   ];

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const url = isProfile 
//           ? `https://echocircle-backend.vercel.app/posts/${userId}/posts`
//           : "https://echocircle-backend.vercel.app/posts";

//         const response = await fetch(url, {
//           method: "GET",
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log("Fetched posts:", data);
//           dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
//         } else {
//           // Use mock data if API fails
//           console.log("Using mock posts data");
//           dispatch(setPosts({ posts: mockPosts }));
//         }
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//         // Use mock data on error
//         dispatch(setPosts({ posts: mockPosts }));
//       }
//     };

//     fetchPosts();
//   }, [dispatch, isProfile, userId, token]);

//   return (
//     <>
//       {Array.isArray(posts) && posts.length > 0 ? (
//         posts.map((post) => (
//           <PostWidget
//             key={post._id}
//             postId={post._id}
//             postUserId={post.userId}
//             name={`${post.firstName} ${post.lastName}`}
//             description={post.description}
//             location={post.location}
//             picturePath={post.picturePath}
//             userPicturePath={post.userPicturePath}
//             likes={post.likes || {}}
//             comments={post.comments || []}
//           />
//         ))
//       ) : (
//         <Typography>No posts available</Typography>
//       )}
//     </>
//   );
// };

// export default PostsWidget;