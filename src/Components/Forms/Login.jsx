import { useState } from "react";
import axios from "axios";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);

  const handlePasswordToggle = () => {
    setTogglePassword((prevToggle) => !prevToggle);
  };

  const handleClear = () => {
    setUser({
      email: "",
      password: "",
    });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { email, password } = user;
      const bool = [email, password].every((input) => Boolean(input));

      if (bool) {
        // user login logic
        const body = { email, password };
        const result = await axios.post(
          "http://localhost:5000/api/user",
          body,
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );

        console.log("user login result: ", result);
        if (result.status === 200) {
          toast({
            title: result.data.message,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          handleClear();
          localStorage.setItem("user", JSON.stringify(result.data.user));
          navigate("/chats");
        }
      } else {
        const conditions = {
          [!password]: "Please provide password!",
          [!email]: "Please provide email!",
        };

        const error = conditions[true];
        toast({
          title: error,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl id="userEmail" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          type="email"
          value={user.email}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </FormControl>
      <FormControl id="userPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter your Password"
            type={togglePassword ? "text" : "password"}
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordToggle}>
              {togglePassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        w="100%"
        marginTop={"20px"}
        onClick={handleLogin}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        w="100%"
        marginTop={"5px"}
        onClick={() => setUser({ email: "deven@gmail.com", password: "deven" })}
      >
        Guest Login
      </Button>
    </VStack>
  );
};

export default Login;
