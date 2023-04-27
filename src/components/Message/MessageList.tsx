import { useMessage } from "@/hooks/useMessage";
import { Message } from "@/models/Message";
import { compareDate } from "@/utils/StringUtils";
import { Box, Divider, Flex, Spinner, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

type MessageListProps = {};

const MessageList: React.FC<MessageListProps> = () => {
    const { messageState, messageAction } = useMessage();
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "auto" });
    };

    useEffect(() => {
        if (messageState.isNewMessage) {
            scrollToBottom();
        }
    }, [
        messageState.isNewMessage,
        messageState.selectedUserMessage.output.list,
    ]);

    return (
        <Box
            bg="gray.100"
            flexGrow={1}
            w="100%"
            py={6}
            px={12}
            overflow="auto"
            maxH="100%"
            className="scroll"
        >
            {messageState.loading.getListMessageLoading ? (
                <Flex align="center" justify="center" py={2}>
                    <Spinner />
                </Flex>
            ) : (
                <>
                    {messageState.selectedUserMessage.output.page <
                        messageState.selectedUserMessage.output.totalPage && (
                        <Flex align="center" justify="center">
                            <Text
                                onClick={messageAction.loadMoreMessage}
                                cursor="pointer"
                                color="brand.100"
                                fontWeight="500"
                                mb={2}
                            >
                                Xem thêm
                            </Text>
                        </Flex>
                    )}
                    {messageState.selectedUser &&
                        messageState.selectedUserMessage.output.list.length <=
                            0 && (
                            <Flex align="center" justify="center" h="100%">
                                <Text>
                                    Bạn chưa có cuộc trò chuyện nào với{" "}
                                    {messageState.selectedUser?.displayName}
                                </Text>
                            </Flex>
                        )}
                </>
            )}
            {messageState.selectedUserMessage.output.list.map(
                (message: Message, idx: number) => {
                    if (idx === 0) {
                        return (
                            <Box key={message.id}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    mb={2}
                                    position="relative"
                                >
                                    <Box
                                        bg="white"
                                        py={2}
                                        px={6}
                                        rounded="full"
                                        zIndex={2}
                                    >
                                        <Text>
                                            {moment(
                                                new Date(
                                                    message.createdAt!.seconds *
                                                        1000
                                                )
                                            ).format("DD/MM/YYYY")}
                                        </Text>
                                    </Box>
                                    <Divider
                                        position="absolute"
                                        top="50%"
                                        left={0}
                                        right={0}
                                        borderColor="gray.300"
                                    />
                                </Flex>
                                <MessageItem message={message} />
                            </Box>
                        );
                    }
                    if (
                        !compareDate(
                            message.createdAt!,
                            messageState.selectedUserMessage.output.list[
                                idx - 1
                            ].createdAt!
                        )
                    ) {
                        return (
                            <Box key={message.id}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    mb={2}
                                    position="relative"
                                >
                                    <Box
                                        bg="white"
                                        py={2}
                                        px={6}
                                        rounded="full"
                                        zIndex={2}
                                    >
                                        <Text>
                                            {moment(
                                                new Date(
                                                    message.createdAt!.seconds *
                                                        1000
                                                )
                                            ).format("DD/MM/YYYY")}
                                        </Text>
                                    </Box>
                                    <Divider
                                        position="absolute"
                                        top="50%"
                                        left={0}
                                        right={0}
                                        borderColor="gray.300"
                                    />
                                </Flex>
                                <MessageItem message={message} />
                            </Box>
                        );
                    } else {
                        return (
                            <MessageItem message={message} key={message.id} />
                        );
                    }
                }
            )}
            <Box ref={bottomRef}></Box>
        </Box>
    );
};
export default MessageList;
