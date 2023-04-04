import { UserModel } from "@/models/User";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";

interface UserHorizontalSnippetItemProps extends FlexProps {
    user: UserModel;
    hiddenSubBio?: boolean;
    size?: "sm" | "md" | "lg";
}

const UserHorizontalSnippetItem: React.FC<UserHorizontalSnippetItemProps> = ({
    user,
    hiddenSubBio = false,
    size = "lg",
    ...rest
}) => {
    return (
        <Link
            // href={routes.getAuthorDetailPage(author.id!)}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
                {...rest}
            >
                <Flex>
                    <Avatar
                        src={user.photoURL || "/images/noImage.jpg"}
                        size={size}
                    />
                    <VStack
                        align="flex-start"
                        ml={size === "sm" ? 2 : size === "md" ? 4 : 8}
                        spacing={0}
                    >
                        <Text noOfLines={1} fontWeight={600}>
                            {user.displayName}
                        </Text>
                        {!hiddenSubBio && (
                            <Text noOfLines={2} fontSize={14} color="gray.400">
                                {user.subBio}
                            </Text>
                        )}
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default UserHorizontalSnippetItem;
