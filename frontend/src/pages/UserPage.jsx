import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

// components that give the information of users
const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();

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
      }
    };

    getUser();
  }, [username, showToast]);

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
