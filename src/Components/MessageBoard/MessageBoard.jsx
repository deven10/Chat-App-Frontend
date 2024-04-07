import { Box } from "@chakra-ui/react";
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import SingleChatWindow from "./components/SingleChatWindow";

const MessageBoard = ({ isUpdated, setIsUpdated }) => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      width={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <SingleChatWindow isUpdated={isUpdated} setIsUpdated={setIsUpdated} />
    </Box>
  );
};

export default MessageBoard;
