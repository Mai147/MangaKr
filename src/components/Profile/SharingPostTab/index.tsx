import InfiniteScroll from "@/components/InfiniteScroll";
import SharingPostItem from "@/components/Post/Sharing/SharingPostItem";
import { USER_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    SharingPostPaginationInput,
} from "@/hooks/usePagination";
import { SharingPost } from "@/models/Post";
import { UserModel } from "@/models/User";
import { Spinner, Box, Text, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type ProfileSharingPostTabProps = {
    user: UserModel;
};

const ProfileSharingPostTab: React.FC<ProfileSharingPostTabProps> = ({
    user,
}) => {
    const [sharingPostPaginationInput, setSharingPostPaginationInput] =
        useState<SharingPostPaginationInput>({
            ...defaultPaginationInput,
            userId: user.uid,
            isAccept: true,
            isLock: false,
            pageCount: USER_PAGE_COUNT,
            setDocValue: (docValue) => {
                setSharingPostPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [sharingPostPaginationOutput, setSharingPostPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const [loading, setLoading] = useState(true);
    const { getSharingPosts } = usePagination();

    const getListSharingPosts = async () => {
        setLoading(true);
        const res = await getSharingPosts(sharingPostPaginationInput);
        if (res) {
            setSharingPostPaginationOutput((prev) => ({
                ...prev,
                ...res,
                list: [...prev.list, ...res.list],
            }));
            setSharingPostPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
        setLoading(false);
    };

    useEffect(() => {
        getListSharingPosts();
    }, [user, sharingPostPaginationInput.page]);

    return (
        <Box w="100%">
            {!loading && sharingPostPaginationOutput.list.length <= 0 ? (
                <Flex w="100%" align="center" justify="center">
                    <Text>{user.displayName} chưa chia sẻ bài viết nào</Text>
                </Flex>
            ) : (
                <>
                    <Box w="100%" mt={8}>
                        <InfiniteScroll
                            isLoading={loading}
                            page={sharingPostPaginationOutput.page}
                            totalPage={sharingPostPaginationOutput.totalPage}
                            onNext={() => {
                                setSharingPostPaginationOutput((prev) => ({
                                    ...prev,
                                    page: prev.page + 1,
                                    isNext: true,
                                }));
                            }}
                        >
                            {sharingPostPaginationOutput.list.map(
                                (item: SharingPost) => (
                                    <SharingPostItem
                                        key={item.id}
                                        sharingPost={item}
                                    />
                                )
                            )}
                        </InfiniteScroll>
                    </Box>
                    {loading && <Spinner />}
                </>
            )}
        </Box>
    );
};
export default ProfileSharingPostTab;
