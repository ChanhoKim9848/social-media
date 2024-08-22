import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  //   logout function
  const logout = async () => {
    try {
      // logout api call (POST method)
      const res = await fetch("api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //   if user is not logged in, error
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // otherwise, remove user data from the browser and logged out
      localStorage.removeItem("user-info");
      setUser(null);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return logout;
};

export default useLogout;
