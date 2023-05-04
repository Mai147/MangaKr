import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { routes } from "@/constants/routes";
import { Book, bookStatusList } from "@/models/Book";
import { UserModel } from "@/models/User";
import {
    Box,
    Divider,
    Flex,
    Heading,
    Icon,
    Link,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { BsBookHalf } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import BookImage from "../../Image";
import AddLibraryButton from "../Header/AddLibraryButton";
import BookDetailSidebarItem from "./BookDetailSidebarItem";

type BookDetailSidebarProps = {
    book: Book;
    user?: UserModel | null;
};

const BookDetailSidebar: React.FC<BookDetailSidebarProps> = ({
    book,
    user,
}) => {
    return (
        <Stack
            direction={{ base: "column", md: "row", xl: "column" }}
            spacing={4}
            align={{ base: "center", md: "flex-start" }}
            mr={{ base: 0, md: 5 }}
            maxW={{ base: "100%", xl: "260px" }}
            w="100%"
        >
            <VStack
                w={{ base: "100%", md: "auto" }}
                maxW={{ base: "100%", md: "260px" }}
            >
                <BookImage imageUrl={book.imageUrl} />
                <Flex w="full" justify="center">
                    <Heading
                        textAlign="center"
                        display={{ base: "inline-block", xl: "none" }}
                        as="h3"
                    >
                        {book.name}
                    </Heading>
                </Flex>

                <Box display={{ base: "block", xl: "none" }}>
                    <AddLibraryButton book={book} user={user} />
                </Box>
            </VStack>
            <Divider my={4} display={{ base: "none", xl: "block" }} />
            <Stack direction={"column"} alignSelf="flex-start" flexGrow={1}>
                <Text fontSize={20} color="gray.600" fontWeight={600}>
                    Thông tin
                </Text>
                <BookDetailSidebarItem title="Tác giả:">
                    {(book.authorSnippets || []).length > 0 ? (
                        <Flex flexGrow={1} wrap="wrap">
                            {book.authorSnippets?.map((author, idx) => (
                                <Flex key={author.id}>
                                    {idx === 0 ? "" : ", "}
                                    <Link
                                        key={author.id!}
                                        ml={1}
                                        _hover={{ color: "brand.400" }}
                                        href={routes.getAuthorDetailPage(
                                            author.id!
                                        )}
                                    >
                                        <Text maxW={"90px"} noOfLines={1}>
                                            {author.name}
                                        </Text>
                                    </Link>
                                </Flex>
                            ))}
                        </Flex>
                    ) : (
                        <Text>Chưa biết</Text>
                    )}
                </BookDetailSidebarItem>
                <BookDetailSidebarItem title="Thể loại:">
                    {(book.genreSnippets || []).length > 0 ? (
                        <Flex flexGrow={1} wrap="wrap" align="center">
                            {book.genreSnippets?.map((genre) => (
                                <Tag
                                    key={genre.id}
                                    label={genre.name}
                                    href={`${routes.getBookHomePage()}?genreId=${
                                        genre.id
                                    }`}
                                    mr={2}
                                    mb={2}
                                />
                            ))}
                        </Flex>
                    ) : (
                        <Text>Chưa biết</Text>
                    )}
                </BookDetailSidebarItem>
                <BookDetailSidebarItem title="Trạng thái:">
                    <Text>
                        {bookStatusList.find(
                            (item) => item.value === book.status
                        )?.label || "Chưa biết"}
                    </Text>
                </BookDetailSidebarItem>
                <BookDetailSidebarItem title="Số tập:">
                    <Text>{book.volumes || "Chưa biết"}</Text>
                </BookDetailSidebarItem>
                <BookDetailSidebarItem title="Số chap:">
                    <Text>{book.chapters || "Chưa biết"}</Text>
                </BookDetailSidebarItem>
                <BookDetailSidebarItem title="Ngày xuất bản:">
                    <Text>
                        {moment(book.publishedDate).format("DD/MM/YYYY")}
                    </Text>
                </BookDetailSidebarItem>
                <Divider my={4} />
                <Text fontSize={20} color="gray.600" fontWeight={600}>
                    Đánh giá
                </Text>
                <BookDetailSidebarItem title="Điểm:">
                    <Flex align="center">
                        <Text mr={1}>{book.rating}/10</Text>
                        <RatingBar
                            rate={book.rating}
                            size={16}
                            maxRate={5}
                            readonly
                        />
                    </Flex>
                </BookDetailSidebarItem>
                <Stack
                    direction={{ base: "column", sm: "row", xl: "column" }}
                    justify="space-between"
                >
                    <BookDetailSidebarItem title="Người đọc:">
                        <Flex align="center">
                            <Text mr={1}>{book.popularity}</Text>
                            <Icon as={BsBookHalf} />
                        </Flex>
                    </BookDetailSidebarItem>
                    <BookDetailSidebarItem title="Bình luận:">
                        <Flex align="center">
                            <Text mr={1}>{book.numberOfComments}</Text>
                            <Icon as={FaRegComment} />
                        </Flex>
                    </BookDetailSidebarItem>
                    <BookDetailSidebarItem title="Bài đánh giá:">
                        <Flex align="center">
                            <Text mr={1}>{book.numberOfReviews}</Text>
                            <Icon as={MdOutlineRateReview} />
                        </Flex>
                    </BookDetailSidebarItem>
                </Stack>
            </Stack>
        </Stack>
    );
};
export default BookDetailSidebar;
