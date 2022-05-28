import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useDebounce, UserBadgeItem, UserListItem } from "../../Imports/index";
import { SearchInitial } from "../../Redux/AuthSlice";
import { CreateGroupChatInitial } from "../../Redux/GroupSlice";
import { useMyContext } from "../../useContext/GlobalState";
import { CreateGroupChatRoute, SearchRoute } from "../../utils/ApiRoutes";
const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fosCusSearch = useRef();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats, socket } = useMyContext();
  const debouncedValue = useDebounce(search, 500);

  const handleGroup = (userToAdd) => {
    setSearch("");
    fosCusSearch.current.focus();
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== delUser._id));
    setSearch("");
    fosCusSearch.current.focus();
  };
  const handleSubmitCreateGroup = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      let name = groupChatName;
      let users = JSON.stringify(selectedUsers.map((u) => u._id));
      let token = user.token;
      dispatch(
        CreateGroupChatInitial({ CreateGroupChatRoute, name, users, token })
      )
        .then((data) => {
          if (data?.payload?.status === 200) {
            setChats([data, ...chats]);
            onClose();
            toast({
              title: "New Group Chat Created!",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          } else if (data?.payload?.status === 400) {
            toast({
              title: "Failed to Create the Chat!",
              description: data?.payload?.msg,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        })
        .catch((error) => {
          toast({
            title: "Failed to Create the Chat!",
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    setSearch(debouncedValue);
    if (!debouncedValue) {
      return;
    }
    try {
      let token = user.token;
      setLoading(true);
      dispatch(SearchInitial({ SearchRoute, search: debouncedValue, token }))
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
  }, [debouncedValue]);
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Tai, Thinh, Nam,Tat"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                ref={fosCusSearch}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmitCreateGroup} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
