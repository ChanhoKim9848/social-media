import { atom } from "recoil";

const userAtom = atom({
  key: "userAtom",
//   after logged in, this function gets user data from browser.
  default: JSON.parse(localStorage.getItem("user-info")),
});

export default userAtom;
