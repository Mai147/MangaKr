import BookSnippetHorizontalSkeleton from "@/components/Book/Snippet/BookSnippetHorizontalSkeleton";
import RatingBar from "@/components/RatingBar";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Book } from "@/models/Book";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RightSidebarItem from "./RightSidebarItem";

type RightSidebarProps = {};

const RightSidebar: React.FC<RightSidebarProps> = () => {
    const [topBooks, setTopBooks] = useState<Book[]>([]);
    const [topBooksLoading, setTopBooksLoading] = useState(false);

    const getTopBooks = async () => {
        setTopBooksLoading(true);
        const bookDocsRef = collection(
            fireStore,
            firebaseRoute.getAllBookRoute()
        );
        const bookQuery = query(
            bookDocsRef,
            orderBy("rating", "desc"),
            limit(3)
        );
        const bookDocs = await getDocs(bookQuery);
        const books = bookDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as Book)
        );
        setTopBooks(books);
        setTopBooksLoading(false);
    };

    useEffect(() => {
        getTopBooks();
    }, []);
    return (
        <Flex
            direction="column"
            borderColor="gray.200"
            borderRadius={4}
            boxShadow="md"
        >
            <Box
                borderTopLeftRadius={4}
                borderTopRightRadius={4}
                bg="brand.100"
                px={4}
                py={2}
                border="1px solid red"
            >
                <Text color="white">Manga hàng đầu</Text>
            </Box>
            <Box bg="white" p={2}>
                {topBooksLoading && <BookSnippetHorizontalSkeleton size="sm" />}
                {topBooks.map((book) => (
                    <RightSidebarItem
                        key={book.id}
                        title={book.name}
                        imageUrl={book.imageUrl}
                        sub={
                            <RatingBar
                                size={16}
                                rate={book.rating / 2}
                                readonly
                            />
                        }
                    />
                ))}
            </Box>
        </Flex>
    );
};

export default RightSidebar;
