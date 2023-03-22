import RatingBar from "@/components/RatingBar";
import CircleHorizontalSkeleton from "@/components/Skeleton/CircleHorizontalSkeleton";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { COMMUNITY_PAGE } from "@/constants/routes";
import { fireStore } from "@/firebase/clientApp";
import { Book } from "@/models/Book";
import { Community } from "@/models/Community";
import { Box, Flex, Text } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RightSidebarItem from "./RightSidebarItem";

type RightSidebarProps = {};

const RightSidebar: React.FC<RightSidebarProps> = () => {
    const [topBooks, setTopBooks] = useState<Book[]>([]);
    const [topCommunities, setTopCommunities] = useState<Community[]>([]);
    const [topBooksLoading, setTopBooksLoading] = useState(false);
    const [topCommunitiesLoading, setTopCommunitiesLoading] = useState(false);

    const getTopBooks = async () => {
        setTopBooksLoading(true);
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const bookQuery = query(
            bookDocsRef,
            orderBy("rating", "desc"),
            limit(3)
        );
        const bookDocs = await getDocs(bookQuery);
        const books = bookDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Book)
        );
        setTopBooks(books);
        setTopBooksLoading(false);
    };

    const getTopCommunities = async () => {
        setTopCommunitiesLoading(true);
        const communityDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommunityRoute()
        );
        const communityQuery = query(
            communityDocsRef,
            orderBy("numberOfMembers", "desc"),
            limit(3)
        );
        const communityDocs = await getDocs(communityQuery);
        const communities = communityDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Community)
        );
        setTopCommunities(communities);
        setTopCommunitiesLoading(false);
    };

    useEffect(() => {
        getTopBooks();
    }, []);

    useEffect(() => {
        getTopCommunities();
    }, []);

    return (
        <Flex
            direction="column"
            borderColor="gray.200"
            borderRadius={4}
            boxShadow="md"
        >
            <Box
                borderTopLeftRadius={4}
                borderTopRightRadius={4}
                bg="brand.100"
                px={4}
                py={2}
            >
                <Text color="white">Manga hàng đầu</Text>
            </Box>
            <Box bg="white" p={2}>
                {topBooksLoading && <HorizontalSkeleton size="sm" />}
                {topBooks.map((book) => (
                    <RightSidebarItem
                        key={book.id}
                        title={book.name}
                        imageUrl={book.imageUrl}
                        sub={
                            <RatingBar
                                size={16}
                                rate={book.rating / 2}
                                readonly
                            />
                        }
                    />
                ))}
            </Box>
            <Box bg="blue.500" px={4} py={2}>
                <Text color="white">Cộng đồng yêu thích</Text>
            </Box>
            <Box bg="white" p={2}>
                {topCommunitiesLoading && (
                    <CircleHorizontalSkeleton size="sm" />
                )}
                {topCommunities.map((community) => (
                    <RightSidebarItem
                        key={community.id}
                        title={community.name}
                        href={`${COMMUNITY_PAGE}/${community.id}`}
                        imageUrl={community.imageUrl}
                        imageShape="circle"
                        sub={
                            <Text fontSize={14} color="gray.500">
                                {community.numberOfMembers} thành viên
                            </Text>
                        }
                    />
                ))}
            </Box>
        </Flex>
    );
};

export default RightSidebar;
