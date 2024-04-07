import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import LoadingSkeleton from "./LoadingSkeleton";
import UserCard from "./UserCard";
import { ChatContext } from "../Context/ChatProvider";

const UsersListDrawer = ({ user, isOpen, onClose }) => {
  const { setSelectedChat, chats, setChats } = useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const toast = useToast();

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something to Search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log("users list: ", data);
      setUsersList(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description:
          error?.response?.data?.message ?? "Failed to Search Users!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      console.log("access chat: ", data);

      if (!chats?.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching the chats!",
        description:
          error?.response?.data?.message ?? "Failed to Search Users!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    } finally {
      setLoadingChat(false);
    }
  };
  return (
    <>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" gap="5px" paddingBottom="10px">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Users..."
              />
              <Button isLoading={loading} onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              usersList.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat ? <Spinner /> : null}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UsersListDrawer;
