import { Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
  //
  const [posts, setPosts] = useState([]);
  // loading state
  const [loading, setLoading] = useState(true);
  // toast message
  const showToast = useShowToast();

  useEffect(() => {
    // display my feed with other user posts whom I am following
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        // get other users post in the feed
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast]);
  return (
    <>
      {!loading && posts.length === 0 && (
        <h1>Follow some users to see the feed!</h1>
      )}
      {loading && (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default HomePage;
