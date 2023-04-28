import ReactionItem from "@/components/Post/Item/ReactionBar/ReactionItem";
import { Vote } from "@/models/Vote";
import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";

type LeftSidebarProps = {
    voteList: Vote[];
    userVote?: Vote;
    onVote: (value: Vote) => Promise<void>;
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    voteList,
    userVote,
    onVote,
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedReaction, setSelectedReaction] = useState<
        Vote | undefined
    >();
    return (
        <VStack position="sticky" top={24} mr={4} spacing={6}>
            {voteList.map((e) => (
                <ReactionItem
                    key={e.value}
                    icon={e.icon}
                    color={e.color}
                    iconSize={30}
                    isActive={userVote?.value === e.value}
                    isLoading={loading && e === selectedReaction}
                    isDisabled={loading}
                    value={e}
                    onClick={async (value) => {
                        setLoading(true);
                        setSelectedReaction(e);
                        await onVote(value as Vote);
                        setLoading(false);
                    }}
                />
            ))}
        </VStack>
    );
};
export default LeftSidebar;
