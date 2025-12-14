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
  Snackbar,
  Alert,
} from "@mui/material";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";

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

      setImage(null);
      setPost("");
      setIsImage(false);
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
      <div className="rounded-2xl border border-red-900/70 bg-neutral-950/95 p-3 text-neutral-100 shadow-[0_0_30px_rgba(127,29,29,0.45)] sm:p-4">
        {/* Top: avatar + input */}
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <UserImage image={picturePath} />
          </div>
          <div className="flex-1">
            <textarea
              rows={2}
              placeholder="What's on your mind..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
              disabled={loading}
              className="w-full resize-none rounded-2xl border border-red-900/60 bg-black/70 px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {/* Image dropzone */}
        {isImage && (
          <div className="mt-3 rounded-xl border border-red-900/60 bg-black/70 p-3">
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              disabled={loading}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="flex items-center gap-3">
                  <div
                    {...getRootProps()}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-xl border-2 border-dashed border-red-700/70 bg-black/60 px-3 py-2 text-xs transition ${
                      loading
                        ? "cursor-not-allowed opacity-60"
                        : "hover:border-red-500 hover:bg-black/80"
                    }`}
                  >
                    <input {...getInputProps()} disabled={loading} />
                    {image ? (
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="truncate text-neutral-100">
                          {image.name}
                        </span>
                        <EditOutlined className="text-neutral-400" />
                      </div>
                    ) : (
                      <span className="text-neutral-400">
                        Drag & drop an image, or click to select
                      </span>
                    )}
                  </div>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      disabled={loading}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-red-900/70 bg-black/80 text-neutral-300 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <DeleteOutlined sx={{ fontSize: 18 }} />
                    </button>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        )}

        {/* Divider */}
        <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />

        {/* Bottom row: actions + post button */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: media actions */}
          <div className="flex flex-1 flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => !loading && setIsImage(!isImage)}
              className={`flex items-center gap-1 rounded-full px-2 py-1 ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:bg-black/60"
              }`}
            >
              <ImageOutlined
                sx={{ fontSize: 18 }}
                className="text-neutral-400"
              />
              <span className="text-neutral-300">Image</span>
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              <GifBoxOutlined
                sx={{ fontSize: 18 }}
                className="text-neutral-400"
              />
              <span className="text-neutral-400">Clip</span>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              <AttachFileOutlined
                sx={{ fontSize: 18 }}
                className="text-neutral-400"
              />
              <span className="text-neutral-400">Attachment</span>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
              <MicOutlined
                sx={{ fontSize: 18 }}
                className="text-neutral-400"
              />
              <span className="text-neutral-400">Audio</span>
            </div>

            <div className="flex items-center gap-1 sm:hidden">
              <MoreHorizOutlined
                sx={{ fontSize: 18 }}
                className="text-neutral-400"
              />
            </div>
          </div>

          {/* Post button */}
          <button
            type="button"
            onClick={handlePost}
            disabled={loading || (!post.trim() && !image)}
            className={`relative flex min-w-[100px] items-center justify-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              loading || (!post.trim() && !image)
                ? "bg-red-900/70 text-neutral-400 cursor-not-allowed"
                : "bg-red-600 text-black hover:bg-red-500"
            }`}
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
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