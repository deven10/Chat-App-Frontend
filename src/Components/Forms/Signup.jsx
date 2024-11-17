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
import { BASE_URL } from "../../config";

const Signup = ({ setTabIndex }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);

  const handlePasswordToggle = () => {
    setTogglePassword((prevToggle) => !prevToggle);
  };

  const handleImage = (pic) => {
    setLoading(true);

    const imageErrorToast = () => {
      setLoading(false);
      toast({
        title: "Invalid Image",
        description: "Select Image - jpeg / png format",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    };

    if (pic === undefined) {
      imageErrorToast();
    }

    const imageFormat = ["image/jpeg", "image/jpg", "image/png"];

    if (imageFormat.includes(pic?.type)) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "deven-umrania");

      fetch("https://api.cloudinary.com/v1_1/deven-umrania/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((result) => {
          setUser((prev) => ({
            ...prev,
            picture: result.url.toString(),
          }));
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      imageErrorToast();
    }
  };

  const handleClear = () => {
    setUser({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      picture: "",
    });
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const { name, email, password, confirmPassword, picture } = user;
      const bool = [name, email, password, confirmPassword].every((input) =>
        Boolean(input)
      );
      const passwordMatching = password === confirmPassword;
      if (bool && passwordMatching) {
        // register user logic
        const body = { name, email, password, picture };
        const result = await axios.post(`${BASE_URL}/api/user/register`, body, {
          headers: {
            "Content-type": "application/json",
          },
        });

        console.log("new user registered result: ", result);
        if (result.status === 201) {
          toast({
            title: result.data.message,
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          setTabIndex(0);
          handleClear();
        }
      } else {
        const conditions = {
          [password !== confirmPassword]:
            "Password & Confirm Password should be same!",
          [!confirmPassword]: "Please provide confirm password!",
          [!password]: "Please provide password!",
          [!email]: "Please provide email!",
          [!name]: "Please provide name!",
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
    <VStack spacing="10px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          value={user.name}
          onChange={(e) =>
            setUser((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </FormControl>
      <FormControl id="email" isRequired>
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
      <FormControl id="password" isRequired>
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
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Confirm Password"
            type={togglePassword ? "text" : "password"}
            value={user.confirmPassword}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
          />
          <InputRightElement w="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handlePasswordToggle}>
              {togglePassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="picture">
        <FormLabel>Upload Profile Picture</FormLabel>
        <Input
          type="file"
          p={1}
          accept="image/*"
          onChange={(e) => {
            handleImage(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        w="100%"
        marginTop={"15px"}
        onClick={handleSignup}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
