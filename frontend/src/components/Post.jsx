import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

// function that gets data from each post

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  useEffect(() => {
    // functions gets user data from a post
    const getUser = async () => {
      try {
        // fetch user depending on the user's id
        // api call user
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();

        // if user does not eixst, error
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  // delete post function with button
  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      // confirmation message if user confirms to delete
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      // method delete api call
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));  
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // if function did not get user data, no post will be shown
  if (!user) return null;

  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex gap={3} mb={4} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          {/* Avatar image on profile */}
          {/* if profile exist, then show user profile picture. */}
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            // if we click text, we go to user's profile
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {/* Comments section layout */}

            {/* if replies are less than 3 and 0, boring sign is displayed next to comment */}
            {post.replies.length === 0 && <Text textAlign={"center"}>😪</Text>}
            {/* if replies are 3 and more, we show 3 profile pictures of users who replied */}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[0].userProfilePic}
                position={"absolute"}
                top={"0px"}
                left="15px"
                padding={"2px"}
              />
            )}

            {post.replies[1] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[1].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                right="-5px"
                padding={"2px"}
              />
            )}

            {post.replies[2] && (
              <Avatar
                size="xs"
                name="John doe"
                src={post.replies[2].userProfilePic}
                position={"absolute"}
                bottom={"0px"}
                left="4px"
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        {/* account name display */}
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              {/* if we click text, we go to user's profile */}
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>

              {/* verified sign next to account name */}
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text
                fontSize={"xs"}
                width={36}
                textAlign={"right"}
                color={"gray.light"}
              >
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>

              {/* logout, question mark prevents user getting error,
               when current user is undefined */}
              {currentUser?._id === user._id && (
                <DeleteIcon size={20} onClick={handleDeletePost} />
              )}
            </Flex>
          </Flex>
          {/* elements and layout of user post section */}
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}
          <Flex gap={3} my={1}>
            {/* heart icon action */}
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
