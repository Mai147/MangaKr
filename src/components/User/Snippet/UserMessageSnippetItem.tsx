import { useMessage } from "@/hooks/useMessage";
import { UserMessageSnippet } from "@/models/User";
import { isToday } from "@/utils/StringUtils";
import UserUtils from "@/utils/UserUtils";
import { Avatar, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React from "react";

type UserMessageSnippetItemProps = {
    userMessage: UserMessageSnippet;
    isActive?: boolean;
};

const UserMessageSnippetItem: React.FC<UserMessageSnippetItemProps> = ({
    userMessage,
    isActive = false,
}) => {
    const { messageAction } = useMessage();
    return (
        <Flex
            px={6}
            py={4}
            bg={isActive ? "gray.100" : "white"}
            align="center"
            w="100%"
            cursor="pointer"
            _hover={{ bg: "gray.50" }}
            transition="all 0.5s"
            onClick={() => {
                if (!isActive) {
                    messageAction.switchUser(
                        UserUtils.messageSnippetToUserSnippet(userMessage)
                    );
                }
            }}
        >
            <Avatar
                size="md"
                flexShrink={0}
                src={userMessage.imageUrl || "/images/noImage.jpg"}
            />
            <HStack
                ml="2"
                flexGrow={1}
                justify="space-between"
                align="flex-start"
            >
                <VStack align="flex-start" spacing={0}>
                    <Text fontWeight={600} fontSize={14}>
                        {userMessage.displayName}
                    </Text>
                    <Text noOfLines={1} fontSize="12" color="gray.400">
                        {userMessage.latestMessage}
                    </Text>
                </VStack>
                <VStack flexShrink={0} spacing={1} align="flex-end">
                    {userMessage.latestCreatedAt?.seconds && (
                        <Text color="gray.600" fontSize={14}>
                            {isToday(userMessage.latestCreatedAt)
                                ? moment(
                                      new Date(
                                          userMessage.latestCreatedAt?.seconds *
                                              1000
                                      )
                                  ).format("HH : mm")
                                : moment(
                                      new Date(
                                          userMessage.latestCreatedAt?.seconds *
                                              1000
                                      )
                                  ).format("DD/MM/YYYY")}
                        </Text>
                    )}
                    {userMessage.numberOfUnseens > 0 && (
                        <Flex
                            borderRadius="full"
                            w="4"
                            h="4"
                            bg="brand.100"
                            align="center"
                            justify="center"
                            fontSize={10}
                            color="white"
                        >
                            {userMessage.numberOfUnseens}
                        </Flex>
                    )}
                </VStack>
            </HStack>
        </Flex>
    );
};
export default UserMessageSnippetItem;
