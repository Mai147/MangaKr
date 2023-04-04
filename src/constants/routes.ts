const HOME_ROUTE = "/";
const PROFILE_ROUTE = "/profile";
const LIBRARY_ROUTE = "/library";
const BOOK_ROUTE = "/books";
const REVIEW_ROUTE = "/reviews";
const AUTHOR_ROUTE = "/authors";
const GENRE_ROUTE = "/genres";
const NEWS_ROUTE = "/news";
const COMMUNITY_ROUTE = "/communities";
const POST_ROUTE = "/posts";
const USER_ROUTE = "/users";
const TOPIC_ROUTE = "/topics";
export const getCommunityPostApprovePage = (communityId: string) => {
    return `/communities/${communityId}/posts/approve`;
};
const SEARCH_ROUTE = "/search";
const WRITER_ROUTE = "/writer";
const MESSAGE_ROUTE = "/messages";

export const routes = {
    getHomePage: () => {
        return `${HOME_ROUTE}`;
    },
    getProfilePage: () => {
        return `${PROFILE_ROUTE}`;
    },
    getProfileLibraryPage: () => {
        return `${PROFILE_ROUTE}/${LIBRARY_ROUTE}`;
    },
    getBookHomePage: () => {
        return `${BOOK_ROUTE}`;
    },
    getBookTopPage: () => {
        return `${BOOK_ROUTE}/top`;
    },
    getBookCreatePage: () => {
        return `${BOOK_ROUTE}/create`;
    },
    getBookDetailPage: (bookId: string) => {
        return `${BOOK_ROUTE}/${bookId}`;
    },
    getBookEditPage: (bookId: string) => {
        return `${BOOK_ROUTE}/${bookId}/edit`;
    },
    getBookReviewHomePage: (bookId: string) => {
        return `${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}`;
    },
    getReviewHomePage: () => {
        return `${BOOK_ROUTE}/${REVIEW_ROUTE}`;
    },
    getReviewCreatePage: (bookId: string) => {
        return `${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/create`;
    },
    getReviewDetailPage: (bookId: string, reviewId: string) => {
        return `${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/${reviewId}`;
    },
    getReviewEditPage: (bookId: string, reviewId: string) => {
        return `${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/${reviewId}/edit`;
    },
    getAuthorHomePage: () => {
        return `${AUTHOR_ROUTE}`;
    },
    getAuthorDetailPage: (authorId: string) => {
        return `${AUTHOR_ROUTE}/${authorId}`;
    },
    getAuthorCreatePage: () => {
        return `${AUTHOR_ROUTE}/create`;
    },
    getAuthorEditPage: (authorId: string) => {
        return `${AUTHOR_ROUTE}/${authorId}/edit`;
    },
    getGenreCreatePage: () => {
        return `${GENRE_ROUTE}/create`;
    },
    getGenreEditPage: (genreId: string) => {
        return `${GENRE_ROUTE}/${genreId}/edit`;
    },
    getNewsHomePage: () => {
        return `${NEWS_ROUTE}`;
    },
    getNewsCreatePage: () => {
        return `${NEWS_ROUTE}/create`;
    },
    getCommunityHomePage: () => {
        return `${COMMUNITY_ROUTE}`;
    },
    getCommunityDetailPage: (communityId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}`;
    },
    getCommunityPostCreatePage: (communityId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}/${POST_ROUTE}/create`;
    },
    getCommunityTopicCreatePage: (communityId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/create`;
    },
    getCommunityTopicDetailPage: (communityId: string, topicId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/${topicId}`;
    },
    getCommunityUserApprovePage: (communityId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}/${USER_ROUTE}/approve`;
    },
    getCommunityUserAuthorizePage: (communityId: string) => {
        return `${COMMUNITY_ROUTE}/${communityId}/${USER_ROUTE}/authorize`;
    },
    getSearchPage: () => {
        return `${SEARCH_ROUTE}`;
    },
    getWriterPage: () => {
        return `${WRITER_ROUTE}`;
    },
    getMessagePage: () => {
        return `${MESSAGE_ROUTE}`;
    },
};
