import { UserModel, UserSnippet } from "@/models/User";

let UserUtils = {};

const toUserSnippet = (user: UserModel): UserSnippet => {
    return {
        id: user.uid,
        displayName: user.displayName!,
        imageUrl: user.photoURL,
    };
};

export default UserUtils = {
    toUserSnippet,
};
