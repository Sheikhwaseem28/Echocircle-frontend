import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friend from "../../components/Friend";
import { setPost } from "../../state/index";
import { API_URL } from "../../api";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Send,
  Smile,
  Globe,
  Users,
  Lock,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

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
  audience = "public",
  tags = [],
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const likeCount = Object.keys(likes).length + (isLiked && !likes[loggedInUserId] ? 1 : 0);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/like`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: loggedInUserId }),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
      } else {
        console.error("Failed to like post");
        // Revert if API fails
        setIsLiked(!newLikedState);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setIsLiked(!newLikedState);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add comment logic here
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  const getAudienceIcon = () => {
    switch (audience) {
      case "private":
        return <Lock size={12} />;
      case "friends":
        return <Users size={12} />;
      default:
        return <Globe size={12} />;
    }
  };

  const getAudienceLabel = () => {
    switch (audience) {
      case "private":
        return "Private";
      case "friends":
        return "Friends Only";
      default:
        return "Public";
    }
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <article className="group">
      {/* Post Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                <div className="h-8 w-8 rounded-xl bg-gray-800 flex items-center justify-center text-white font-semibold">
                  {name?.[0] || "U"}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">{name}</h3>
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-300">
                    {getAudienceIcon()}
                    <span>{getAudienceLabel()}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  {location && <span>📍 {location}</span>}
                  <span>•</span>
                  <span>Just now</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Post Description */}
      {description && (
        <div className="mb-4">
          <p className="text-gray-100 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Image */}
      {picturePath && (
        <div className="mb-4 rounded-xl overflow-hidden border border-gray-800 group-hover:border-gray-700 transition-all duration-300">
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Image preview</p>
                <p className="text-xs text-gray-500 mt-1">
                  {picturePath.includes('.jpg') ? 'JPG Image' : 'Media'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart size={14} className="text-rose-400" />
            <span>{formatCount(likeCount)} likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{formatCount(comments.length)} comments</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {getAudienceLabel()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center border-y border-gray-800/50 py-2 mb-4">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${isLiked
            ? "text-rose-400 hover:text-rose-300"
            : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }`}
        >
          {isLiked ? (
            <Heart size={20} className="text-rose-400" />
          ) : (
            <Heart size={20} />
          )}
          <span className="text-sm font-medium">Like</span>
        </button>

        <button
          onClick={() => setIsCommentsVisible(!isCommentsVisible)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${isCommentsVisible
            ? "text-blue-400 hover:text-blue-300"
            : "text-gray-400 hover:text-white hover:bg-gray-800/30"
            }`}
        >
          <MessageCircle size={20} />
          <span className="text-sm font-medium">Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommentsVisible && (
        <div className="space-y-4">
          {/* Existing Comments */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300">
                Comments ({comments.length})
              </h4>
              {comments.map((comment, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-white">
                      U
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800/30 rounded-xl p-3">
                      <p className="text-sm text-gray-100">{comment.text || comment}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 ml-2 text-xs text-gray-500">
                      <button className="hover:text-rose-400">Like</button>
                      <button className="hover:text-blue-400">Reply</button>
                      <span>2h ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <MessageCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No comments yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to comment</p>
            </div>
          )}

          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full rounded-xl border border-gray-800 bg-gray-900/30 py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <Smile size={20} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className={`px-4 rounded-xl ${newComment.trim()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default PostWidget;