import { Topic } from "@/models/Topic";
import {
    AspectRatio,
    Box,
    Flex,
    HStack,
    IconButton,
    Image,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";

type TopicHorizontalSnippetItemProps = {
    topic: Topic;
    handleApprove?: (isAccept: boolean) => Promise<void>;
};

const TopicHorizontalSnippetItem: React.FC<TopicHorizontalSnippetItemProps> = ({
    topic,
    handleApprove,
}) => {
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [deleLoading, setDeleteLoading] = useState(false);

    return (
        <Flex
            justify="space-between"
            align="center"
            w="100%"
            p={4}
            _hover={{ bg: "gray.50" }}
            transition="all 0.3s"
        >
            <HStack spacing={4} flexGrow={1}>
                <Text w="100px" flexShrink={0}>
                    {topic.creatorDisplayName}
                </Text>
                <Box w="80px" flexShrink={0}>
                    <AspectRatio ratio={4 / 3} w="90%">
                        <Image src={topic.imageUrl || "/images/noImage.jpg"} />
                    </AspectRatio>
                </Box>
                <Text w="300px" flexShrink={0}>
                    {topic.title}
                </Text>
                <Text flexGrow={1} noOfLines={3} whiteSpace="pre-line">
                    {topic.description}
                </Text>
            </HStack>
            <IconButton
                aria-label="approve-button"
                icon={<AiOutlineCheck fontSize={16} />}
                ml={10}
                flexShrink={0}
                bg={"green.300"}
                _hover={{
                    bg: "green.400",
                }}
                isLoading={acceptLoading}
                isDisabled={deleLoading}
                onClick={async (e) => {
                    e.stopPropagation();
                    setAcceptLoading(true);
                    handleApprove && (await handleApprove(true));
                    setAcceptLoading(false);
                }}
            />
            <IconButton
                aria-label="approve-button"
                icon={<MdOutlineClear fontSize={16} />}
                ml={10}
                flexShrink={0}
                bg={"brand.100"}
                _hover={{
                    bg: "brand.400",
                }}
                isLoading={deleLoading}
                isDisabled={acceptLoading}
                onClick={async (e) => {
                    e.stopPropagation();
                    setDeleteLoading(true);
                    handleApprove && (await handleApprove(false));
                    setDeleteLoading(false);
                }}
            />
        </Flex>
    );
};
export default TopicHorizontalSnippetItem;
