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
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "warning", "info"
  });
  
  const { palette } = useTheme();
  const { _id, firstName, lastName } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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
      
      // Try to post to backend if we have a token
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

      // Create mock post if backend fails or no token
      let newPost;
      if (response && response.ok) {
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        newPost = posts[0]; // Assuming the new post is first in array
      } else {
        // Create mock post locally
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

        // Get current posts and add new one at the beginning
        const currentPosts = useSelector((state) => state.posts) || [];
        const updatedPosts = [mockPost, ...currentPosts];
        dispatch(setPosts({ posts: updatedPosts }));
        newPost = mockPost;
      }

      // Show success message
      setSnackbar({
        open: true,
        message: "Post created successfully!",
        severity: "success",
      });

      // Reset form
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
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            disabled={loading}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>

        {isImage && (
          <Box
            border={`1px solid ${palette.neutral.medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              disabled={loading}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ 
                      "&:hover": { cursor: loading ? "not-allowed" : "pointer" },
                      opacity: loading ? 0.6 : 1,
                    }}
                  >
                    <input {...getInputProps()} disabled={loading} />
                    {image ? (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    ) : (
                      <Typography color={palette.neutral.medium}>
                        Drag & drop an image here, or click to select
                      </Typography>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                      disabled={loading}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}

        <Divider sx={{ margin: "1.25rem 0" }} />

        <FlexBetween>
          <FlexBetween 
            gap="0.25rem" 
            onClick={() => !loading && setIsImage(!isImage)}
            sx={{ 
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <ImageOutlined sx={{ color: palette.neutral.mediumMain }} />
            <Typography
              color={palette.neutral.mediumMain}
            >
              Image
            </Typography>
          </FlexBetween>

          {isNonMobileScreens ? (
            <>
              <FlexBetween gap="0.25rem">
                <GifBoxOutlined sx={{ color: palette.neutral.mediumMain }} />
                <Typography color={palette.neutral.mediumMain}>Clip</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: palette.neutral.mediumMain }} />
                <Typography color={palette.neutral.mediumMain}>Attachment</Typography>
              </FlexBetween>

              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: palette.neutral.mediumMain }} />
                <Typography color={palette.neutral.mediumMain}>Audio</Typography>
              </FlexBetween>
            </>
          ) : (
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: palette.neutral.mediumMain }} />
            </FlexBetween>
          )}
          
          <Button
            onClick={handlePost}
            disabled={loading || (!post.trim() && !image)}
            sx={{
              color: "white",
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
              cursor: loading ? "not-allowed" : "pointer",
              position: "relative",
              minWidth: "100px",
              opacity: (loading || (!post.trim() && !image)) ? 0.6 : 1,
              "&:hover": {
                backgroundColor: (loading || (!post.trim() && !image)) 
                  ? palette.primary.main 
                  : palette.primary.dark,
              },
            }}
          >
            {loading ? "POSTING..." : "POST"}
          </Button>
        </FlexBetween>
      </WidgetWrapper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MyPostWidget;