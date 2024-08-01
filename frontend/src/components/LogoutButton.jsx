import { Button } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

// Logout button function
const LogoutButton = () => {
  // user data once it is logged in from auth page
  const setUser = useSetRecoilState(userAtom);
  // call useShowToast function to make toast message
  const showToast = useShowToast();

  //   logout function
  const handleLogout = async () => {
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
      console.log(error);
    }
  };
  return (
    <Button
      position={"fixed"}
      top={"30px"}
      right={"30px"}
      size={"sm"}
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
