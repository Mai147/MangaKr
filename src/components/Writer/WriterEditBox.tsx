import { WRITER_PAGE_COUNT } from "@/constants/pagination";
import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    defaultPaginationOutput,
    PaginationInput,
    PaginationOutput,
} from "@/hooks/usePagination";
import { Author } from "@/models/Author";
import { Genre } from "@/models/Genre";
import AuthorService from "@/services/AuthorService";
import GenreService from "@/services/GenreService";
import {
    Flex,
    VStack,
    HStack,
    Divider,
    Spinner,
    Text,
    Select,
    Box,
    useToast,
    Link,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import AuthorTableSnippetItem from "../Author/Snippet/AuthorTableSnippetItem";
import GenreTableSnippetItem from "../Genre/GenreTableSnippetItem";
import ConfirmModal from "../Modal/ConfirmModal";
import Pagination from "../Pagination";
import TableHeader, { TableInfoHeader } from "../Table/TableHeader";

type WriterEditBoxProps = {};

type WriterEditBoxState = {
    field: "authors" | "genres";
    reload: boolean;
    searchValue: string;
    authors: {
        input: PaginationInput;
        output: PaginationOutput;
        loading: boolean;
        selected?: Author;
    };
    genres: {
        input: PaginationInput;
        output: PaginationOutput;
        loading: boolean;
        selected?: Genre;
    };
};

const defaultPaginationState = {
    input: {
        ...defaultPaginationInput,
        pageCount: WRITER_PAGE_COUNT,
    },
    output: defaultPaginationOutput,
    loading: true,
};

const defaultWriterBoxState: WriterEditBoxState = {
    field: "authors",
    authors: defaultPaginationState,
    genres: defaultPaginationState,
    reload: false,
    searchValue: "",
};

export const authorHeaderList: TableInfoHeader[] = [
    {
        title: "Người tạo",
        width: "200px",
    },
    {
        title: "Ảnh",
        width: "80px",
    },
    {
        title: "Tên tác giả",
        width: "200px",
    },
    {
        title: "Bio",
    },
];

export const genreHeaderList: TableInfoHeader[] = [
    {
        title: "Người tạo",
        width: "200px",
    },
    {
        title: "Tên thể loại",
        width: "200px",
    },
    {
        title: "Mô tả",
    },
];

const WriterEditBox: React.FC<WriterEditBoxProps> = () => {
    const [writerBoxState, setWriterBoxState] = useState<WriterEditBoxState>(
        defaultWriterBoxState
    );
    const { getAuthors, getGenres } = usePagination();
    const { toggleView, closeModal } = useModal();
    const [searchValue, setSearchValue] = useState("");
    const toast = useToast();
    const debouncedSearch = useDebounce(searchValue, 300);

    const getInfos = async () => {
        setWriterBoxState((prev) => ({
            ...prev,
            [writerBoxState.field]: {
                ...prev[writerBoxState.field],
                loading: true,
            },
        }));
        let res: any = {};
        const input: PaginationInput = {
            ...writerBoxState[writerBoxState.field].input,
            page: writerBoxState.reload
                ? 1
                : writerBoxState[writerBoxState.field].input.page,
            isFirst: writerBoxState.reload
                ? true
                : writerBoxState[writerBoxState.field].input.isFirst,
            setDocValue: (docValue: any) => {
                setWriterBoxState((prev) => ({
                    ...prev,
                    [prev.field]: {
                        ...prev[prev.field],
                        input: {
                            ...prev[prev.field].input,
                            docValue,
                        },
                    },
                }));
            },
            searchValue: writerBoxState.searchValue,
        };
        switch (writerBoxState.field) {
            case "authors": {
                res = await getAuthors(input);
                break;
            }
            case "genres": {
                res = await getGenres(input);
                break;
            }
        }
        setWriterBoxState((prev) => ({
            ...prev,
            [prev.field]: {
                ...prev[prev.field],
                loading: false,
                output: res,
                input: {
                    ...prev[prev.field].input,
                    isFirst: false,
                },
            },
            reload: false,
        }));
    };

    const handleDeleteAuthor = async () => {
        try {
            if (writerBoxState.authors.selected) {
                const res = await AuthorService.delete({
                    author: writerBoxState.authors.selected,
                });
                if (res) {
                    setWriterBoxState((prev) => ({
                        ...prev,
                        authors: {
                            ...prev.authors,
                            output: {
                                ...prev.authors.output,
                                list: prev.authors.output.list.filter(
                                    (item: Author) =>
                                        item.id !== prev.authors.selected?.id
                                ),
                            },
                        },
                        reload: true,
                    }));
                    closeModal();
                    toast({
                        ...toastOption,
                        title: "Xóa thành công!",
                        status: "success",
                    });
                } else {
                    closeModal();
                    toast({
                        ...toastOption,
                        title: "Không thể xóa tác giả này!",
                        status: "error",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteGenre = async () => {
        try {
            if (writerBoxState.genres.selected) {
                const res = await GenreService.delete({
                    genre: writerBoxState.genres.selected,
                });
                if (res) {
                    setWriterBoxState((prev) => ({
                        ...prev,
                        genres: {
                            ...prev.genres,
                            output: {
                                ...prev.genres.output,
                                list: prev.genres.output.list.filter(
                                    (item: Genre) =>
                                        item.id !== prev.genres.selected?.id
                                ),
                            },
                        },
                        reload: true,
                    }));
                    closeModal();
                    toast({
                        ...toastOption,
                        title: "Xóa thành công!",
                        status: "success",
                    });
                } else {
                    closeModal();
                    toast({
                        ...toastOption,
                        title: "Không thể xóa thể loại này!",
                        status: "error",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getInfos();
    }, [
        writerBoxState.field,
        writerBoxState[writerBoxState.field].input.page,
        writerBoxState.searchValue,
    ]);

    useEffect(() => {
        setWriterBoxState((prev) => ({
            ...defaultWriterBoxState,
            searchValue,
            field: prev.field,
        }));
    }, [debouncedSearch, writerBoxState.field]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <ConfirmModal
                title={
                    writerBoxState.field === "authors"
                        ? "Xác nhận xóa tác giả"
                        : "Xác nhận xóa thể loại"
                }
                content={
                    writerBoxState.field === "authors"
                        ? "Bạn chắc chắn muốn xóa tác giả này?"
                        : "Bạn chắc chắn muốn xóa thể loại này?"
                }
                subContent={
                    writerBoxState.field === "authors"
                        ? "Bạn không thể xóa nếu có Manga thuộc tác giả này!"
                        : "Bạn không thể xóa nếu có Manga thuộc thể loại này!"
                }
                onSubmit={
                    writerBoxState.field === "authors"
                        ? handleDeleteAuthor
                        : handleDeleteGenre
                }
            />
            <VStack spacing={0} align="flex-start">
                <VStack spacing={4} w="100%" p={4}>
                    <Flex
                        w="100%"
                        fontSize={20}
                        fontWeight={600}
                        justify="space-between"
                    >
                        <Text>
                            {writerBoxState.field === "authors"
                                ? "Danh sách tác giả"
                                : "Danh sách thể loại"}
                        </Text>
                        <HStack spacing={4}>
                            <Select
                                w="250px"
                                borderColor="gray.400"
                                value={writerBoxState.field}
                                onChange={(e) => {
                                    setWriterBoxState((prev) => ({
                                        ...prev,
                                        field: e.target.value as
                                            | "authors"
                                            | "genres",
                                    }));
                                }}
                            >
                                <option value={"authors"}>Tác giả</option>
                                <option value={"genres"}>Thể loại</option>
                            </Select>
                            <Link
                                href={
                                    writerBoxState.field === "authors"
                                        ? routes.getAuthorCreatePage()
                                        : routes.getGenreCreatePage()
                                }
                            >
                                <IconButton
                                    aria-label="Create"
                                    bg={"blue.300"}
                                    _hover={{ bg: "blue.400" }}
                                    icon={<IoAddOutline />}
                                    fontSize={18}
                                />
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
                            placeholder={
                                writerBoxState.field === "authors"
                                    ? "Tìm kiếm tác giả..."
                                    : "Tìm kiếm thể loại..."
                            }
                            borderColor="gray.400"
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </InputGroup>
                </VStack>
                <Divider borderColor="gray.300" />
                {writerBoxState.field === "authors" ? (
                    <TableHeader list={authorHeaderList} />
                ) : (
                    <TableHeader list={genreHeaderList} />
                )}
                <Divider borderColor="gray.300" />
                {writerBoxState[writerBoxState.field].loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : writerBoxState.field === "authors" ? (
                    writerBoxState.authors.output.list.length > 0 ? (
                        writerBoxState.authors.output.list.map(
                            (author: Author) => (
                                <Box key={author.id} w="100%">
                                    <AuthorTableSnippetItem
                                        author={author}
                                        onDelete={(author) => {
                                            setWriterBoxState((prev) => ({
                                                ...prev,
                                                authors: {
                                                    ...prev.authors,
                                                    selected: author,
                                                },
                                            }));
                                            toggleView("confirmModal");
                                        }}
                                    />
                                    <Divider borderColor="gray.300" />
                                </Box>
                            )
                        )
                    ) : (
                        <Flex align="center" justify="center" w="100%" py={10}>
                            <Text>Chưa có tác giả nào</Text>
                        </Flex>
                    )
                ) : writerBoxState.genres.output.list.length > 0 ? (
                    writerBoxState.genres.output.list.map((genre: Genre) => (
                        <Box key={genre.id} w="100%">
                            <GenreTableSnippetItem
                                genre={genre}
                                onDelete={(genre) => {
                                    setWriterBoxState((prev) => ({
                                        ...prev,
                                        genres: {
                                            ...prev.genres,
                                            selected: genre,
                                        },
                                    }));
                                    toggleView("confirmModal");
                                }}
                            />
                            <Divider borderColor="gray.300" />
                        </Box>
                    ))
                ) : (
                    <Flex align="center" justify="center" w="100%" py={10}>
                        <Text>Chưa có thể loại nào</Text>
                    </Flex>
                )}
            </VStack>
            <Flex align="center" py={6} justify="center" w="100%">
                <Pagination
                    page={writerBoxState[writerBoxState.field].output.page}
                    totalPage={
                        writerBoxState[writerBoxState.field].output.totalPage
                    }
                    onNext={() =>
                        setWriterBoxState((prev) => ({
                            ...prev,
                            [prev.field]: {
                                ...prev[prev.field],
                                input: {
                                    ...prev[prev.field].input,
                                    page: prev[prev.field].input.page + 1,
                                    isNext: true,
                                },
                            },
                        }))
                    }
                    onPrev={() =>
                        setWriterBoxState((prev) => ({
                            ...prev,
                            [prev.field]: {
                                ...prev[prev.field],
                                input: {
                                    ...prev[prev.field].input,
                                    page: prev[prev.field].input.page - 1,
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
export default WriterEditBox;
