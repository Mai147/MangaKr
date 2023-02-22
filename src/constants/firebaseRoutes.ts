const BOOK_ROUTE = `books`;
const BOOK_VOTE_ROUTE = `bookVotes`;
const READING_BOOK_SNIPPET_ROUTE = `readingBookSnippets`;
const WRITING_BOOK_SNIPPET_ROUTE = `writingBookSnippets`;
const USER_ROUTE = `users`;
const AUTHOR_ROUTE = `authors`;
const AUTHOR_SNIPPET_ROUTE = `authorSnippets`;
const GENRE_SNIPPET_ROUTE = `genreSnippets`;
const CHARACTER_SNIPPET_ROUTE = `characterSnippets`;
const GENRE_ROUTE = `genres`;
const BOOK_COMMENT_ROUTE = `bookComments`;
const REVIEW_ROUTE = `reviews`;
const IMAGE_ROUTE = `image`;

export const firebaseRoute = {
    getAllUserRoute() {
        return USER_ROUTE;
    },
    getUserImageRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${IMAGE_ROUTE}`;
    },
    getUserBookVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${BOOK_VOTE_ROUTE}`;
    },
    getUserReadingBookSnippetRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${READING_BOOK_SNIPPET_ROUTE}`;
    },
    getUserWritingBookSnippetRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${WRITING_BOOK_SNIPPET_ROUTE}`;
    },
    getAllAuthorRoute() {
        return AUTHOR_ROUTE;
    },
    getAllGenreRoute() {
        return GENRE_ROUTE;
    },
    getAllBookRoute() {
        return BOOK_ROUTE;
    },
    getBookAuthorSnippetRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${AUTHOR_SNIPPET_ROUTE}`;
    },
    getBookGenreSnippetRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${GENRE_SNIPPET_ROUTE}`;
    },

    getBookCharacterSnippetRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${CHARACTER_SNIPPET_ROUTE}`;
    },
    getBookImageRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${IMAGE_ROUTE}`;
    },
    getAllCommentRoute() {
        return `${BOOK_COMMENT_ROUTE}`;
    },
    getAllReviewRoute() {
        return `${REVIEW_ROUTE}`;
    },
    getReviewImageRoute(reviewId: string) {
        return `${REVIEW_ROUTE}/${reviewId}/${IMAGE_ROUTE}`;
    },
};
