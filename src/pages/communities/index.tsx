import CommunitySnippetHorizontalItem from "@/components/Community/Snippet/CommunitySnippetHorizontalItem";
import SectionHeading from "@/components/Home/SectionHeading";
import PageContent from "@/components/Layout/PageContent";
import RightSidebar from "@/components/Layout/Sidebar/RightSidebar";
import CreateCommunityModal from "@/components/Modal/Community/CreateCommunityModal";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import { Community } from "@/models/Community";
import { Box, Divider, VStack } from "@chakra-ui/react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type CommunityPageProps = {};

const CommunityPage: React.FC<CommunityPageProps> = () => {
    const { user } = useAuth();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(false);

    const getRelativeCommunities = async (userId: string) => {
        setLoading(true);
        const readingBookDocsRef = collection(
            fireStore,
            firebaseRoute.getUserReadingBookSnippetRoute(userId)
        );
        const readingBookQuery = query(readingBookDocsRef, limit(3));
        const readingBookDocs = await getDocs(readingBookQuery);
        const bookIds = readingBookDocs.docs.map((doc) => doc.id);
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const communityQuery = query(
            communityDocsRef,
            where("bookId", "in", bookIds),
            limit(10)
        );
        const communityDocs = await getDocs(communityQuery);
        const communities = communityDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Community)
        );
        setCommunities(communities);
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            getRelativeCommunities(user.uid);
        }
    }, [user]);
    return (
        <PageContent>
            <VStack spacing={2} align="flex-start">
                <SectionHeading title="You may like" />
                {communities.map((community) => (
                    <Box w="100%" key={community.id}>
                        <CommunitySnippetHorizontalItem
                            community={community}
                            w="100%"
                        />
                    </Box>
                ))}
                <Divider py={4} />
                <SectionHeading title="Cộng đồng nổi bật" />
            </VStack>
            <RightSidebar />
        </PageContent>
    );
};
export default CommunityPage;
