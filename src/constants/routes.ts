export const HOME_PAGE = "/";
export const PROFILE_PAGE = "/profile";
export const PROFILE_LIBRARY_PAGE = "/profile/library";
export const BOOK_PAGE = "/books";
export const BOOK_TOP_PAGE = "/books/top";
export const CREATE_BOOK_PAGE = "/books/create";
export const getEditBookPage = (bookId: string) => {
    return `/books/${bookId}/edit`;
};
export const BOOK_REVIEW_PAGE = "/books/reviews";
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
export const getEditAuthorPage = (authorId: string) => {
    return `/authors/${authorId}/edit`;
};
export const NEWS_PAGE = "/news";
export const CREATE_NEWS_PAGE = "/news/create";
export const COMMUNITY_PAGE = "/communities";
export const getCommunityCreatePostPage = (communityId: string) => {
    return `/communities/${communityId}/posts/create`;
};
export const getCommunityPostApprovePage = (communityId: string) => {
    return `/communities/${communityId}/posts/approve`;
};
export const getCommunityUserApprovePage = (communityId: string) => {
    return `/communities/${communityId}/users/approve`;
};
export const getCommunityUserAuthorizePage = (communityId: string) => {
    return `/communities/${communityId}/users/authorize`;
};
export const SEARCH_PAGE = "/search";
