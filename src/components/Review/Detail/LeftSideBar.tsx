import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { IconButton, VStack } from "@chakra-ui/react";
import {
    collection,
    doc,
    getDoc,
    increment,
    writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    AiFillDislike,
    AiFillLike,
    AiOutlineDislike,
    AiOutlineLike,
} from "react-icons/ai";

type ReviewLeftSideBarProps = {
    reviewId: string;
};

const ReviewLeftSideBar: React.FC<ReviewLeftSideBarProps> = ({ reviewId }) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [userVote, setUserVote] = useState<1 | -1 | undefined>(undefined);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);

    const getUserVote = async (userId: string) => {
        const userReviewVoteDocRef = doc(
            fireStore,
            firebaseRoute.getUserReviewVoteRoute(userId),
            reviewId
        );
        const userReviewVoteDoc = await getDoc(userReviewVoteDocRef);
        if (userReviewVoteDoc.exists()) {
            setUserVote(userReviewVoteDoc.data().value);
        } else {
            setUserVote(undefined);
        }
    };

    const handleLike = async (value: 1 | -1) => {
        if (!user) {
            toggleView("login");
            return;
        }
        value === 1 ? setLikeLoading(true) : setDislikeLoading(true);
        try {
            const batch = writeBatch(fireStore);
            const userReviewVoteRef = doc(
                fireStore,
                firebaseRoute.getUserReviewVoteRoute(user.uid),
                reviewId
            );
            const reviewRef = doc(
                fireStore,
                firebaseRoute.getAllReviewRoute(),
                reviewId
            );
            let likeIncrement = 0;
            let dislikeIncrement = 0;
            if (!userVote) {
                batch.set(userReviewVoteRef, {
                    value,
                });
                value === 1 ? (likeIncrement = 1) : (dislikeIncrement = 1);
            } else {
                if (value === userVote) {
                    batch.delete(userReviewVoteRef);
                    value === 1
                        ? (likeIncrement = -1)
                        : (dislikeIncrement = -1);
                } else {
                    batch.update(userReviewVoteRef, {
                        value,
                    });
                    if (value === 1) {
                        likeIncrement = 1;
                        dislikeIncrement = -1;
                    } else {
                        likeIncrement = -1;
                        dislikeIncrement = 1;
                    }
                }
            }
            batch.update(reviewRef, {
                numberOfLikes: increment(likeIncrement),
                numberOfDislikes: increment(dislikeIncrement),
            });
            await batch.commit();
            setUserVote(value);
        } catch (error) {
            console.log(error);
        }
        value === 1 ? setLikeLoading(false) : setDislikeLoading(false);
    };

    useEffect(() => {
        if (user) {
            getUserVote(user.uid);
        }
    }, [user]);

    return (
        <VStack position="sticky" top={24} mr={4}>
            <IconButton
                aria-label="like-button"
                icon={
                    userVote === 1 ? (
                        <AiFillLike fontSize={30} />
                    ) : (
                        <AiOutlineLike fontSize={30} />
                    )
                }
                color={userVote === 1 ? "brand.100" : "gray.700"}
                variant="ghost"
                borderRadius="full"
                size="lg"
                onClick={() => handleLike(1)}
                isDisabled={dislikeLoading}
                isLoading={likeLoading}
            />
            <IconButton
                aria-label="like-button"
                icon={
                    userVote === -1 ? (
                        <AiFillDislike fontSize={30} />
                    ) : (
                        <AiOutlineDislike fontSize={30} />
                    )
                }
                color={userVote === -1 ? "brand.100" : "gray.700"}
                variant="ghost"
                borderRadius="full"
                size="lg"
                onClick={() => handleLike(-1)}
                isDisabled={likeLoading}
                isLoading={dislikeLoading}
            />
        </VStack>
    );
};
export default ReviewLeftSideBar;
