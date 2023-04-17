const BOOK_ROUTE = `books`;
const BOOK_VOTE_ROUTE = `bookVotes`;
const READING_BOOK_SNIPPET_ROUTE = `readingBookSnippets`;
const WRITING_BOOK_SNIPPET_ROUTE = `writingBookSnippets`;
const USER_ROUTE = `users`;
const USER_SNIPPET_ROUTE = `userSnippets`;
const AUTHOR_ROUTE = `authors`;
const AUTHOR_SNIPPET_ROUTE = `authorSnippets`;
const AUTHOR_VOTE_ROUTE = `authorVotes`;
const GENRE_SNIPPET_ROUTE = `genreSnippets`;
const CHARACTER_ROUTE = `characters`;
const CHARACTER_SNIPPET_ROUTE = `characterSnippets`;
const GENRE_ROUTE = `genres`;
const COMMENT_ROUTE = `comments`;
const COMMENT_VOTE_ROUTE = `commentVotes`;
const REVIEW_ROUTE = `reviews`;
const REVIEW_VOTE_ROUTE = `reviewVotes`;
const IMAGE_ROUTE = `image`;
const COMMUNITY_ROUTE = `communities`;
const COMMUNITY_MODERATOR_SNIPPET = `moderatorSnippets`;
const POST_ROUTE = `posts`;
const POST_VOTE_ROUTE = `postVotes`;
const TOPIC_ROUTE = `topics`;
const TOPIC_REPLY_ROUTE = `replies`;
const VOTING_ROUTE = `votings`;
const VOTING_OPTION_ROUTE = `options`;
const VOTING_VOTE_ROUTE = `votingVotes`;
const MESSAGE_ROUTE = `messages`;
const FOLLOW_ROUTE = `follows`;
const FOLLOWED_ROUTE = `followeds`;
const NOTIFICATION_ROUTE = `notifications`;

export const firebaseRoute = {
    COMMUNITY_SNIPPET_ROUTE: `communitySnippets`,
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
        return `${USER_ROUTE}/${userId}/${this.COMMUNITY_SNIPPET_ROUTE}`;
    },
    getUserReviewVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${REVIEW_VOTE_ROUTE}`;
    },
    getUserCommentVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${COMMENT_VOTE_ROUTE}`;
    },
    getUserAuthorVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${AUTHOR_VOTE_ROUTE}`;
    },
    getUserPostRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${POST_ROUTE}`;
    },
    getUserPostCommentRoute(userId: string, postId: string) {
        return `${USER_ROUTE}/${userId}/${POST_ROUTE}/${postId}/${COMMENT_ROUTE}`;
    },
    getUserPostVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${POST_VOTE_ROUTE}`;
    },
    getUserVotingVoteRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${VOTING_VOTE_ROUTE}`;
    },
    getUserMessageRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${MESSAGE_ROUTE}`;
    },
    getUserMessageDetailRoute(firstUserId: string, secondUserId: string) {
        return `${USER_ROUTE}/${firstUserId}/${MESSAGE_ROUTE}/${secondUserId}/messageList`;
    },
    getUserFollowRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${FOLLOW_ROUTE}`;
    },
    getUserFollowedRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${FOLLOWED_ROUTE}`;
    },
    getUserNotificationRoute(userId: string) {
        return `${USER_ROUTE}/${userId}/${NOTIFICATION_ROUTE}`;
    },
    getAllAuthorRoute() {
        return AUTHOR_ROUTE;
    },
    getAuthorImageRoute(authorId: string) {
        return `${AUTHOR_ROUTE}/${authorId}/${IMAGE_ROUTE}`;
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
    getCommunityModeratorSnippetRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${COMMUNITY_MODERATOR_SNIPPET}`;
    },
    getCommunityUserRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${USER_SNIPPET_ROUTE}`;
    },
    getCommunityPostRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${POST_ROUTE}`;
    },
    getCommunityPostCommentRoute(communityId: string, postId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${POST_ROUTE}/${postId}/${COMMENT_ROUTE}`;
    },
    getCommunityTopicRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}`;
    },
    getCommunityVotingRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}`;
    },
    getCommunityVotingOptionRoute(communityId: string, votingId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}/${votingId}/${VOTING_OPTION_ROUTE}`;
    },
    getCommunityVotingOptionVoteRoute(
        communityId: string,
        votingId: string,
        voteOptionId: string
    ) {
        return `${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}/${votingId}/${VOTING_OPTION_ROUTE}/${voteOptionId}/${VOTING_VOTE_ROUTE}`;
    },
    getCommunityVotingImageRoute(
        communityId: string,
        votingId: string,
        votingOptionId: string
    ) {
        return `${COMMUNITY_ROUTE}/${communityId}/${VOTING_ROUTE}/${votingId}/${votingOptionId}/${IMAGE_ROUTE}`;
    },
    getCommunityImageRoute(communityId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${IMAGE_ROUTE}`;
    },
    getReplyCommentRoute(parentRoute: string, parentId: string) {
        return `${parentRoute}/${parentId}/${COMMENT_ROUTE}`;
    },
    getPostImageRoute(postId: string) {
        return `${POST_ROUTE}/${postId}/${IMAGE_ROUTE}`;
    },
    getTopicImageRoute(communityId: string, topicId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/${topicId}/${IMAGE_ROUTE}`;
    },
    getCommunityTopicReplyRoute(communityId: string, topicId: string) {
        return `${COMMUNITY_ROUTE}/${communityId}/${TOPIC_ROUTE}/${topicId}/${TOPIC_REPLY_ROUTE}`;
    },
    getMessageImageRoute(messageId: string) {
        return `${MESSAGE_ROUTE}/${messageId}/${IMAGE_ROUTE}`;
    },
};
