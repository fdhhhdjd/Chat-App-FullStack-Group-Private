import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce, UserBadgeItem, UserListItem } from "../../Imports/index";
import { SearchInitial } from "../../Redux/AuthSlice";
import {
  AddUserToGroupInitial,
  RemoveGroupInitial,
  RenameGroupInitial,
  reset,
} from "../../Redux/GroupSlice";
import { useMyContext } from "../../useContext/GlobalState";
import {
  RemoveFromGroup,
  RenameGroupChatRoute,
  SearchRoute,
  AddUserToGroup,
} from "../../utils/ApiRoutes";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { RenameGroup } = useSelector((state) => state.group);

  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user, socket } = useMyContext();
  const debouncedValue = useDebounce(search, 500);
  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      let token = user.token;
      let chatId = selectedChat._id;
      let chatName = groupChatName;
      dispatch(
        RenameGroupInitial({ RenameGroupChatRoute, chatId, chatName, token })
      )
        .then((data) => {
          if (data?.payload?.status === 200) {
            if (data?.payload?.msg) {
              toast({
                title: "Update Group Chat !",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            }
            onClose();
            setSelectedChat(data?.payload?.updatedChat);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
          } else if (data?.payload?.status === 400) {
            toast({
              title: "Error Occured!",
              description: data?.payload?.msg,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setRenameLoading(false);
          }
        })
        .catch((error) => {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      let chatId = selectedChat._id;
      let userId = user1._id;
      let token = user.token;
      dispatch(
        AddUserToGroupInitial({ AddUserToGroup, chatId, userId, token })
      ).then((item) => {
        setSelectedChat(item?.payload?.added);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      let chatId = selectedChat?._id;
      let userId = user1?._id;
      let token = user?.token;
      dispatch(RemoveGroupInitial({ RemoveFromGroup, chatId, userId, token }))
        .then((data) => {
          if (data?.payload?.status === 200) {
            user1._id === user._id
              ? setSelectedChat()
              : setSelectedChat(data?.payload?.removed);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
          }
        })
        .catch((error) => {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };
  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
    try {
      setLoading(true);
      let token = user.token;
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
      setLoading(false);
    }
  }, [debouncedValue]);
  useEffect(() => {
    setGroupChatName(selectedChat.chatName);
  }, [selectedChat]);
  useEffect(() => {
    if (RenameGroup.status === 200) {
      const HandleReset = setTimeout(() => {
        dispatch(reset());
      }, 800);
      return () => clearTimeout(HandleReset);
    }
  }, [RenameGroup]);
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                name="groupChatName"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
