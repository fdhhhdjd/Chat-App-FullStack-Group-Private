import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginInitial } from "../../Redux/AuthSlice";
import { useMyContext } from "../../useContext/GlobalState";
import { LoginRoute } from "../../utils/ApiRoutes";
const initialState = {
  email: "",
  password: "",
};
const Login = () => {
  const [state, setState] = useState(initialState);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const { socket } = useMyContext();
  const [loading, setLoading] = useState(false);
  const { email, password } = state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      dispatch(LoginInitial({ LoginRoute, email, password }))
        .then((item) => {
          if (item?.payload?.status === 200) {
            toast({
              title: "Login Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            localStorage.setItem(
              "userInfo",
              JSON.stringify(item?.payload?.user)
            );
            setLoading(false);
            window.location.href = "/chats";
          } else {
            toast({
              title: "Error Occured!",
              description: `${item?.payload?.msg}`,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          name="email"
          placeholder="Enter Your Email Address."
          onChange={handleChange}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={handleChange}
            type={show ? "text" : "password"}
            name="password"
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          state({ email: "guest@example.com", password: "123456" });
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
