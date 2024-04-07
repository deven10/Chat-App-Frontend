import { Box, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import LoadingSkeleton from "../LoadingSkeleton";
import CreateGroupChatModal from "./components/CreateGroupChatModal";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../utils/utilityFunctions";

const ChatList = ({ user, isUpdated }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setChats, selectedChat, chats, setSelectedChat } =
    useContext(ChatContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          "http://localhost:5000/api/chat",
          config
        );

        setChats(data);
        if (selectedChat) {
          const updatedSelectedChat = data.find(
            (chat) => chat._id === selectedChat._id
          );
          setSelectedChat(updatedSelectedChat);
        }
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
        localStorage.clear();
        navigate("/");
      }
    };

    fetchChats();
  }, [isUpdated]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg="#fff"
      width={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "20px", md: "24px" }}
        fontFamily={"sans-serif"}
        display={"flex"}
        width="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My chats
        <CreateGroupChatModal />
      </Box>

      <Box
        display="flex"
        flexDir={"column"}
        p={3}
        bg="#F8F8F8"
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats?.map((chat) => (
              <Box
                key={chat._id}
                cursor={"pointer"}
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(
                        JSON.parse(localStorage.getItem("user")),
                        chat?.users
                      )
                    : chat?.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <LoadingSkeleton />
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
