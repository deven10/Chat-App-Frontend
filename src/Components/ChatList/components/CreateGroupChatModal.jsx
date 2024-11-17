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
  Text,
  FormControl,
  Input,
  useToast,
  FormLabel,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useMemo, useState } from "react";
// import AsyncSelect from "react-select/async";
import Select from "react-select";
import { ChatContext } from "../../../Context/ChatProvider";
import { BASE_URL } from "../../../config";

const CreateGroupChatModal = () => {
  const toast = useToast();
  const { setChats, allUsers, config, userInfo } = useContext(ChatContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChat, setGroupChat] = useState({
    chatName: "",
    users: [],
  });

  const userOptions = useMemo(() => {
    return allUsers
      .map((u) => ({
        label: u.name,
        value: u._id,
      }))
      .filter((u) => u.value !== userInfo.id);
  }, [allUsers]);

  const handleClear = () => {
    setGroupChat({
      chatName: "",
      users: [],
    });
  };

  const handleSubmit = async () => {
    if (!groupChat.chatName.trim()) {
      toast({
        title: "Input Group Chat Name!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    if (groupChat.users.length < 2) {
      toast({
        title: "Minimum 2 users are required to form a Group Chat!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/chat/group`,
        {
          chatName: groupChat.chatName,
          users: groupChat.users.map((u) => u.value),
        },
        config
      );

      if (response.status === 201) {
        setChats((prev) => [response.data, ...prev]);
        onClose();
        handleClear();
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ?? "Failed to Create new Group Chat!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  return (
    <>
      <Button
        onClick={onOpen}
        fontSize={{ base: "15px", md: "10px", lg: "15px" }}
      >
        <Text pr={3}>New Group Chat</Text>
        <i className="fas fa-plus"></i>
      </Button>

      <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            gap="15px"
            justifyContent="center"
            alignItems="center"
          >
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
              {/* <AsyncSelect
                loadOptions={userOptions}
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
              /> */}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupChatModal;
