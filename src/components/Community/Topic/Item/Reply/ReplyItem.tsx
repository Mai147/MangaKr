import { TopicReply } from "@/models/Topic";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";

type TopicReplyItemProps = {
    topicReply: TopicReply;
};

const TopicReplyItem: React.FC<TopicReplyItemProps> = ({ topicReply }) => {
    return (
        <Flex direction="column" align="flex-start">
            <Flex>
                <Avatar
                    src={topicReply.creatorImageUrl || "/images/noImage.jpg"}
                />
                <Box ml={2}>
                    <Text fontWeight={500}>
                        {topicReply.creatorDisplayName}
                    </Text>
                    {topicReply.createdAt && (
                        <Text color="gray.400" fontSize={12}>
                            {moment(
                                new Date(topicReply.createdAt.seconds * 1000)
                            )
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}
                </Box>
            </Flex>
            <Box
                ml={14}
                mt={2}
                position="relative"
                bg="gray.100"
                p={6}
                borderRadius={10}
                borderTopLeftRadius={0}
                _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: "100%",
                    w: 0,
                    h: 0,
                    borderBottom: "20px solid transparent",
                    borderRight: "8px solid",
                    borderTop: "8px solid",
                    borderLeft: "20px solid transparent",
                    borderTopColor: "gray.100",
                    borderRightColor: "gray.100",
                }}
            >
                <Text whiteSpace="pre-line">{topicReply.replyText}</Text>
            </Box>
        </Flex>
    );
};
export default TopicReplyItem;
