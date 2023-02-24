import RatingBar from "@/components/RatingBar";
import Tag from "@/components/Tag";
import { Review } from "@/models/Review";
import {
    AspectRatio,
    Flex,
    Icon,
    IconButton,
    Image,
    Link,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

type ReviewSnippetItemProps = {
    review: Review;
    href?: string;
    onDelete?: (review: Review) => void;
};

const ReviewSnippetItem: React.FC<ReviewSnippetItemProps> = ({
    review,
    href,
    onDelete,
}) => {
    return (
        <Link
            _hover={{ textDecoration: "none" }}
            role="group"
            href={href}
            w="100%"
        >
            <Flex
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius={4}
                align="center"
                justify="space-between"
                _groupHover={{ bg: "gray.100" }}
                transition="all 0.5s"
                position="relative"
            >
                <Flex>
                    <AspectRatio ratio={4 / 3} w={"120px"} flexShrink={0}>
                        <Image src={review.imageUrl || "/images/noImage.jpg"} />
                    </AspectRatio>
                    <Flex
                        ml={8}
                        align="flex-start"
                        direction="column"
                        justify="space-between"
                    >
                        <Text fontSize={18} fontWeight={600} noOfLines={1}>
                            {review.title}
                        </Text>
                        <RatingBar rate={review.rating} maxRate={10} readonly />
                        <Tag label={review.tagReview} />
                    </Flex>
                </Flex>
                <Icon
                    as={MdOutlineArrowForwardIos}
                    fontSize={30}
                    color="brand.100"
                    opacity={0}
                    transform={"translateX(-10px)"}
                    _groupHover={{
                        opacity: "100%",
                        transform: "translateX(0)",
                    }}
                    transition={"all .3s ease"}
                />
                {onDelete && (
                    <IconButton
                        position="absolute"
                        top={-2}
                        right={-2}
                        size="sm"
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
