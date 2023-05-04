import RatingBar from "@/components/RatingBar";
import useModal from "@/hooks/useModal";
import { UserModel } from "@/models/User";
import BookService from "@/services/BookService";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import RequiredLoginContainer from "../RequiredLoginContainer";

type BookDetailVoteProps = {
    bookId: string;
    user?: UserModel | null;
};

const BookDetailVote: React.FC<BookDetailVoteProps> = ({ bookId, user }) => {
    const { toggleView } = useModal();
    const [rateLoading, setRateLoading] = useState(false);
    const [userRate, setUserRate] = useState(0);

    const getBookRate = async (userId: string) => {
        try {
            const rate = await BookService.getUserRate({ bookId, userId });
            if (rate) {
                setUserRate(rate);
            } else {
                setUserRate(0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (user) {
            getBookRate(user.uid);
        }
    }, [user]);

    const handleRate = async (value: number) => {
        setRateLoading(true);
        try {
            if (!user) {
                toggleView("login");
                return;
            }
            await BookService.handleRate({
                userId: user.uid,
                bookId,
                value,
                userRate,
            });
            setUserRate(value);
        } catch (error) {
            console.log(error);
        }
        setRateLoading(false);
    };

    return (
        <Box mb={4}>
            {!user ? (
                <RequiredLoginContainer action="bình chọn" />
            ) : (
                <Flex align="center">
                    <Text mr={4}>Bình chọn</Text>
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
                </Flex>
            )}
        </Box>
    );
};
export default BookDetailVote;
