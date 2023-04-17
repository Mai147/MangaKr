import Overlay from "@/components/Overlay";
import { Post } from "@/models/Post";
import { Box, Flex, VStack } from "@chakra-ui/react";
import React from "react";
import PostItemContent from "../Content";
import PostItemHeader from "../Header";
import PostItemImages from "../Images";

type PostItemPreviewProps = {
    post: Post;
    onHidden: () => void;
};

const PostItemPreview: React.FC<PostItemPreviewProps> = ({
    onHidden,
    post,
}) => {
    return (
        <Overlay onHidden={onHidden} contentWidth="50%">
            <Flex flexGrow={1} px={12} align="center" justify="center">
                <Box
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius={8}
                    boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
                    bg="white"
                    w="100%"
                    overflow="auto"
                    maxH="calc(100vh - 36px)"
                    className="scroll dark"
                    cursor="default"
                    onClick={(e) => e.stopPropagation()}
                >
                    <VStack align="flex-start" w="100%">
                        <PostItemHeader post={post} />
                        <PostItemContent post={post} />
                        <Box w="100%">
                            <PostItemImages imageList={post.imageUrls} />
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </Overlay>
    );
};
export default PostItemPreview;
