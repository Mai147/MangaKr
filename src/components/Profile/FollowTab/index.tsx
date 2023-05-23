import Pagination from "@/components/Pagination";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    FollowPaginationInput,
    defaultPaginationInput,
    PaginationOutput,
    defaultPaginationOutput,
} from "@/hooks/usePagination";
import { Follow, UserModel } from "@/models/User";
import { Box, Flex, IconButton, Spinner, VStack } from "@chakra-ui/react";
import { CiCircleRemove } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import UserService from "@/services/UserService";
import useAuth from "@/hooks/useAuth";

type ProfileFollowTabProps = {
    user: UserModel;
};

const ProfileFollowTab: React.FC<ProfileFollowTabProps> = ({ user }) => {
    const [followPaginationInput, setFollowPaginationInput] =
        useState<FollowPaginationInput>({
            ...defaultPaginationInput,
            userId: user.uid,
            isAccept: true,
            pageCount: USER_PAGE_COUNT,
            setDocValue: (docValue) => {
                setFollowPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [followPaginationOutput, setFollowPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const [loading, setLoading] = useState(true);
    const { getFollows } = usePagination();
    const userAuth = useAuth();

    const getListFollows = async () => {
        setLoading(true);
        const res = await getFollows(followPaginationInput);
        if (res) {
            setFollowPaginationOutput(res);
            setFollowPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
        setLoading(false);
    };

    useEffect(() => {
        getListFollows();
    }, [user, followPaginationInput.page]);

    return (
        <Box w="100%">
            <VStack w="100%" spacing={{ base: 2, md: 4 }} mb={8}>
                {loading ? (
                    <Spinner />
                ) : (
                    followPaginationOutput.list.map((item: Follow) => (
                        <Flex
                            w="100%"
                            key={item.id}
                            pr={{ base: 2, md: 4 }}
                            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
                            borderRadius={4}
                            align="center"
                            justify="space-between"
                        >
                            <Box flexGrow={1}>
                                <UserHorizontalSnippetItem
                                    user={{
                                        id: item.id!,
                                        displayName: item.displayName!,
                                        imageUrl: item.imageUrl,
                                    }}
                                    boxShadow="none"
                                />
                            </Box>
                            {user.uid === userAuth.user?.uid && (
                                <IconButton
                                    aria-label="unfollow-button"
                                    icon={<IoMdClose />}
                                    fontSize={20}
                                    onClick={async () => {
                                        await UserService.unfollow({
                                            userId: userAuth.user!.uid,
                                            followerId: user.uid,
                                        });
                                        setFollowPaginationOutput((prev) => ({
                                            ...prev,
                                            accept: {
                                                ...prev,
                                                list: prev.list.filter(
                                                    (acceptItem: Follow) =>
                                                        acceptItem.id !==
                                                        item.id
                                                ),
                                            },
                                        }));
                                    }}
                                />
                            )}
                        </Flex>
                    ))
                )}
            </VStack>
            <Pagination
                page={followPaginationOutput.page}
                totalPage={followPaginationOutput.totalPage}
                onNext={() => {
                    setFollowPaginationInput((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                        isNext: true,
                    }));
                }}
                onPrev={() => {
                    setFollowPaginationInput((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                        isNext: false,
                    }));
                }}
            />
        </Box>
    );
};
export default ProfileFollowTab;
