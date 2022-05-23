import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import { useMyContext } from "../../useContext/GlobalState";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../Configs/ChatLogics";
import { useEffect, useState } from "react";

const ScrollableChat = ({ messages }) => {
  const { user, BoldFont, images } = useMyContext();
  useMyContext();
  const [a, setA] = useState();
  useEffect(() => {
    messages.map((m) => {
      if (m.content.includes("https://res.cloudinary.com/taithinhnam")) {
        const url = new URL(m.content);
        const extension = url.pathname.split(".")[1];
        setA(extension);
      }
    });
  }, [messages, BoldFont, images]);

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

            {m.content.includes("https://res.cloudinary.com/taithinhnam") ? (
              m.content.includes(
                "https://res.cloudinary.com/taithinhnam/video/upload"
              ) ? (
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
              ) : (
                <img
                  src={m.content}
                  alt=""
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
                />
              )
            ) : (
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {m.content}
              </span>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
