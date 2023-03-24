import { AspectRatio, Image, Skeleton } from "@chakra-ui/react";
import React, { BaseSyntheticEvent, useState } from "react";

type PostItemImageProps = {
    url: string;
    isShadow?: boolean;
};

const PostItemImage: React.FC<PostItemImageProps> = ({
    url,
    isShadow = false,
}) => {
    const [ratio, setRatio] = useState<number | undefined>();
    const onImageLoad = (e: BaseSyntheticEvent) => {
        const { width, height } = e.target as HTMLImageElement;
        const imageRatio = width / height;
        setRatio(imageRatio <= 0.75 ? 3 / 4 : imageRatio < 1.33 ? 1 : 4 / 3);
    };
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
            <Skeleton w="100%" h="200px" />
            <Image src={url} onLoad={onImageLoad} display="none" />
        </>
    );
};
export default PostItemImage;
