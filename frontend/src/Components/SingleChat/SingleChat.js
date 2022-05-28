import { FormControl } from "@chakra-ui/form-control";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/input";

import { Box, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";

import {
  Avatar,
  IconButton,
  Spinner,
  useToast,
  ButtonGroup,
} from "@chakra-ui/react";
import HeadlessTippy from "@tippyjs/react/headless";
import axios from "axios";
import Picker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import Lottie from "react-lottie";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  getFormattedDate,
  getFormattedTime,
  getSender,
  getSenderFull,
  getSenderPic,
} from "../../Configs/ChatLogics";
import {
  ProfileModal,
  ScrollableChat,
  UpdateGroupChatModal,
} from "../../Imports/index";
import {
  FetchChatIdUserInitial,
  SendMessageInitial,
} from "../../Redux/MessageSlice";
import "../../Styles/ChatBpx.css";
import { useMyContext } from "../../useContext/GlobalState";
import animationData from "../../utils/animations/typing.json";
import {
  MessageGetAll,
  SendMessage,
  UploadVideoOrImage,
  UploadFile,
} from "../../utils/ApiRoutes";
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const { loadings } = useSelector((state) => state.message);
  const messageEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { socket } = useMyContext();
  const [upFile, setUpFile] = useState();
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
  const handleHideResult = () => {
    setShowEmojiPicker(false);
  };

  const sendMessage = async (event) => {
    socket.emit("stop typing", selectedChat._id);
    try {
      let token = user.token;
      let content = event || newMessage;
      let chatId = selectedChat;
      let time = getFormattedTime();
      let todayDate = getFormattedDate();
      dispatch(
        SendMessageInitial({
          SendMessage,
          content,
          chatId,
          time,
          todayDate,
          token,
        })
      )
        .then((data) => {
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
  };
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = newMessage;
    message += emojiObject.emoji;
    setNewMessage(message);
  };
  const sendChat = (event) => {
    if (event.key === "Enter" && newMessage) {
      if (newMessage.length > 0) {
        sendMessage(msg);
        setNewMessage("");
      }
    }
  };
  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket.on("fetch", (data) => {
      if (data == "icon") {
        fetchMessages();
      }
    });
  }, []);
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
      setNewMessage(images?.url);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };
  const handleUploadFile = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      console.log(file);
      if (!file) {
        return toast({
          title: "Error Occured!",
          description: "File not Exists",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } else if (file.type !== "application/pdf") {
        return toast({
          title: "Error Occured!",
          description: "File Support Pdf",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }

      let formData = new FormData();

      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(UploadFile, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setLoading(false);
      setUpFile(res.data);
      setNewMessage(images?.url);
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    if (images?.url) {
      let token = user.token;
      let content = images?.url;
      let chatId = selectedChat;
      let time = getFormattedTime();
      let todayDate = getFormattedDate();
      dispatch(
        SendMessageInitial({
          SendMessage,
          content,
          chatId,
          time,
          todayDate,
          token,
        })
      )
        .then((data) => {
          socket.emit("new message", data?.payload);
          setMessages([...messages, data?.payload]);
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
  useEffect(() => {
    if (upFile?.url) {
      let token = user.token;
      let content = upFile?.url;
      let chatId = selectedChat;
      let time = getFormattedTime();
      let todayDate = getFormattedDate();
      dispatch(
        SendMessageInitial({
          SendMessage,
          content,
          chatId,
          time,
          todayDate,
          token,
        })
      )
        .then((data) => {
          socket.emit("new message", data?.payload);
          setMessages([...messages, data?.payload]);

          setNewMessage("");
          setUpFile("");
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
  }, [upFile]);
  useEffect(() => {
    socket.on("new message", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification((prevArray) => [...prevArray, newMessageRecieved]);
          setFetchAgain(newMessageRecieved);
        }
      } else {
        setMessages((prevArray) => [...prevArray, newMessageRecieved]);
      }
    });
  }, []);

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
            {loadings ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={(event) => sendChat(event)}
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
              <InputGroup size="md">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <InputRightElement width="4.5rem">
                  <ButtonGroup
                    size="sm"
                    border="0"
                    display="flex"
                    pd={2}
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    <Text>
                      <label htmlFor="file-input" style={{ cursor: "pointer" }}>
                        <Tooltip label="Up Pdf" aria-label="A tooltip">
                          <i
                            className="fa fa-plus"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </Tooltip>
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        onChange={handleUploadFile}
                        style={{ display: "none" }}
                      />
                    </Text>
                    <Text>
                      <label
                        htmlFor="file-input1"
                        style={{ cursor: "pointer" }}
                      >
                        <Tooltip label="Up Pdf" aria-label="A tooltip">
                          <i
                            className="fa fa-file"
                            style={{ fontSize: "1.5rem" }}
                          ></i>
                        </Tooltip>
                      </label>
                      <input
                        id="file-input1"
                        type="file"
                        onChange={handleUpload}
                        style={{ display: "none" }}
                      />
                    </Text>
                  </ButtonGroup>
                  &nbsp;&nbsp; &nbsp;
                </InputRightElement>

                <InputLeftElement>
                  <HeadlessTippy
                    interactive
                    visible={showEmojiPicker}
                    onClickOutside={handleHideResult}
                  >
                    <Container>
                      <div className="button-container">
                        <div className="emoji">
                          <BsEmojiSmileFill
                            onClick={handleEmojiPickerhideShow}
                          />
                          {showEmojiPicker && (
                            <Picker onEmojiClick={handleEmojiClick} />
                          )}
                        </div>
                      </div>
                    </Container>
                  </HeadlessTippy>
                </InputLeftElement>
              </InputGroup>
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
const Container = styled.div`
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #000;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;

        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
`;
