export const HOME_PAGE = "/";
export const PROFILE_PAGE = "/profile";
export const PROFILE_LIBRARY_PAGE = "/profile/library";
export const BOOK_PAGE = "/books";
export const BOOK_TOP_PAGE = "/books/top";
export const CREATE_BOOK_PAGE = "/books/create";
export const BOOK_REVIEW_PAGE = "/books/reviews";
export const getEditBookPage = (bookId: string) => {
    return `/books/${bookId}/edit`;
};
export const getBookReviewPage = (bookId: string) => {
    return `/books/${bookId}/reviews`;
};
export const getCreateBookReviewPage = (bookId: string) => {
    return `/books/${bookId}/reviews/create`;
};
export const getBookReviewDetailPage = (bookId: string, reviewId: string) => {
    return `/books/${bookId}/reviews/${reviewId}`;
};
export const getEditBookReviewPage = (bookId: string, reviewId: string) => {
    return `/books/${bookId}/reviews/${reviewId}/edit`;
};
export const AUTHOR_PAGE = "/authors";
export const NEWS_PAGE = "/news";
export const CREATE_NEWS_PAGE = "/news/create";
export const COMMUNITY_PAGE = "/communities";
export const SEARCH_PAGE = "/search";
