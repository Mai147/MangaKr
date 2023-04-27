import {
    EVERYONE_PRIVACY,
    FOLLOW_PRIVACY,
    ONLYME_PRIVACY,
    PrivacyType,
} from "@/constants/privacy";
import { Post } from "@/models/Post";
import UserService from "@/services/UserService";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const PostUtils = {
    checkPrivacyType: async ({
        postCreatorId,
        userId,
    }: {
        postCreatorId: string;
        userId?: string;
    }): Promise<PrivacyType[] | undefined> => {
        try {
            if (!userId) {
                return [EVERYONE_PRIVACY];
            }
            if (userId === postCreatorId) {
                return [EVERYONE_PRIVACY, FOLLOW_PRIVACY, ONLYME_PRIVACY];
            }
            const follow = await UserService.getFollow({
                userId,
                followerId: postCreatorId,
            });
            if (!follow) {
                return [EVERYONE_PRIVACY];
            } else {
                return [EVERYONE_PRIVACY, FOLLOW_PRIVACY];
            }
        } catch (error) {
            console.log(error);
        }
    },
    fromDoc: (doc: QueryDocumentSnapshot<DocumentData>) => {
        const post = JSON.parse(JSON.stringify(doc.data())) as Post;
        return {
            id: doc.id,
            ...post,
        };
    },
};

export default PostUtils;
