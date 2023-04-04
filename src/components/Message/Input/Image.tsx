import ImageShow from "@/components/ImageUpload/ImageShow";
import { useMessage } from "@/hooks/useMessage";
import { Box, IconButton, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";

type MessageInputImageProps = {
    url: string;
    isShadow?: boolean;
};

const MessageInputImage: React.FC<MessageInputImageProps> = ({
    url,
    isShadow = false,
}) => {
    const [isShowImage, setIsShowImage] = useState(false);
    const { messageAction } = useMessage();
    return (
        <Box
            mr={4}
            mb={4}
            position="relative"
            cursor="pointer"
            onClick={() => setIsShowImage(true)}
        >
            {isShowImage && (
                <ImageShow
                    imageList={[url]}
                    onHidden={() => setIsShowImage(false)}
                />
            )}
            <Image
                w="60px"
                h="60px"
                objectFit="cover"
                borderRadius={4}
                src={url}
                filter="auto"
                brightness={isShadow ? 0.4 : 1}
            />
            <IconButton
                position="absolute"
                top={-2}
                right={-2}
                aria-label="delete button"
                icon={<IoIosClose />}
                size="xs"
                onClick={(e) => {
                    e.stopPropagation();
                    messageAction.onDeleteImageInput(url);
                }}
            />
        </Box>
    );
};
export default MessageInputImage;
