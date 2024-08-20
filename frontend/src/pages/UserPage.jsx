import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";

// user's page function, feed, following users, posts...
const UserPage = () => {
  // user and loading
  const { user, loading } = useGetUserProfile();
  // get username to get user data from database
  const { username } = useParams();
  // toast message to show error or success message
  const showToast = useShowToast();
  //  states of the posts
  const [posts, setPosts] = useState([]);
  // loading state, to check posts are loading from the api call
  const [fetchingPosts, setFetchingPosts] = useState(false);

  useEffect(() => {

    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast]);

  // if user does not exist and page is loading,
  // page shows loading sign
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  // if user try to go user page that does not exist and
  // it is not loading page, return user not found
  if (!user && !loading) return <h1>User not found</h1>;

  // if user does not eixst, return null
  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />

      {/* if user does not have any post */}
      {!fetchingPosts && posts.length === 0 && (
        <h1>User does not have any post.</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
