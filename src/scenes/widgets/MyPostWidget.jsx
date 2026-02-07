import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import { API_URL } from "../../api";
import {
  Image,
  Video,
  File,
  Mic,
  Smile,
  X,
  Send,
  Globe,
  Users,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Alert, Snackbar } from "@mui/material";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState("public"); // public, friends, private
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { _id, firstName, lastName } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const posts = useSelector((state) => state.posts);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePost = async () => {
    if (!post.trim() && !image) {
      setSnackbar({
        open: true,
        message: "Share something with your circle...",
        severity: "warning",
      });
      return;
    }

    setLoading(true);

    try {
      let response;

      if (token) {
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);
        formData.append("audience", audience);
        if (image) {
          formData.append("picture", image);
          formData.append("picturePath", image.name);
        }

        response = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      let newPost;
      if (response && response.ok) {
        const freshPosts = await response.json();
        dispatch(setPosts({ posts: freshPosts }));
        newPost = freshPosts[0];
      } else {
        const mockPost = {
          _id: `mock_${Date.now()}`,
          userId: _id,
          firstName: firstName || "User",
          lastName: lastName || "",
          description: post,
          location: "Unknown",
          picturePath: image ? image.name : "",
          userPicturePath: picturePath,
          audience: audience,
          likes: {},
          comments: [],
          createdAt: new Date().toISOString(),
        };

        const currentPosts = posts || [];
        const updatedPosts = [mockPost, ...currentPosts];
        dispatch(setPosts({ posts: updatedPosts }));
        newPost = mockPost;
      }

      setSnackbar({
        open: true,
        message: `Echo shared ${audience === "private" ? "privately" : "with your circle"}!`,
        severity: "success",
      });

      setImage(null);
      setPost("");
      setIsImage(false);
    } catch (error) {
      console.error("Failed to post data:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const audienceOptions = [
    { value: "public", icon: <Globe size={14} />, label: "Public", description: "Visible to everyone" },
    { value: "friends", icon: <Users size={14} />, label: "Friends", description: "Your friends only" },
    { value: "private", icon: <Lock size={14} />, label: "Private", description: "Only you" },
  ];

  const mediaOptions = [
    { icon: <Image size={18} />, label: "Photo", color: "text-rose-400" },
    { icon: <Video size={18} />, label: "Video", color: "text-blue-400" },
    { icon: <File size={18} />, label: "File", color: "text-green-400" },
    { icon: <Mic size={18} />, label: "Voice", color: "text-purple-400" },
    { icon: <Smile size={18} />, label: "Feeling", color: "text-yellow-400" },
  ];

  return (
    <>
      <div className="rounded-2xl border border-gray-800/50 bg-gradient-to-b from-gray-900/40 to-black/40 backdrop-blur-sm p-4 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-r from-rose-500/20 to-red-500/20 flex items-center justify-center">
              <Sparkles size={18} className="text-rose-400 sm:size-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Share an Echo</h2>
              <p className="text-xs sm:text-sm text-gray-400">What's on your mind?</p>
            </div>
          </div>
        </div>

        {/* User Avatar & Input */}
        <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-shrink-0">
            <UserImage image={picturePath} size="md" mobileSize="md" />
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              placeholder="Share your thoughts, ideas, or moments..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
              disabled={loading}
              className="w-full resize-none rounded-xl border border-gray-800 bg-gray-900/30 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        {isImage && (
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-medium text-gray-300">Add Media</h3>
              <button
                onClick={() => setIsImage(false)}
                className="text-xs text-gray-500 hover:text-white"
              >
                Close
              </button>
            </div>
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png,.gif"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              disabled={loading}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div>
                  <div
                    {...getRootProps()}
                    className={`relative rounded-xl border-2 border-dashed p-4 sm:p-8 text-center transition-all cursor-pointer ${isDragActive
                        ? "border-rose-400 bg-rose-500/10"
                        : "border-gray-700 hover:border-gray-600"
                      } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <input {...getInputProps()} disabled={loading} />
                    {image ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <Image size={20} className="text-rose-400 sm:size-6" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{image.name}</p>
                            <p className="text-xs text-gray-400">
                              {(image.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImage(null);
                          }}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 flex-shrink-0"
                        >
                          <X size={16} className="sm:size-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-center">
                          <Image size={24} className="text-gray-500 sm:size-8" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-300">
                            {isDragActive
                              ? "Drop your image here"
                              : "Tap to add photo"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Dropzone>
          </div>
        )}

        {/* Audience Selector - Scrollable on mobile */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">Who can see this?</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {audienceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setAudience(option.value)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-xs sm:text-sm transition-all flex-shrink-0 ${audience === option.value
                    ? "border-rose-500 bg-rose-500/10 text-white"
                    : "border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                  }`}
              >
                <span className={audience === option.value ? "text-rose-400" : "text-gray-500"}>
                  {option.icon}
                </span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-gray-800/50">
          <div className="flex items-center gap-2 sm:gap-3">
            {mediaOptions.map((media, index) => (
              <button
                key={index}
                onClick={() => {
                  if (media.label === "Photo") setIsImage(!isImage);
                }}
                className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/30 transition-all ${media.label === "Photo" && isImage ? "bg-gray-800/50" : ""
                  }`}
              >
                <span className={media.color}>{media.icon}</span>
                <span className="text-xs text-gray-400 hidden sm:inline">{media.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handlePost}
            disabled={loading || (!post.trim() && !image)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all ${loading || (!post.trim() && !image)
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25"
              }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="hidden sm:inline">Sharing...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span className="hidden sm:inline">Share Echo</span>
              </>
            )}
          </button>
        </div>

        {/* Character Counter */}
        <div className="mt-4 text-right">
          <span className={`text-xs ${post.length > 500 ? "text-red-400" : "text-gray-500"
            }`}>
            {post.length}/500
          </span>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      {post.trim() && (
        <div className="fixed bottom-20 right-4 z-40 sm:hidden">
          <button
            onClick={handlePost}
            disabled={loading}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/30"
            aria-label="Post"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      )}

      {/* Snackbar - Mobile bottom position */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: window.innerWidth < 640 ? "bottom" : "top",
          horizontal: "center"
        }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#1a1a1a',
            color: 'white',
            border: '1px solid #374151',
            borderRadius: '12px',
            maxWidth: window.innerWidth < 640 ? '90vw' : '400px',
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'white',
          }}
          icon={false}
        >
          <div className="flex items-center gap-2">
            {snackbar.severity === 'success' && <Sparkles size={16} className="text-rose-400" />}
            <span className="text-sm">{snackbar.message}</span>
          </div>
        </Alert>
      </Snackbar>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default MyPostWidget;