import { Image, Skeleton } from "@chakra-ui/react";
import React, { BaseSyntheticEvent, useState } from "react";

type MessageItemImageProps = {
    url: string;
};

const MessageItemImage: React.FC<MessageItemImageProps> = ({ url }) => {
    const [imageLoad, setImageLoad] = useState(true);
    const onImageLoad = (e: BaseSyntheticEvent) => {
        setImageLoad(false);
    };
    return imageLoad ? (
        <>
            <Skeleton w="100%" h={"150px"} />
            <Image src={url} w="100%" onLoad={onImageLoad} display="none" />
        </>
    ) : (
        <Image src={url} maxW="100%" />
    );
};
export default MessageItemImage;
