import { AspectRatio, Image, Skeleton } from "@chakra-ui/react";
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

type PostItemImageProps = {
    url: string;
    isShadow?: boolean;
    size?: "sm" | "lg";
};

const PostItemImage: React.FC<PostItemImageProps> = ({
    url,
    isShadow = false,
    size = "lg",
}) => {
    const [ratio, setRatio] = useState<number | undefined>();
    const imageRef = useRef<HTMLImageElement>(null);
    const onImageLoad = () => {
        // const { width, height } = e.target as HTMLImageElement;
        const { width, height } = imageRef.current!;
        const imageRatio = width / height;
        setRatio(imageRatio <= 0.75 ? 3 / 4 : imageRatio < 1.33 ? 1 : 4 / 3);
    };
    useEffect(() => {
        if (imageRef.current) {
            onImageLoad();
        }
    }, [imageRef.current]);
    return ratio ? (
        <AspectRatio ratio={ratio} w="100%" h="100%">
            <Image
                src={url}
                objectFit="cover"
                filter="auto"
                brightness={isShadow ? 0.4 : 1}
            />
        </AspectRatio>
    ) : (
        <>
            <Skeleton w="100%" h={size === "sm" ? "30px" : "150px"} />
            <Image
                src={url}
                ref={imageRef}
                // onLoad={onImageLoad}
                display="none"
            />
        </>
    );
};
export default PostItemImage;
