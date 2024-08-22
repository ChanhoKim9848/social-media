import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
  // password state
  const [showPassword, setShowPassword] = useState(false);

  // authentication state, login or signup
  const setAuthScreen = useSetRecoilState(authScreenAtom);

  // set user
  const setUser = useSetRecoilState(userAtom);

  // check page loading state
  const [loading, setLoading] = useState(false);

  // user login data
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  // toast message function call
  const showToast = useShowToast();

  // login functionality
  const handleLogin = async () => {
    // if page is loading, set loading state true
    setLoading(true);
    try {
      // login api call
      const res = await fetch("/api/users/login", {
        // POST method
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // JSON input data to string
        body: JSON.stringify(inputs),
      });

      // get user data from login form
      const data = await res.json();

      // if data gives error or invalid, error
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      // save user data on the browser (local storage) and set user after login
      localStorage.setItem("user-info", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      // loading state false
      setLoading(false);
    }
  };

  return (
    // login overall design
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>

        {/* Box design */}
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                // User name input
                type="text"
                value={inputs.username}
                onChange={(e) =>
                  setInputs((inputs) => ({
                    ...inputs,
                    username: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  // user password input
                  type={showPassword ? "text" : "password"}
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((inputs) => ({
                      ...inputs,
                      password: e.target.value,
                    }))
                  }
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              {/* Button design */}
              <Button
                loadingText="Logging in"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                // Login Button Action
                onClick={handleLogin}
                // when page is loading, show loading sign
                isLoading = {loading}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Do not have an account?{" "}
                {/* If signup button is clicked in login state, it shows signup card */}
                <Link
                  color={"blue.400"}
                  onClick={() => setAuthScreen("signup")}
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
