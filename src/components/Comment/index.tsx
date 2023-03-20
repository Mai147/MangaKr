import CommentItem from "@/components/Comment/CommentItem";
import CommentInputs from "@/components/Comment/CommentInput";
import { COMMENT_PAGE_COUNT } from "@/constants/pagination";
import { fireStore } from "@/firebase/clientApp";
import { Comment } from "@/models/Comment";
import { UserModel } from "@/models/User";
import {
    Box,
    Button,
    Flex,
    SkeletonCircle,
    SkeletonText,
    VStack,
} from "@chakra-ui/react";
import {
    getCountFromServer,
    query,
    startAfter,
    limit,
    orderBy,
    getDocs,
    DocumentData,
    QueryDocumentSnapshot,
    doc,
    increment,
    serverTimestamp,
    Timestamp,
    writeBatch,
    CollectionReference,
    DocumentReference,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../Book/Detail/Action/RequiredLoginContainer";

type CommentSectionProps = {
    commentDocsRef: CollectionReference<DocumentData>;
    rootDocRef: DocumentReference<DocumentData>;
    user?: UserModel | null;
};

const CommentSection: React.FC<CommentSectionProps> = ({
    commentDocsRef,
    rootDocRef,
    user,
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [commentList, setCommentList] = useState<Comment[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [getCommentLoading, setGetCommentLoading] = useState(false);
    const [lastCommentDoc, setLastCommentDoc] =
        useState<QueryDocumentSnapshot<DocumentData> | null>(null);

    const handleComment = async () => {
        setCommentLoading(true);
        try {
            if (!user) {
                return;
            }
            const batch = writeBatch(fireStore);
            const newComment: Comment = {
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp,
            };
            // const commentDocRef = doc(
            //     collection(fireStore, firebaseRoute.getBookCommentRoute(bookId))
            // );
            const commentDocRef = doc(commentDocsRef);
            // const bookDocRef = doc(
            //     collection(fireStore, firebaseRoute.getAllBookRoute()),
            //     bookId
            // );
            batch.set(commentDocRef, newComment);
            batch.update(rootDocRef, {
                numberOfComments: increment(1),
            });
            await batch.commit();
            setCommentText("");
            setCommentList((prev) => [
                {
                    ...newComment,
                    id: commentDocRef.id,
                    createdAt: Timestamp.fromDate(new Date()),
                },
                ...prev,
            ]);
        } catch (error) {
            console.log(error);
        }
        setCommentLoading(false);
    };

    const getComments = async ({
        page,
        pageCount,
    }: {
        page: number;
        pageCount: number;
    }) => {
        setGetCommentLoading(true);
        // const commentDocsRef = collection(
        //     fireStore,
        //     firebaseRoute.getBookCommentRoute(bookId)
        // );
        const queryConstraints = [];
        const snapShot = await getCountFromServer(commentDocsRef);
        const ttPage = Math.ceil(snapShot.data().count / pageCount);
        setTotalPage(ttPage);
        if (lastCommentDoc) {
            if (page <= ttPage) {
                queryConstraints.push(startAfter(lastCommentDoc));
                queryConstraints.push(limit(pageCount));
            } else return;
        }
        const commentQuery = query(
            commentDocsRef,
            orderBy("createdAt", "desc"),
            limit(pageCount),
            ...queryConstraints
        );
        const commentDocs = await getDocs(commentQuery);
        let comments: Comment[] = [];
        for (const commentDoc of commentDocs.docs) {
            const comment = commentDoc.data() as Comment;
            comments = [
                ...comments,
                {
                    id: commentDoc.id,
                    ...comment,
                },
            ];
        }
        setLastCommentDoc(commentDocs.docs[commentDocs.docs.length - 1]);
        setCommentList((prev) => [...prev, ...comments]);
        setGetCommentLoading(false);
    };

    useEffect(() => {
        getComments({ page, pageCount: COMMENT_PAGE_COUNT });
    }, [page]);

    return (
        <>
            {!user ? (
                <RequiredLoginContainer action="bình luận" />
            ) : (
                <Box w="100%">
                    <CommentInputs
                        commentText={commentText}
                        setCommentText={setCommentText}
                        createLoading={commentLoading}
                        onCreateComment={handleComment}
                        user={user}
                    />
                    <VStack spacing={2} align="center">
                        <Flex alignSelf="stretch" direction="column">
                            {commentList.map((comment) => {
                                return (
                                    <CommentItem
                                        key={comment.id}
                                        comment={comment}
                                        loadingDelete={false}
                                        onDeleteComment={() => {}}
                                        userId={user.uid}
                                    />
                                );
                            })}
                            {getCommentLoading && (
                                <Box padding="6" boxShadow="lg" bg="white">
                                    <SkeletonCircle size="10" />
                                    <SkeletonText
                                        mt="4"
                                        noOfLines={4}
                                        spacing="4"
                                        skeletonHeight="2"
                                        fadeDuration={0.4}
                                        speed={0.8}
                                    />
                                </Box>
                            )}
                        </Flex>
                        {page < totalPage && (
                            <Button
                                variant={"link"}
                                color="brand.100"
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Xem thêm
                            </Button>
                        )}
                    </VStack>
                </Box>
            )}
        </>
    );
};
export default CommentSection;
