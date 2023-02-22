import BookCommentItem from "@/components/Book/Comment/CommentItem";
import CommentInputs from "@/components/Comment/CommentInput";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import useBook from "@/hooks/useBook";
import { BookComment } from "@/models/Comment";
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
    collection,
    getCountFromServer,
    query,
    startAfter,
    limit,
    where,
    orderBy,
    getDocs,
    DocumentData,
    QueryDocumentSnapshot,
    doc,
    increment,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../RequiredLoginContainer";

type BookDetailCommentProps = {
    bookId: string;
    user?: UserModel | null;
};

const BookDetailComment: React.FC<BookDetailCommentProps> = ({
    bookId,
    user,
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [commentText, setCommentText] = useState("");
    const [commentList, setCommentList] = useState<BookComment[]>([]);
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
            const newComment: BookComment = {
                bookId,
                creatorId: user.uid,
                creatorDisplayName: user.displayName!,
                creatorImageUrl: user.photoURL,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp,
            };
            const commentDocRef = doc(
                collection(fireStore, firebaseRoute.getAllCommentRoute())
            );
            const bookDocRef = doc(
                collection(fireStore, firebaseRoute.getAllBookRoute()),
                bookId
            );
            batch.set(commentDocRef, newComment);
            batch.update(bookDocRef, {
                numberOfComments: increment(1),
            });
            await batch.commit();
            setCommentText("");
            setCommentList((prev) => [
                {
                    ...newComment,
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
        bookId,
    }: {
        page: number;
        pageCount: number;
        bookId: string;
    }) => {
        setGetCommentLoading(true);
        const commentDocsRef = collection(
            fireStore,
            firebaseRoute.getAllCommentRoute()
        );
        const queryConstraints = [];
        const snapShot = await getCountFromServer(query(commentDocsRef));
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
            where("bookId", "==", bookId),
            orderBy("createdAt", "desc"),
            limit(pageCount),
            ...queryConstraints
        );
        const commentDocs = await getDocs(commentQuery);
        const comments = commentDocs.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...doc.data(),
                } as BookComment)
        );
        setLastCommentDoc(commentDocs.docs[commentDocs.docs.length - 1]);
        setCommentList((prev) => [...prev, ...comments]);
        setGetCommentLoading(false);
    };

    useEffect(() => {
        getComments({ bookId, page, pageCount: 5 });
    }, [page]);

    return (
        <>
            {!user ? (
                <RequiredLoginContainer action="bình luận" />
            ) : (
                <Box>
                    <CommentInputs
                        commentText={commentText}
                        setCommentText={setCommentText}
                        createLoading={commentLoading}
                        onCreateComment={handleComment}
                        user={user}
                    />
                    <VStack spacing={2} align="center">
                        <Flex alignSelf="stretch" direction="column">
                            {commentList.map((comment) => (
                                <BookCommentItem
                                    key={comment.id}
                                    comment={comment}
                                    loadingDelete={false}
                                    onDeleteComment={() => {}}
                                    userId={user.uid}
                                />
                            ))}
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
export default BookDetailComment;
