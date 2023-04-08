import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import React from "react";
import BookDetailVote from "./Vote";
import CommentSection from "../../../Comment";
import BookDetailReviewAction from "./Review";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { CommentProvider } from "@/context/CommentContext";

type BookDetailActionProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailAction: React.FC<BookDetailActionProps> = ({ book, user }) => {
    return (
        <>
            <BookDetailReviewAction bookId={book.id!} user={user} />
            <BookDetailVote bookId={book.id!} user={user} />
            <CommentProvider
                commentRoute={firebaseRoute.getBookCommentRoute(book.id!)}
                rootRoute={firebaseRoute.getAllBookRoute()}
                rootId={book.id!}
                setNumberOfCommentsIncrement={() => {}}
            >
                <CommentSection user={user} />
            </CommentProvider>
        </>
    );
};
export default BookDetailAction;
