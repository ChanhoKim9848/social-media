import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
  // user login data from recoil authentication
  const user = useRecoilValue(userAtom);
  return (
    <Container maxW="620px">
      <Header />
      <Routes>
        <Route
          path="/"
          // if user is not logged in, it shows authentication page
          element={user ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          // otherwise shows homepage
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/update"
          //  if user logged in, update profile page otherwise the app goes to authentication page
          element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
        />
        <Route path="/:username" element={user ? 
          (
            <>
            {/* if user logged in, user page and create post button are displayed */}
            <UserPage />
            <CreatePost/>
            </>
          ):(
            // else, only show user page
            <UserPage />
          )
        } />
        <Route path="/:username/post/:pid" element={<PostPage />} />
      </Routes>

    </Container>
  );
}

export default App;
