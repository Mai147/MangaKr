import Overlay from "@/components/Overlay";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import useVoting from "@/hooks/useVoting";
import {
    Box,
    Flex,
    Spinner,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import React from "react";

type VotingOptionResultProps = {
    onHidden: () => void;
};

const VotingOptionResult: React.FC<VotingOptionResultProps> = ({
    onHidden,
}) => {
    const { votingState } = useVoting();
    return (
        <Overlay onHidden={onHidden} contentWidth={{ base: "80%", md: "50%" }}>
            <Flex
                flexGrow={1}
                px={{ base: 4, md: 12 }}
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
                    {votingState.loading.getVotingOptionVote ? (
                        <Flex py={4} align="center" justify="center">
                            <Spinner />
                        </Flex>
                    ) : (
                        <VStack align="flex-start" w="100%" spacing={0}>
                            {(
                                votingState.selectedVoting?.selectedVotingOption
                                    ?.userVotes || []
                            ).length === 0 && (
                                <Flex
                                    py={4}
                                    align="center"
                                    justify="center"
                                    w="100%"
                                >
                                    <Text>Chưa có bình chọn nào</Text>
                                </Flex>
                            )}
                            {(
                                votingState.selectedVoting?.selectedVotingOption
                                    ?.userVotes || []
                            ).map((userVote) => (
                                <Box w="100%" key={userVote.id}>
                                    <UserHorizontalSnippetItem
                                        user={userVote}
                                        isLink={false}
                                        boxShadow="none"
                                        borderBottom="1px solid"
                                        borderColor="gray.300"
                                    />
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            </Flex>
        </Overlay>
    );
};
export default VotingOptionResult;
