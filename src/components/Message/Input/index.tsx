import useAuth from "@/hooks/useAuth";
import ResizeTextarea from "react-textarea-autosize";
import {
    Flex,
    Avatar,
    IconButton,
    Box,
    Textarea,
    HStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineSend } from "react-icons/ai";
import MessageInputImageButton from "./ImageButton";
import { useMessage } from "@/hooks/useMessage";
import MessageInputImages from "./Images";

type MessageInputProps = {};

const MessageInput: React.FC<MessageInputProps> = () => {
    const { user } = useAuth();
    const { messageState, messageAction } = useMessage();

    return messageState.selectedUser ? (
        <Box w="100%" p={2}>
            <Flex w="100%" position="relative">
                <Box
                    flexGrow={1}
                    bg="white"
                    pb={2}
                    pt={3}
                    pl={12}
                    pr={24}
                    borderRadius="100"
                    boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                >
                    <MessageInputImages />
                    <Textarea
                        minH="unset"
                        flexGrow={1}
                        bg="white"
                        border="none"
                        outline="none"
                        boxShadow="unset"
                        _focusVisible={{ boxShadow: "unset" }}
                        p={0}
                        value={messageState.messageInput.content}
                        placeholder={"..."}
                        resize="none"
                        className="scroll is-hidden"
                        as={ResizeTextarea}
                        minRows={1}
                        maxRows={2}
                        onChange={(e) =>
                            messageAction.onTypeMessageText(e.target.value)
                        }
                        onPaste={messageAction.onPasteImage}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                await messageAction.handleSendMessage();
                            }
                        }}
                    />
                </Box>

                <Avatar
                    src={user?.photoURL || "/images/noImage.jpg"}
                    size="sm"
                    position="absolute"
                    top={"50%"}
                    left={1}
                    translateY="-50%"
                    transform="auto"
                    zIndex={10}
                />
                <HStack
                    position="absolute"
                    top={"50%"}
                    translateY="-50%"
                    transform="auto"
                    right={0}
                    zIndex={10}
                >
                    <MessageInputImageButton />
                    <IconButton
                        aria-label="Send button"
                        variant="ghost"
                        onClick={messageAction.handleSendMessage}
                        icon={<AiOutlineSend />}
                        fontSize={20}
                        color="gray.500"
                        isLoading={messageState.loading.sendMessageLoading}
                    />
                </HStack>
            </Flex>
        </Box>
    ) : (
        <></>
    );
};
export default MessageInput;
