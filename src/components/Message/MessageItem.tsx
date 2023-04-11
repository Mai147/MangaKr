import useAuth from "@/hooks/useAuth";
import { useMessage } from "@/hooks/useMessage";
import { Message } from "@/models/Message";
import { Avatar, Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import MessageItemImage from "./MessageItemImage";

type MessageItemProps = {
    message: Message;
};

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const { user } = useAuth();
    const { messageState } = useMessage();
    return (
        <Flex
            mb={4}
            flexDirection={message.type === "RECEIVE" ? "row" : "row-reverse"}
        >
            <Avatar
                src={
                    (message.type === "RECEIVE"
                        ? messageState.selectedUser?.imageUrl
                        : user?.photoURL) || "/images/noImage.jpg"
                }
                flexShrink={0}
                ml={message.type === "RECEIVE" ? 0 : 2}
                mr={message.type === "RECEIVE" ? 2 : 0}
            />
            <VStack
                align={message.type === "RECEIVE" ? "flex-start" : "flex-end"}
            >
                <Flex
                    align="flex-end"
                    flexDirection={
                        message.type === "RECEIVE" ? "row" : "row-reverse"
                    }
                >
                    <Text fontWeight={600} lineHeight="1">
                        {message.type === "RECEIVE"
                            ? messageState.selectedUser?.displayName
                            : "Bạn"}
                    </Text>
                    <Text
                        color="gray.400"
                        fontWeight={500}
                        fontSize={12}
                        ml={message.type === "RECEIVE" ? 4 : 0}
                        mr={message.type === "RECEIVE" ? 0 : 4}
                        lineHeight={1}
                    >
                        {moment(
                            new Date(message.createdAt!.seconds * 1000)
                        ).format("HH : mm")}
                    </Text>
                </Flex>
                {message.imageUrls.map((url, idx) => (
                    <MessageItemImage key={idx} url={url} />
                ))}
                <VStack
                    spacing={1}
                    align={
                        message.type === "RECEIVE" ? "flex-start" : "flex-end"
                    }
                >
                    {(message.contents || []).map((contentData, idx) => (
                        <Flex
                            key={idx}
                            align="flex-end"
                            flexDirection={
                                message.type === "RECEIVE"
                                    ? "row-reverse"
                                    : "row"
                            }
                        >
                            {(idx === (message.contents || []).length - 1 ||
                                contentData.isSent === false) &&
                                message.id ===
                                    messageState.selectedUserMessage.output.list.slice(
                                        -1
                                    )[0].id && (
                                    <Flex
                                        rounded="full"
                                        w="4"
                                        h="4"
                                        align="center"
                                        justify="center"
                                        fontSize={12}
                                        color={
                                            contentData.isSent
                                                ? "white"
                                                : "gray.400"
                                        }
                                        bg={
                                            contentData.isSent
                                                ? "gray.400"
                                                : "transparent"
                                        }
                                        border="1px solid"
                                        borderColor="gray.400"
                                        mr={message.type === "RECEIVE" ? 0 : 2}
                                        ml={message.type === "RECEIVE" ? 2 : 0}
                                    >
                                        {contentData.isSent && (
                                            <Icon as={AiOutlineCheck} />
                                        )}
                                    </Flex>
                                )}
                            <Box
                                bg={
                                    message.type === "RECEIVE"
                                        ? "white"
                                        : "#0147FF"
                                }
                                color={
                                    message.type === "RECEIVE"
                                        ? "gray.700"
                                        : "white"
                                }
                                borderRadius={16}
                                borderTopLeftRadius={
                                    message.type === "RECEIVE" ? 0 : 16
                                }
                                borderTopRightRadius={
                                    message.type === "RECEIVE" ? 16 : 0
                                }
                                borderBottomRightRadius={
                                    message.type === "RECEIVE"
                                        ? 0
                                        : idx <
                                          (message.contents?.length || 0) - 1
                                        ? 0
                                        : 16
                                }
                                borderBottomLeftRadius={
                                    message.type === "SEND"
                                        ? 0
                                        : idx <
                                          (message.contents?.length || 0) - 1
                                        ? 0
                                        : 16
                                }
                                px={4}
                                py={2}
                                key={idx}
                            >
                                <Text whiteSpace="pre-line">
                                    {contentData.content}
                                </Text>
                            </Box>
                        </Flex>
                    ))}
                </VStack>
            </VStack>
        </Flex>
    );
};
export default MessageItem;
