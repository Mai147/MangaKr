import { useMessage } from "@/hooks/useMessage";
import { IconButton } from "@chakra-ui/react";
import React, { useRef } from "react";
import { MdOutlineAttachFile } from "react-icons/md";

type MessageInputImageButtonProps = {};

const MessageInputImageButton: React.FC<MessageInputImageButtonProps> = () => {
    const imageRef = useRef<HTMLInputElement>(null);
    const { messageAction, messageState } = useMessage();
    return (
        <>
            <IconButton
                aria-label="File button"
                variant="ghost"
                type="submit"
                icon={<MdOutlineAttachFile />}
                fontSize={20}
                color="gray.500"
                onClick={() => imageRef.current?.click()}
                isDisabled={messageState.loading.sendMessageLoading}
            />
            <input
                type="file"
                hidden
                ref={imageRef}
                onChange={messageAction.onChooseImages}
                accept="image/*"
                multiple
            />
        </>
    );
};
export default MessageInputImageButton;
