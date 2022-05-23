import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "../../Styles/ChatBpx.css";
import { Avatar, IconButton, Spinner, useToast } from "@chakra-ui/react";
import {
  getSender,
  getSenderFull,
  getSenderPic,
} from "../../Configs/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Lottie from "react-lottie";
import animationData from "../../utils/animations/typing.json";
import io from "socket.io-client";
import {
  UpdateGroupChatModal,
  ProfileModal,
  ScrollableChat,
} from "../../Imports/index";
import { useMyContext } from "../../useContext/GlobalState";
import { useDispatch } from "react-redux";
import {
  FetchChatIdUserInitial,
  SendMessageInitial,
} from "../../Redux/MessageSlice";
import {
  MessageGetAll,
  SendMessage,
  UploadVideoOrImage,
} from "../../utils/ApiRoutes";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [participation, setParticipation] = useState();
  const [submit, setSubmit] = useState(false);
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const {
    selectedChat,
    setSelectedChat,
    user,
    notification,
    setNotification,
    setBoldFont,
    BoldFont,
    images,
    setImages,
  } = useMyContext();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      let token = user.token;
      let chatId = selectedChat._id;
      dispatch(FetchChatIdUserInitial({ MessageGetAll, chatId, token }))
        .then((data) => {
          setMessages(data?.payload);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        let token = user.token;
        let content = newMessage;
        let chatId = selectedChat;
        dispatch(
          SendMessageInitial({
            SendMessage,
            content,
            chatId,
            token,
          })
        )
          .then((data) => {
            socket.emit("new message", data?.payload);
            setMessages([...messages, data?.payload]);
            setBoldFont(!BoldFont);
            setNewMessage("");
            setImages("");
          })
          .catch((err) => {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          });
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, BoldFont, images]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          setBoldFont(!BoldFont);
          setImages("");
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setBoldFont(!BoldFont);
        setImages("");
      }
    });
  }, [BoldFont, messages, images]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const ScrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (!file)
        return toast({
          title: "Error Occured!",
          description: "File not Exists",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      if (file.size > 1024 * 1024)
        // 1mb
        return toast({
          title: "Error Occured!",
          description: "Size too large !",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

      let formData = new FormData();

      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(UploadVideoOrImage, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setLoading(false);
      setImages(res.data);
      setBoldFont(!BoldFont);
      setNewMessage(images?.url);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
  useEffect(() => {
    ScrollToBottom();
  }, [BoldFont, selectedChat, messages, images]);
  useEffect(() => {
    if (images?.url) {
      let token = user.token;
      let content = images?.url;
      let chatId = selectedChat;
      dispatch(
        SendMessageInitial({
          SendMessage,
          content,
          chatId,
          token,
        })
      )
        .then((data) => {
          socket.emit("new message", data?.payload);
          setMessages([...messages, data?.payload]);
          setBoldFont(!BoldFont);
          setNewMessage("");
          setImages("");
        })
        .catch((err) => {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    }
  }, [images]);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    src={getSenderPic(user, selectedChat.users)}
                  />
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            ref={messageEndRef}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages" ref={messageEndRef}>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
              <Input
                variant="filled"
                bg="#E0E0E0"
                type="file"
                placeholder="Enter a message.."
                onChange={handleUpload}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
