import BookDetail from "@/components/Book/Detail";
import BookError from "@/components/Book/Error";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import BookUtils from "@/utils/BookUtils";
import ModelUtils from "@/utils/ModelUtils";
import { Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";

type BookDetailPageProps = {
    book: Book;
};

const BookDetailPage: React.FC<BookDetailPageProps> = ({ book }) => {
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
    const res = await ModelUtils.getBook(bid as string, undefined, {
        getAuthor: true,
        getGenre: true,
    });
    if (res) book = res.book;
    return {
        props: {
            book,
        },
    };
}

export default BookDetailPage;
