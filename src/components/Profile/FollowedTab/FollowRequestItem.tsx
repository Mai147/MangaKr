import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import { Follow, UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import { Box, HStack, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";

type FollowRequestItemProps = {
    follow: Follow;
    follower: UserModel;
};

const FollowRequestItem: React.FC<FollowRequestItemProps> = ({
    follow,
    follower,
}) => {
    const [acceptFollowLoading, setAcceptFollowLoading] = useState(false);
    const [declineFollowLoading, setDeclineFollowLoading] = useState(false);
    return (
        <Box w="100%" key={follow.id}>
            <UserHorizontalSnippetItem
                user={{
                    id: follow.id!,
                    displayName: follow.displayName!,
                    imageUrl: follow.imageUrl,
                }}
                rightAction={
                    <HStack flexShrink={0}>
                        <IconButton
                            aria-label="accept"
                            icon={<AiOutlineCheck />}
                            bg="green.300"
                            fontSize={16}
                            _hover={{
                                bg: "green.400",
                            }}
                            size="md"
                            isLoading={acceptFollowLoading}
                            isDisabled={declineFollowLoading}
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAcceptFollowLoading(true);
                                await UserService.acceptFollow({
                                    userId: follow.id!,
                                    follower: {
                                        id: follower.uid,
                                        displayName: follower.displayName!,
                                        imageUrl: follower.photoURL,
                                    },
                                });
                                setAcceptFollowLoading(false);
                            }}
                        />
                        <IconButton
                            aria-label="accept"
                            icon={<MdOutlineClear />}
                            fontSize={16}
                            size="md"
                            isLoading={declineFollowLoading}
                            isDisabled={acceptFollowLoading}
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeclineFollowLoading(true);
                                await UserService.declineFollow({
                                    followerId: follower.uid,
                                    userId: follow.id!,
                                });
                                setDeclineFollowLoading(false);
                            }}
                        />
                    </HStack>
                }
            />
        </Box>
    );
};
export default FollowRequestItem;
