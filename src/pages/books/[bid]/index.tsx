import BookDetail from "@/components/Book/Detail";
import BookError from "@/components/Book/Error";
import useAuth from "@/hooks/useAuth";
import { Book } from "@/models/Book";
import ModelUtils from "@/utils/ModelUtils";
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
    const res = await ModelUtils.getBook(bid as string);
    if (res) book = res.book;
    return {
        props: {
            book,
        },
    };
}

export default BookDetailPage;
