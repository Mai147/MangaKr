import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import React from "react";
import BookDetailVote from "./Vote";
import BookDetailComment from "./Comment";
import BookDetailReviewAction from "./Review";

type BookDetailActionProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailAction: React.FC<BookDetailActionProps> = ({ book, user }) => {
    return (
        <>
            <BookDetailReviewAction bookId={book.id!} user={user} />
            <BookDetailVote bookId={book.id!} user={user} />
            <BookDetailComment bookId={book.id!} user={user} />
        </>
    );
};
export default BookDetailAction;
