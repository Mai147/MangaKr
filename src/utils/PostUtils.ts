import {
    EVERYONE_PRIVACY,
    FOLLOW_PRIVACY,
    ONLYME_PRIVACY,
    PrivacyType,
} from "@/constants/privacy";
import UserService from "@/services/UserService";

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
};

export default PostUtils;
