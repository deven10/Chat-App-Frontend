import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import ChatList from "../Components/ChatList/ChatList";
import MessageBoard from "../Components/MessageBoard/MessageBoard";

const Chats = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Header user={userInfo} />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        p={4}
        style={{ height: "calc(100vh - 72px)" }}
      >
        <ChatList user={userInfo} isUpdated={isUpdated} />
        <MessageBoard isUpdated={isUpdated} setIsUpdated={setIsUpdated} />
      </Box>
    </div>
  );
};

export default Chats;
