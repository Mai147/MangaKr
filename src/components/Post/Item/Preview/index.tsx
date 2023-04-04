import { Post } from "@/models/Post";
import { Box, Flex, Icon, VStack } from "@chakra-ui/react";
import React from "react";
import { TfiClose } from "react-icons/tfi";
import PostItemContent from "../Content";
import PostItemHeader from "../Header";
import PostItemImages from "../Images";

type PostItemPreviewProps = {
    post: Post;
    onHidden: (e: React.MouseEvent) => void;
};

const PostItemPreview: React.FC<PostItemPreviewProps> = ({
    onHidden,
    post,
}) => {
    return (
        <Box
            bg="transparent"
            position="fixed"
            top={0}
            bottom={0}
            left={0}
            right={0}
            zIndex={1000}
        >
            <Box
                onClick={onHidden}
                w="100%"
                h="100%"
                bg="black"
                opacity={0.8}
                filter="auto"
                brightness={0.3}
                zIndex={1000}
            ></Box>
            <Icon
                color="white"
                as={TfiClose}
                position="absolute"
                right={6}
                top={6}
                fontSize={24}
                cursor="pointer"
                onClick={onHidden}
            />
            <Flex
                position="absolute"
                top="50%"
                left="50%"
                translateY="-50%"
                translateX="-50%"
                transform="auto"
                align="center"
                w="50%"
                onClick={onHidden}
            >
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
            </Flex>
        </Box>
    );
};
export default PostItemPreview;
