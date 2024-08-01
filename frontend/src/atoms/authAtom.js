import { atom } from "recoil";


// user authentication screen setting
const authScreenAtom = atom({
  key: "authScreenAtom",
//   default login page
  default: "login",
});

export default authScreenAtom;
