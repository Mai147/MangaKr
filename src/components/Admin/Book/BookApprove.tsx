import CommunityInfoApproveList from "@/components/Community/Approve/CommunityInfoApproveList";
import Pagination from "@/components/Pagination";
import TableHeader, { TableInfoHeader } from "@/components/Table/TableHeader";
import { BOOK_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import useDebounce from "@/hooks/useDebounce";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationOutput,
    PostPaginationInput,
} from "@/hooks/usePagination";
import BookService from "@/services/BookService";
import {
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import BookTableSnippetItem from "./BookTableSnippetItem";

type AdminBookApproveProps = {};

type AdminBookApproveState = {
    reload: boolean;
    books: {
        input: PostPaginationInput;
        output: PaginationOutput;
        loading: boolean;
    };
};

const defaultPaginationState = {
    input: {
        ...defaultPaginationInput,
        pageCount: BOOK_PAGE_COUNT,
    },
    output: defaultPaginationOutput,
    loading: true,
};

const defaultBookApproveState: AdminBookApproveState = {
    books: defaultPaginationState,
    reload: false,
};

export const bookHeaderList: TableInfoHeader[] = [
    {
        title: "Ảnh",
        width: "80px",
    },
    {
        title: "Tên",
        width: "300px",
    },
    {
        title: "Nội dung",
        display: { base: "none", md: "block" },
    },
];

const AdminBookApprove: React.FC<AdminBookApproveProps> = () => {
    const [bookApproveState, setBookApproveState] =
        useState<AdminBookApproveState>(defaultBookApproveState);
    const { getBooks } = usePagination();
    const debouncedSearch = useDebounce(
        bookApproveState.books.input.searchValue || "",
        300
    );

    const getCommunityInfos = async () => {
        setBookApproveState((prev) => ({
            ...prev,
            books: {
                ...prev.books,
                loading: true,
            },
        }));
        const input = {
            ...bookApproveState.books.input,
            page: bookApproveState.reload
                ? 1
                : bookApproveState.books.input.page,
            isFirst: bookApproveState.reload
                ? true
                : bookApproveState.books.input.isFirst,
            setDocValue: (docValue: any) => {
                setBookApproveState((prev) => ({
                    ...prev,
                    books: {
                        ...prev.books,
                        input: {
                            ...prev.books.input,
                            docValue,
                        },
                    },
                }));
            },
        };
        const res = await getBooks({ ...input });
        if (res) {
            setBookApproveState((prev) => ({
                ...prev,
                books: {
                    ...prev.books,
                    loading: false,
                    output: res,
                    input: {
                        ...prev.books.input,
                        isFirst: false,
                    },
                },
                reload: false,
            }));
        }
    };

    const handleLock = async (item: any) => {
        await BookService.toggleLockState({
            book: item,
        });
        setBookApproveState((prev) => ({
            ...prev,
            books: {
                ...prev.books,
                output: {
                    ...prev.books.output,
                    list: prev.books.output.list.map((listItem: any) =>
                        listItem.id !== item.id
                            ? listItem
                            : {
                                  ...listItem,
                                  isLock: !listItem.isLock,
                              }
                    ),
                },
            },
        }));
    };

    useEffect(() => {
        setBookApproveState((prev) => ({
            ...prev,
            books: {
                ...prev.books,
                input: {
                    ...prev.books.input,

                    page: 1,
                },
            },
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        getCommunityInfos();
    }, [bookApproveState.books.input.page, debouncedSearch]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <VStack spacing={0} align="flex-start">
                <Box p={4} w="100%" fontSize={20} fontWeight={600}>
                    <Flex justify="space-between">
                        <Text>Phê duyệt Manga</Text>
                        <HStack spacing={2} align="center">
                            <Link
                                href={routes.getAdminPage()}
                                _hover={{ textDecoration: "none" }}
                            >
                                <Button>Quay lại</Button>
                            </Link>
                        </HStack>
                    </Flex>
                    <InputGroup mt={4}>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<FiSearch color="gray.300" />}
                        />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm manga..."
                            borderColor="gray.400"
                            onChange={(e) =>
                                setBookApproveState((prev) => ({
                                    ...prev,
                                    books: {
                                        ...prev.books,
                                        input: {
                                            ...prev.books.input,
                                            searchValue: e.target.value,
                                        },
                                    },
                                }))
                            }
                        />
                    </InputGroup>
                </Box>
                <Divider borderColor="gray.300" />
                <TableHeader list={bookHeaderList} />
                <Divider borderColor="gray.300" />
                {bookApproveState.books.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : (
                    <CommunityInfoApproveList
                        list={bookApproveState.books.output.list}
                        type={"books"}
                        isAccept={true}
                        handleLock={handleLock}
                        renderChild={(item) => (
                            <BookTableSnippetItem book={item} />
                        )}
                    />
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={bookApproveState.books.output.page}
                    totalPage={bookApproveState.books.output.totalPage}
                    onNext={() =>
                        setBookApproveState((prev) => ({
                            ...prev,
                            books: {
                                ...prev.books,
                                input: {
                                    ...prev.books.input,
                                    page: prev.books.input.page + 1,
                                    isNext: true,
                                },
                            },
                        }))
                    }
                    onPrev={() =>
                        setBookApproveState((prev) => ({
                            ...prev,
                            books: {
                                ...prev.books,
                                input: {
                                    ...prev.books.input,
                                    page: prev.books.input.page - 1,
                                    isNext: false,
                                },
                            },
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default AdminBookApprove;
