import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    IconButton,
    useBreakpointValue,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";
import BookSnippetItem from "../Book/Snippet/BookSnippetItem";
import { Book } from "@/models/Book";
import { getEditBookReviewPage } from "@/constants/routes";
import reviews from "@/pages/books/reviews";
import ReviewSnippetItem from "../Review/Snippet/ReviewSnippetItem";
import { Review } from "@/models/Review";

// Settings for the slider

type Settings = {
    arrows: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
};

const defaultSetting: Settings = {
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

type Props = {
    reviews: Review[];
};

const Carousel: React.FC<Props> = ({ reviews }) => {
    // As we have used custom buttons, we need a reference variable to
    // change the state

    const [slider, setSlider] = React.useState<Slider | null>(null);

    // These are the breakpoints which changes the position of the
    // buttons as the screen size changes
    const top = useBreakpointValue({ base: "90%", sm: "50%" });
    const side = useBreakpointValue({ base: "30%", sm: "40px", md: "30px" });
    const settings = useBreakpointValue({
        base: defaultSetting,
        sm: {
            ...defaultSetting,
            slidesToShow: 1,
        },
        lg: {
            ...defaultSetting,
            slidesToShow: 1,
        },
    });

    const getReviewGroup = () => {
        let reviewGroup = [];
        let reviewFourthGroup: Review[] = [];
        reviews.forEach((review, idx) => {
            if (idx % 4 === 0) {
                if (reviewFourthGroup.length > 0) {
                    reviewGroup.push(reviewFourthGroup);
                }
                reviewFourthGroup = [];
            }
            reviewFourthGroup.push(review);
        });
        if (reviewFourthGroup.length > 0) {
            reviewGroup.push(reviewFourthGroup);
        }
        return reviewGroup;
    };

    return (
        <Box position={"relative"} width={"full"} overflow={"hidden"}>
            {/* CSS files for react-slick */}
            <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
            />
            {/* Left Icon */}
            <IconButton
                aria-label="left-arrow"
                borderRadius="full"
                position="absolute"
                left={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                bg="gray.700"
                opacity="70%"
                _hover={{ bg: "brand.100", opacity: "100%" }}
                transition="all 0.3s"
                onClick={() => slider?.slickPrev()}
            >
                <BiLeftArrowAlt />
            </IconButton>
            {/* Right Icon */}
            <IconButton
                aria-label="right-arrow"
                borderRadius="full"
                position="absolute"
                right={side}
                top={top}
                transform={"translate(0%, -50%)"}
                zIndex={2}
                bg="gray.700"
                opacity="70%"
                _hover={{ bg: "brand.100", opacity: "100%" }}
                transition="all 0.3s"
                onClick={() => slider?.slickNext()}
            >
                <BiRightArrowAlt />
            </IconButton>
            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {/* <Flex> */}
                {/* <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%"> */}
                {getReviewGroup().map((reviewGroup) => (
                    <Box>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            {reviewGroup.map((review) => (
                                <ReviewSnippetItem
                                    review={review}
                                    href={getEditBookReviewPage(
                                        review.bookId,
                                        review.id!
                                    )}
                                />
                            ))}
                        </Grid>
                    </Box>
                ))}
                {/* </Grid> */}
                {/* </Flex> */}
            </Slider>
        </Box>
    );
};

export default Carousel;
