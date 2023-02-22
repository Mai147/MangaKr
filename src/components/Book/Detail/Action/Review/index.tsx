import { getCreateBookReviewPage } from "@/constants/routes";
import { UserModel } from "@/models/User";
import { Box, Flex, Icon, Link, Text } from "@chakra-ui/react";
import React from "react";
import { BiEdit } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import RequiredLoginContainer from "../RequiredLoginContainer";

type BookDetailReviewActionProps = {
    user?: UserModel | null;
    bookId: string;
};

const BookDetailReviewAction: React.FC<BookDetailReviewActionProps> = ({
    user,
    bookId,
}) => {
    return (
        <Box mb={4}>
            {!user ? (
                <RequiredLoginContainer action="viết bài đánh giá" />
            ) : (
                <Link
                    _hover={{ textDecoration: "none", color: "brand.100" }}
                    role="group"
                    transition={"all .3s ease"}
                    href={getCreateBookReviewPage(bookId)}
                >
                    <Flex align="center" w="fit-content">
                        <Text mr={2}>Viết bài đánh giá</Text>
                        <Icon
                            as={BiEdit}
                            fontSize={20}
                            color="gray.400"
                            _groupHover={{ color: "brand.100" }}
                            transition={"all .3s ease"}
                        />
                        <Icon
                            as={IoIosArrowForward}
                            fontSize={20}
                            color="brand.100"
                            ml={10}
                            opacity={0}
                            transform={"translateX(-10px)"}
                            _groupHover={{
                                opacity: "100%",
                                transform: "translateX(0)",
                            }}
                            transition={"all .3s ease"}
                        />
                    </Flex>
                </Link>
            )}
        </Box>
    );
};
export default BookDetailReviewAction;
