import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import SectionHeading from "@/components/Home/SectionHeading";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import CircleHorizontalSkeleton from "@/components/Skeleton/CircleHorizontalSkeleton";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { Community } from "@/models/Community";
import CommunityService from "@/services/CommunityService";
import { Box, Divider, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type CommunityPageProps = {};

const CommunityPage: React.FC<CommunityPageProps> = () => {
    const { user, setNeedAuth } = useAuth();
    const [communities, setCommunities] = useState<{
        related: Community[];
        top: Community[];
    }>({
        related: [],
        top: [],
    });
    const { toggleView } = useModal();
    const [loading, setLoading] = useState<{
        related: boolean;
        top: boolean;
    }>({
        related: false,
        top: false,
    });

    const getRelatedCommunities = async (userId: string) => {
        setLoading((prev) => ({
            ...prev,
            related: true,
        }));
        const communities = await CommunityService.getUserRelated({ userId });
        setCommunities((prev) => ({
            ...prev,
            related: communities,
        }));
        setLoading((prev) => ({
            ...prev,
            related: false,
        }));
    };

    const getTopCommunities = async () => {
        setLoading((prev) => ({
            ...prev,
            top: true,
        }));
        const communities = await CommunityService.getAll({
            communityOrderBy: "numberOfMembers",
        });
        setCommunities((prev) => ({
            ...prev,
            top: communities,
        }));
        setLoading((prev) => ({
            ...prev,
            top: false,
        }));
    };

    useEffect(() => {
        if (user) {
            getRelatedCommunities(user.uid);
            getTopCommunities();
        }
    }, [user]);

    useEffect(() => {
        setNeedAuth(false);
    }, []);

    return (
        <PageContent>
            <VStack spacing={2} align="flex-start">
                <SectionHeading title="Bạn có thể thích" />
                {loading.related &&
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)}
                {communities.related.length > 0 ? (
                    communities.related.map((community) => (
                        <Box w="100%" key={community.id}>
                            <CommunitySnippetHorizontalItem
                                community={community}
                                w="100%"
                            />
                        </Box>
                    ))
                ) : (
                    <Text>Không có cộng đồng nào</Text>
                )}
                <Divider py={4} borderColor="gray.400" />
                <SectionHeading title="Cộng đồng nổi bật" />
                {loading.top &&
                    [1, 2, 3].map((e) => <CircleHorizontalSkeleton key={e} />)}
                {communities.top.length > 0 ? (
                    communities.top.map((community) => (
                        <Box w="100%" key={community.id}>
                            <CommunitySnippetHorizontalItem
                                community={community}
                                w="100%"
                            />
                        </Box>
                    ))
                ) : (
                    <Text>Không có cộng đồng nào</Text>
                )}
            </VStack>
            <RightSidebar />
        </PageContent>
    );
};
export default CommunityPage;
