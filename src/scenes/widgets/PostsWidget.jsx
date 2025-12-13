import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // Mock posts data
  const mockPosts = [
    {
      _id: "1",
      userId: "mockUser1",
      firstName: "John",
      lastName: "Doe",
      description: "This is a sample post to test the feed!",
      location: "New York",
      picturePath: "",
      userPicturePath: "",
      likes: {},
      comments: ["Great post!", "Thanks for sharing"],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      userId: "mockUser2",
      firstName: "Jane",
      lastName: "Smith",
      description: "Another test post with some content.",
      location: "Los Angeles",
      picturePath: "",
      userPicturePath: "",
      likes: {},
      comments: [],
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
          dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
        } else {
          // Use mock data if API fails
          console.log("Using mock posts data");
          dispatch(setPosts({ posts: mockPosts }));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Use mock data on error
        dispatch(setPosts({ posts: mockPosts }));
      }
    };

    fetchPosts();
  }, [dispatch, isProfile, userId, token]);

  return (
    <>
      {Array.isArray(posts) && posts.length > 0 ? (
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
            likes={post.likes || {}}
            comments={post.comments || []}
          />
        ))
      ) : (
        <Typography>No posts available</Typography>
      )}
    </>
  );
};

export default PostsWidget;