import { Skeleton, Stack } from "@chakra-ui/react";

const LoadingSkeleton = () => {
  return (
    <>
      <Stack>
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
      </Stack>
    </>
  );
};

export default LoadingSkeleton;
