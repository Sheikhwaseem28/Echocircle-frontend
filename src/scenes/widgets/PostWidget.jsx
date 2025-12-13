import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";

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
}) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const mainColor = palette.neutral.main;
  const primaryColor = palette.primary.main;

  const handleLike = async () => {
    try {
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
      } else {
        console.error("Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={mainColor} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <Box
          sx={{
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
            width: "100%",
            height: "300px",
            backgroundColor: palette.neutral.light,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          {/* Simple image display or placeholder */}
          {picturePath.startsWith('http') || picturePath.startsWith('data:image') ? (
            <img
              src={picturePath}
              alt="post"
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover" 
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<Typography color="textSecondary">Image not available</Typography>';
              }}
            />
          ) : (
            <Typography color="textSecondary">Image preview</Typography>
          )}
        </Box>
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleLike} aria-label="like post">
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primaryColor }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)} aria-label="toggle comments">
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton aria-label="share post">
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isCommentsVisible && (
        <Box mt="0.5rem">
          {comments.map((comment, index) => (
            <Box key={`${name}-${index}`}>
              <Divider />
              <Typography sx={{ color: mainColor, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;