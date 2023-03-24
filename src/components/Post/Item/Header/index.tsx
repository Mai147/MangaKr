import { Post } from "@/models/Post";
import { Flex, Avatar, VStack, Text, Box } from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React from "react";

type PostItemHeaderProps = {
    post: Post;
};

const PostItemHeader: React.FC<PostItemHeaderProps> = ({ post }) => {
    return (
        <>
            <Flex p={4} pb={2} align="center">
                <Avatar
                    src={post.creatorImageUrl || "/images/noImage.jpg"}
                    mr={2}
                />
                <VStack spacing={0} align="flex-start">
                    <Text fontWeight={500} fontSize={18} lineHeight={1}>
                        {post.creatorDisplayName}
                    </Text>
                    {post.createdAt?.seconds && (
                        <Text color="gray.600" fontSize={12} fontWeight={500}>
                            {moment(new Date(post.createdAt?.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                </VStack>
            </Flex>

            <Flex justify="center" align="center" w="100%" px={4}>
                <Box borderBottom="1px solid" borderColor="gray.300" w="100%" />
            </Flex>
        </>
    );
};
export default PostItemHeader;
