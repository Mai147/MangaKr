import useVoting from "@/hooks/useVoting";
import { VotingOption } from "@/models/Vote";
import { isDateEnd } from "@/utils/StringUtils";
import {
    Button,
    Flex,
    HStack,
    Icon,
    Image,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import VotingOptionResult from "./VotingOptionResult";

type VotingOptionItemProps = {
    votingOption: VotingOption;
};

const VotingOptionItem: React.FC<VotingOptionItemProps> = ({
    votingOption,
}) => {
    const { votingState, votingAction } = useVoting();
    const [voteLoading, setVoteLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    return (
        <Flex
            w="100%"
            p={{ base: 2, md: 6 }}
            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            borderRadius={8}
            bgGradient={`linear(to-r, rgba(200,60,30,0.1) ${
                (votingOption.numberOfVotes /
                    (votingState.selectedVoting?.voting.numberOfVotes || 1)) *
                100
            }%, white ${
                (votingOption.numberOfVotes /
                    (votingState.selectedVoting?.voting.numberOfVotes || 1)) *
                100
            }%)`}
        >
            {showResult && (
                <VotingOptionResult onHidden={() => setShowResult(false)} />
            )}
            <VStack w="100%" spacing={4}>
                <Flex
                    w="100%"
                    align="center"
                    justify="space-between"
                    direction={{ base: "column", sm: "row" }}
                >
                    <Flex
                        w="100%"
                        mr={{ base: 0, sm: 8 }}
                        justify={{ base: "center", sm: "flex-start" }}
                        p={{ base: 2, sm: 0 }}
                        border={{ base: "1px solid #dedede", sm: "none" }}
                        borderRadius={{ base: 4, sm: 0 }}
                    >
                        {votingOption.imageUrl && (
                            <Image
                                src={votingOption.imageUrl}
                                maxW={{
                                    base: "100px",
                                    sm: "150px",
                                    md: "200px",
                                }}
                                h={{ base: "80px", sm: "120px", md: "150px" }}
                                objectFit="cover"
                                borderRadius={8}
                                mr={4}
                            />
                        )}
                        <Text whiteSpace="pre-line">{votingOption.value}</Text>
                    </Flex>
                    <VStack flexShrink={0} spacing={1}>
                        {votingOption.id ===
                            votingState.selectedVoting?.userVoteOptionId && (
                            <Icon
                                as={AiFillCheckCircle}
                                color="green.400"
                                fontSize={30}
                            />
                        )}
                        <Text fontWeight={500} fontSize={{ base: 16, md: 20 }}>
                            {(
                                (votingOption.numberOfVotes /
                                    (votingState.selectedVoting?.voting
                                        .numberOfVotes || 1)) *
                                100
                            ).toFixed(2)}
                            %
                        </Text>
                        <Text color="gray.500" fontSize={{ base: 14, md: 16 }}>
                            {votingOption.numberOfVotes} lượt bình chọn
                        </Text>
                        <HStack>
                            {votingState.selectedVoting &&
                                !votingState.selectedVoting.voting.isClose &&
                                !isDateEnd(
                                    votingState.selectedVoting.voting.timeLast
                                ) && (
                                    <Button
                                        w={{ base: "20", md: "28" }}
                                        size={{ base: "sm", md: "md" }}
                                        isLoading={voteLoading}
                                        onClick={async () => {
                                            setVoteLoading(true);
                                            await votingAction.handleVote(
                                                votingOption.id!
                                            );
                                            setVoteLoading(false);
                                        }}
                                    >
                                        {votingOption.id ===
                                        votingState.selectedVoting
                                            ?.userVoteOptionId
                                            ? "Hủy bình chọn"
                                            : "Bình chọn"}
                                    </Button>
                                )}
                            <Button
                                variant="outline"
                                w={{ base: "20", md: "28" }}
                                size={{ base: "sm", md: "md" }}
                                onClick={() => {
                                    votingAction.switchVotingOption(
                                        votingOption.id!
                                    );
                                    setShowResult(true);
                                }}
                            >
                                Xem kết quả
                            </Button>
                        </HStack>
                    </VStack>
                </Flex>
            </VStack>
        </Flex>
    );
};
export default VotingOptionItem;
