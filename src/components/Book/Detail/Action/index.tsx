import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import React from "react";
import BookDetailVote from "./Vote";
import CommentSection from "../../../Comment";
import BookDetailReviewAction from "./Review";
import { firebaseRoute } from "@/constants/firebaseRoutes";

type BookDetailActionProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailAction: React.FC<BookDetailActionProps> = ({ book, user }) => {
    return (
        <>
            <BookDetailReviewAction bookId={book.id!} user={user} />
            <BookDetailVote bookId={book.id!} user={user} />
            <CommentSection
                commentRoute={firebaseRoute.getBookCommentRoute(book.id!)}
                rootRoute={firebaseRoute.getAllBookRoute()}
                rootId={book.id!}
                user={user}
            />
        </>
    );
};
export default BookDetailAction;
