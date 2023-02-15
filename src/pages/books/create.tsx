import { WRITER_ROLE } from "@/constants/roles";
import { HOME_PAGE } from "@/constants/routes";
import useAuth from "@/hooks/useAuth";
import cookies from "next-cookies";
import React, { useEffect, useRef, useState } from "react";
import { GetServerSidePropsContext } from "next";
import {
    AspectRatio,
    Box,
    Button,
    Flex,
    Image,
    VStack,
} from "@chakra-ui/react";
import useSelectFile from "@/hooks/useSelectFile";
import { BookModel } from "@/models/Book";
import InputText from "@/components/Input/InputText";
import dynamic from "next/dynamic";
import InputField from "@/components/Input/InputField";

type BookCreatePageProps = {};

const BookCreatePage: React.FC<BookCreatePageProps> = () => {
    const Editor = dynamic(() => import("../../components/Editor"), {
        ssr: false,
    });
    const { setNeedAuth, setDefaultPath } = useAuth();
    const { selectedFile, onSelectFile } = useSelectFile();
    const imageRef = useRef<HTMLInputElement>(null);
    const [bookForm, setBookForm] = useState<BookModel>();
    const [editor, setEditor] = useState();

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setBookForm(
            (prev) =>
                ({
                    ...prev,
                    [event.target.name]: event.target.value,
                } as BookModel)
        );
    };

    useEffect(() => {
        setNeedAuth(true);
        setDefaultPath(HOME_PAGE);
    }, []);
    return (
        <Flex align="flex-start">
            <VStack spacing={4} align="stretch" mr={8}>
                <AspectRatio
                    ratio={3 / 4}
                    w={{ base: "100px", sm: "150px", md: "250px" }}
                >
                    <Image
                        src={selectedFile || "/images/noImage.jpg"}
                        objectFit={"cover"}
                        borderRadius={4}
                        alt="Book Image"
                    />
                </AspectRatio>
                <Button
                    variant="outline"
                    onClick={() => imageRef.current?.click()}
                >
                    Thay đổi
                </Button>
                <input
                    type="file"
                    hidden
                    ref={imageRef}
                    onChange={onSelectFile}
                    accept="image/*"
                />
            </VStack>
            <Flex direction="column" flexGrow={1}>
                <InputField label="Book name">
                    <InputText
                        name="name"
                        onChange={handleChange}
                        value={bookForm?.name}
                        required
                        type="text"
                    />
                </InputField>
                <InputField label="Description">
                    <InputText
                        name="description"
                        onChange={handleChange}
                        value={bookForm?.description}
                        required
                        isMultipleLine
                        type="text"
                    />
                </InputField>
                <InputField label="Plot">
                    <Box flexGrow={1}>
                        <Editor
                            // value={bookForm?.plot}
                            onInit={setEditor}
                            // onChange={(data) => {
                            //     console.log(data);
                            //     setBookForm(
                            //         (prev) =>
                            //             ({
                            //                 ...prev,
                            //                 plot: data,
                            //             } as BookModel)
                            //     );
                            // }}
                        />
                    </Box>
                </InputField>
            </Flex>
        </Flex>
    );
};

//     description?: string;
//     plot?: string;
//     characters?: string;
//     authorSnippets?: AuthorSnippet[];
//     genreSnippets?: GenreSnippet[];
//     status?: string;
//     volumes?: string;
//     chapters?: string;
//     characterSnippets?: CharacterSnippet[];
//     publishedDate?: Timestamp;
//     rating: number;
//     numberOfComments: number;
//     numberOfReviews: number;
//     writerId: string;
//     createdAt: Timestamp;

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== WRITER_ROLE) {
            context.res.writeHead(302, { Location: HOME_PAGE });
            context.res.end();
        }
    } else {
        context.res.writeHead(302, { Location: HOME_PAGE });
        context.res.end();
    }

    return {
        props: {},
    };
}

export default BookCreatePage;
