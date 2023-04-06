import RatingBar from "@/components/RatingBar";
import CircleHorizontalSkeleton from "@/components/Skeleton/CircleHorizontalSkeleton";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { routes } from "@/constants/routes";
import { Book } from "@/models/Book";
import { Community } from "@/models/Community";
import BookService from "@/services/BookService";
import CommunityService from "@/services/CommunityService";
import { Box, Flex, Text } from "@chakra-ui/react";
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
        const books = await BookService.getAll({
            bookLimit: 3,
            bookOrders: [
                {
                    bookOrderBy: "rating",
                    bookOrderDirection: "desc",
                },
            ],
        });
        setTopBooks(books);
        setTopBooksLoading(false);
    };

    const getTopCommunities = async () => {
        setTopCommunitiesLoading(true);
        const communities = await CommunityService.getAll({
            communityLimit: 3,
            communityOrders: [
                {
                    communityOrderBy: "numberOfMembers",
                    communityOrderDirection: "desc",
                },
            ],
        });
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
                        href={routes.getBookDetailPage(book.id!)}
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
                        href={routes.getCommunityDetailPage(community.id!)}
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
