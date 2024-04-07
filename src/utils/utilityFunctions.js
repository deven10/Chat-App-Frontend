export const getSender = (loggedInUser, users) => {
  return users[0]?._id === loggedInUser?.id ? users[1]?.name : users[0]?.name;
};

export const getSenderFull = (loggedInUser, users) => {
  return users
    ? users[0]?._id === loggedInUser?.id
      ? users[1]
      : users[0]
    : null;
};
