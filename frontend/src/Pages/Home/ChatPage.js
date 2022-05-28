import React, { useState } from "react";
import { useMyContext } from "../../useContext/GlobalState";
import { Box } from "@chakra-ui/layout";
import { SideDrawer, MyChats, ChatBox, MetaData } from "../../Imports/index";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useMyContext();
  return (
    <React.Fragment>
      <MetaData title="Page Chat" />
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </React.Fragment>
  );
};

export default ChatPage;
