import { Avatar, Box, Text } from "@chakra-ui/react";

const UserCard = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        width="100%"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "#fff",
        }}
        display="flex"
        alignItems="center"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar mr={2} size="sm" name={user?.name} src={user?.picture} />
        <Box>
          <Text>{user?.name}</Text>
          <Text fontSize="xs">
            <b>Email: </b>
            {user?.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserCard;
