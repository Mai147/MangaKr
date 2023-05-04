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
import { Box, Spinner, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

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
                        <Box w="100%" key={item.id}>
                            <UserHorizontalSnippetItem
                                user={{
                                    id: item.id!,
                                    displayName: item.displayName!,
                                    imageUrl: item.imageUrl,
                                }}
                            />
                        </Box>
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
