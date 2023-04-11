import BookForm from "@/components/Book/Form";
import { WRITER_ROLE } from "@/constants/roles";
import { routes } from "@/constants/routes";
import { BookCreateProvider } from "@/context/BookCreateContext";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import BookService from "@/services/BookService";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import cookies from "next-cookies";
import React, { useEffect } from "react";

type BookEditProps = {
    book: Book;
};

const BookEditPage: React.FC<BookEditProps> = ({ book }) => {
    const { authAction } = useAuth();
    useEffect(() => {
        authAction.setDefaultPath(routes.getHomePage());
        authAction.setNeedAuth(true);
    }, []);
    return (
        <Box p="6" bg="white" borderRadius={4} boxShadow="lg" flexGrow={1}>
            <BookCreateProvider>
                <BookForm book={book} />
            </BookCreateProvider>
        </Box>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { token, user, user_id } = cookies(context) || null;
    if (token) {
        const us = JSON.parse(JSON.stringify(user));
        if (us.role !== WRITER_ROLE) {
            context.res.writeHead(302, { Location: routes.getHomePage() });
            context.res.end();
        }
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }

    const { bid } = context.query;
    const res = await BookService.get({
        bookId: bid as string,
        userId: user_id,
    });
    if (res) {
        if (res.book?.writerId !== user_id) {
            context.res.writeHead(302, { Location: routes.getHomePage() });
            context.res.end();
        }
        return {
            props: {
                book: res.book,
            },
        };
    } else {
        context.res.writeHead(302, { Location: routes.getHomePage() });
        context.res.end();
    }
}

export default BookEditPage;
