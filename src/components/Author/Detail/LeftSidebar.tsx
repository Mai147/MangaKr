import LeftSidebar from "@/components/Layout/Sidebar/LeftSidebar";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { doc, getDoc, increment, writeBatch } from "firebase/firestore";
import React, { useEffect, useState } from "react";

type AuthorLeftSidebarProps = {
    authorId: string;
};

const AuthorLeftSidebar: React.FC<AuthorLeftSidebarProps> = ({ authorId }) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [userVote, setUserVote] = useState<1 | -1 | undefined>(undefined);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);

    const getUserVote = async (userId: string) => {
        const userAuthorVoteDocRef = doc(
            fireStore,
            firebaseRoute.getUserAuthorVoteRoute(userId),
            authorId
        );
        const userAuthorVoteDoc = await getDoc(userAuthorVoteDocRef);
        if (userAuthorVoteDoc.exists()) {
            setUserVote(userAuthorVoteDoc.data().value);
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
            const userAuthorVoteRef = doc(
                fireStore,
                firebaseRoute.getUserAuthorVoteRoute(user.uid),
                authorId
            );
            const authorRef = doc(
                fireStore,
                firebaseRoute.getAllAuthorRoute(),
                authorId
            );
            let likeIncrement = 0;
            let dislikeIncrement = 0;
            if (!userVote) {
                batch.set(userAuthorVoteRef, {
                    value,
                });
                value === 1 ? (likeIncrement = 1) : (dislikeIncrement = 1);
            } else {
                if (value === userVote) {
                    batch.delete(userAuthorVoteRef);
                    value === 1
                        ? (likeIncrement = -1)
                        : (dislikeIncrement = -1);
                } else {
                    batch.update(userAuthorVoteRef, {
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
            batch.update(authorRef, {
                numberOfLikes: increment(likeIncrement),
                numberOfDislikes: increment(dislikeIncrement),
            });
            await batch.commit();
            setUserVote((prev) => (prev === value ? undefined : value));
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
        <LeftSidebar
            handleLike={handleLike}
            likeLoading={likeLoading}
            dislikeLoading={dislikeLoading}
            userVote={userVote}
        />
    );
};
export default AuthorLeftSidebar;
