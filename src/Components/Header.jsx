import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Avatar,
  Tooltip,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UsersListDrawer from "./UsersListDrawer";
import { useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const { notifications, setNotifications, setSelectedChat } =
    useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <Box
        w="100%"
        p={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#fff"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom">
          <Button variant="ghost">
            <i className="fas fa-search"></i>
            <Text
              display={{ base: "none", md: "flex" }}
              px={4}
              onClick={onOpen}
            >
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="sans-serif">
          Chatting App
        </Text>
        <Box display="flex" gap="25px" alignItems="center">
          <Menu>
            <MenuButton position="relative">
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
              <i className="fas fa-bell fa-lg"></i>
            </MenuButton>
            <MenuList p={3}>
              {notifications?.length === 0 && "No New Messages"}
              {notifications.length > 0 &&
                notifications.map((notification) => (
                  <MenuItem
                    key={notification._id}
                    onClick={() => {
                      setSelectedChat(notification.chat);
                      setNotifications(
                        notifications.filter(
                          (notif) => notif._id !== notification._id
                        )
                      );
                    }}
                  >
                    {notification.chat.isGroupChat
                      ? `New Message in ${notification.chat.chatName}`
                      : `New Message from ${notification.sender.name}`}
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.name} src={user?.picture} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <UsersListDrawer user={user} isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Header;
