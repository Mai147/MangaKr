import BookSnippetHorizontalItem from "@/components/Book/Snippet/BookSnippetHorizontalItem";
import BookCarousel from "@/components/Book/Snippet/Carousel";
import Pagination from "@/components/Pagination";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import { WRITER_PAGE_COUNT } from "@/constants/pagination";
import usePagination, {
    BookPaginationInput,
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
} from "@/hooks/usePagination";
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

const AuthorDetail: React.FC<AuthorDetailProps> = ({ author }) => {
    const [authorBookPaginationInput, setAuthorBookPaginationInput] =
        useState<BookPaginationInput>({
            ...defaultPaginationInput,
            pageCount: WRITER_PAGE_COUNT,
            authorId: author.id!,
            setDocValue: (docValue) => {
                setAuthorBookPaginationInput((prev) => ({
                    ...prev,
                    docValue,
                }));
            },
        });
    const [authorBookPaginationOutput, setAuthorBookPaginationOutput] =
        useState<PaginationOutput>(defaultPaginationOutput);
    const [loading, setLoading] = useState(false);
    const { getBooks } = usePagination();

    const getAuthorBooks = async () => {
        setLoading(true);
        const res = await getBooks(authorBookPaginationInput);
        if (res) {
            setAuthorBookPaginationOutput(res);
            setAuthorBookPaginationInput((prev) => ({
                ...prev,
                isFirst: false,
            }));
        }
        setLoading(false);
    };

    const getBookGroup = (books: Book[]) => {
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
        getAuthorBooks();
    }, [authorBookPaginationInput.page]);

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
                bg="white"
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
                        <div
                            dangerouslySetInnerHTML={{
                                __html: author.bio || "-----",
                            }}
                            className="ck ck-content"
                        ></div>
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
                    {loading ? (
                        <Grid
                            templateColumns="repeat(2, minmax(0, 1fr))"
                            gap={4}
                            w="100%"
                        >
                            <HorizontalSkeleton size="sm" />
                            <HorizontalSkeleton size="sm" />
                        </Grid>
                    ) : authorBookPaginationOutput.totalPage > 0 ? (
                        <Flex direction="column" w="100%">
                            <BookCarousel
                                length={
                                    getBookGroup(
                                        authorBookPaginationOutput.list
                                    ).length
                                }
                                type="grid"
                            >
                                {getBookGroup(
                                    authorBookPaginationOutput.list
                                ).map((bookGroup) => (
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
                                page={authorBookPaginationOutput.page}
                                totalPage={authorBookPaginationOutput.totalPage}
                                onNext={() => {
                                    setAuthorBookPaginationInput((prev) => ({
                                        ...prev,
                                        page: prev.page + 1,
                                        isNext: true,
                                    }));
                                }}
                                onPrev={() => {
                                    setAuthorBookPaginationInput((prev) => ({
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
