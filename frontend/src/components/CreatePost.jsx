import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

// maximum text characters in post
const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  //  make postText and setPostText state to check how many characters
  //  are currently typed in text input and how many characters left can be typed
  const [postText, setPostText] = useState("");

  // call handleImageChange function to check the image file to update
  // imgUrl to render image file on the avatar
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  //   image type variable
  const imageRef = useRef(null);

  //   set the maximum text value can be typed in a post
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);

  //   check user state
  const user = useRecoilValue(userAtom);

  //   toast message
  const showToast = useShowToast();

  //  loading state
  const [loading, setLoading] = useState(false);

  // set post states
  const [posts, setPosts] = useRecoilState(postsAtom);

  // username
  const {username} = useParams();

  //   get text input value from post
  const handleTextChange = (e) => {
    // current input characters
    const inputText = e.target.value;

    // if input characters exceed max characters
    if (inputText.length > MAX_CHAR) {
      // stop user from typing characters into the text field
      const truncatedText = inputText.slice(0, MAX_CHAR);

      // set remaining characters to 0
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      // set post text that will be typed
      // get post text length that user typed and decrement it from max characters
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  //   handling create post function
  const handleCreatePost = async () => {
    // loading state is true when create post
    setLoading(true);

    try {
      // create api call
      const res = await fetch(`/api/posts/create`, {
        // post method and json data
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      // if data does not exist, error
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // post success
      showToast("Success", "Post created successfully", "success");

      // if user and user on profile page are same (users on their own pages)
      // user can add new posts (user cannot post on other user's profile)
      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      // close adding post
      onClose();

      // empty text and img after create a post
      setPostText("");
      setImgUrl("");

    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      // after creating post, loading state set to false
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Post </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />

              {/* Text Input  */}
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              {/* Image upload input and rendering*/}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              {/* Image upload button */}
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {/* if image is selected, we render image below text area in the post */}
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />

                {/* delete image button and set imgUrl empty string */}
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              // when it is loading state,
              // button display loading sign and user cannot press
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
