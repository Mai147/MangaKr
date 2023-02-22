import { AspectRatio, Image } from "@chakra-ui/react";
import React from "react";

type BookImageProps = {
    imageUrl?: string | null;
};

const BookImage: React.FC<BookImageProps> = ({ imageUrl }) => {
    return (
        <AspectRatio
            ratio={3 / 4}
            w={{
                base: "100px",
                sm: "150px",
                lg: "200px",
                xl: "250px",
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
export default BookImage;
