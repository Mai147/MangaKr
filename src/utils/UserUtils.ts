import { UserMessageSnippet, UserModel, UserSnippet } from "@/models/User";

let UserUtils = {};

const toUserSnippet = (user: UserModel): UserSnippet => {
    return {
        id: user.uid,
        displayName: user.displayName!,
        imageUrl: user.photoURL,
    };
};

const messageSnippetToUserSnippet = (user: UserMessageSnippet): UserSnippet => {
    return {
        id: user.id,
        displayName: user.displayName,
        imageUrl: user.imageUrl,
    };
};

export default UserUtils = {
    toUserSnippet,
    messageSnippetToUserSnippet,
};
