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
            p={{ base: 4, sm: 6 }}
            borderRadius={4}
            boxShadow="lg"
            flexDirection={{ base: "column", xl: "row" }}
        >
            <BookDetailSidebar book={book} user={user} />
            <Box
                flexGrow={1}
                pl={{ base: 0, xl: 5 }}
                borderLeft={{ base: "none", xl: "1px solid" }}
                borderColor={{ base: "transparent", xl: "gray.400" }}
                w={{ base: "100%", xl: "calc(100% - 260px)" }}
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
