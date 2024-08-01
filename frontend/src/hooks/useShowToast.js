import { useToast } from "@chakra-ui/react";
import React from "react";


// Toast message setting to call in every functions.
const useShowToast = () => {
  const toast = useToast();
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };
  return showToast;
};

export default useShowToast;
