import RatingBar from "@/components/RatingBar";
import { Book } from "@/models/Book";
import { UserModel } from "@/models/User";
import { Box, Flex, Heading, Stack, VStack } from "@chakra-ui/react";
import React from "react";
import { BsBookHalf } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import AddLibraryButton from "./AddLibraryButton";
import ReactInfo from "./ReactInfo";

type BookDetailHeaderProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailHeader: React.FC<BookDetailHeaderProps> = ({ book, user }) => {
    return (
        <VStack
            spacing={2}
            align="stretch"
            display={{ base: "none", xl: "flex" }}
        >
            <Stack direction="row" justify="space-between">
                <Heading as="h3">{book.name}</Heading>
                <Box display={{ base: "block", "2xl": "none" }}>
                    <AddLibraryButton book={book} user={user} />
                </Box>
            </Stack>
            <Flex align="center" justify="space-between">
                <Box display={{ base: "none", "2xl": "block" }}>
                    <AddLibraryButton book={book} user={user} />
                </Box>
                <Stack></Stack>
                <ReactInfo
                    title="bình chọn"
                    value={book.numberOfRates}
                    subChild={
                        <RatingBar rate={book.rating / 2} size={20} readonly />
                    }
                />
                <ReactInfo
                    icon={BsBookHalf}
                    title="người đọc"
                    value={book.popularity}
                />
                <ReactInfo
                    icon={FaRegComment}
                    title="bình luận"
                    value={book.numberOfComments}
                />
                <ReactInfo
                    icon={MdOutlineRateReview}
                    title="bài đánh giá"
                    value={book.numberOfReviews}
                />
            </Flex>
        </VStack>
    );
};
export default BookDetailHeader;
