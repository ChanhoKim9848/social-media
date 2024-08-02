import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";

export default function UpdateProfilePage() {
  // get user data from db
  const [user, setUser] = useRecoilState(userAtom);

  // data inputs to update user profile
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });

  const fileRef = useRef(null);

  // call handleImageChange function to check the image file to update
  // imgUrl to render image file on the avatar
  const { handleImageChange, imgUrl } = usePreviewImg();

  return (
    <Flex align={"center"} justify={"center"} my={6}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              {/* if the file is image file, render the image file on the avatar */}
              <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
            </Center>
            <Center w="full">
              {/* if Change Avatar button is clicked, user can choose picture file */}
              <Button w="full" onClick={() => fileRef.current.click()}>
                Change Avatar
              </Button>
              {/* if user choose picture file, handleImageChange function checks if the file is image type */}
              <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
            </Center>
          </Stack>
        </FormControl>
        <FormControl isRequired>
          {/* Full name update */}
          <FormLabel>Full name</FormLabel>
          <Input
            value={inputs.name}
            onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
            placeholder="John doe"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          {/* User name update */}
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="Jonedoe"
            value={inputs.username}
            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl isRequired>
          {/* Email address update */}
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            value={inputs.email}
            onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl isRequired>
          {/* Biography update */}
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="your bio."
            value={inputs.bio}
            onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          {/* Password update */}
          <FormLabel>Password</FormLabel>
          <Input
            value={inputs.password}
            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.500",
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
