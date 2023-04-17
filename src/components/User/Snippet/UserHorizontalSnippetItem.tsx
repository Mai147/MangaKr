import { routes } from "@/constants/routes";
import { UserSnippet } from "@/models/User";
import { Avatar, Flex, FlexProps, Link, Text, VStack } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface UserHorizontalSnippetItemProps extends FlexProps {
    user: UserSnippet;
    size?: "sm" | "md" | "lg";
    isLink?: boolean;
    rightAction?: ReactNode;
}

const UserHorizontalSnippetItem: React.FC<UserHorizontalSnippetItemProps> = ({
    user,
    size = "lg",
    isLink = true,
    rightAction,
    ...rest
}) => {
    return (
        <Link
            href={isLink ? routes.getProfilePage(user.id) : undefined}
            _hover={{ textDecoration: "none" }}
        >
            <Flex
                p={4}
                // border="1px solid"
                // borderColor="gray.200"
                boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
                borderRadius={4}
                align="center"
                justify="space-between"
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
                {...rest}
            >
                <Flex align="center">
                    <Avatar
                        src={user.imageUrl || "/images/noImage.jpg"}
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
                    </VStack>
                </Flex>
                {rightAction}
            </Flex>
        </Link>
    );
};
export default UserHorizontalSnippetItem;
