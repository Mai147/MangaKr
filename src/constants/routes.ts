const HOME_ROUTE = "/";
const PROFILE_ROUTE = "profile";
const LIBRARY_ROUTE = "library";
const BOOK_ROUTE = "books";
const REVIEW_ROUTE = "reviews";
const AUTHOR_ROUTE = "authors";
const GENRE_ROUTE = "genres";
const NEWS_ROUTE = "news";
const COMMUNITY_ROUTE = "communities";
const POST_ROUTE = "posts";
const USER_ROUTE = "users";
const TOPIC_ROUTE = "topics";
const VOTING_ROUTE = "votings";
const SEARCH_ROUTE = "search";
const WRITER_ROUTE = "writer";
const MESSAGE_ROUTE = "messages";
const ADMIN_ROUTE = "admin";

export const routes = {
    getHomePage: () => {
        return `${HOME_ROUTE}`;
    },
    getProfilePage: (userId: string) => {
        return `/${PROFILE_ROUTE}/${userId}`;
    },
    getProfileEditPage: () => {
        return `/${PROFILE_ROUTE}/edit`;
    },
    getProfileLibraryPage: () => {
        return `/${PROFILE_ROUTE}/${LIBRARY_ROUTE}`;
    },
    getUserPostDetailPage: (userId: string, postId: string) => {
        return `/${USER_ROUTE}/${userId}/${POST_ROUTE}/${postId}`;
    },
    getBookHomePage: () => {
        return `/${BOOK_ROUTE}`;
    },
    getBookTopPage: () => {
        return `/${BOOK_ROUTE}/top`;
    },
    getBookCreatePage: () => {
        return `/${BOOK_ROUTE}/create`;
    },
    getBookDetailPage: (bookId: string) => {
        return `/${BOOK_ROUTE}/${bookId}`;
    },
    getBookEditPage: (bookId: string) => {
        return `/${BOOK_ROUTE}/${bookId}/edit`;
    },
    getBookReviewHomePage: (bookId: string) => {
        return `/${BOOK_ROUTE}/${REVIEW_ROUTE}?bookId=${bookId}`;
    },
    getReviewHomePage: () => {
        return `/${BOOK_ROUTE}/${REVIEW_ROUTE}`;
    },
    getReviewCreatePage: (bookId: string) => {
        return `/${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/create`;
    },
    getReviewDetailPage: (bookId: string, reviewId: string) => {
        return `/${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/${reviewId}`;
    },
    getReviewEditPage: (bookId: string, reviewId: string) => {
        return `/${BOOK_ROUTE}/${bookId}/${REVIEW_ROUTE}/${reviewId}/edit`;
    },
    getAuthorHomePage: () => {
        return `/${AUTHOR_ROUTE}`;
    },
    getAuthorDetailPage: (authorId: string) => {
        return `/${AUTHOR_ROUTE}/${authorId}`;
    },
    getAuthorCreatePage: () => {
        return `/${AUTHOR_ROUTE}/create`;
    },
    getAuthorEditPage: (authorId: string) => {
        return `/${AUTHOR_ROUTE}/${authorId}/edit`;
    },
    getGenreCreatePage: () => {
        return `/${GENRE_ROUTE}/create`;
    },
    getGenreEditPage: (genreId: string) => {
        return `/${GENRE_ROUTE}/${genreId}/edit`;
    },
    getNewsHomePage: () => {
        return `/${NEWS_ROUTE}`;
    },
    getNewsCreatePage: () => {
        return `/${NEWS_ROUTE}/create`;
    },
    getCommunityHomePage: () => {
        return `/${COMMUNITY_ROUTE}`;
    },
    getCommunityDetailPage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}`;
    },
    getCommunityPostCreatePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${POST_ROUTE}/create`;
    },
    getCommunityTopicCreatePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/create`;
    },
    getCommunityVotingCreatePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}/create`;
    },
    getCommunityPostDetailPage: (communityId: string, postId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${POST_ROUTE}/${postId}`;
    },
    getCommunityTopicDetailPage: (communityId: string, topicId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/${topicId}`;
    },
    getCommunityVotingDetailPage: (communityId: string, votingId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}/${votingId}`;
    },
    getCommunityApprovePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/approve`;
    },
    getCommunityUserApprovePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${USER_ROUTE}/approve`;
    },
    getCommunityUserAuthorizePage: (communityId: string) => {
        return `/${COMMUNITY_ROUTE}/${communityId}/${USER_ROUTE}/authorize`;
    },
    getSearchPage: () => {
        return `/${SEARCH_ROUTE}`;
    },
    getWriterPage: () => {
        return `/${WRITER_ROUTE}`;
    },
    getMessagePage: () => {
        return `/${MESSAGE_ROUTE}`;
    },
    getMessageDetailPage: (userId: string) => {
        return `/${MESSAGE_ROUTE}/${userId}`;
    },
    getPostCreatePage: () => {
        return `/${POST_ROUTE}/create`;
    },
    getPostDetailPage: (postId: string) => {
        return `/${POST_ROUTE}/${postId}`;
    },
    getAdminPage: () => {
        return `/${ADMIN_ROUTE}`;
    },
    getAdminBookPage: () => {
        return `/${ADMIN_ROUTE}/${BOOK_ROUTE}`;
    },
    getAdminReviewPage: () => {
        return `/${ADMIN_ROUTE}/${REVIEW_ROUTE}`;
    },
    getAdminUserPage: () => {
        return `/${ADMIN_ROUTE}/${USER_ROUTE}`;
    },
    getAdminPostPage: () => {
        return `/${ADMIN_ROUTE}/${POST_ROUTE}`;
    },
    getAdminLoginPage: () => {
        return `/${ADMIN_ROUTE}/login`;
    },
};
