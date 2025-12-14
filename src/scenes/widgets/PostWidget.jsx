import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friend from "../../components/Friend";
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

  const handleLike = async () => {
    try {
      const response = await fetch(
        `https://echocircle-backend.vercel.app/posts/${postId}/like`,
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
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <article className="space-y-3">
      {/* Header: author */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Friend
            friendId={postUserId}
            name={name}
            subtitle={location}
            userPicturePath={userPicturePath}
          />
        </div>
      </div>

      {/* Text */}
      {description && (
        <p className="text-sm leading-relaxed text-neutral-100">
          {description}
        </p>
      )}

      {/* Image */}
      {picturePath && (
        <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl border border-red-900/70 bg-black/80">
          {picturePath.startsWith("http") ||
          picturePath.startsWith("data:image") ? (
            <img
              src={picturePath}
              alt="post"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="text-xs text-neutral-500">Image not available</div>';
              }}
            />
          ) : (
            <span className="text-xs text-neutral-500">Image preview</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between text-xs text-neutral-300">
        <div className="flex items-center gap-4">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            aria-label="like post"
            className="flex items-center gap-1"
          >
            {isLiked ? (
              <FavoriteOutlined sx={{ fontSize: 18 }} className="text-red-500" />
            ) : (
              <FavoriteBorderOutlined sx={{ fontSize: 18 }} />
            )}
            <span>{likeCount}</span>
          </button>

          {/* Comments */}
          <button
            type="button"
            onClick={() => setIsCommentsVisible(!isCommentsVisible)}
            aria-label="toggle comments"
            className="flex items-center gap-1"
          >
            <ChatBubbleOutlineOutlined sx={{ fontSize: 18 }} />
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Share */}
        <button
          type="button"
          aria-label="share post"
          className="flex items-center justify-center rounded-full border border-red-900/70 bg-black/70 px-2 py-1 hover:border-red-500"
        >
          <ShareOutlined sx={{ fontSize: 18 }} />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-900/60 to-transparent" />

      {/* Comments */}
      {isCommentsVisible && (
        <div className="space-y-2 border-l border-red-900/60 pl-3">
          {comments.map((comment, index) => (
            <div key={`${name}-${index}`} className="space-y-1">
              <p className="text-xs text-neutral-100">{comment}</p>
              <div className="h-px w-full bg-neutral-800/70" />
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-xs text-neutral-500">No comments yet</p>
          )}
        </div>
      )}
    </article>
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