import { useMessage } from "@/hooks/useMessage";
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import React from "react";

type MessageHeaderProps = {};

const MessageHeader: React.FC<MessageHeaderProps> = () => {
    const { messageState } = useMessage();
    return messageState.selectedUser ? (
        <>
            <Flex px={6} py={4}>
                <Avatar
                    src={
                        messageState.selectedUser?.imageUrl ||
                        "/images/noImage.jpg"
                    }
                />
                <Text ml={2} fontWeight={600}>
                    {messageState.selectedUser?.displayName}
                </Text>
            </Flex>

            <Divider borderColor="gray.400" />
        </>
    ) : (
        <Flex px={6} py={4}>
            <Avatar src={"/images/noImage.jpg"} />
            <Text ml={2} fontWeight={600}>
                Unknown
            </Text>
        </Flex>
    );
};
export default MessageHeader;
