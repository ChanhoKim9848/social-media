import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";

// user's page function, feed, following users, posts...
const UserPage = () => {
  // user state checks if user is logged in or not
  const [user, setUser] = useState(null);
  // get username to get user data from database
  const { username } = useParams();
  // toast message to show error or success message
  const showToast = useShowToast();

  // loading state. to check if page is loading.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if user is logged in, app shows the user feed and profile
    const getUser = async () => {
      try {
        // get user data from the api call
        const res = await fetch(`/api/users/profile/${username}`);
        // get user data from the database
        const data = await res.json();

        // if no data, error
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // otherwise, state is set to the user
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        // loading state becomes false
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  // if user does not exist and page is loading, 
  // page shows loading sign
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />;
      </Flex>
    )
  }
  // if user try to go user page that does not exist and
  // it is not loading page, return user not found
  if (!user && !loading) return <h1>User not found</h1>;

  // if user does not eixst, return null
  if (!user) return null;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle="Let's talk about thread"
      />
      <UserPost
        likes={123}
        replies={213}
        postImg="/post2.png"
        postTitle="NIcueeee"
      />
      <UserPost
        likes={567}
        replies={412}
        postImg="/post3.png"
        postTitle="ez pz"
      />
    </>
  );
};

export default UserPage;
