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
            p={6}
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
                <Flex w="100%" align="center" justify="space-between">
                    <Flex w="100%" mr={8}>
                        {votingOption.imageUrl && (
                            <Image
                                src={votingOption.imageUrl}
                                maxW="200px"
                                h="150px"
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
                        <Text fontWeight={500} fontSize={20}>
                            {(
                                (votingOption.numberOfVotes /
                                    (votingState.selectedVoting?.voting
                                        .numberOfVotes || 1)) *
                                100
                            ).toFixed(2)}
                            %
                        </Text>
                        <Text color="gray.500">
                            {votingOption.numberOfVotes} lượt bình chọn
                        </Text>
                        <HStack>
                            {votingState.selectedVoting &&
                                !votingState.selectedVoting.voting.isClose &&
                                !isDateEnd(
                                    votingState.selectedVoting.voting.timeLast
                                ) && (
                                    <Button
                                        w="28"
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
                                w="28"
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
