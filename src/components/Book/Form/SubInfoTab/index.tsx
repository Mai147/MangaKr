import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import AuthorModal from "@/components/Modal/Author";
import GenreModal from "@/components/Modal/Genre";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useBookCreate from "@/hooks/useBookCreate";
import useModal from "@/hooks/useModal";
import { Author, AuthorSnippet } from "@/models/Author";
import { Book, bookStatusList } from "@/models/Book";
import { Genre, GenreSnippet } from "@/models/Genre";
import ModelUtils from "@/utils/ModelUtils";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import SelectField from "../SelectField";

type BookFormSubInfoTabProps = {
    book: Book;
    onInputTextChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    // onSelectChange: (value: any, field: string) => void;
};

type Status = {
    label: string;
    value: string;
};

type BookOtherValue = {
    authorSnippets: AuthorSnippet[];
    genreSnippets: GenreSnippet[];
    status: Status[];
};

const defaultBookOtherValue: BookOtherValue = {
    authorSnippets: [],
    genreSnippets: [],
    status: bookStatusList,
};

const BookFormSubInfoTab: React.FC<BookFormSubInfoTabProps> = ({
    book,
    onInputTextChange,
}) => {
    const { toggleView } = useModal();
    const [bookOtherValue, setBookOtherValue] = useState<BookOtherValue>(
        defaultBookOtherValue
    );
    const { setBookForm } = useBookCreate();

    const handleSelectChange = (
        field: "authorSnippets" | "genreSnippets" | "status",
        value: any,
        ids?: any
    ) => {
        setBookForm((prev) => ({
            ...prev,
            [field]: value,
        }));
        if (field === "authorSnippets") {
            setBookForm((prev) => ({
                ...prev,
                authorIds: ids,
            }));
        } else if (field === "genreSnippets") {
            setBookForm((prev) => ({
                ...prev,
                genreIds: ids,
            }));
        }
    };

    const getAuthors = async () => {
        const authorsDocRef = collection(
            fireStore,
            firebaseRoute.getAllAuthorRoute()
        );
        const authorsDocs = await getDocs(authorsDocRef);
        const authors: AuthorSnippet[] = authorsDocs.docs.map((doc) =>
            ModelUtils.toAuthorSnippet({
                id: doc.id,
                ...doc.data(),
            } as Author)
        );
        setBookOtherValue((prev) => ({
            ...prev,
            authorSnippets: authors,
        }));
    };

    const getGenres = async () => {
        const genresDocRef = collection(
            fireStore,
            firebaseRoute.getAllGenreRoute()
        );
        const genresDocs = await getDocs(genresDocRef);
        const genres: GenreSnippet[] = genresDocs.docs.map((doc) =>
            ModelUtils.toGenreSnippet({
                id: doc.id,
                ...doc.data(),
            } as Genre)
        );
        setBookOtherValue((prev) => ({
            ...prev,
            genreSnippets: genres,
        }));
    };

    useEffect(() => {
        Promise.all([getAuthors(), getGenres()]).catch((error) =>
            console.log(error)
        );
    }, []);

    return (
        <VStack spacing={2} align="flex-start" w={"100%"}>
            <AuthorModal
                setAuthors={(author) => {
                    setBookOtherValue((prev) => ({
                        ...prev,
                        authorSnippets: [
                            ...(prev.authorSnippets || []),
                            author,
                        ],
                    }));
                }}
            />
            <GenreModal
                setGenres={(genre) => {
                    setBookOtherValue((prev) => ({
                        ...prev,
                        genreSnippets: [...(prev.genreSnippets || []), genre],
                    }));
                }}
            />
            <InputField label="Tác giả">
                <SelectField
                    options={bookOtherValue.authorSnippets}
                    value={bookOtherValue.authorSnippets
                        .filter((au) => book.authorIds?.includes(au.id!))
                        .map((au) => au.name)}
                    onChange={(data) => {
                        const authors = bookOtherValue.authorSnippets.filter(
                            (item: AuthorSnippet) => data.includes(item.name)
                        );
                        const ids = authors.map((au) => au.id);
                        handleSelectChange("authorSnippets", authors, ids);
                    }}
                    onAdd={() => toggleView("createAuthor")}
                />
            </InputField>
            <InputField label="Thể loại">
                <SelectField
                    options={bookOtherValue.genreSnippets}
                    value={bookOtherValue.genreSnippets
                        .filter((gen) => book.genreIds?.includes(gen.id!))
                        .map((gen) => gen.name)}
                    onChange={(data) => {
                        const genres = bookOtherValue.genreSnippets.filter(
                            (item: GenreSnippet) => data.includes(item.name)
                        );
                        const ids = genres.map((genre) => genre.id);
                        handleSelectChange("genreSnippets", genres, ids);
                    }}
                    onAdd={() => toggleView("createGenre")}
                />
            </InputField>
            <Flex direction={{ base: "column", lg: "row" }} w="100%">
                <Box mr={{ base: 0, lg: 4 }}>
                    <InputField label="Trạng thái" isFull={false} isHalf={true}>
                        <Box flexGrow={1}>
                            <MultiSelect
                                options={bookOtherValue.status.map((sta) => ({
                                    label: sta.label,
                                    value: sta.value,
                                }))}
                                value={book.status || ""}
                                onChange={(data) => {
                                    const status = bookOtherValue.status.find(
                                        (item) => item.value === data
                                    );
                                    handleSelectChange("status", status?.value);
                                }}
                                single
                            />
                        </Box>
                    </InputField>
                </Box>
                <HStack spacing={4} flexGrow={1}>
                    <InputField label="Số tập" isFull={false} isHalf={true}>
                        <InputText
                            name="volumes"
                            value={book.volumes}
                            onInputChange={onInputTextChange}
                            type="text"
                        />
                    </InputField>
                    <InputField label="Số chap" isFull={false} isHalf={true}>
                        <InputText
                            name="chapters"
                            value={book.chapters}
                            onInputChange={onInputTextChange}
                            type="text"
                        />
                    </InputField>
                </HStack>
            </Flex>
            <InputField label="Ngày xuất bản" isFull={false} isHalf={true}>
                <InputText
                    w={{ base: "100%", md: 0 }}
                    onInputChange={onInputTextChange}
                    name="publishedDate"
                    value={book.publishedDate?.toString()}
                    type="date"
                />
            </InputField>
        </VStack>
    );
};
export default BookFormSubInfoTab;
