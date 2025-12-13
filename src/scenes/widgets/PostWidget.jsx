import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import { 
  Box, 
  Divider, 
  IconButton, 
  Typography, 
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";
import {
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Flag,
  Link,
  BarChart,
  Users,
  Eye,
  Calendar,
  MapPin,
  Hash,
  Send,
  MoreHorizontal,
  CheckCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes = {}, 
  comments = [],
  shares = 0,
  views = 0,
  tags = [],
  createdAt,
  viewMode = "detailed",
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [commentInput, setCommentInput] = useState("");
  const [postComments, setPostComments] = useState(comments);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const { palette } = useTheme();
  const primaryColor = palette.primary.main;

  // Format time ago
  const timeAgo = createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : "Just now";

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      
      const response = await fetch(`https://echocircle-backend.vercel.app/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    
    try {
      setLoading(true);
      // Mock comment addition
      const newComment = {
        id: Date.now(),
        user: "You",
        text: commentInput,
        time: "Just now"
      };
      
      setPostComments(prev => [...prev, newComment]);
      setCommentInput("");
      
      // In real app, send to backend
      // const response = await fetch(`/posts/${postId}/comment`, {...});
      
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s post`,
          text: description,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Show success message
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Compact view for sidebars
  if (viewMode === "compact") {
    return (
      <WidgetWrapper className="!p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            src={userPicturePath}
            sx={{ width: 40, height: 40 }}
          >
            {name?.charAt(0)}
          </Avatar>
          <div className="flex-1">
            <Typography variant="subtitle2" fontWeight="600">
              {name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {timeAgo}
            </Typography>
          </div>
        </div>
        
        <Typography variant="body2" className="mb-3 line-clamp-2">
          {description}
        </Typography>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-600 hover:text-red-500"
            >
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </button>
            <button 
              onClick={() => setIsCommentsVisible(!isCommentsVisible)}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-500"
            >
              <MessageSquare size={14} />
              <span>{postComments.length}</span>
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </WidgetWrapper>
    );
  }

  return (
    <WidgetWrapper className="group relative">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar
              src={userPicturePath}
              sx={{ 
                width: 48, 
                height: 48,
                border: `2px solid ${palette.primary.light}`
              }}
            >
              {name?.charAt(0)}
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Typography variant="h6" fontWeight="600">
                {name}
              </Typography>
              {postUserId === loggedInUserId && (
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {timeAgo}
              </span>
              {location && (
                <>
                  <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* More Options */}
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={isBookmarked ? 'text-amber-500' : 'text-gray-400'}
          >
            <Bookmark size={18} fill={isBookmarked ? "currentColor" : "none"} />
          </IconButton>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            className="text-gray-400"
          >
            <MoreHoriz />
          </IconButton>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Content */}
      <Typography 
        variant="body1" 
        className="mb-4 leading-relaxed whitespace-pre-line"
      >
        {description}
      </Typography>

      {/* Post Image */}
      {picturePath && (
        <Box
          className="relative rounded-2xl overflow-hidden mb-4"
          sx={{
            backgroundColor: palette.neutral.light,
            minHeight: '400px',
            maxHeight: '600px',
          }}
        >
          <img
            src={picturePath}
            alt="Post content"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div class="text-center">
                    <ImageOutlined className="text-gray-400 mb-2 mx-auto" size={48} />
                    <Typography color="textSecondary">Image not available</Typography>
                  </div>
                </div>
              `;
            }}
          />
          
          {/* Image Overlay Stats */}
          <div className="absolute bottom-4 right-4 flex items-center gap-4 bg-black/60 text-white px-3 py-2 rounded-xl">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span className="text-sm font-medium">{views.toLocaleString()}</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div className="flex items-center gap-1">
              <Share2 size={14} />
              <span className="text-sm font-medium">{shares.toLocaleString()}</span>
            </div>
          </div>
        </Box>
      )}

      {/* Post Stats */}
      <div className="flex items-center justify-between py-3 border-y border-gray-100 mb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-purple-500"></div>
              ))}
            </div>
            <Typography variant="caption" color="textSecondary">
              {likeCount} likes
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-gray-500" />
            <Typography variant="caption" color="textSecondary">
              {postComments.length} comments
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <Share2 size={16} className="text-gray-500" />
            <Typography variant="caption" color="textSecondary">
              {shares} shares
            </Typography>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-gray-500" />
          <Typography variant="caption" color="textSecondary">
            Trending
          </Typography>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            isLiked 
              ? 'bg-red-50 text-red-600' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span className="font-medium">{isLiked ? "Liked" : "Like"}</span>
        </button>
        
        <button
          onClick={() => setIsCommentsVisible(!isCommentsVisible)}
          className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all"
        >
          <MessageSquare size={20} />
          <span className="font-medium">Comment</span>
        </button>
        
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          {isSharing ? (
            <CircularProgress size={16} />
          ) : (
            <Share2 size={20} />
          )}
          <span className="font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommentsVisible && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <Typography variant="subtitle1" fontWeight="600" className="mb-4">
            Comments ({postComments.length})
          </Typography>
          
          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <Avatar
              sx={{ width: 40, height: 40 }}
              className="flex-shrink-0"
            >
              You
            </Avatar>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={loading || !commentInput.trim()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  {loading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Comments List */}
          {postComments.length > 0 ? (
            <div className="space-y-4">
              {postComments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <Avatar
                    sx={{ width: 32, height: 32 }}
                    className="flex-shrink-0"
                  >
                    {comment.user?.charAt(0) || "U"}
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3">
                      <Typography variant="subtitle2" fontWeight="500">
                        {comment.user}
                      </Typography>
                      <Typography variant="body2" className="mt-1">
                        {comment.text}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-3">
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Like
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Reply
                      </button>
                      <span className="text-xs text-gray-400">
                        {comment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <Typography color="textSecondary">
                No comments yet. Be the first to comment!
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* More Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '12px',
            minWidth: '200px',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Link size={18} />
          </ListItemIcon>
          <ListItemText primary="Copy link" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <BarChart size={18} />
          </ListItemIcon>
          <ListItemText primary="View insights" />
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Flag size={18} />
          </ListItemIcon>
          <ListItemText primary="Report post" />
        </MenuItem>
      </Menu>
    </WidgetWrapper>
  );
};

export default PostWidget;


// import {
//   ChatBubbleOutlineOutlined,
//   FavoriteBorderOutlined,
//   FavoriteOutlined,
//   ShareOutlined,
// } from "@mui/icons-material";
// import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
// import FlexBetween from "../../components/FlexBetween";
// import Friend from "../../components/Friend";
// import WidgetWrapper from "../../components/WidgetWrapper";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setPost } from "../../state/index";

// const PostWidget = ({
//   postId,
//   postUserId,
//   name,
//   description,
//   location,
//   picturePath,
//   userPicturePath,
//   likes = {}, 
//   comments = [], 
// }) => {
//   const [isCommentsVisible, setIsCommentsVisible] = useState(false);
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.token);
//   const loggedInUserId = useSelector((state) => state.user._id);
//   const isLiked = Boolean(likes[loggedInUserId]);
//   const likeCount = Object.keys(likes).length;

//   const { palette } = useTheme();
//   const mainColor = palette.neutral.main;
//   const primaryColor = palette.primary.main;

//   const handleLike = async () => {
//     try {
//       const response = await fetch(`https://echocircle-backend.vercel.app/posts/${postId}/like`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId: loggedInUserId }),
//       });

//       if (response.ok) {
//         const updatedPost = await response.json();
//         dispatch(setPost({ post: updatedPost }));
//       } else {
//         console.error("Failed to like post");
//       }
//     } catch (error) {
//       console.error("Error liking post:", error);
//     }
//   };

//   return (
//     <WidgetWrapper m="2rem 0">
//       <Friend
//         friendId={postUserId}
//         name={name}
//         subtitle={location}
//         userPicturePath={userPicturePath}
//       />
//       <Typography color={mainColor} sx={{ mt: "1rem" }}>
//         {description}
//       </Typography>
//       {picturePath && (
//         <Box
//           sx={{
//             borderRadius: "0.75rem",
//             marginTop: "0.75rem",
//             width: "100%",
//             height: "300px",
//             backgroundColor: palette.neutral.light,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             overflow: "hidden"
//           }}
//         >
//           {/* Simple image display or placeholder */}
//           {picturePath.startsWith('http') || picturePath.startsWith('data:image') ? (
//             <img
//               src={picturePath}
//               alt="post"
//               style={{ 
//                 width: "100%", 
//                 height: "100%", 
//                 objectFit: "cover" 
//               }}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.style.display = 'none';
//                 e.target.parentElement.innerHTML = '<Typography color="textSecondary">Image not available</Typography>';
//               }}
//             />
//           ) : (
//             <Typography color="textSecondary">Image preview</Typography>
//           )}
//         </Box>
//       )}
//       <FlexBetween mt="0.25rem">
//         <FlexBetween gap="1rem">
//           <FlexBetween gap="0.3rem">
//             <IconButton onClick={handleLike} aria-label="like post">
//               {isLiked ? (
//                 <FavoriteOutlined sx={{ color: primaryColor }} />
//               ) : (
//                 <FavoriteBorderOutlined />
//               )}
//             </IconButton>
//             <Typography>{likeCount}</Typography>
//           </FlexBetween>
//           <FlexBetween gap="0.3rem">
//             <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)} aria-label="toggle comments">
//               <ChatBubbleOutlineOutlined />
//             </IconButton>
//             <Typography>{comments.length}</Typography>
//           </FlexBetween>
//         </FlexBetween>
//         <IconButton aria-label="share post">
//           <ShareOutlined />
//         </IconButton>
//       </FlexBetween>
//       {isCommentsVisible && (
//         <Box mt="0.5rem">
//           {comments.map((comment, index) => (
//             <Box key={`${name}-${index}`}>
//               <Divider />
//               <Typography sx={{ color: mainColor, m: "0.5rem 0", pl: "1rem" }}>
//                 {comment}
//               </Typography>
//             </Box>
//           ))}
//           <Divider />
//         </Box>
//       )}
//     </WidgetWrapper>
//   );
// };

// export default PostWidget;