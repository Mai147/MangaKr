import { AspectRatio, Image } from "@chakra-ui/react";
import React from "react";

type SnippetHorizontalImageProps = {
    imageUrl?: string | null;
};

const SnippetHorizontalImage: React.FC<SnippetHorizontalImageProps> = ({
    imageUrl,
}) => {
    return (
        <AspectRatio
            ratio={3 / 4}
            w={{
                base: "60px",
                lg: "80px",
                xl: "100px",
            }}
            flexShrink={0}
        >
            <Image
                src={imageUrl || "/images/noImage.jpg"}
                objectFit={"cover"}
                borderRadius={4}
                alt="Book Image"
            />
        </AspectRatio>
    );
};
export default SnippetHorizontalImage;
