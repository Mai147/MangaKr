import Pagination from "@/components/Pagination";
import useVoting from "@/hooks/useVoting";
import { Voting } from "@/models/Vote";
import {
    Box,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { FiSearch } from "react-icons/fi";
import VotingSnippet from "./VotingSnippet";

type CommunityVotingTabProps = {};

const CommunityVotingTab: React.FC<CommunityVotingTabProps> = () => {
    const { votingState, votingAction } = useVoting();

    return (
        <>
            <Box
                mb={4}
                position="sticky"
                top={40}
                left={0}
                bg="white"
                zIndex={999}
                w={"calc(100% + 36px)"}
                pb={4}
            >
                <InputGroup>
                    <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch color="gray.300" />}
                    />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm cuộc bình chọn..."
                        borderColor="gray.400"
                        value={votingState.input.searchValue || ""}
                        onChange={(e) => votingAction.search(e.target.value)}
                    />
                </InputGroup>
            </Box>
            {votingState.loading.getVotings ? (
                <Spinner my={4} />
            ) : votingState.votingPaginationOutput.list &&
              votingState.votingPaginationOutput.list.length > 0 ? (
                <>
                    {votingState.votingPaginationOutput.list.map(
                        (voting: Voting) => (
                            <Box key={voting.id} w="100%" mb={8}>
                                <VotingSnippet voting={voting} />
                            </Box>
                        )
                    )}
                    <Pagination
                        page={votingState.votingPaginationOutput.page || 0}
                        totalPage={
                            votingState.votingPaginationOutput.totalPage || 0
                        }
                        onNext={votingAction.onNext}
                        onPrev={votingAction.onPrev}
                    />
                </>
            ) : (
                <Text>Chưa có cuộc bình chọn nào</Text>
            )}
        </>
    );
};
export default CommunityVotingTab;
