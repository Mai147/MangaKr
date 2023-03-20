import useBookCreate from "@/hooks/useBookCreate";
import useSelectFile from "@/hooks/useSelectFile";
import { Book } from "@/models/Book";
import { Character } from "@/models/Character";
import { Flex, Button, Divider, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiOutlineBook } from "react-icons/ai";
import { BsInfoCircle, BsPerson } from "react-icons/bs";
import { IoDocumentTextOutline, IoImageOutline } from "react-icons/io5";
import BookFormCharacterTab from "./CharacterTab";
import BookFormContentTab from "./ContentTab";
import BookFormDescriptionTab from "./DescriptionTab";
import BookFormImageTab from "./ImageTab";
import BookFormSubInfoTab from "./SubInfoTab";
import TabItem from "@/components/Tab/TabItem";

type BookFormProps = {
    book?: Book;
};

const formTab = [
    {
        title: "Hình ảnh",
        icon: IoImageOutline,
    },
    {
        title: "Mô tả",
        icon: AiOutlineBook,
    },
    {
        title: "Nội dung",
        icon: IoDocumentTextOutline,
    },
    {
        title: "Nhân vật",
        icon: BsPerson,
    },
    {
        title: "Khác",
        icon: BsInfoCircle,
    },
];

const BookForm: React.FC<BookFormProps> = ({ book }) => {
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState(formTab[0].title);
    const { bookForm, setBookForm, setCharacters, handleSubmit, errors } =
        useBookCreate();
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();

    useEffect(() => {
        if (book) {
            setBookForm(book);
            setCharacters(
                book.characterSnippets?.map(
                    (char) =>
                        ({
                            ...char,
                            bookId: book.id,
                            numberOfDislikes: 0,
                            numberOfLikes: 0,
                        } as Character)
                ) || []
            );
            setSelectedFile(book.imageUrl);
        }
    }, []);

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

    return (
        <Flex direction="column">
            <Flex>
                <Text fontSize={24} fontWeight={600}>
                    Viết Manga
                </Text>
                <Button
                    w={28}
                    ml={8}
                    isLoading={loading}
                    onClick={async () => {
                        setLoading(true);
                        await handleSubmit(book);
                        setLoading(false);
                    }}
                >
                    Lưu
                </Button>
            </Flex>
            <Divider my={4} />
            <Flex width="100%" mb={4}>
                {formTab.map((item) => (
                    <TabItem
                        key={item.title}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === formTab[0].title && (
                    <BookFormImageTab
                        onSelectFile={onSelectFile}
                        setSelectedFile={setSelectedFile}
                        selectedFile={selectedFile}
                    />
                )}
                {selectedTab === formTab[1].title && (
                    <BookFormDescriptionTab
                        bookName={bookForm.name}
                        description={bookForm.description!}
                        errors={errors}
                        onChange={handleChange}
                    />
                )}
                {selectedTab === formTab[2].title && (
                    <BookFormContentTab
                        plot={bookForm.plot || ""}
                        characterContent={bookForm.characters || ""}
                        onChange={handleChangeCkeditor}
                    />
                )}
                {selectedTab === formTab[3].title && <BookFormCharacterTab />}
                {selectedTab === formTab[4].title && (
                    <BookFormSubInfoTab
                        book={bookForm}
                        onInputTextChange={handleChange}
                    />
                )}
            </Flex>
        </Flex>
    );
};
export default BookForm;
