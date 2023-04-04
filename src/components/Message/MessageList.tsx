import useCommunity from "@/hooks/useCommunity";
import { useMessage } from "@/hooks/useMessage";
import { compareDate } from "@/utils/StringUtils";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
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
    }, [messageState.isNewMessage, messageState.selectedUserMessageList]);

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
            {messageState.selectedMessagePaginationInput?.loading ? (
                <Flex align="center" justify="center" py={2}>
                    <Spinner />
                </Flex>
            ) : (
                <>
                    {(messageState.selectedMessagePaginationInput?.page || 0) <
                        (messageState.selectedMessagePaginationInput
                            ?.totalPage || 0) && (
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
                        messageState.selectedUserMessageList.length <= 0 && (
                            <Flex align="center" justify="center" h="100%">
                                <Text>
                                    Bạn chưa có cuộc trò chuyện nào với{" "}
                                    {messageState.selectedUser?.displayName}
                                </Text>
                            </Flex>
                        )}
                </>
            )}
            {messageState.selectedUserMessageList.map((message, idx) => {
                if (idx === 0) {
                    return (
                        <Box key={message.id}>
                            <Flex align="center" justify="center" mb={2}>
                                <Box bg="white" py={2} px={6} rounded="full">
                                    <Text>
                                        {moment(
                                            new Date(
                                                message.createdAt!.seconds *
                                                    1000
                                            )
                                        ).format("DD/MM/YYYY")}
                                    </Text>
                                </Box>
                            </Flex>
                            <MessageItem message={message} />
                        </Box>
                    );
                }
                if (
                    !compareDate(
                        message.createdAt!,
                        messageState.selectedUserMessageList[idx - 1].createdAt!
                    )
                ) {
                    <Box key={message.id}>
                        <Box>
                            {moment(
                                new Date(message.createdAt!.seconds * 1000)
                            ).format("DD/MM/YYYY")}
                        </Box>
                        <MessageItem message={message} />
                    </Box>;
                } else {
                    return <MessageItem message={message} key={message.id} />;
                }
            })}
            <Box ref={bottomRef}></Box>
        </Box>
    );
};
export default MessageList;
