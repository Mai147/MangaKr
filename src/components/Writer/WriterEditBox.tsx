import { routes } from "@/constants/routes";
import { toastOption } from "@/constants/toast";
import useDebounce from "@/hooks/useDebounce";
import useModal from "@/hooks/useModal";
import usePagination, {
    defaultPaginationInput,
    PaginationInput,
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

interface WriterEditBoxInput extends PaginationInput {
    type: "authors" | "genres";
    reload: boolean;
    searchValue: string;
}

const defaultWriterBoxInput: WriterEditBoxInput = {
    ...defaultPaginationInput,
    pageCount: 10,
    type: "authors",
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
    const [writerBoxPaginationInput, setWriterBoxPaginationInput] =
        useState<WriterEditBoxInput>(defaultWriterBoxInput);
    const [authorList, setAuthorList] = useState<Author[]>([]);
    const [genreList, setGenreList] = useState<Genre[]>([]);
    const { getAuthors, getGenres } = usePagination();
    const { toggleView, closeModal } = useModal();
    const [selectedAuthor, setSelectedAuthor] = useState<Author>();
    const [selectedGenre, setSelectedGenre] = useState<Genre>();
    const [searchValue, setSearchValue] = useState("");
    const toast = useToast();
    const debouncedSearch = useDebounce(searchValue, 300);

    const getInfos = async () => {
        setWriterBoxPaginationInput((prev) => ({
            ...prev,
            loading: true,
        }));
        let res: any = {};
        switch (writerBoxPaginationInput.type) {
            case "authors": {
                res = await getAuthors({
                    ...writerBoxPaginationInput,
                    page: writerBoxPaginationInput.reload
                        ? 1
                        : writerBoxPaginationInput.page,
                    isFirst: writerBoxPaginationInput.reload
                        ? true
                        : writerBoxPaginationInput.isFirst,
                });
                setAuthorList(res.authors);
                break;
            }
            case "genres": {
                res = await getGenres({
                    ...writerBoxPaginationInput,
                    page: writerBoxPaginationInput.reload
                        ? 1
                        : writerBoxPaginationInput.page,
                    isFirst: writerBoxPaginationInput.reload
                        ? true
                        : writerBoxPaginationInput.isFirst,
                });
                setGenreList(res.genres);
                break;
            }
        }
        setWriterBoxPaginationInput((prev) => ({
            ...prev,
            isFirst: false,
            loading: false,
            totalPage: res.totalPage || 0,
            page: prev.reload ? 1 : prev.page,
            reload: false,
        }));
    };

    const handleDeleteAuthor = async () => {
        try {
            if (selectedAuthor) {
                const res = await AuthorService.delete({
                    author: selectedAuthor,
                });
                if (res) {
                    setAuthorList((prev) =>
                        prev.filter((item) => item.id !== selectedAuthor.id)
                    );
                    setWriterBoxPaginationInput((prev) => ({
                        ...prev,
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
            if (selectedGenre) {
                const res = await GenreService.delete({
                    genre: selectedGenre,
                });
                if (res) {
                    setGenreList((prev) =>
                        prev.filter((item) => item.id !== selectedGenre.id)
                    );
                    setWriterBoxPaginationInput((prev) => ({
                        ...prev,
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

    useEffect(() => {
        getInfos();
    }, [
        writerBoxPaginationInput.page,
        writerBoxPaginationInput.type,
        writerBoxPaginationInput.searchValue,
    ]);

    useEffect(() => {
        setWriterBoxPaginationInput((prev) => ({
            ...prev,
            searchValue,
            page: 1,
            isFirst: true,
            isNext: true,
        }));
    }, [debouncedSearch]);

    return (
        <Flex direction="column" flexGrow={1} justify="space-between">
            <ConfirmModal
                title={
                    writerBoxPaginationInput.type === "authors"
                        ? "Xác nhận xóa tác giả"
                        : "Xác nhận xóa thể loại"
                }
                content={
                    writerBoxPaginationInput.type === "authors"
                        ? "Bạn chắc chắn muốn xóa tác giả này?"
                        : "Bạn chắc chắn muốn xóa thể loại này?"
                }
                subContent={
                    writerBoxPaginationInput.type === "authors"
                        ? "Bạn không thể xóa nếu có Manga thuộc tác giả này!"
                        : "Bạn không thể xóa nếu có Manga thuộc thể loại này!"
                }
                onSubmit={
                    writerBoxPaginationInput.type === "authors"
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
                            {writerBoxPaginationInput.type === "authors"
                                ? "Danh sách tác giả"
                                : "Danh sách thể loại"}
                        </Text>
                        <HStack spacing={4}>
                            <Select
                                w="250px"
                                borderColor="gray.400"
                                value={writerBoxPaginationInput.type}
                                onChange={(e) => {
                                    setWriterBoxPaginationInput((prev) => ({
                                        ...prev,
                                        page: 1,
                                        isFirst: true,
                                        isNext: true,
                                        type: e.target.value as
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
                                    writerBoxPaginationInput.type === "authors"
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
                                writerBoxPaginationInput.type === "authors"
                                    ? "Tìm kiếm tác giả..."
                                    : "Tìm kiếm thể loại..."
                            }
                            borderColor="gray.400"
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </InputGroup>
                </VStack>
                <Divider borderColor="gray.300" />
                {writerBoxPaginationInput.type === "authors" ? (
                    <TableHeader list={authorHeaderList} />
                ) : (
                    <TableHeader list={genreHeaderList} />
                )}
                <Divider borderColor="gray.300" />
                {writerBoxPaginationInput.loading ? (
                    <Flex align="center" justify="center" w="100%" p={10}>
                        <Spinner />
                    </Flex>
                ) : writerBoxPaginationInput.type === "authors" ? (
                    authorList && authorList.length > 0 ? (
                        authorList.map((author) => (
                            <Box key={author.id} w="100%">
                                <AuthorTableSnippetItem
                                    author={author}
                                    onDelete={(author) => {
                                        setSelectedAuthor(author);
                                        toggleView("confirmModal");
                                    }}
                                />
                                <Divider borderColor="gray.300" />
                            </Box>
                        ))
                    ) : (
                        <Flex align="center" justify="center" w="100%" py={10}>
                            <Text>Chưa có tác giả nào</Text>
                        </Flex>
                    )
                ) : genreList && genreList.length > 0 ? (
                    genreList.map((genre) => (
                        <Box key={genre.id} w="100%">
                            <GenreTableSnippetItem
                                genre={genre}
                                onDelete={(genre) => {
                                    setSelectedGenre(genre);
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
                    page={writerBoxPaginationInput.page}
                    totalPage={writerBoxPaginationInput.totalPage}
                    onNext={() =>
                        setWriterBoxPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                            isNext: true,
                        }))
                    }
                    onPrev={() =>
                        setWriterBoxPaginationInput((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                            isNext: false,
                        }))
                    }
                />
            </Flex>
        </Flex>
    );
};
export default WriterEditBox;
