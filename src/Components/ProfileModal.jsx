import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button onClick={onOpen}>
          <i className="fas fa-eye"></i>
        </Button>
      )}

      <Modal isOpen={isOpen} isCentered size="lg" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            gap="15px"
            justifyContent="center"
            alignItems="center"
          >
            <Image boxSize="200px" src={user?.picture} alt={user?.name} />
            <Text fontSize="22px">{user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
