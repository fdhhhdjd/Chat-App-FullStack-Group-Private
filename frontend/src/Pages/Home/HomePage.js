import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login, Register, MetaData } from "../../Imports/index";

function Homepage() {
  const navigate = useNavigate();
  const [isFlag, setIsFlag] = useState(true);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
  }, []);
  return (
    <Container maxW="xl" centerContent>
      <MetaData title="Authentication" />
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <>
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
