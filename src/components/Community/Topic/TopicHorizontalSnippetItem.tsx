import { Topic } from "@/models/Topic";
import { AspectRatio, Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { topicHeaderList } from "../Approve/CommunityInfoApprove";
import TopicItemPreview from "./Item/TopicPreview";

type TopicHorizontalSnippetItemProps = {
    topic: Topic;
};

const TopicHorizontalSnippetItem: React.FC<TopicHorizontalSnippetItemProps> = ({
    topic,
}) => {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            px={{ base: 2, md: 4 }}
            py={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
            cursor="pointer"
            onClick={() => setShowPreview(true)}
        >
            {showPreview && (
                <TopicItemPreview
                    topic={topic}
                    onHidden={() => {
                        setShowPreview(false);
                    }}
                />
            )}
            <HStack spacing={4} flexGrow={1}>
                <Text
                    w={topicHeaderList[0].width}
                    flexShrink={0}
                    display={topicHeaderList[0].display}
                >
                    {topic.creatorDisplayName}
                </Text>
                <Box w={topicHeaderList[1].width} flexShrink={0}>
                    <AspectRatio ratio={4 / 3} w="90%">
                        <Image src={topic.imageUrl || "/images/noImage.jpg"} />
                    </AspectRatio>
                </Box>
                <Text w={topicHeaderList[2].width} flexShrink={0}>
                    {topic.title}
                </Text>
                <Text
                    flexGrow={1}
                    noOfLines={3}
                    whiteSpace="pre-line"
                    display={topicHeaderList[0].display}
                >
                    {topic.description}
                </Text>
            </HStack>
        </Flex>
    );
};
export default TopicHorizontalSnippetItem;
