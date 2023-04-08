import { Book } from "@/models/Book";
import { Box, Divider, Flex } from "@chakra-ui/react";
import React from "react";
import BookDetailSidebar from "./Sidebar";
import BookDetailHeader from "./Header";
import BookDetailContent from "./Content";
import BookDetailAction from "./Action";
import { UserModel } from "@/models/User";

type BookDetailProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetail: React.FC<BookDetailProps> = ({ book, user }) => {
    return (
        <Flex
            position="relative"
            alignItems="flex-start"
            bg="white"
            p={6}
            borderRadius={4}
            boxShadow="lg"
        >
            <BookDetailSidebar book={book} />
            <Box
                flexGrow={1}
                pl={5}
                borderLeft="1px solid"
                borderColor="gray.400"
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
