import { routes } from "@/constants/routes";
import { Voting } from "@/models/Vote";
import { isDateEnd } from "@/utils/StringUtils";
import {
    Avatar,
    Box,
    Divider,
    Flex,
    HStack,
    IconButton,
    Link,
    Text,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { AiOutlineArrowRight } from "react-icons/ai";

type VotingSnippetProps = {
    voting: Voting;
};

const VotingSnippet: React.FC<VotingSnippetProps> = ({ voting }) => {
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            href={routes.getCommunityVotingDetailPage(
                voting.communityId,
                voting.id!
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
                    {voting.createdAt && (
                        <Text color="gray.400" fontSize={14}>
                            {moment(new Date(voting.createdAt.seconds * 1000))
                                .locale("vi")
                                .fromNow()}
                        </Text>
                    )}

                    <Text
                        color={
                            isDateEnd(voting.timeLast)
                                ? "brand.100"
                                : "green.400"
                        }
                        fontSize={14}
                        fontWeight={500}
                    >
                        {isDateEnd(voting.timeLast) ? "Đã kết thúc" : "Đang mở"}
                    </Text>
                    <Text color="gray.700" fontSize={14} fontWeight={500}>
                        Đến{" "}
                        {moment(
                            new Date(voting.timeLast.seconds * 1000)
                        ).format("HH:mm DD/MM/yyyy")}
                    </Text>
                </HStack>
                <Text noOfLines={3} whiteSpace="pre-line" fontWeight={600}>
                    {voting.content}
                </Text>
                <Divider my={4} />
                <Text>{voting.numberOfOptions} lựa chọn</Text>
                <Flex align="center">
                    <Text>{voting.numberOfVotes} người đã bình chọn</Text>
                    <Box position="relative" h="8" w="28" ml={2}>
                        {voting.votingVoteSnippets.map((snippet, idx) => {
                            return (
                                <Avatar
                                    key={snippet.id}
                                    size="sm"
                                    src={
                                        snippet.imageUrl ||
                                        "/images/noImage.jpg"
                                    }
                                    position="absolute"
                                    top={0}
                                    left={`calc(24px * ${idx})`}
                                    border="2px solid white"
                                    zIndex={idx}
                                />
                            );
                        })}
                        {voting.numberOfVotes > 3 && (
                            <Flex
                                w="34px"
                                h="34px"
                                borderRadius="full"
                                position="absolute"
                                align="center"
                                justify="center"
                                bg="gray.300"
                                fontSize={10}
                                fontWeight={500}
                                top={0}
                                left={`calc(24px * 3 - 6px)`}
                                border="2px solid white"
                                zIndex={4}
                            >
                                +{voting.numberOfVotes - 3}
                            </Flex>
                        )}
                    </Box>
                </Flex>
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
                                {voting.creatorDisplayName}
                            </Text>
                        </Text>
                        <Avatar
                            src={
                                voting.creatorImageUrl || "/images/noImage.jpg"
                            }
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
export default VotingSnippet;
