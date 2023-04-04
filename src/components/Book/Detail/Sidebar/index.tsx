import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { routes } from "@/constants/routes";
import { Book, bookStatusList } from "@/models/Book";
import { Divider, Flex, Icon, Link, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { BsBookHalf } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import BookImage from "../../Image";
import BookDetailSidebarItem from "./BookDetailSidebarItem";

type BookDetailSidebarProps = {
    book: Book;
};

const BookDetailSidebar: React.FC<BookDetailSidebarProps> = ({ book }) => {
    return (
        <VStack spacing={4} align="flex-start" mr={5}>
            <BookImage imageUrl={book.imageUrl} />
            <Divider my={4} />
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
                            />
                        ))}
                    </Flex>
                ) : (
                    <Text>Chưa biết</Text>
                )}
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Trạng thái:">
                <Text>
                    {bookStatusList.find((item) => item.value === book.status)
                        ?.label || "Chưa biết"}
                </Text>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Số tập:">
                <Text>{book.volumes || "Chưa biết"}</Text>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Số chap:">
                <Text>{book.chapters || "Chưa biết"}</Text>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Ngày xuất bản:">
                <Text>{moment(book.publishedDate).format("DD/MM/YYYY")}</Text>
            </BookDetailSidebarItem>
            <Divider my={4} />
            <Text fontSize={20} color="gray.600" fontWeight={600}>
                Đánh giá
            </Text>
            <BookDetailSidebarItem title="Điểm:">
                <>
                    <Text mr={1}>{book.rating}/10</Text>
                    <RatingBar
                        rate={book.rating}
                        size={16}
                        maxRate={10}
                        readonly
                    />
                </>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Người đọc:">
                <>
                    <Text mr={1}>{book.popularity}</Text>
                    <Icon as={BsBookHalf} />
                </>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Bình luận:">
                <>
                    <Text mr={1}>{book.numberOfComments}</Text>
                    <Icon as={FaRegComment} />
                </>
            </BookDetailSidebarItem>
            <BookDetailSidebarItem title="Bài dánh giá:">
                <>
                    <Text mr={1}>{book.numberOfReviews}</Text>
                    <Icon as={MdOutlineRateReview} />
                </>
            </BookDetailSidebarItem>
        </VStack>
    );
};
export default BookDetailSidebar;
