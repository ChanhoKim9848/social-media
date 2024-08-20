import { useEffect, useState } from "react";
import useShowToast from "./useShowToast";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
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
        showToast("Error", error.message, "error");
      } finally {
        // loading state becomes false
        setLoading(false);
      }
    };
    getUser();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
