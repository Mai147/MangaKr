import { Book } from "@/models/Book";
import { Box, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import useAuth from "@/hooks/useAuth";
import BookDetailSidebar from "./Sidebar";
import BookDetailHeader from "./Header";
import BookDetailContent from "./Content";
import BookDetailAction from "./Action";

type BookDetailProps = {
    book: Book;
};

const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
    const { user } = useAuth();

    return (
        <Flex position="relative" alignItems="flex-start">
            <BookDetailSidebar book={book} />
            <Box
                flexGrow={1}
                pl={5}
                borderLeft="1px solid"
                borderColor="gray.200"
            >
                <BookDetailHeader book={book} user={user} />
                <Divider my={4} />
                <BookDetailContent book={book} />
                <Divider my={4} />
                <BookDetailAction book={book} user={user} />
            </Box>
        </Flex>
    );
};
export default BookDetail;
