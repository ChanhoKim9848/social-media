import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

// components that give the information of users
const UserPage = () => {
  return (
    <>
      <UserHeader />
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
