import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { Community } from "@/models/Community";
import { Topic, TopicReply } from "@/models/Topic";
import FileUtils from "@/utils/FileUtils";
import { triGram } from "@/utils/StringUtils";
import { TopicUtils } from "@/utils/TopicUtils";
import {
    writeBatch,
    doc,
    collection,
    serverTimestamp,
    Timestamp,
    increment,
    getDoc,
} from "firebase/firestore";
import CommunityService from "./CommunityService";

class TopicService {
    static get = async ({
        topicId,
        communityId,
        isAccept,
        isLock,
    }: {
        topicId: string;
        communityId: string;
        isAccept?: boolean;
        isLock?: boolean;
    }) => {
        const topicDocRef = doc(
            fireStore,
            firebaseRoute.getCommunityTopicRoute(communityId),
            topicId
        );
        const topicDoc = await getDoc(topicDocRef);
        if (topicDoc.exists()) {
            const topic = TopicUtils.fromDoc(topicDoc);
            if (isAccept !== undefined && topic.isAccept !== isAccept) return;
            if (isLock !== undefined && topic.isLock !== isLock) return;
            return topic;
        }
    };
    static create = async ({
        topicForm,
        community,
    }: {
        topicForm: Topic;
        community: Community;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const topicDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityTopicRoute(community.id!)
                )
            );
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                community.id!
            );
            const res = await FileUtils.uploadFile({
                imageRoute: firebaseRoute.getTopicImageRoute(
                    community.id!,
                    topicDocRef.id
                ),
                imageUrl: topicForm.imageUrl,
            });
            const trigramTitle = triGram(topicForm.title);
            const trigramCreatorName = triGram(topicForm.creatorDisplayName);
            batch.set(topicDocRef, {
                ...topicForm,
                communityId: community.id,
                trigramTitle: {
                    ...trigramTitle.obj,
                    ...trigramCreatorName.obj,
                },
                createdAt: serverTimestamp() as Timestamp,
            });
            if (res) {
                batch.update(topicDocRef, {
                    imageUrl: res.downloadUrl,
                    imageRef: res.downloadRef,
                });
            }
            batch.update(communityDocRef, {
                numberOfTopics: increment(1),
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static toggleLockState = async ({ topic }: { topic: Topic }) => {
        try {
            const batch = writeBatch(fireStore);
            const topicDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityTopicRoute(topic.communityId)
                ),
                topic.id!
            );
            batch.update(topicDocRef, {
                isLock: !topic.isLock,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static approve = async ({
        topic,
        community,
        isAccept,
    }: {
        topic: Topic;
        community: Community;
        isAccept: boolean;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            let topicDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityTopicRoute(community.id!),
                topic.id!
            );
            const communityDocRef = doc(
                fireStore,
                firebaseRoute.getAllCommunityRoute(),
                community.id!
            );
            if (isAccept) {
                // Community noti
                await CommunityService.updateNotification({
                    community,
                    creatorDisplayName: topic.creatorDisplayName!,
                    type: "TOPIC",
                });
                batch.update(communityDocRef, {
                    numberOfTopics: increment(1),
                });
                batch.update(topicDocRef, {
                    isAccept,
                });
            } else {
                batch.delete(topicDocRef);
            }
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
    static reply = async ({
        topicReplyForm,
        topic,
    }: {
        topicReplyForm: TopicReply;
        topic: Topic;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const topicDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityTopicRoute(topic.communityId),
                topic.id!
            );
            const topicReplyDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getCommunityTopicReplyRoute(
                        topic.communityId,
                        topic.id!
                    )
                )
            );
            batch.set(topicReplyDocRef, topicReplyForm);
            batch.update(topicDocRef, {
                numberOfReplies: increment(1),
            });
            await batch.commit();
            return {
                ...topicReplyForm,
                createdAt: Timestamp.fromDate(new Date()),
            } as TopicReply;
        } catch (error) {
            console.log(error);
        }
    };
    static changeStatus = async ({
        isClose,
        topic,
    }: {
        isClose: boolean;
        topic: Topic;
    }) => {
        try {
            const batch = writeBatch(fireStore);
            const topicDocRef = doc(
                fireStore,
                firebaseRoute.getCommunityTopicRoute(topic.communityId),
                topic.id!
            );
            batch.update(topicDocRef, {
                isClose,
            });
            await batch.commit();
        } catch (error) {
            console.log(error);
        }
    };
}

export default TopicService;
