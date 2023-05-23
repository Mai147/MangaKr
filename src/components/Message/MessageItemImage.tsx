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
    const onImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageLoad(false);
        console.log("Image not Found");
    };
    return imageLoad ? (
        <>
            <Skeleton w="100%" h={"150px"} />
            <Image
                src={url}
                w="100%"
                onLoad={onImageLoad}
                onError={onImageError}
                display="none"
            />
        </>
    ) : (
        <Image
            src={url}
            maxW={{ base: "100%", sm: "50%", md: "40%", xl: "30%" }}
        />
    );
};
export default MessageItemImage;
