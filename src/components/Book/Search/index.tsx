import Pagination from "@/components/Pagination";
import HorizontalSkeleton from "@/components/Skeleton/HorizontalSkeleton";
import Tag from "@/components/Tag";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import useBooks from "@/hooks/useBooks";
import { Filter, filterList, FilterValue } from "@/hooks/usePagination";
import { Box, Divider, Flex, Select, Spinner, Text } from "@chakra-ui/react";
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
    const {
        selectedGenre,
        genreLoading,
        genreList,
        bookList,
        bookLoading,
        page,
        totalPage,
        selectedFilter,
        slideToNextPage,
        slideToPrevPage,
        onChangeFilter,
    } = useBooks();
    return (
        <Box flexGrow={1}>
            <Text fontSize={24} fontWeight={600}>
                {title}
            </Text>
            <Divider my={4} borderColor="gray.400" />
            {pageView === "search" && (
                <>
                    <Flex justify="center">
                        <Box mx={2}>
                            <Tag
                                label="Tất cả"
                                isActive={!selectedGenre?.id}
                                onClick={() => {
                                    router.push(routes.getBookHomePage());
                                }}
                            />
                        </Box>
                        {genreLoading && <Spinner />}
                        {genreList.map((genre) => (
                            <Box key={genre.id} mx={2}>
                                <Tag
                                    label={genre.name}
                                    isActive={selectedGenre?.id === genre.id}
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
                    </Flex>
                    <Flex align="center" justify="center" my={4}>
                        <Text whiteSpace="pre-line">
                            {selectedGenre?.description}
                        </Text>
                    </Flex>
                </>
            )}
            {pageView === "top" && (
                <Flex justify="center" mb={10}>
                    <Select
                        onChange={(event) => {
                            onChangeFilter(event.target.value as FilterValue);
                        }}
                        value={selectedFilter}
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
            {bookLoading &&
                [1, 2, 3, 4].map((e, idx) => <HorizontalSkeleton key={idx} />)}
            {bookList.length <= 0 ? (
                <Text align="center" mt={10}>
                    {noResultText}
                </Text>
            ) : (
                bookList.map((book, idx) =>
                    pageView === "search" ? (
                        <BookSnippetHorizontalItem key={book.id} book={book} />
                    ) : (
                        <BookTopSnippetItem
                            key={book.id}
                            rank={(page - 1) * BOOK_PAGE_COUNT + 1 + idx}
                            book={book}
                        />
                    )
                )
            )}
            <Pagination
                page={page}
                totalPage={totalPage}
                onNext={slideToNextPage}
                onPrev={slideToPrevPage}
            />
        </Box>
    );
};
export default BookSearch;
