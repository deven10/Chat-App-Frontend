import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  FormLabel,
  Box,
  Text,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { ChatContext } from "../../../Context/ChatProvider";
import Select from "react-select";

const UpdateGroupChatModal = ({ setIsUpdated }) => {
  const toast = useToast();
  const { selectedChat, config, allUsers, userInfo } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChat, setGroupChat] = useState({
    chatName: "",
    admin: "",
    users: [],
  });

  useEffect(() => {
    if (selectedChat) {
      const users = selectedChat.users
        .filter((u) => u._id !== userInfo.id)
        .map((u) => ({
          label: u.name,
          value: u._id,
        }));
      const admin = {
        label: selectedChat.groupAdmin.name,
        value: selectedChat.groupAdmin._id,
      };
      setGroupChat({
        chatName: selectedChat.chatName,
        users,
        admin,
      });
    }
  }, [selectedChat]);

  const userOptions = useMemo(() => {
    const res = allUsers
      ?.map((u) => ({
        label: u.name,
        value: u._id,
      }))
      .filter((u) => u.value !== groupChat.admin?.value);
    return res;
  }, [allUsers, groupChat.admin]);

  const adminOptions = useMemo(() => {
    const res = allUsers.map((u) => ({
      label: u.name,
      value: u._id,
    }));
    return res;
  }, [allUsers]);

  const isGroupAdmin = useMemo(
    () => selectedChat.groupAdmin._id === userInfo.id,
    [selectedChat, userInfo]
  );

  const updateGroupChat = async (type) => {
    try {
      const groupMembers = groupChat.users.map((u) => u.value);
      const response = await axios.post(
        `http://localhost:5000/api/chat/group/update`,
        {
          chatId: selectedChat._id,
          chatName: groupChat.chatName,
          users: [...groupMembers, groupChat.admin.value],
          groupAdmin: groupChat.admin.value,
        },
        config
      );

      if (response.status === 200) {
        onClose();

        if (type === "update group") {
          toast({
            title: "Group Chat Updated Successfully!",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top-center",
          });
        }

        if (type === "exit group") {
          toast({
            title: "Removed from Group Successfully!",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top-center",
          });
        }

        setIsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ?? `Failed to Update Group Chat!`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  const handleUpdateGroupChat = () => {
    if (!groupChat.chatName.trim()) {
      toast({
        title: "Error",
        description: "Group Chat Name is required!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    if (groupChat.users.length <= 1) {
      toast({
        title: "Error",
        description: "Atleast 2 members are required to form a group chat!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    if (!groupChat.admin?.value) {
      toast({
        title: "Error",
        description: "Please select group admin!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    if (!isGroupAdmin) {
      toast({
        title: "Error",
        description: "Only Group Admin can make changes!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    updateGroupChat("update group");
  };

  const handleLeaveGroup = () => {
    if (selectedChat.groupAdmin._id === groupChat.admin?.value) {
      toast({
        title: "Error",
        description: "Please change the group admin before leaving!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    updateGroupChat("exit group");
  };

  return (
    <>
      <Button onClick={onOpen}>
        <i className="fas fa-eye"></i>
      </Button>

      <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            gap="12px"
            justifyContent="start"
            alignItems="start"
          >
            {isGroupAdmin ? (
              <>
                <FormControl>
                  <FormLabel>Chat Name:</FormLabel>
                  <Input
                    placeholder="Group Chat Name"
                    mb={2}
                    value={groupChat.chatName}
                    onChange={(e) =>
                      setGroupChat((prev) => ({
                        ...prev,
                        chatName: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Select Group Admin:</FormLabel>
                  <Select
                    options={adminOptions}
                    closeMenuOnSelect={true}
                    placeholder="Select Group Admin..."
                    onChange={(option) => {
                      setGroupChat((prev) => ({
                        ...prev,
                        admin: option,
                      }));

                      if (
                        groupChat.users.find((u) => u.value === option.value)
                      ) {
                        setGroupChat((prev) => ({
                          ...prev,
                          users: prev.users.filter(
                            (u) => u.value !== option.value
                          ),
                        }));
                      }
                    }}
                    value={groupChat.admin}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Select Group Members:</FormLabel>
                  <Select
                    options={userOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    placeholder="Select Group Members..."
                    onChange={(option) => {
                      setGroupChat((prev) => ({
                        ...prev,
                        users: option,
                      }));
                    }}
                    value={groupChat.users}
                  />
                </FormControl>
              </>
            ) : (
              <>
                <Box display="flex" alignItems={"center"} gap="10px">
                  <Text
                    fontFamily={"sans-serif"}
                    fontWeight={600}
                    fontSize={"16px"}
                  >
                    Group Name:{" "}
                  </Text>
                  <Text
                    fontFamily={"sans-serif"}
                    fontWeight={400}
                    fontSize={"15px"}
                  >
                    {selectedChat?.chatName}
                  </Text>
                </Box>
                <Box display="flex" alignItems={"center"} gap="10px">
                  <Text
                    fontFamily={"sans-serif"}
                    fontWeight={600}
                    fontSize={"16px"}
                  >
                    Group Admin:{" "}
                  </Text>
                  <Text
                    fontFamily={"sans-serif"}
                    fontWeight={400}
                    fontSize={"15px"}
                  >
                    {selectedChat?.groupAdmin?.name}
                  </Text>
                </Box>
                <Box display="flex" flexDir={"column"} gap="10px">
                  <Text
                    fontFamily={"sans-serif"}
                    fontWeight={600}
                    fontSize={"16px"}
                  >
                    Members:{" "}
                  </Text>
                  <ul style={{ listStyle: "none" }}>
                    {selectedChat?.users?.map((user) => (
                      <li style={{ marginBottom: "8px" }} key={user._id}>
                        <Box display="flex" alignItems={"center"} gap="15px">
                          <Avatar
                            size="sm"
                            name={user?.name}
                            src={user?.picture}
                          />
                          <Text
                            fontFamily={"sans-serif"}
                            fontWeight={400}
                            fontSize={"15px"}
                          >
                            {user?.name}
                          </Text>
                        </Box>
                      </li>
                    ))}
                  </ul>
                </Box>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            {isGroupAdmin && (
              <Button colorScheme="blue" mr={3} onClick={handleUpdateGroupChat}>
                Update Group
              </Button>
            )}
            <Button colorScheme="red" onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
