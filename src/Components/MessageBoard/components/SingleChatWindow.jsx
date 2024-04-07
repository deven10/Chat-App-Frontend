import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import Lottie from "lottie-react";

import { ChatContext } from "../../../Context/ChatProvider";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { getSenderFull } from "../../../utils/utilityFunctions";
import ProfileModal from "../../ProfileModal";
import LoadingDots from "../../../assets/loading-dots.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChatWindow = ({ setIsUpdated }) => {
  const { selectedChat, setSelectedChat, notifications, setNotifications } =
    useContext(ChatContext);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [postingNewMessage, setPostingNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("user"));

  // connecting to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  // getting full chat
  const userChat = useMemo(() => {
    return getSenderFull(
      JSON.parse(localStorage.getItem("user")),
      selectedChat?.users
    );
  }, [selectedChat]);

  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    },
  };

  // posting new message api
  const handleNewMessage = async () => {
    if (newMessage.trim()) {
      try {
        setPostingNewMessage(true);
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setAllMessages((prev) => [...prev, data]);
        socket.emit("new message", data);
        socket.emit("stop typing", selectedChat._id);
      } catch (error) {
        toast({
          title: "Error while posting new message!",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-center",
        });
      } finally {
        setPostingNewMessage(false);
      }
    }
  };

  // fetching all messages
  useEffect(() => {
    selectedChatCompare = selectedChat;
    if (selectedChat) {
      const getMessages = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `http://localhost:5000/api/message/${selectedChat._id}`,
            config
          );
          setAllMessages(data ?? []);
          socket.emit("join chat", selectedChat._id);
        } catch (error) {
          toast({
            title: "Error while fetching messages!",
            description: error.message,
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-center",
          });
        } finally {
          setLoading(false);
        }
      };

      getMessages();
    }
  }, [selectedChat]);

  // getting realtime message using socket
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setIsUpdated((prev) => !prev);
        }
      } else {
        setAllMessages([...allMessages, newMessageReceived]);
      }
    });
  });

  const isLoggedInUser = (message) => message.sender._id === userInfo.id;

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // logic for typing indicator
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (e.target.value === "") {
      setTyping(false);
      socket.emit("stop typing", selectedChat._id);
      return;
    }

    const lastTypingTime = new Date().getTime();
    const timer = 3000;
    setTimeout(() => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTypingTime;

      if (timeDiff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "20px", md: "24px" }}
            pb={3}
            px={2}
            width={"100%"}
            fontFamily={"sans-serif"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={{ base: "space-between" }}
          >
            <Button
              onClick={() => setSelectedChat(null)}
              display={{ base: "flex", md: "none" }}
            >
              <i className="fas fa-long-arrow-alt-left"></i>
            </Button>
            {selectedChat?.isGroupChat ? (
              <>
                {selectedChat?.chatName}
                <UpdateGroupChatModal setIsUpdated={setIsUpdated} />
              </>
            ) : (
              <>
                {userChat?.name}
                <ProfileModal user={userChat} />
              </>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner size="xl" alignSelf="center" margin="auto" />
            ) : (
              <Box display="flex" gap="5px" flexDir="column" width="100%">
                {allMessages?.map((message) => (
                  <Box
                    key={message._id}
                    display="flex"
                    justifyContent={
                      isLoggedInUser(message) ? "flex-end" : "flex-start"
                    }
                    alignItems="center"
                    gap="10px"
                    width="75%"
                    margin={`0 0 0 ${isLoggedInUser(message) ? "auto" : "0"}`}
                  >
                    {!isLoggedInUser(message) && (
                      <Avatar
                        size="sm"
                        name={message.sender.name}
                        src={message.sender.picture}
                      />
                    )}
                    <Text
                      fontFamily="sans-serif"
                      style={{
                        background: isLoggedInUser(message)
                          ? "#d9fdd3"
                          : "#FFF",
                        color: "#111",
                        borderRadius: "6px",
                        padding: "6px 10px",
                      }}
                    >
                      {message.content}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}

            {isTyping ? (
              <>
                <Box h={"50px"} width={"100px"}>
                  <Lottie animationData={LoadingDots} loop={true} />
                </Box>
              </>
            ) : null}
            <FormControl
              display="flex"
              justifyContent="space-between"
              alignItems={"center"}
              gap={"15px"}
              mt={2}
            >
              <Input
                placeholder="Enter a message..."
                value={newMessage}
                onChange={typingHandler}
                border={"1px solid #cecece"}
                isRequired
              />
              <Button
                isLoading={postingNewMessage}
                onClick={handleNewMessage}
                isDisabled={newMessage.trim() ? false : true}
              >
                Send
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"2xl"} fontFamily={"sans-serif"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChatWindow;
