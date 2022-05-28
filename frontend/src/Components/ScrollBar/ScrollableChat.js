import { Avatar } from "@chakra-ui/avatar";
import {
  Badge,
  ButtonGroup,
  Link,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/tooltip";
import { useEffect, useRef, useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  CheckLink,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../Configs/ChatLogics";
import { IconMessageInitial } from "../../Redux/MessageSlice";
import { useMyContext } from "../../useContext/GlobalState";
import { useDispatch } from "react-redux";
import { IconMessage } from "../../utils/ApiRoutes";
import { Document, Page, pdfjs } from "react-pdf";
const ScrollableChat = ({ messages }) => {
  const { user, BoldFont, images, selectedChat } = useMyContext();
  const [data, setData] = useState();
  const messageEndRef = useRef(null);
  const dispatch = useDispatch();
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  useMyContext();
  const handleModal = (id) => {
    messages.forEach((message) => {
      if (message._id === id) {
        setData(message);
      }
    });
  };
  const handleIcon = (number) => {
    let icon = number;
    let id = data?._id;
    let token = user.token;
    dispatch(IconMessageInitial({ IconMessage, id, icon, token }));
  };
  const ScrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    ScrollToBottom();
  }, [selectedChat, messages, images]);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <Tooltip label={`${m.time} - ${m.date}  `} aria-label="A tooltip">
              {m.content.includes(".png") || m.content.includes(".jpg") ? (
                <>
                  <img
                    src={m.content}
                    alt=""
                    style={{
                      backgroundColor: `${
                        m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                      }`,
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 22 : 20,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "45%",
                    }}
                  />
                  {m?.icons?.icon && (
                    <Text
                      colorScheme="blue"
                      border="0"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Badge ml="1" fontSize="1em" border="9">
                        {m?.icons?.icon === 1 && "😄"}
                        {m?.icons?.icon === 2 && "😍"}
                        {m?.icons?.icon === 3 && "😡"}
                        {m?.icons?.icon === 4 && "😭"}
                      </Badge>
                    </Text>
                  )}
                </>
              ) : m.content.includes(
                  "https://res.cloudinary.com/taithinhnam/video/upload"
                ) ? (
                <>
                  <video
                    controls
                    style={{
                      backgroundColor: `${
                        m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                      }`,
                      marginLeft: isSameSenderMargin(messages, m, i, user._id),
                      marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                      borderRadius: "20px",
                      padding: "5px 15px",
                      maxWidth: "45%",
                    }}
                  >
                    <source src={m.content} />
                  </video>
                  {m?.icons?.icon && (
                    <Text
                      colorScheme="blue"
                      border="0"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      <Badge ml="1" fontSize="1em" border="9">
                        {m?.icons?.icon === 1 && "😄"}
                        {m?.icons?.icon === 2 && "😍"}
                        {m?.icons?.icon === 3 && "😡"}
                        {m?.icons?.icon === 4 && "😭"}
                      </Badge>
                    </Text>
                  )}
                </>
              ) : m.content.includes(".pdf") ? (
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 10 : 20,
                    borderRadius: "20px",
                    maxWidth: "39rem",
                    lineHeight: "1rem",
                    padding: "5px 15px",
                  }}
                >
                  <Link color="blue.500" href={m.content} target="_blank">
                    Link File Pdf Attachment
                    <br />
                    <br />
                    <Document
                      file={m.content}
                      onLoadSuccess={onDocumentLoadSuccess}
                      size="A4"
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                    {m?.icons?.icon && (
                      <Text
                        colorScheme="blue"
                        border="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                      >
                        <Badge ml="1" fontSize="1em" border="9">
                          {m?.icons?.icon === 1 && "😄"}
                          {m?.icons?.icon === 2 && "😍"}
                          {m?.icons?.icon === 3 && "😡"}
                          {m?.icons?.icon === 4 && "😭"}
                        </Badge>
                      </Text>
                    )}
                  </Link>
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                    marginTop: isSameUser(messages, m, i, user._id) ? 10 : 20,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    lineHeight: "2rem",
                  }}
                >
                  {CheckLink(m.content) === "true" ? (
                    <Link color="blue.500" href={m.content} target="_blank">
                      {m.content}
                      {m?.icons?.icon && (
                        <Text
                          colorScheme="blue"
                          border="0"
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Badge ml="1" fontSize="1em" border="9">
                            {m?.icons?.icon === 1 && "😄"}
                            {m?.icons?.icon === 2 && "😍"}
                            {m?.icons?.icon === 3 && "😡"}
                            {m?.icons?.icon === 4 && "😭"}
                          </Badge>
                        </Text>
                      )}
                    </Link>
                  ) : (
                    <>
                      {m.content}
                      {m?.icons?.icon && (
                        <Text
                          colorScheme="blue"
                          border="0"
                          display="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <Badge ml="1" fontSize="1em" border="9">
                            {m?.icons?.icon === 1 && "😄"}
                            {m?.icons?.icon === 2 && "😍"}
                            {m?.icons?.icon === 3 && "😡"}
                            {m?.icons?.icon === 4 && "😭"}
                          </Badge>
                        </Text>
                      )}
                    </>
                  )}
                </span>
              )}
            </Tooltip>
            <Popover>
              &nbsp;&nbsp; &nbsp;
              <PopoverTrigger>
                <i
                  className="fas fa-smile"
                  onClick={() => handleModal(m._id)}
                  style={{
                    marginTop: isSameUser(messages, m, i, user._id) ? 25 : 30,
                  }}
                ></i>
              </PopoverTrigger>
              {data?._id === m?._id && (
                <Portal>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader>Choose Icon</PopoverHeader>
                    <PopoverCloseButton />
                    <ButtonGroup
                      size="sm"
                      border="0"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-evenly"
                    >
                      <Text colorScheme="blue" onClick={() => handleIcon("1")}>
                        😄
                      </Text>
                      <Text colorScheme="blue" onClick={() => handleIcon("2")}>
                        😍
                      </Text>
                      <Text colorScheme="blue" onClick={() => handleIcon("3")}>
                        😡
                      </Text>
                      <Text colorScheme="blue" onClick={() => handleIcon("4")}>
                        😭
                      </Text>
                    </ButtonGroup>
                    <PopoverFooter>Thank For</PopoverFooter>
                  </PopoverContent>
                </Portal>
              )}
            </Popover>
            <div ref={messageEndRef} />
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
