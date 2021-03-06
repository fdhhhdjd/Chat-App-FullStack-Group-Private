import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Stack } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from "react";
import NotificationBadge, { Effect } from "react-notification-badge";
import { useDispatch } from "react-redux";
import messageFacebook from "../Assets/messageFacebook.mp3";
import { getSender } from "../Configs/ChatLogics";
import {
  ChatLoading,
  MetaData,
  ProfileModal,
  UserListItem,
} from "../Imports/index";
import { LogoutInitial, SearchInitial } from "../Redux/AuthSlice";
import { AccessUserToGroupInitial } from "../Redux/GroupSlice";
import { useMyContext } from "../useContext/GlobalState";
import {
  AccessUserToGroupRoute,
  LogoutRoute,
  SearchRoute,
} from "../utils/ApiRoutes";
function SideDrawer() {
  const {
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
    socket,
    user,
    setUser,
  } = useMyContext();
  const [search, setSearch] = useState("");
  const videoRef = useRef(null);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState();
  const [loadingChat, setLoadingChat] = useState(false);
  const [title, setTitle] = useState("");
  const [flicker, setFlicker] = useState();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const LogoutHandler = async () => {
    dispatch(LogoutInitial({ LogoutRoute, user })).then((data) => {
      if (data?.payload?.status === true) {
        localStorage.clear();
        window.location.href = "/";
      }
    });
  };

  const HandleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      let token = user.token;
      dispatch(SearchInitial({ SearchRoute, search, token }))
        .then((data) => {
          if (data?.payload?.status === 200) {
            setLoading(false);
            setSearchResult(data?.payload?.users);
          }
        })
        .catch((error) => {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const AccessChat = async (userId) => {
    try {
      setLoadingChat(true);
      let token = user.token;
      dispatch(
        AccessUserToGroupInitial({ AccessUserToGroupRoute, userId, token })
      ).then((data) => {
        console.log(data, "data");
        if (!chats.find((c) => c._id === data?.payload?._id))
          setChats([data?.payload, ...chats]);
        setSelectedChat(data?.payload);
        setLoadingChat(false);
        onClose();
      });
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    if (notification.length > 0) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
    setFlicker("");
    if (notification.length > 0) {
      let clear = setInterval(() => {
        setTitle("");
        var LearTimeOut = setTimeout(() => {
          notification.map((notif) => setTitle(notif?.chat?.chatName));
        }, 1000);
        return () => {
          clearTimeout(LearTimeOut);
        };
      }, 2000);
      return () => {
        clearInterval(clear);
      };
    }
  }, [notification]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userInfo"));
    if (data) {
      setUser1(data);
    }
  }, []);

  return (
    <>
      {title === "" ? (
        <MetaData title={`${"Chat Page"}`} />
      ) : notification.length > 0 ? (
        <MetaData
          title={`${
            title != "" && `(${notification.length}) ${title} send Message `
          }`}
        />
      ) : (
        <MetaData title={`${"Chat Page"}`} />
      )}

      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}

              {notification.length > 0 && (
                <Stack>
                  <Button
                    colorScheme="teal"
                    size="xs"
                    spacing={1}
                    direction="row"
                    align="center"
                    onClick={() => {
                      setNotification([]);
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              )}
            </MenuList>
            {notification.length > 0 && (
              <video
                controls
                autoPlay
                ref={videoRef}
                style={{ display: "none" }}
              >
                <source src={messageFacebook} type="video/mp4" />
              </video>
            )}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user1}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={LogoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={HandleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => AccessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
