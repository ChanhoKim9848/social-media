import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  // toast message
  const toast = useToast();
  // toast message to show error
  const showToast = useShowToast();
  // logged in user
  const currentUser = useRecoilValue(userAtom);

  // updating state after certain action is executed
  const [updating, setUpdating] = useState(false);

  // following check. this is used to other user's profile and display follow/unfollow button
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  // follow and unfollow handler
  const handleFollowUnFollow = async () => {
    try {
      if (!currentUser) {
        showToast("Error", "Please login to follow", "error");
        return;
      }

      // if user try to click any button during updating, it does not do anything
      if(updating) return;

      // update user
      setUpdating(true);

      // call follow/unfollow api (POST request)
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // if data does not exist, error
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // otherwise follow / unfollow other user
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop(); // simulate removing user from followers array
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        // currentUser is empty, it does not give error
        user.followers.push(currentUser?._id); // simulate adding to followers array
      }
      setFollowing(!following);

      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      //  updating state becomes false after update
      setUpdating(false);
    }
  };

  // Copy URL function
  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      // Message after link button clicked
      toast({
        title: "Profile link copied!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    // layout with Chakra UI
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        {/* User Profile and Feed Box */}
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {/* Responsive Profile Image */}

          {/* user avatar */}
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              // Responsive medium size to x large size
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {/* if user does not exist, it displays broken profile picture */}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src={"https://bit.ly/broken-link"}
              // Responsive medium size to x large size
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>

      <Text>{user.bio}</Text>

      {/* update profile button */}
      {currentUser?._id === user._id && (
        // Link is used as RouterLink for client side routing
        <Link as={RouterLink} to="/update">
          <Button size={"sm"}>Update Profile</Button>
        </Link>
      )}
      {/* when current user is seeing other user's profile */}
      {currentUser?._id !== user._id && (

        // when button is clicked and updating state, buttons shows loading sign
        <Button size={"sm"} onClick={handleFollowUnFollow} isLoading={updating}>
          {/* if user is already following, button is unfollow otheriwse follow */}
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>Instagram.com</Link>
        </Flex>
        <Flex>
          {/* Icon Buttons Containers Under Profile Image */}
          <Box className="icon-container">
            {/* Instagram Icon from React */}
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                {/* CgMoreO Icon from React */}
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      {/* Feeds and replies */}
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
