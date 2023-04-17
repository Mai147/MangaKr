import Overlay from "@/components/Overlay";
import { Voting } from "@/models/Vote";
import {
    Avatar,
    Box,
    Divider,
    Flex,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";

type VotingItemPreviewProps = {
    voting: Voting;
    onHidden: () => void;
};

const VotingItemPreview: React.FC<VotingItemPreviewProps> = ({
    onHidden,
    voting,
}) => {
    return (
        <Overlay onHidden={onHidden} contentWidth="80%">
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
                        <Box p={6} w="100%">
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
                                        {voting.creatorDisplayName}
                                    </Text>
                                </Text>
                                <Avatar
                                    src={
                                        voting.creatorImageUrl ||
                                        "/images/noImage.jpg"
                                    }
                                    size="sm"
                                    ml={2}
                                />
                                {voting.createdAt && (
                                    <Text color="gray.400" fontSize={14} ml={4}>
                                        {moment(
                                            new Date(
                                                voting.createdAt.seconds * 1000
                                            )
                                        )
                                            .locale("vi")
                                            .fromNow()}
                                    </Text>
                                )}
                            </Flex>
                            <Divider my={4} />
                            <Text fontWeight={600} fontSize={20}>
                                {voting.content}
                            </Text>
                            <VStack spacing={4} mt={4}>
                                {voting.options.map((votingOption) => (
                                    <Flex
                                        w="100%"
                                        p={6}
                                        boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
                                        borderRadius={8}
                                        key={votingOption.id}
                                    >
                                        <VStack w="100%" spacing={4}>
                                            <Flex w="100%">
                                                {votingOption.imageUrl && (
                                                    <Image
                                                        src={
                                                            votingOption.imageUrl
                                                        }
                                                        maxW="200px"
                                                        h="150px"
                                                        objectFit="cover"
                                                        borderRadius={8}
                                                        mr={4}
                                                    />
                                                )}
                                                <Text whiteSpace="pre-line">
                                                    {votingOption.value}
                                                </Text>
                                            </Flex>
                                        </VStack>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </Overlay>
    );
};
export default VotingItemPreview;
