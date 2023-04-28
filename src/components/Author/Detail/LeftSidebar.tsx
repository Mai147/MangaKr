import LeftSidebar from "@/components/Layout/Sidebar/LeftSidebar";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import useAuth from "@/hooks/useAuth";
import useModal from "@/hooks/useModal";
import { basicVoteList, Vote } from "@/models/Vote";
import VoteService from "@/services/VoteService";
import React, { useEffect, useState } from "react";

type AuthorLeftSidebarProps = {
    authorId: string;
};

const AuthorLeftSidebar: React.FC<AuthorLeftSidebarProps> = ({ authorId }) => {
    const { user } = useAuth();
    const { toggleView } = useModal();
    const [userVote, setUserVote] = useState<Vote | undefined>();

    const getUserVote = async (userId: string) => {
        const userVote = await VoteService.get({
            voteRoute: firebaseRoute.getUserAuthorVoteRoute(userId),
            voteId: authorId,
        });
        if (userVote) {
            setUserVote(userVote as Vote);
        } else {
            setUserVote(undefined);
        }
    };

    const onVote = async (vote: Vote) => {
        if (!user) {
            toggleView("login");
            return;
        } else {
            try {
                if (!userVote) {
                    await VoteService.create({
                        voteRoute: firebaseRoute.getUserAuthorVoteRoute(
                            user.uid
                        ),
                        voteId: authorId,
                        rootRoute: firebaseRoute.getAllAuthorRoute(),
                        rootId: authorId,
                        vote,
                    });
                } else {
                    await VoteService.update({
                        voteRoute: firebaseRoute.getUserAuthorVoteRoute(
                            user.uid
                        ),
                        voteId: authorId,
                        rootRoute: firebaseRoute.getAllAuthorRoute(),
                        rootId: authorId,
                        userVote,
                        vote,
                    });
                }
                setUserVote(userVote?.value !== vote.value ? vote : undefined);
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (user) {
            getUserVote(user.uid);
        } else {
            setUserVote(undefined);
        }
    }, [user]);

    return (
        <LeftSidebar
            voteList={basicVoteList}
            userVote={userVote}
            onVote={onVote}
        />
    );
};
export default AuthorLeftSidebar;
