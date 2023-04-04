import { useMessage } from "@/hooks/useMessage";
import { Flex } from "@chakra-ui/react";
import React from "react";
import MessageInputImage from "./Image";

type MessageInputImagesProps = {};

const MessageInputImages: React.FC<MessageInputImagesProps> = () => {
    const { messageState } = useMessage();
    return (
        <Flex flexWrap="wrap">
            {messageState.messageInput.imageUrls.map((image) => (
                <MessageInputImage url={image} key={image} />
            ))}
        </Flex>
    );
};
export default MessageInputImages;
