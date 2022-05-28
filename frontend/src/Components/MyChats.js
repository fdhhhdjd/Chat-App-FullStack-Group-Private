import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSender, getStatus } from "../Configs/ChatLogics";
import { GroupChatModal } from "../Imports/index";
import { FetchChatInitial } from "../Redux/MessageSlice";
import { useMyContext } from "../useContext/GlobalState";
import { FetchChatRoute } from "../utils/ApiRoutes";
import ChatLoading from "./ChatLoading";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const dispatch = useDispatch();
  const { selectedChat, setSelectedChat, user, socket, setChats, chats } =
    useMyContext();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      let token = user.token;
      dispatch(FetchChatInitial({ FetchChatRoute, token }))
        .then((item) => {
          if (item?.payload?.status === 200) {
            setChats(item?.payload?.results);
          }
        })
        .catch((error) => {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);
  useEffect(() => {
    socket.on("fetch", (message) => {
      fetchChats();
    });
    socket.on("new message", (message) => {
      fetchChats();
    });
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : `${chat.chatName} (Group)`}
                  &nbsp;&nbsp;
                  {getStatus(loggedUser, chat.users) == "online" ? (
                    <i className="fas fa-circle sidebar-online-status"></i>
                  ) : (
                    <i className="fas fa-circle sidebar-offline-status"></i>
                  )}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {
                      (user.name = chat.latestMessage.sender.name
                        ? chat.latestMessage.content.includes(
                            "https://res.cloudinary.com/taithinhnam"
                          )
                          ? chat.latestMessage.content.includes(
                              "https://res.cloudinary.com/taithinhnam/video/upload"
                            )
                            ? "Đã gửi 1 Video"
                            : "Đã gửi 1 Hình ảnh"
                          : chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 20) + "..."
                          : chat.latestMessage.content
                        : chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 20) + "..."
                        : chat.latestMessage.content)
                    }
                  </Text>
                )}
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    {moment(chat.latestMessage.createdAt).fromNow()}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
