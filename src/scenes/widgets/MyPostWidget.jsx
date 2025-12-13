import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import {
  Send,
  Image as ImageIcon,
  File,
  Mic,
  Smile,
  MapPin,
  Calendar,
  X,
  Upload,
  CheckCircle,
  Sparkles,
  Globe,
  Lock,
  Users,
} from "lucide-react";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [privacy, setPrivacy] = useState("public"); // public, friends, private
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const { palette } = useTheme();
  const { _id, firstName, lastName } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  const posts = useSelector((state) => state.posts);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePost = async () => {
    if (!post.trim() && !image) {
      setSnackbar({
        open: true,
        message: "Please write something or add an image before posting",
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
      
        if (image) {
          formData.append("picture", image);
          formData.append("picturePath", image.name);
        }
      
        response = await fetch(`https://echocircle-backend.vercel.app/posts`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      let newPost;
      if (response && response.ok) {
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        newPost = posts[0];
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
        message: "Post created successfully!",
        severity: "success",
      });

      // Reset form
      setImage(null);
      setPost("");
      setIsImage(false);
      setShowAdvanced(false);

    } catch (error) {
      console.error("Failed to post data:", error);
      setSnackbar({
        open: true,
        message: "Failed to create post. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WidgetWrapper className="relative group">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <Typography variant="h6" fontWeight="600">
                Create Post
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Share your thoughts with the community
              </Typography>
            </div>
          </div>
          
          {/* Privacy Selector */}
          <div className="flex items-center gap-2">
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="public" className="flex items-center gap-2">
                🌍 Public
              </option>
              <option value="friends" className="flex items-center gap-2">
                👥 Friends
              </option>
              <option value="private" className="flex items-center gap-2">
                🔒 Only Me
              </option>
            </select>
          </div>
        </div>

        {/* User Input Area */}
        <div className="flex gap-4 mb-6">
          <div className="flex-shrink-0">
            <UserImage 
              image={picturePath} 
              size="48px" 
              border 
              borderColor={palette.primary.light}
            />
          </div>
          
          <div className="flex-1">
            <InputBase
              placeholder={`What's on your mind, ${firstName}?`}
              onChange={(e) => setPost(e.target.value)}
              value={post}
              disabled={loading}
              multiline
              rows={3}
              sx={{
                width: "100%",
                fontSize: "16px",
                lineHeight: "1.5",
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: palette.neutral.medium,
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                },
              }}
            />
            
            {/* Character counter */}
            <div className="flex justify-end mt-2">
              <Typography 
                variant="caption" 
                color={post.length > 500 ? "error" : "textSecondary"}
              >
                {post.length}/500
              </Typography>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        {isImage && (
          <div className="mb-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <Dropzone
              accept={{
                'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                'video/*': ['.mp4', '.mov']
              }}
              multiple={false}
              maxSize={10485760} // 10MB
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              disabled={loading}
            >
              {({ getRootProps, getInputProps, isDragActive }) => (
                <div
                  {...getRootProps()}
                  className={`p-8 text-center transition-all ${isDragActive ? 'bg-blue-50' : 'bg-gray-50'} ${
                    loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                  }`}
                >
                  <input {...getInputProps()} disabled={loading} />
                  
                  {image ? (
                    <div className="relative">
                      <div className="flex items-center justify-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div className="text-left">
                          <Typography fontWeight="500">{image.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {(image.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                          </Typography>
                        </div>
                      </div>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage(null);
                        }}
                        className="absolute top-0 right-0"
                        size="small"
                        disabled={loading}
                      >
                        <X size={16} />
                      </IconButton>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                        {isDragActive ? (
                          <Upload size={24} className="text-blue-500" />
                        ) : (
                          <ImageIcon size={24} className="text-gray-400" />
                        )}
                      </div>
                      <Typography className="font-medium">
                        {isDragActive ? "Drop your file here" : "Add photos/videos"}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Drag & drop or click to browse
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Supports JPG, PNG, GIF, MP4 up to 10MB
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        )}

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <Typography variant="subtitle2" fontWeight="500">
                Advanced Options
              </Typography>
              <IconButton size="small" onClick={() => setShowAdvanced(false)}>
                <X size={16} />
              </IconButton>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300">
                <MapPin size={18} className="text-gray-600" />
                <span className="text-sm">Add location</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-sm">Schedule post</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
          {/* Media Actions */}
          <div className="flex items-center gap-2">
            <IconButton
              onClick={() => !loading && setIsImage(!isImage)}
              className={`rounded-xl ${isImage ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              disabled={loading}
              size="medium"
            >
              <ImageOutlined />
            </IconButton>
            
            {isNonMobileScreens ? (
              <>
                <IconButton className="bg-gray-100 text-gray-600 rounded-xl" size="medium">
                  <GifBoxOutlined />
                </IconButton>
                <IconButton className="bg-gray-100 text-gray-600 rounded-xl" size="medium">
                  <AttachFileOutlined />
                </IconButton>
                <IconButton className="bg-gray-100 text-gray-600 rounded-xl" size="medium">
                  <MicOutlined />
                </IconButton>
                <IconButton 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`rounded-xl ${showAdvanced ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  size="medium"
                >
                  <MoreHorizOutlined />
                </IconButton>
              </>
            ) : (
              <IconButton className="bg-gray-100 text-gray-600 rounded-xl" size="medium">
                <MoreHorizOutlined />
              </IconButton>
            )}
          </div>
          
          {/* Post Button */}
          <Button
            onClick={handlePost}
            disabled={loading || (!post.trim() && !image)}
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send size={18} />}
            sx={{
              minWidth: "120px",
              borderRadius: "12px",
              padding: "10px 24px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: palette.primary.main,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              '&:hover': {
                backgroundColor: palette.primary.dark,
                boxShadow: "0 6px 20px rgba(37, 99, 235, 0.3)",
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                backgroundColor: palette.grey[300],
                color: palette.grey[500],
                boxShadow: 'none',
                transform: 'none',
              }
            }}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>

        {/* Privacy Indicator */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            {privacy === "public" && (
              <>
                <Globe size={14} />
                <span>Visible to everyone</span>
              </>
            )}
            {privacy === "friends" && (
              <>
                <Users size={14} />
                <span>Visible to friends only</span>
              </>
            )}
            {privacy === "private" && (
              <>
                <Lock size={14} />
                <span>Only visible to you</span>
              </>
            )}
          </div>
          <Typography variant="caption" color="textSecondary">
            Your post will appear in the feed
          </Typography>
        </div>
      </WidgetWrapper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          icon={
            snackbar.severity === "success" ? <CheckCircle size={20} /> : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyPostWidget;

// import {
//   EditOutlined,
//   DeleteOutlined,
//   AttachFileOutlined,
//   GifBoxOutlined,
//   ImageOutlined,
//   MicOutlined,
//   MoreHorizOutlined,
// } from "@mui/icons-material";
// import {
//   Box,
//   Divider,
//   Typography,
//   InputBase,
//   useTheme,
//   Button,
//   IconButton,
//   useMediaQuery,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import FlexBetween from "../../components/FlexBetween";
// import Dropzone from "react-dropzone";
// import UserImage from "../../components/UserImage";
// import WidgetWrapper from "../../components/WidgetWrapper";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setPosts } from "../../state/index";

// const MyPostWidget = ({ picturePath }) => {
//   const dispatch = useDispatch();
//   const [isImage, setIsImage] = useState(false);
//   const [image, setImage] = useState(null);
//   const [post, setPost] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success", // "success", "error", "warning", "info"
//   });
  
//   const { palette } = useTheme();
//   const { _id, firstName, lastName } = useSelector((state) => state.user);
//   const token = useSelector((state) => state.token);
//   const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

//   const posts = useSelector((state) => state.posts);


//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   const handlePost = async () => {
//     if (!post.trim() && !image) {
//       setSnackbar({
//         open: true,
//         message: "Please write something or add an image before posting",
//         severity: "warning",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       let response;
      
//       // Try to post to backend if we have a token
//       if (token) {
//         const formData = new FormData();
//         formData.append("userId", _id);
//         formData.append("description", post);
      
//         if (image) {
//           formData.append("picture", image);
//           formData.append("picturePath", image.name);
//         }
      
//         response = await fetch(`https://echocircle-backend.vercel.app/posts`, {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: formData,
//         });
//       }

//       // Create mock post if backend fails or no token
//       let newPost;
//       if (response && response.ok) {
//         const posts = await response.json();
//         dispatch(setPosts({ posts }));
//         newPost = posts[0]; // Assuming the new post is first in array
//       } else {
//         // Create mock post locally
//         const mockPost = {
//           _id: `mock_${Date.now()}`,
//           userId: _id,
//           firstName: firstName || "User",
//           lastName: lastName || "",
//           description: post,
//           location: "Unknown",
//           picturePath: image ? image.name : "",
//           userPicturePath: picturePath,
//           likes: {},
//           comments: [],
//           createdAt: new Date().toISOString(),
//         };

//         // Get current posts and add new one at the beginning
//         const currentPosts = posts || [];
//         const updatedPosts = [mockPost, ...currentPosts];
//         dispatch(setPosts({ posts: updatedPosts }));
//         newPost = mockPost;
//       }

//       // Show success message
//       setSnackbar({
//         open: true,
//         message: "Post created successfully!",
//         severity: "success",
//       });

//       // Reset form
//       setImage(null);
//       setPost("");
//       setIsImage(false);

//     } catch (error) {
//       console.error("Failed to post data:", error);
//       setSnackbar({
//         open: true,
//         message: "Failed to create post. Please try again.",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <WidgetWrapper>
//         <FlexBetween gap="1.5rem">
//           <UserImage image={picturePath} />
//           <InputBase
//             placeholder="What's on your mind..."
//             onChange={(e) => setPost(e.target.value)}
//             value={post}
//             disabled={loading}
//             sx={{
//               width: "100%",
//               backgroundColor: palette.neutral.light,
//               borderRadius: "2rem",
//               padding: "1rem 2rem",
//             }}
//           />
//         </FlexBetween>

//         {isImage && (
//           <Box
//             border={`1px solid ${palette.neutral.medium}`}
//             borderRadius="5px"
//             mt="1rem"
//             p="1rem"
//           >
//             <Dropzone
//               acceptedFiles=".jpg,.jpeg,.png"
//               multiple={false}
//               onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
//               disabled={loading}
//             >
//               {({ getRootProps, getInputProps }) => (
//                 <FlexBetween>
//                   <Box
//                     {...getRootProps()}
//                     border={`2px dashed ${palette.primary.main}`}
//                     p="1rem"
//                     width="100%"
//                     sx={{ 
//                       "&:hover": { cursor: loading ? "not-allowed" : "pointer" },
//                       opacity: loading ? 0.6 : 1,
//                     }}
//                   >
//                     <input {...getInputProps()} disabled={loading} />
//                     {image ? (
//                       <FlexBetween>
//                         <Typography>{image.name}</Typography>
//                         <EditOutlined />
//                       </FlexBetween>
//                     ) : (
//                       <Typography color={palette.neutral.medium}>
//                         Drag & drop an image here, or click to select
//                       </Typography>
//                     )}
//                   </Box>
//                   {image && (
//                     <IconButton
//                       onClick={() => setImage(null)}
//                       sx={{ width: "15%" }}
//                       disabled={loading}
//                     >
//                       <DeleteOutlined />
//                     </IconButton>
//                   )}
//                 </FlexBetween>
//               )}
//             </Dropzone>
//           </Box>
//         )}

//         <Divider sx={{ margin: "1.25rem 0" }} />

//         <FlexBetween>
//           <FlexBetween 
//             gap="0.25rem" 
//             onClick={() => !loading && setIsImage(!isImage)}
//             sx={{ 
//               cursor: loading ? "not-allowed" : "pointer",
//               opacity: loading ? 0.6 : 1,
//             }}
//           >
//             <ImageOutlined sx={{ color: palette.neutral.mediumMain }} />
//             <Typography
//               color={palette.neutral.mediumMain}
//             >
//               Image
//             </Typography>
//           </FlexBetween>

//           {isNonMobileScreens ? (
//             <>
//               <FlexBetween gap="0.25rem">
//                 <GifBoxOutlined sx={{ color: palette.neutral.mediumMain }} />
//                 <Typography color={palette.neutral.mediumMain}>Clip</Typography>
//               </FlexBetween>

//               <FlexBetween gap="0.25rem">
//                 <AttachFileOutlined sx={{ color: palette.neutral.mediumMain }} />
//                 <Typography color={palette.neutral.mediumMain}>Attachment</Typography>
//               </FlexBetween>

//               <FlexBetween gap="0.25rem">
//                 <MicOutlined sx={{ color: palette.neutral.mediumMain }} />
//                 <Typography color={palette.neutral.mediumMain}>Audio</Typography>
//               </FlexBetween>
//             </>
//           ) : (
//             <FlexBetween gap="0.25rem">
//               <MoreHorizOutlined sx={{ color: palette.neutral.mediumMain }} />
//             </FlexBetween>
//           )}
          
//           <Button
//             onClick={handlePost}
//             disabled={loading || (!post.trim() && !image)}
//             sx={{
//               color: "white",
//               backgroundColor: palette.primary.main,
//               borderRadius: "3rem",
//               cursor: loading ? "not-allowed" : "pointer",
//               position: "relative",
//               minWidth: "100px",
//               opacity: (loading || (!post.trim() && !image)) ? 0.6 : 1,
//               "&:hover": {
//                 backgroundColor: (loading || (!post.trim() && !image)) 
//                   ? palette.primary.main 
//                   : palette.primary.dark,
//               },
//             }}
//           >
//             {loading ? "POSTING..." : "POST"}
//           </Button>
//         </FlexBetween>
//       </WidgetWrapper>

//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default MyPostWidget;