import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchPosts = async () => {
      const url = isProfile 
        ? `http://localhost:3001/posts/${userId}/posts`
        : "http://localhost:3001/posts";

      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data); // Verify fetched data structure
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    };

    fetchPosts();
  }, [dispatch, isProfile, userId, token]);

  return (
    <>
      {Array.isArray(posts) ? (
        posts.map((post) => (
          <PostWidget
            key={post._id}
            postId={post._id}
            postUserId={post.userId}
            name={`${post.firstName} ${post.lastName}`}
            description={post.description}
            location={post.location}
            picturePath={post.picturePath}
            userPicturePath={post.userPicturePath}
            likes={post.likes}
            comments={post.comments}
          />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </>
  );
};

export default PostsWidget;
