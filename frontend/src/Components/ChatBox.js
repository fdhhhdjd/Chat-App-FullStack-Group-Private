import { Box } from "@chakra-ui/layout";
import "../Styles/ChatBpx.css";
import { SingleChat } from "../Imports/index";
import { useMyContext } from "../useContext/GlobalState";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useMyContext();
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
