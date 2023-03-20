import RatingBar from "@/components/RatingBar";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { fireStore } from "@/firebase/clientApp";
import { UserModel } from "@/models/User";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import {
    doc,
    collection,
    getDoc,
    runTransaction,
    increment,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../RequiredLoginContainer";

type BookDetailVoteProps = {
    bookId: string;
    user?: UserModel | null;
};

const BookDetailVote: React.FC<BookDetailVoteProps> = ({ bookId, user }) => {
    const [rateLoading, setRateLoading] = useState(false);
    const [userRate, setUserRate] = useState(0);

    const getBookVote = async (userId: string) => {
        try {
            const bookVoteDocRef = doc(
                collection(
                    fireStore,
                    firebaseRoute.getUserBookVoteRoute(userId)
                ),
                bookId
            );
            const bookVoteDoc = await getDoc(bookVoteDocRef);
            if (bookVoteDoc.exists()) {
                setUserRate(bookVoteDoc.data().value);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getBookVote(user.uid);
        }
    }, [user]);

    const handleRate = async (value: number) => {
        setRateLoading(true);
        try {
            await runTransaction(fireStore, async (transaction) => {
                if (user) {
                    const bookVoteDocRef = doc(
                        collection(
                            fireStore,
                            firebaseRoute.getUserBookVoteRoute(user.uid)
                        ),
                        bookId
                    );
                    const bookDocRef = doc(
                        collection(fireStore, firebaseRoute.getAllBookRoute()),
                        bookId
                    );
                    const bookDoc = await transaction.get(bookDocRef);
                    if (!bookDoc.exists()) {
                        throw "Không tìm thấy sách";
                    }
                    const { rating, numberOfRates } = bookDoc.data();
                    let newRating = 0;
                    if (userRate !== 0) {
                        newRating =
                            (rating * numberOfRates + value - userRate) /
                            numberOfRates;
                        transaction.update(bookVoteDocRef, {
                            value,
                        });
                    } else {
                        newRating =
                            (rating * numberOfRates + value) /
                            (numberOfRates + 1);
                        transaction.set(bookVoteDocRef, {
                            value,
                        });
                        transaction.update(bookDocRef, {
                            numberOfRates: increment(1),
                        });
                    }
                    transaction.update(bookDocRef, {
                        rating: newRating,
                    });

                    setUserRate(value);
                }
            });
        } catch (error) {
            console.log(error);
        }
        setRateLoading(false);
    };

    return (
        <Flex align="flex-end" mb={4}>
            {!user ? (
                <RequiredLoginContainer action="bình chọn" />
            ) : (
                <>
                    <Text mr={4}>Để lại bình chọn</Text>
                    <Flex align="center">
                        <RatingBar
                            maxRate={10}
                            rate={userRate}
                            setRate={handleRate}
                            readonly={rateLoading}
                            size={24}
                        />
                        {rateLoading && <Spinner ml={2} size={"sm"} />}
                    </Flex>
                </>
            )}
        </Flex>
    );
};
export default BookDetailVote;
