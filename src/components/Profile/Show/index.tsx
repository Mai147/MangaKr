import InfiniteScroll from "@/components/InfiniteScroll";
import PostItem from "@/components/Post/Item";
import { usePost } from "@/hooks/usePost";
import { UserModel } from "@/models/User";
import {
    Avatar,
    Box,
    Divider,
    Flex,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

type ProfileShowProps = {
    user: UserModel;
};

const ProfileShow: React.FC<ProfileShowProps> = ({ user }) => {
    const { postState, postAction } = usePost();

    useEffect(() => {
        postAction.setSelectedUser(user);
    }, [user]);

    return (
        <Flex direction="column" align="flex-start">
            <Flex alignItems="center">
                <Avatar
                    size={"2xl"}
                    src={user.photoURL || ""}
                    border="3px solid"
                    borderColor="white"
                    box-shadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                    mr={6}
                    referrerPolicy="no-referrer"
                />
                <VStack spacing={0} alignItems="flex-start">
                    <VStack spacing={-2} align="flex-start">
                        <Text fontSize={24} fontWeight={700}>
                            {user.displayName}
                        </Text>
                        <Text fontSize={16} color="gray.400">
                            {user.email}
                        </Text>
                    </VStack>
                    <Text color="gray.600">{user.subBio}</Text>
                </VStack>
            </Flex>
            <Divider my={4} />
            <VStack align="flex-start">
                <Text>{user.bio || "Không"}</Text>
            </VStack>
            <VStack w="100%" justify="center" mt={4}>
                <Box w="90%">
                    <InfiniteScroll
                        isLoading={postState.loading.getAll}
                        page={postState.output.page}
                        totalPage={postState.output.totalPage}
                        onNext={postAction.loadMore}
                    >
                        {postState.output.list.map((postData) => (
                            <PostItem
                                postData={postData}
                                key={postData.post.id}
                            />
                        ))}
                    </InfiniteScroll>
                </Box>
                {postState.loading.getAll && <Spinner />}
            </VStack>
        </Flex>
    );
};
export default ProfileShow;
