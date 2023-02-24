import InputField from "@/components/Input/InputField";
import InputText from "@/components/Input/InputText";
import AuthorModal from "@/components/Modal/Author";
import GenreModal from "@/components/Modal/Genre";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useModal from "@/hooks/useModal";
import { Author } from "@/models/Author";
import { Book } from "@/models/Book";
import { Genre } from "@/models/Genre";
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
    onSelectChange: (value: any, field: string) => void;
};

type Status = {
    label: string;
    value: string;
};

type BookOtherValue = {
    authors: Author[];
    genres: Genre[];
    status: Status[];
};

const defaultBookOtherValue: BookOtherValue = {
    authors: [],
    genres: [],
    status: [
        {
            label: "Hoàn thành",
            value: "DONE",
        },
        {
            label: "Còn tiếp",
            value: "GOING",
        },
        {
            label: "Đang tạm dừng",
            value: "DROP",
        },
    ],
};

const BookFormSubInfoTab: React.FC<BookFormSubInfoTabProps> = ({
    book,
    onInputTextChange,
    onSelectChange,
}) => {
    const { toggleView } = useModal();
    const [bookOtherValue, setBookOtherValue] = useState<BookOtherValue>(
        defaultBookOtherValue
    );

    const getAuthors = async () => {
        const authorsDocRef = collection(
            fireStore,
            firebaseRoute.getAllAuthorRoute()
        );
        const authorsDocs = await getDocs(authorsDocRef);
        const authors: Author[] = authorsDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Author)
        );
        setBookOtherValue((prev) => ({
            ...prev,
            authors,
        }));
    };

    const getGenres = async () => {
        const genresDocRef = collection(
            fireStore,
            firebaseRoute.getAllGenreRoute()
        );
        const genresDocs = await getDocs(genresDocRef);
        const genres: Genre[] = genresDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Genre)
        );
        setBookOtherValue((prev) => ({
            ...prev,
            genres,
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
                        authors: [...(prev.authors || []), author],
                    }));
                }}
            />
            <GenreModal
                setGenres={(genre) => {
                    setBookOtherValue((prev) => ({
                        ...prev,
                        genres: [...(prev.genres || []), genre],
                    }));
                }}
            />
            <InputField label="Tác giả">
                <SelectField
                    options={bookOtherValue.authors}
                    value={bookOtherValue.authors
                        .filter((au) => book.authorIds?.includes(au.id!))
                        .map((au) => au.name)}
                    onChange={(ids) => {
                        const authorIds = bookOtherValue.authors
                            .filter((item: Author) => ids.includes(item.name))
                            .map((au) => au.id!);
                        onSelectChange(authorIds, "authorIds");
                    }}
                    onAdd={() => toggleView("createAuthor")}
                />
            </InputField>
            <InputField label="Thể loại">
                <SelectField
                    options={bookOtherValue.genres}
                    value={bookOtherValue.genres
                        .filter((gen) => book.genreIds?.includes(gen.id!))
                        .map((gen) => gen.name)}
                    onChange={(ids) => {
                        const genreIds = bookOtherValue.genres
                            .filter((item: Genre) => ids.includes(item.name))
                            .map((gen) => gen.id!);
                        onSelectChange(genreIds, "genreIds");
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
                                    onSelectChange(status, "status");
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
