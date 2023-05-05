import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { Review, tagReviewList } from "@/models/Review";
import {
    AspectRatio,
    Flex,
    FlexProps,
    Icon,
    IconButton,
    Image,
    Link,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

interface ReviewSnippetItemProps extends FlexProps {
    review: Review;
    href?: string;
    onDelete?: (review: Review) => void;
    onCarousel?: boolean;
}

const ReviewSnippetItem: React.FC<ReviewSnippetItemProps> = ({
    review,
    href,
    onDelete,
    onCarousel = false,
    ...rest
}) => {
    const ratingBarMaxRate = useBreakpointValue({
        base: 5,
        sm: 10,
        md: 5,
        lg: 10,
    });
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            role="group"
            href={href}
            w="100%"
        >
            <Flex
                {...rest}
                p={{ base: 2, sm: 4, md: 2, lg: 4 }}
                bg="white"
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                align="center"
                justify="space-between"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
                position="relative"
            >
                <Flex>
                    <AspectRatio
                        ratio={{ base: 4 / 3, md: 3 / 4, lg: 4 / 3 }}
                        w={{
                            base: "90px",
                            sm: "120px",
                            md: "100px",
                            lg: "120px",
                        }}
                        flexShrink={0}
                    >
                        <Image src={review.imageUrl || "/images/noImage.jpg"} />
                    </AspectRatio>
                    <Flex
                        ml={{ base: 4, sm: 8, md: 4, lg: 8 }}
                        align="flex-start"
                        direction="column"
                        justify="space-between"
                    >
                        <Text
                            fontSize={{ base: 16, sm: 18 }}
                            fontWeight={600}
                            noOfLines={1}
                            lineHeight={1.2}
                        >
                            {review.title}
                        </Text>
                        <RatingBar
                            rate={review.rating}
                            maxRate={ratingBarMaxRate}
                            readonly
                        />
                        <Tag
                            label={
                                tagReviewList.find(
                                    (tag) => tag.value === review.tagReview
                                )?.label!
                            }
                        />
                    </Flex>
                </Flex>
                {!onCarousel && (
                    <Icon
                        as={MdOutlineArrowForwardIos}
                        fontSize={24}
                        color="brand.100"
                        opacity={0}
                        transform={"translateX(-10px)"}
                        _groupHover={{
                            opacity: "100%",
                            transform: "translateX(0)",
                        }}
                        transition={"all .3s ease"}
                    />
                )}
                {onDelete && (
                    <IconButton
                        position="absolute"
                        top={2}
                        right={2}
                        size="xs"
                        aria-label="Delete button"
                        bg="brand.400"
                        borderRadius="full"
                        icon={<FaTimes />}
                        _hover={{ bg: "brand.100" }}
                        transition="all 0.3s"
                        onClick={(event) => {
                            event.stopPropagation();
                            event.nativeEvent.preventDefault();
                            onDelete(review);
                        }}
                    />
                )}
            </Flex>
        </Link>
    );
};
export default ReviewSnippetItem;
