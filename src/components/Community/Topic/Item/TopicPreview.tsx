import Overlay from "@/components/Overlay";
import { Topic } from "@/models/Topic";
import {
    AspectRatio,
    Box,
    Divider,
    Flex,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import TopicItemHeader from "./TopicHeader";

type TopicItemPreviewProps = {
    topic: Topic;
    onHidden: () => void;
};

const TopicItemPreview: React.FC<TopicItemPreviewProps> = ({
    onHidden,
    topic,
}) => {
    return (
        <Overlay
            onHidden={onHidden}
            contentWidth={{ base: "100%", lg: "auto" }}
        >
            <Flex
                flexGrow={1}
                px={{ base: 0, md: 12 }}
                align="center"
                justify="center"
            >
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
                        <Box p={6}>
                            <TopicItemHeader
                                topic={topic}
                                canBack={false}
                                canChangeStatus={false}
                            />
                            <Divider my={4} />
                            <Text fontWeight={600} fontSize={20}>
                                {topic.title}
                            </Text>
                            <Text whiteSpace="pre-line">
                                {topic.description}
                            </Text>
                            {topic.imageUrl && (
                                <Flex justify="center" mt={4}>
                                    <AspectRatio ratio={4 / 3} w="50%">
                                        <Image
                                            src={topic.imageUrl}
                                            borderRadius={4}
                                        />
                                    </AspectRatio>
                                </Flex>
                            )}
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </Overlay>
    );
};
export default TopicItemPreview;
