import { SharingPost } from "@/models/Post";
import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import "moment/locale/vi";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import PostItem from "../Item";

type SharingPostItemProps = {
    sharingPost: SharingPost;
};

const SharingPostItem: React.FC<SharingPostItemProps> = ({ sharingPost }) => {
    return (
        <Box
            border="1px solid"
            borderColor="gray.300"
            borderRadius={8}
            boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px"
            overflow="hidden"
            mb={10}
            w="100%"
            bg="white"
            px={4}
            py={2}
        >
            <Flex py={4} align="center" justify="space-between" w="100%">
                <Flex align="center">
                    <Avatar
                        src={
                            sharingPost.sharingUserImageUrl ||
                            "/images/noImage.jpg"
                        }
                        mr={2}
                    />
                    <VStack spacing={0} align="flex-start">
                        <HStack align="center">
                            <Text fontWeight={500} fontSize={18} lineHeight={1}>
                                {sharingPost.sharingUserDisplayName}
                            </Text>
                            <Text>đã chia sẻ 1 bài viết</Text>
                        </HStack>
                        {sharingPost.sharingCreatedAt?.seconds && (
                            <Text
                                color="gray.600"
                                fontSize={12}
                                fontWeight={500}
                            >
                                {moment(
                                    new Date(
                                        sharingPost.sharingCreatedAt?.seconds *
                                            1000
                                    )
                                )
                                    .locale("vi")
                                    .fromNow()}
                            </Text>
                        )}
                    </VStack>
                </Flex>
                <Box position="relative" role="group">
                    <Icon
                        as={FiMoreVertical}
                        color="gray.700"
                        fontSize={24}
                        cursor="pointer"
                    />
                    <Box
                        position="absolute"
                        top={4}
                        right={4}
                        px={4}
                        bg="white"
                        boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                        borderRadius={4}
                        opacity={0}
                        visibility="hidden"
                        _groupHover={{ opacity: 1, visibility: "visible" }}
                    >
                        <Link
                            href={sharingPost.url}
                            w="100%"
                            _hover={{ textDecoration: "none" }}
                        >
                            <Button variant="unstyled">
                                <Flex align="center">
                                    Xem bài viết gốc
                                    <Icon
                                        as={HiOutlineDocumentSearch}
                                        fontSize={18}
                                        ml={1}
                                    />
                                </Flex>
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Flex>
            <PostItem
                postData={{
                    post: sharingPost,
                }}
                action={false}
                boxShadow={false}
                reaction={false}
            />
        </Box>
    );
};
export default SharingPostItem;
