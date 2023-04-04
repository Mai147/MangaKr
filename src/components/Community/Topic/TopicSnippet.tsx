import { routes } from "@/constants/routes";
import { Topic } from "@/models/Topic";
import {
    Avatar,
    Box,
    Flex,
    HStack,
    IconButton,
    Link,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

type TopicSnippetProps = {
    topic: Topic;
};

const TopicSnippet: React.FC<TopicSnippetProps> = ({ topic }) => {
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            href={routes.getCommunityTopicDetailPage(
                topic.communityId,
                topic.id!
            )}
        >
            <Box
                borderRadius={12}
                boxShadow="rgba(0, 0, 0, 0.15) 3px 3px 10px 2px"
                p={6}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.3s"
            >
                <HStack spacing={4}>
                    {topic.createdAt && (
                        <Text color="gray.400" fontSize={14}>
                            {moment(new Date(topic.createdAt.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                    <Text
                        color={topic.isClose ? "brand.100" : "green.400"}
                        fontSize={14}
                        fontWeight={500}
                    >
                        {topic.isClose ? "Đã đóng" : "Đang mở"}
                    </Text>
                </HStack>
                <Text fontWeight={600} fontSize={20}>
                    {topic.title}
                </Text>
                <Text noOfLines={3} whiteSpace="pre-line">
                    {topic.description}
                </Text>
                <Flex align="center" justify="space-between" mt={4}>
                    <Flex align="center">
                        <Text
                            as="span"
                            fontSize={14}
                            color="gray.400"
                            display="inline"
                        >
                            Tạo bởi{" "}
                            <Text
                                display="inline"
                                color="gray.600"
                                fontWeight={500}
                            >
                                {topic.creatorDisplayName}
                            </Text>
                        </Text>
                        <Avatar
                            src={topic.creatorImageUrl || "/images/noImage.jpg"}
                            size="sm"
                            ml={2}
                        />
                    </Flex>
                    <IconButton
                        aria-label="next"
                        variant="outline"
                        color="gray.500"
                        borderColor="gray.500"
                        icon={<AiOutlineArrowRight />}
                        ml={10}
                    />
                </Flex>
            </Box>
        </Link>
    );
};
export default TopicSnippet;
