import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    Flex,
    Icon,
    VStack,
    Spinner,
    useToast,
    HStack,
} from "@chakra-ui/react";
import useSelectFile from "@/hooks/useSelectFile";
import { Book } from "@/models/Book";
import InputText from "@/components/Input/InputText";
import dynamic from "next/dynamic";
import InputField from "@/components/Input/InputField";
import { MultiSelect } from "chakra-multiselect";
import { AiOutlineUpload } from "react-icons/ai";
import useModal from "@/hooks/useModal";
import AuthorModal from "@/components/Modal/Author";
import {
    collection,
    doc,
    getDocs,
    increment,
    serverTimestamp,
    Timestamp,
    WriteBatch,
    writeBatch,
} from "firebase/firestore";
import { fireStore } from "@/firebase/clientApp";
import SelectField from "@/components/Book/Form/SelectField";
import GenreModal from "@/components/Modal/Genre";
import ErrorText from "@/components/Modal/Auth/ErrorText";
import { ValidationError } from "@/constants/validation";
import { validateCreateBook } from "@/validation/bookValidation";
import moment from "moment";
import BookImage from "../Image";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { Author } from "@/models/Author";
import { Genre } from "@/models/Genre";

const defaultBookFormState: Book = {
    name: "",
    description: "",
    chapters: "",
    characters: "",
    authorIds: [],
    genreIds: [],
    characterSnippets: [],
    plot: "",
    publishedDate: undefined,
    status: "",
    volumes: "",
    rating: 0,
    popularity: 0,
    numberOfRates: 0,
    numberOfComments: 0,
    numberOfReviews: 0,
    writerId: "1",
};

const Editor = dynamic(() => import("@/components/Editor"), {
    ssr: false,
});

type BookOtherValue = {
    authors: Author[];
    genres: Genre[];
    status: string[];
};

const defaultBookOtherValue: BookOtherValue = {
    authors: [],
    genres: [],
    status: ["Done", "Going", "Drop"],
};

type RemovedAndInsertedSnippet = {
    authorIds: {
        removed: string[];
        inserted: string[];
    };
    genreIds: {
        removed: string[];
        inserted: string[];
    };
};

type BookFormProps = {
    userId: string;
    book?: Book;
};

const BookForm: React.FC<BookFormProps> = ({ userId, book }) => {
    const { toggleView } = useModal();
    const { selectedFile, onSelectFile, onUploadFile, setSelectedFile } =
        useSelectFile();
    const toast = useToast();
    const imageRef = useRef<HTMLInputElement>(null);
    const [bookForm, setBookForm] = useState<Book>(defaultBookFormState);
    const [bookOtherValue, setBookOtherValue] = useState<BookOtherValue>(
        defaultBookOtherValue
    );
    const [ckeditorLoading, setCkeditorLoading] = useState<boolean[]>([
        true,
        true,
    ]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        let val: any;
        if (event.target.type === "date") {
            val = moment(new Date(event.target.value)).format("YYYY-MM-DD");
        } else {
            val = event.target.value;
        }
        setBookForm(
            (prev) =>
                ({
                    ...prev,
                    [event.target.name]: val,
                } as Book)
        );
    };

    const handleChangeCkeditor = (data: string, field: string) => {
        setBookForm(
            (prev) =>
                ({
                    ...prev,
                    [field]: data,
                } as Book)
        );
    };

    const handleSelectChange = (
        ids: string[] | string,
        field: "authorIds" | "genreIds" | "status"
    ) => {
        if (field === "status") {
            setBookForm((prev) => {
                return {
                    ...prev,
                    status: bookOtherValue.status.find((item) => item === ids),
                    // [field]: (bookOtherValue[field] as any[]).find(
                    //     (item: string) => item === ids
                    // ),
                };
            });
        } else {
            setBookForm((prev) => {
                if (field === "authorIds") {
                    const authorIds = bookOtherValue.authors
                        .filter((item: Author) => ids.includes(item.name))
                        .map((au) => au.id!);
                    return {
                        ...prev,
                        authorIds,
                    };
                } else {
                    const genreIds = bookOtherValue.genres
                        .filter((item: Genre) => ids.includes(item.name))
                        .map((gen) => gen.id!);
                    return {
                        ...prev,
                        genreIds,
                    };
                }
            });
        }
    };

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

    const findRemovedAndInsertedSnippet = (): RemovedAndInsertedSnippet => {
        let removedAuthor: string[] = [];
        let insertedAuthor: string[] = [];
        let removedGenre: string[] = [];
        let insertedGenre: string[] = [];
        if (book?.authorIds) {
            removedAuthor = book?.authorIds.filter(
                (id) => !bookForm.authorIds?.includes(id)
            );
            if (bookForm.authorIds) {
                insertedAuthor = bookForm.authorIds.filter(
                    (id) => !book.authorIds?.includes(id)
                );
            }
        }
        if (book?.genreIds) {
            removedGenre = book?.genreIds.filter(
                (id) => !bookForm.genreIds?.includes(id)
            );
            if (bookForm.genreIds) {
                insertedGenre = bookForm.genreIds.filter(
                    (id) => !book.genreIds?.includes(id)
                );
            }
        }
        return {
            authorIds: {
                removed: removedAuthor,
                inserted: insertedAuthor,
            },
            genreIds: {
                removed: removedGenre,
                inserted: insertedGenre,
            },
        };
    };

    const updateSnippet = async ({
        batch,
        snippetRef,
        id,
        type,
        ref,
    }: {
        batch: WriteBatch;
        snippetRef: string;
        ref: string;
        id: string;
        type: "create" | "delete";
    }) => {
        const snippetDocRef = doc(fireStore, snippetRef, id);
        switch (type) {
            case "delete":
                batch.delete(snippetDocRef);
                break;
            case "create":
                batch.set(snippetDocRef, {});
        }
        // Update number of books
        const docRef = doc(fireStore, ref, id);
        batch.update(docRef, {
            numberOfBooks: increment(type === "create" ? 1 : -1),
        });
    };

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setUpdateLoading(true);
        if (errors) setErrors([]);
        const valRes = await validateCreateBook(bookForm, book?.name);
        if (!valRes.result) {
            setErrors(valRes.errors);
            setUpdateLoading(false);
            return;
        }
        if (book) {
            await onUpdate();
        } else {
            await onCreate();
        }
        setUpdateLoading(false);
    };

    const onCreate = async () => {
        try {
            const batch = writeBatch(fireStore);
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute())
            );
            const bookImageUrl = await onUploadFile(
                firebaseRoute.getBookImageRoute(bookDocRef.id)
            );
            // Create book
            const { characterSnippets, ...newBook } = {
                ...bookForm,
            };
            batch.set(bookDocRef, {
                ...newBook,
                writerId: userId,
                createdAt: serverTimestamp() as Timestamp,
            });
            // Create Snippet
            const authorRoute = firebaseRoute.getAllAuthorRoute();
            const bookAuthorIdRoute = firebaseRoute.getBookAuthorIdRoute(
                bookDocRef.id
            );
            const bookGenreIdRoute = firebaseRoute.getBookGenreIdRoute(
                bookDocRef.id
            );
            const genreRoute = firebaseRoute.getAllGenreRoute();
            bookForm.authorIds?.forEach((id) => {
                updateSnippet({
                    batch,
                    id,
                    snippetRef: bookAuthorIdRoute,
                    ref: authorRoute,
                    type: "create",
                });
            });
            bookForm.genreIds?.forEach((id) => {
                updateSnippet({
                    batch,
                    id,
                    snippetRef: bookGenreIdRoute,
                    ref: genreRoute,
                    type: "create",
                });
            });
            // Create user book writing Snippet
            const userWritingBookDocRef = doc(
                fireStore,
                firebaseRoute.getUserWritingBookIdRoute(userId),
                bookDocRef.id
            );
            batch.set(userWritingBookDocRef, {});

            // Update image
            batch.update(
                doc(fireStore, firebaseRoute.getAllBookRoute(), bookDocRef.id),
                {
                    imageUrl: bookImageUrl,
                }
            );

            await batch.commit();
            toast({
                title: "Tạo thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            setBookForm(defaultBookFormState);
            setSelectedFile(undefined);
        } catch (error) {
            console.log(error);
        }
    };

    const onUpdate = async () => {
        try {
            const batch = writeBatch(fireStore);
            const bookDocRef = doc(
                fireStore,
                firebaseRoute.getAllBookRoute(),
                book?.id!
            );
            const bookImageUrl = await onUploadFile(
                firebaseRoute.getBookImageRoute(bookDocRef.id)
            );
            // Update book
            const { characterSnippets, ...updateBook } = {
                ...bookForm,
            };
            batch.update(bookDocRef, {
                ...updateBook,
            });
            // Update Snippet
            const authorRoute = firebaseRoute.getAllAuthorRoute();
            const bookAuthorIdRoute = firebaseRoute.getBookAuthorIdRoute(
                book?.id!
            );
            const genreRoute = firebaseRoute.getAllGenreRoute();
            const bookGenreIdRoute = firebaseRoute.getBookGenreIdRoute(
                book?.id!
            );
            const removedAndInsertedSnippet = findRemovedAndInsertedSnippet();
            removedAndInsertedSnippet.authorIds.removed.forEach((id) => {
                updateSnippet({
                    batch,
                    id,
                    snippetRef: bookAuthorIdRoute,
                    ref: authorRoute,
                    type: "delete",
                });
            });
            removedAndInsertedSnippet.genreIds.removed.forEach((id) => {
                updateSnippet({
                    batch,
                    id,
                    snippetRef: bookGenreIdRoute,
                    ref: genreRoute,
                    type: "delete",
                });
            });
            removedAndInsertedSnippet.authorIds.inserted.forEach((id) => {
                updateSnippet({
                    batch,
                    id: id!,
                    snippetRef: bookAuthorIdRoute,
                    ref: authorRoute,
                    type: "create",
                });
            });
            removedAndInsertedSnippet.genreIds.inserted.forEach((id) => {
                updateSnippet({
                    batch,
                    id,
                    snippetRef: bookGenreIdRoute,
                    ref: genreRoute,
                    type: "create",
                });
            });

            // Update image
            batch.update(bookDocRef, {
                imageUrl: bookImageUrl,
            });

            await batch.commit();
            toast({
                title: book
                    ? "Thay đổi thông tin thành công"
                    : "Tạo thành công",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
            if (!book) {
                setBookForm(defaultBookFormState);
                setSelectedFile(undefined);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        Promise.all([getAuthors(), getGenres()]).catch((error) => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (book) {
            setBookForm(book);
            setSelectedFile(book.imageUrl);
        }
    }, [book]);

    return (
        <form onSubmit={onSubmit}>
            <Flex
                align={{ base: "stretch", md: "flex-start" }}
                direction={{ base: "column", md: "row" }}
            >
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
                <Flex justify="center">
                    <VStack spacing={4} mr={8} top={4} align="stretch">
                        <BookImage imageUrl={selectedFile} />
                        <Button
                            variant="outline"
                            onClick={() => imageRef.current?.click()}
                        >
                            <Icon as={AiOutlineUpload} fontSize={20} />
                        </Button>
                        <input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={onSelectFile}
                            accept="image/*"
                        />
                    </VStack>
                </Flex>
                <Flex direction="column" flexGrow={1}>
                    <InputField label="Book name" required>
                        <Flex
                            direction="column"
                            flexGrow={1}
                            w="100%"
                            align="flex-start"
                        >
                            <InputText
                                name="name"
                                onInputChange={handleChange}
                                value={bookForm?.name}
                                required
                                type="text"
                            />
                            <ErrorText
                                error={
                                    errors.find(
                                        (error) => error.field === "name"
                                    )?.message
                                }
                            />
                        </Flex>
                    </InputField>
                    <InputField label="Description">
                        <InputText
                            name="description"
                            onInputChange={handleChange}
                            value={bookForm?.description}
                            isMultipleLine
                            type="text"
                        />
                    </InputField>
                    <InputField label="Plot">
                        <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                            {ckeditorLoading[0] && <Spinner />}
                            <Editor
                                height="300px"
                                value={bookForm.plot || ""}
                                onChange={(data) =>
                                    handleChangeCkeditor(data, "plot")
                                }
                                setLoading={(value) => {
                                    setCkeditorLoading((prev) => [
                                        value,
                                        prev[1],
                                    ]);
                                }}
                            />
                        </Box>
                    </InputField>
                    <InputField label="Characters">
                        {ckeditorLoading[1] && <Spinner />}
                        <Box flexGrow={1} w={{ base: "100%", md: "auto" }}>
                            <Editor
                                value={bookForm.characters || ""}
                                onChange={(data) =>
                                    handleChangeCkeditor(data, "characters")
                                }
                                height="200px"
                                setLoading={(value) => {
                                    setCkeditorLoading((prev) => [
                                        prev[0],
                                        value,
                                    ]);
                                }}
                            />
                        </Box>
                    </InputField>
                    <Flex direction={{ base: "column", lg: "row" }}>
                        <Box
                            display={{ base: "none", lg: "flex" }}
                            mr={4}
                            w="50%"
                        >
                            <InputField
                                label="Authors"
                                isFull={false}
                                isHalf={true}
                            >
                                <SelectField
                                    options={bookOtherValue.authors}
                                    value={bookOtherValue.authors
                                        .filter((au) =>
                                            bookForm.authorIds?.includes(au.id!)
                                        )
                                        .map((au) => au.name)}
                                    onChange={(ids) =>
                                        handleSelectChange(ids, "authorIds")
                                    }
                                    onAdd={() => toggleView("createAuthor")}
                                />
                            </InputField>
                        </Box>
                        <Box
                            display={{ base: "flex", lg: "none" }}
                            flexGrow={1}
                        >
                            <InputField label="Authors">
                                <SelectField
                                    options={bookOtherValue.authors}
                                    value={bookOtherValue.authors
                                        .filter((au) =>
                                            bookForm.authorIds?.includes(au.id!)
                                        )
                                        .map((au) => au.name)}
                                    onChange={(ids) =>
                                        handleSelectChange(ids, "authorIds")
                                    }
                                    onAdd={() => toggleView("createAuthor")}
                                />
                            </InputField>
                        </Box>
                        <Box display={{ base: "none", lg: "flex" }} w="50%">
                            <InputField
                                label="Genres"
                                isFull={false}
                                isHalf={true}
                            >
                                <SelectField
                                    options={bookOtherValue.genres}
                                    value={bookOtherValue.genres
                                        .filter((gen) =>
                                            bookForm.genreIds?.includes(gen.id!)
                                        )
                                        .map((gen) => gen.name)}
                                    onChange={(ids) =>
                                        handleSelectChange(ids, "genreIds")
                                    }
                                    onAdd={() => toggleView("createGenre")}
                                />
                            </InputField>
                        </Box>
                        <Box
                            display={{ base: "flex", lg: "none" }}
                            flexGrow={1}
                        >
                            <InputField label="Genres">
                                <SelectField
                                    options={bookOtherValue.genres}
                                    value={bookOtherValue.genres
                                        .filter((gen) =>
                                            bookForm.genreIds?.includes(gen.id!)
                                        )
                                        .map((gen) => gen.name)}
                                    onChange={(ids) =>
                                        handleSelectChange(ids, "genreIds")
                                    }
                                    onAdd={() => toggleView("createGenre")}
                                />
                            </InputField>
                        </Box>
                    </Flex>
                    <Flex direction={{ base: "column", lg: "row" }}>
                        <Box mr={{ base: 0, lg: 4 }}>
                            <InputField
                                label="Status"
                                isFull={false}
                                isHalf={true}
                            >
                                <Box flexGrow={1}>
                                    <MultiSelect
                                        options={bookOtherValue.status.map(
                                            (sta) => ({
                                                label: sta,
                                                value: sta,
                                            })
                                        )}
                                        value={bookForm.status || ""}
                                        onChange={(data) =>
                                            handleSelectChange(
                                                data as string,
                                                "status"
                                            )
                                        }
                                        single
                                    />
                                </Box>
                            </InputField>
                        </Box>
                        <HStack spacing={4}>
                            <InputField
                                label="Volumes"
                                isFull={false}
                                isHalf={true}
                            >
                                <InputText
                                    name="volumes"
                                    value={bookForm.volumes}
                                    onInputChange={handleChange}
                                    type="text"
                                />
                            </InputField>
                            <InputField
                                label="Chapters"
                                isFull={false}
                                isHalf={true}
                            >
                                <InputText
                                    name="chapters"
                                    value={bookForm.chapters}
                                    onInputChange={handleChange}
                                    type="text"
                                />
                            </InputField>
                        </HStack>
                    </Flex>
                    <InputField
                        label="Published Date"
                        isFull={false}
                        isHalf={true}
                    >
                        <InputText
                            w={{ base: "100%", md: 0 }}
                            onInputChange={handleChange}
                            name="publishedDate"
                            value={bookForm.publishedDate?.toString()}
                            type="date"
                        />
                    </InputField>
                    <Flex justify="flex-end">
                        <Button w={28} type="submit" isLoading={updateLoading}>
                            {book ? "Lưu" : "Tạo mới"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </form>
    );
};

export default BookForm;
