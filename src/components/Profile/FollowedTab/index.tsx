import Pagination from "@/components/Pagination";
import UserHorizontalSnippetItem from "@/components/User/Snippet/UserHorizontalSnippetItem";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import useAuth from "@/hooks/useAuth";
import usePagination, {
    FollowPaginationInput,
    defaultPaginationInput,
    PaginationOutput,
    defaultPaginationOutput,
} from "@/hooks/usePagination";
import { Follow, UserModel } from "@/models/User";
import UserService from "@/services/UserService";
import {
    Box,
    Divider,
    Flex,
    IconButton,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import FollowRequest from "./FollowRequest";

type ProfileFollowedTabProps = {
    user: UserModel;
};

const ProfileFollowedTab: React.FC<ProfileFollowedTabProps> = ({ user }) => {
    const authState = useAuth();
    const [followPaginationInput, setFollowPaginationInput] = useState<{
        request: FollowPaginationInput;
        accept: FollowPaginationInput;
    }>({
        request: {
            ...defaultPaginationInput,
            userId: user.uid,
            isAccept: false,
            pageCount: USER_PAGE_COUNT,
            setDocValue: (docValue) => {
                setFollowPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        },
        accept: {
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
        },
    });
    const [followPaginationOutput, setFollowPaginationOutput] = useState<{
        request: PaginationOutput;
        accept: PaginationOutput;
    }>({
        request: defaultPaginationOutput,
        accept: defaultPaginationOutput,
    });
    const [loading, setLoading] = useState({
        request: true,
        accept: true,
    });
    const { getFolloweds } = usePagination();
    const userAuth = useAuth();

    const getListFolloweds = async (field: "request" | "accept") => {
        setLoading((prev) => ({
            ...prev,
            [field]: true,
        }));
        const res = await getFolloweds(followPaginationInput[field]);
        if (res) {
            setFollowPaginationOutput((prev) => ({
                ...prev,
                [field]: res,
            }));
            setFollowPaginationInput((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    isFirst: false,
                },
            }));
        }
        setLoading((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    useEffect(() => {
        getListFolloweds("accept");
    }, [user, followPaginationInput.accept.page]);

    useEffect(() => {
        if (authState.user && authState.user.uid === user.uid) {
            getListFolloweds("request");
        }
    }, [authState.user, user, followPaginationInput.request.page]);

    return (
        <Box w="100%">
            {}
            <VStack w="100%" spacing={{ base: 2, md: 4 }} mb={8}>
                {loading.accept ? (
                    <Spinner />
                ) : followPaginationOutput.accept.list.length > 0 ? (
                    followPaginationOutput.accept.list.map((item: Follow) => (
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
                                            followerId: userAuth.user!.uid,
                                            userId: user.uid,
                                        });
                                        setFollowPaginationOutput((prev) => ({
                                            ...prev,
                                            accept: {
                                                ...prev.accept,
                                                list: prev.accept.list.filter(
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
                ) : (
                    <Text>Chưa có người theo dõi</Text>
                )}
            </VStack>
            <Pagination
                page={followPaginationOutput.accept.page}
                totalPage={followPaginationOutput.accept.totalPage}
                onNext={() => {
                    setFollowPaginationInput((prev) => ({
                        ...prev,
                        accept: {
                            ...prev.accept,
                            page: prev.accept.page + 1,
                            isNext: true,
                        },
                    }));
                }}
                onPrev={() => {
                    setFollowPaginationInput((prev) => ({
                        ...prev,
                        accept: {
                            ...prev.accept,
                            page: prev.accept.page - 1,
                            isNext: false,
                        },
                    }));
                }}
            />
            <Divider my={4} />
            {authState.user && authState.user.uid === user.uid && (
                <FollowRequest
                    followPaginationOutput={followPaginationOutput.request}
                    follower={authState.user}
                    loading={loading.request}
                    onNext={() => {
                        setFollowPaginationInput((prev) => ({
                            ...prev,
                            request: {
                                ...prev.request,
                                page: prev.request.page + 1,
                                isNext: true,
                            },
                        }));
                    }}
                    onPrev={() => {
                        setFollowPaginationInput((prev) => ({
                            ...prev,
                            request: {
                                ...prev.request,
                                page: prev.request.page - 1,
                                isNext: false,
                            },
                        }));
                    }}
                />
            )}
        </Box>
    );
};
export default ProfileFollowedTab;
