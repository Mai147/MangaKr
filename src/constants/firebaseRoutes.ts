const BOOK_ROUTE = `books`;
const BOOK_VOTE_ROUTE = `bookVotes`;
const READING_BOOK_SNIPPET_ROUTE = `readingBookSnippets`;
const WRITING_BOOK_SNIPPET_ROUTE = `writingBookSnippets`;
const USER_ROUTE = `users`;
const AUTHOR_ROUTE = `authors`;
const AUTHOR_SNIPPET_ROUTE = `authorSnippets`;
const AUTHOR_VOTE_ROUTE = `authorVotes`;
const GENRE_SNIPPET_ROUTE = `genreSnippets`;
const CHARACTER_ROUTE = `characters`;
const CHARACTER_SNIPPET_ROUTE = `characterSnippets`;
const GENRE_ROUTE = `genres`;
const COMMENT_ROUTE = `comments`;
const REVIEW_ROUTE = `reviews`;
const REVIEW_VOTE_ROUTE = `reviewVotes`;
const IMAGE_ROUTE = `image`;
const COMMUNITY_ROUTE = `communities`;
const COMMUNITY_SNIPPET_ROUTE = `communitySnippets`;

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
    getUserCommunitySnippetRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${COMMUNITY_SNIPPET_ROUTE}`;
    },
    getUserReviewVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${REVIEW_VOTE_ROUTE}`;
    },
    getUserAuthorVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${AUTHOR_VOTE_ROUTE}`;
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
    getAllCharacterRoute() {
        return CHARACTER_ROUTE;
    },
    getCharacterImageRoute(characterId: string) {
        return `${CHARACTER_ROUTE}/${characterId}/${IMAGE_ROUTE}`;
    },
    getBookAuthorSnippetsRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${AUTHOR_SNIPPET_ROUTE}`;
    },
    getBookGenreSnippetsRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${GENRE_SNIPPET_ROUTE}`;
    },
    getBookCharacterSnippetRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${CHARACTER_SNIPPET_ROUTE}`;
    },
    getBookImageRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${IMAGE_ROUTE}`;
    },
    getBookCommentRoute(bookId: string) {
        return `${BOOK_ROUTE}/${bookId}/${COMMENT_ROUTE}`;
    },
    getAllReviewRoute() {
        return `${REVIEW_ROUTE}`;
    },
    getReviewCommentRoute(reviewId: string) {
        return `${REVIEW_ROUTE}/${reviewId}/${COMMENT_ROUTE}`;
    },
    getReviewImageRoute(reviewId: string) {
        return `${REVIEW_ROUTE}/${reviewId}/${IMAGE_ROUTE}`;
    },
    getAllCommunityRoute() {
        return `${COMMUNITY_ROUTE}`;
    },
};
