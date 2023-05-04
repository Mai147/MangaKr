import CommentSection from "@/components/Comment";
import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { firebaseRoute } from "@/constants/firebaseRoutes";
import { routes } from "@/constants/routes";
import { CommentProvider } from "@/context/CommentContext";
import useAuth from "@/hooks/useAuth";
import { Review, tagReviewList } from "@/models/Review";
import {
    VStack,
    AspectRatio,
    Heading,
    Image,
    Text,
    Link,
    Divider,
    Flex,
    useBreakpointValue,
    Box,
} from "@chakra-ui/react";
import React from "react";
import ReviewActionInfoBar from "./ActionInfoBar";
import ReviewLeftSideBar from "./LeftSideBar";

type ReviewDetailProps = {
    review: Review;
};

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review }) => {
    const { user } = useAuth();
    return (
        <Flex align="flex-start">
            <Box
                display={useBreakpointValue({
                    base: "none",
                    md: "block",
                })}
            >
                <ReviewLeftSideBar reviewId={review.id!} />
            </Box>
            <VStack
                spacing={4}
                align="flex-start"
                flexGrow={1}
                bg="white"
                borderRadius={4}
                boxShadow="lg"
                p={{ base: 4, md: 6 }}
            >
                <AspectRatio ratio={3 / 1} w="100%">
                    <Image
                        src={review.imageUrl || "/images/noImage.jpg"}
                        alt="Review Image"
                        objectFit="contain"
                    />
                </AspectRatio>
                <VStack spacing={2} w="100%">
                    <Heading
                        as="h3"
                        fontSize={{ base: 20, md: 28 }}
                        textAlign="center"
                    >
                        {review.title}
                    </Heading>
                    <VStack spacing={0}>
                        <Link
                            href={routes.getBookDetailPage(review.bookId!)}
                            _hover={{ textDecoration: "none" }}
                        >
                            <Text
                                fontWeight={600}
                                color="gray.400"
                                _hover={{ color: "brand.100" }}
                                transition="all 0.3s"
                            >
                                {review.bookName}
                            </Text>
                        </Link>
                        <Text color="gray.400" fontSize={14} fontStyle="italic">
                            Viết bởi {review.creatorDisplayName}
                        </Text>
                    </VStack>
                    <ReviewActionInfoBar review={review} />
                    <Box
                        display={useBreakpointValue({
                            base: "block",
                            md: "none",
                        })}
                    >
                        <ReviewLeftSideBar
                            reviewId={review.id!}
                            direction="row"
                        />
                    </Box>
                </VStack>
                <Divider />
                <div
                    dangerouslySetInnerHTML={{
                        __html: review.content,
                    }}
                    className="ck ck-content"
                ></div>
                <Divider />
                <Flex align="center">
                    <Text fontSize={18} fontWeight={600} mr={10}>
                        Đánh giá:
                    </Text>
                    <RatingBar rate={review.rating} maxRate={10} readonly />
                </Flex>
                <Flex align="center">
                    <Text fontSize={18} fontWeight={600} mr={10}>
                        Nhận xét:
                    </Text>
                    <Tag
                        label={
                            tagReviewList.find(
                                (tag) => tag.value === review.tagReview
                            )?.label!
                        }
                    />
                </Flex>
                <CommentProvider
                    commentRoute={firebaseRoute.getReviewCommentRoute(
                        review.id!
                    )}
                    rootRoute={firebaseRoute.getAllReviewRoute()}
                    rootId={review.id!}
                    setNumberOfCommentsIncrement={() => {}}
                >
                    <CommentSection user={user} />
                </CommentProvider>
            </VStack>
        </Flex>
    );
};
export default ReviewDetail;
