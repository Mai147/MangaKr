import Pagination from "@/components/Pagination";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import Tag from "@/components/Tag";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import useBooks from "@/hooks/useBooks";
import { Book, Filter, filterList, FilterValue } from "@/models/Book";
import {
    Box,
    Divider,
    Flex,
    HStack,
    Select,
    Spinner,
    Text,
    useBreakpointValue,
    VStack,
} from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import BookSnippetHorizontalItem from "../Snippet/BookSnippetHorizontalItem";
import BookTopSnippetItem from "../Snippet/BookTopSnippetItem";

type BookSearchProps = {
    title: string;
    noResultText: string;
    pageView?: "search" | "top";
};

const BookSearch: React.FC<BookSearchProps> = ({
    title,
    noResultText,
    pageView = "search",
}) => {
    const { bookAction, bookState } = useBooks();
    const genreScroll = useBreakpointValue({
        base: "scroll horizontal is-hidden",
        md: "",
    });
    return (
        <Flex direction="column" flexGrow={1} p={4}>
            <Text fontSize={24} fontWeight={600}>
                {title}
            </Text>
            <Divider my={4} borderColor="gray.400" />
            {pageView === "search" && (
                <>
                    <HStack
                        overflowX={{ base: "auto" }}
                        className={genreScroll}
                        wrap={{ base: "nowrap", md: "wrap" }}
                        align="center"
                    >
                        <Box>
                            <Tag
                                label="Tất cả"
                                isActive={!bookState.selectedGenre?.id}
                                onClick={() => {
                                    router.push(routes.getBookHomePage());
                                }}
                            />
                        </Box>
                        {bookState.loading.getGenre && <Spinner />}
                        {bookState.genreList.map((genre) => (
                            <Box key={genre.id}>
                                <Tag
                                    label={genre.name}
                                    isActive={
                                        bookState.selectedGenre?.id === genre.id
                                    }
                                    onClick={() => {
                                        router.push(
                                            `${routes.getBookHomePage()}?genreId=${
                                                genre.id
                                            }`
                                        );
                                    }}
                                />
                            </Box>
                        ))}
                    </HStack>
                    <Flex align="center" justify="center" mb={4}>
                        <Text whiteSpace="pre-line">
                            {bookState.selectedGenre?.description}
                        </Text>
                    </Flex>
                </>
            )}
            {pageView === "top" && (
                <Flex justify="center" mb={{ base: 4, md: 10 }}>
                    <Select
                        onChange={(event) => {
                            bookAction.onChangeFilter(
                                event.target.value as FilterValue
                            );
                        }}
                        value={bookState.bookPaginationInput.filter}
                        bg="white"
                    >
                        {filterList.map((item: Filter) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </Select>
                </Flex>
            )}
            {bookState.loading.getBook &&
                [1, 2, 3, 4].map((e, idx) => <HorizontalSkeleton key={idx} />)}
            {bookState.bookPaginationOutput.list.length <= 0 ? (
                <Box mt={{ base: 2, md: 10 }}>
                    <Text fontSize={20} align="center">
                        {noResultText}
                    </Text>
                </Box>
            ) : (
                <VStack spacing={4} w="100%">
                    {bookState.bookPaginationOutput.list.map(
                        (book: Book, idx: number) =>
                            pageView === "search" ? (
                                <BookSnippetHorizontalItem
                                    key={book.id}
                                    book={book}
                                />
                            ) : (
                                <BookTopSnippetItem
                                    key={book.id}
                                    rank={
                                        (bookState.bookPaginationOutput.page -
                                            1) *
                                            BOOK_PAGE_COUNT +
                                        1 +
                                        idx
                                    }
                                    book={book}
                                />
                            )
                    )}
                </VStack>
            )}
            <Flex flexGrow={1} align="flex-end" justify="center">
                <Pagination
                    page={bookState.bookPaginationOutput.page}
                    totalPage={bookState.bookPaginationOutput.totalPage}
                    onNext={bookAction.onNext}
                    onPrev={bookAction.onPrev}
                />
            </Flex>
        </Flex>
    );
};
export default BookSearch;
