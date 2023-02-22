import BookDetail from "@/components/Book/Detail";
import BookError from "@/components/Book/Error";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import BookUtils from "@/utils/BookUtils";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";

type BookPageProps = {
    book: Book;
};

const BookPage: React.FC<BookPageProps> = ({ book }) => {
    const { setNeedAuth } = useAuth();
    useEffect(() => {
        setNeedAuth(false);
    }, []);

    if (!book) {
        return <BookError />;
    }
    return <BookDetail book={book} />;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { bid } = context.query;
    let book = null;
    const res = await BookUtils.getBook(bid as string);
    if (res) book = res.book;
    return {
        props: {
            book,
        },
    };
}

export default BookPage;
