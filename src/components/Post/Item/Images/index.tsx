import ImageShow from "@/components/ImageUpload/ImageShow";
import { Grid, GridItem, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import PostItemImage from "./PostItemImage";

type PostItemImagesProps = {
    imageList: string[];
    size?: "sm" | "lg";
    canShow?: boolean;
};

const getGridTemplateArea = (length: number) => {
    switch (length) {
        case 0:
            return "";
        case 1:
            return `'img0'`;
        case 2:
            return `'img0' 'img1'`;
        case 3:
            return `'img0 img0' 'img1 img2'`;
        case 4:
            return `'img0 img1' 'img2 img3'`;
        case 5:
            return `'img0 img0 img0 img1 img1 img1' 'img2 img2 img3 img3 img4 img4'`;
        default:
            return `'img0 img1 img2' 'img3 img4 img5'`;
    }
};

const PostItemImages: React.FC<PostItemImagesProps> = ({
    imageList,
    size,
    canShow = true,
}) => {
    const [showImageList, setShowImageList] = useState(false);
    return (
        <>
            {canShow && showImageList && imageList.length > 0 && (
                <ImageShow
                    imageList={imageList}
                    onHidden={() => setShowImageList(false)}
                />
            )}
            <Grid
                gridTemplateAreas={getGridTemplateArea(imageList.length)}
                w="100%"
                gridGap={1}
                cursor="pointer"
                onClick={() => setShowImageList(true)}
            >
                {imageList.map((url, idx) => {
                    if (idx < 5)
                        return (
                            <GridItem key={idx} gridArea={`img${idx}`}>
                                <PostItemImage url={url} size={size} />
                            </GridItem>
                        );
                })}
                {imageList.length > 5 && (
                    <GridItem position="relative" gridArea="img5">
                        <PostItemImage
                            url={imageList[5]}
                            isShadow={true}
                            size={size}
                        />
                        <Text
                            position="absolute"
                            top="50%"
                            left="50%"
                            translateX="-50%"
                            translateY="-50%"
                            transform="auto"
                            fontSize={32}
                            color="white"
                        >
                            +{imageList.length - 5}
                        </Text>
                    </GridItem>
                )}
            </Grid>
        </>
    );
};
export default PostItemImages;
