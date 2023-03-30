import { Community } from "@/models/Community";
import { CommunityUserSnippet } from "@/models/User";
import { Avatar, Box, Flex, HStack, IconButton, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";

type UserHorizontalSnippetItemProps = {
    user: CommunityUserSnippet;
    handleAccept?: () => Promise<void>;
};

const UserHorizontalSnippetItem: React.FC<UserHorizontalSnippetItemProps> = ({
    user,
    handleAccept,
}) => {
    const [loading, setLoading] = useState(false);
    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
            cursor="pointer"
        >
            <HStack spacing={4} flexGrow={1}>
                <Box w="100px">
                    <Avatar src={user.imageUrl || "/images/noImage.jpg"} />
                </Box>
                <Text w="300px" flexShrink={0}>
                    {user.displayName}
                </Text>
                <Box w="200px" flexShrink={0}>
                    {user.createdAt?.seconds && (
                        <Text>
                            {moment(
                                new Date(user.createdAt?.seconds * 1000)
                            ).format("DD/MM/YYYY")}
                        </Text>
                    )}
                </Box>
            </HStack>
            <IconButton
                aria-label="accept-button"
                icon={<AiOutlineCheck />}
                ml={10}
                flexShrink={0}
                bg="green.300"
                _hover={{
                    bg: "green.400",
                }}
                isLoading={loading}
                onClick={async () => {
                    setLoading(true);
                    handleAccept && (await handleAccept());
                    setLoading(false);
                }}
            />
        </Flex>
    );
};
export default UserHorizontalSnippetItem;
