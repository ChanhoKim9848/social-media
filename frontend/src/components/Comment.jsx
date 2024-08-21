import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// user comment components

const Comment = ({ reply, lastReply }) => {
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        {/* User profile image in Comment */}
        <Avatar src={reply.userProfilePic} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* Username of the comment*/}
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>

          {/* User Comment of the comment */}
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {/* if comment is the last one, it does not have a divider (horizontal bar) underneath */}
      {!lastReply ? <Divider /> : null}
    </>
  );
};

export default Comment;
