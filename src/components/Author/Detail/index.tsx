import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import {
    VStack,
    Flex,
    Avatar,
    Icon,
    Divider,
    Grid,
    GridItem,
    Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { ImHeart, ImHeartBroken } from "react-icons/im";
import AuthorLeftSidebar from "./LeftSidebar";

type AuthorDetailProps = {
    author: Author;
};

const defaultPaginationInfo = {
    page: 1,
    isNext: true,
    isFirst: true,
};

const AuthorDetail: React.FC<AuthorDetailProps> = ({ author }) => {
    const [paginationInfo, setPaginationInfo] = useState(defaultPaginationInfo);
    const [totalPage, setTotalPage] = useState(0);
    const [books, setBooks] = useState<Book[]>([]);
    const { getBooks } = usePagination();

    const getAuthorBooks = async (authorId: string) => {
        const res = await getBooks({
            page: paginationInfo.page,
            pageCount: 2,
            isNext: paginationInfo.isNext,
            isFirst: paginationInfo.isFirst,
            authorId,
        });
        setBooks(res.books);
        setTotalPage(res.totalPage || 0);
    };

    const getBookGroup = () => {
        let bookGroup = [];
        let bookTenthGroup: Book[] = [];
        books.forEach((book, idx) => {
            if (idx % 10 === 0) {
                if (bookTenthGroup.length > 0) {
                    bookGroup.push(bookTenthGroup);
                }
                bookTenthGroup = [];
            }
            bookTenthGroup.push(book);
        });
        if (bookTenthGroup.length > 0) {
            bookGroup.push(bookTenthGroup);
        }
        return bookGroup;
    };

    useEffect(() => {
        setPaginationInfo(defaultPaginationInfo);
    }, []);

    useEffect(() => {
        getAuthorBooks(author.id!);
    }, [paginationInfo.page, paginationInfo.isFirst]);

    return (
        <Flex align="flex-start">
            <AuthorLeftSidebar authorId={author.id!} />
            <VStack
                align="flex-start"
                border="1px solid"
                borderColor="gray.300"
                borderRadius={4}
                p={6}
                w="100%"
            >
                <Flex>
                    <Avatar
                        src={author.imageUrl || "/images/noImage.jpg"}
                        size="2xl"
                        mr={10}
                    />
                    <VStack spacing={2} align="flex-start">
                        <Text fontSize={20} fontWeight={500}>
                            {author.name}
                        </Text>
                        <Text fontSize={14} color="gray.400">
                            {author.bio || "-----"}
                        </Text>
                        <Flex
                            align="center"
                            alignSelf="flex-start"
                            fontSize={18}
                            color="gray.500"
                        >
                            <Flex align="center" mr={8}>
                                <Icon as={ImHeart} color="brand.100" mr={1} />
                                {author.numberOfLikes.toLocaleString("vi")}
                            </Flex>
                            <Flex align="center" mr={8}>
                                <Icon
                                    as={ImHeartBroken}
                                    color="gray.700"
                                    mr={1}
                                />
                                {author.numberOfDislikes.toLocaleString("vi")}
                            </Flex>
                            <Flex align="center">
                                <Icon as={FaBook} color="blue.400" mr={1} />
                                {author.numberOfBooks.toLocaleString("vi")}
                            </Flex>
                        </Flex>
                    </VStack>
                </Flex>
                <Divider pb={4} />
                <VStack spacing={2} pt={4} align="flex-start" w="100%">
                    <Text fontSize={20} fontWeight={600}>
                        Danh sách Manga
                    </Text>
                    {totalPage > 0 ? (
                        <Flex direction="column" w="100%">
                            <BookCarousel
                                length={getBookGroup().length}
                                type="grid"
                            >
                                {getBookGroup().map((bookGroup) => (
                                    <Grid
                                        templateColumns="repeat(2, 1fr)"
                                        gap={4}
                                        key={bookGroup[0].id}
                                    >
                                        {bookGroup.map((book) => (
                                            <GridItem key={book.id}>
                                                <BookSnippetHorizontalItem
                                                    book={book}
                                                />
                                            </GridItem>
                                        ))}
                                    </Grid>
                                ))}
                            </BookCarousel>
                            <Pagination
                                page={paginationInfo.page}
                                totalPage={totalPage}
                                onNext={() => {
                                    setPaginationInfo((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                        isNext: true,
                                    }));
                                }}
                                onPrev={() => {
                                    setPaginationInfo((prev) => ({
                                        ...prev,
                                        page: prev.page - 1,
                                        isNext: false,
                                    }));
                                }}
                            />
                        </Flex>
                    ) : (
                        <Text>Tác giả này chưa có Manga nào!</Text>
                    )}
                </VStack>
            </VStack>
        </Flex>
    );
};
export default AuthorDetail;
