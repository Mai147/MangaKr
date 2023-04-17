import useVoting from "@/hooks/useVoting";
import { VStack } from "@chakra-ui/react";
import React from "react";
import VotingOptionItem from "./VotingOptionItem";

type VotingOptionListProps = {};

const VotingOptionList: React.FC<VotingOptionListProps> = () => {
    const { votingState } = useVoting();
    return (
        <VStack spacing={4}>
            {votingState.selectedVoting!.voting.options.map((votingOption) => (
                <VotingOptionItem
                    key={votingOption.id}
                    votingOption={votingOption}
                />
            ))}
        </VStack>
    );
};
export default VotingOptionList;
