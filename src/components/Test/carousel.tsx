import React, { useState } from "react";
import {
    Box,
    Button,
    Flex,
    IconButton,
    useBreakpointValue,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
// And react-slick as our Carousel Lib
import Slider from "react-slick";
import BookSnippetItem from "../Book/Snippet/BookSnippetItem";
import { Book } from "@/models/Book";

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
    slidesToScroll: 2,
};

type Props = {
    books: Book[];
};

const Carousel: React.FC<Props> = ({ books }) => {
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
            slidesToShow: 3,
        },
        lg: {
            ...defaultSetting,
            slidesToShow: 4,
        },
    });

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
                bg="gray.100"
                opacity="30%"
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
                bg="gray.100"
                opacity="30%"
                _hover={{ bg: "brand.100", opacity: "100%" }}
                transition="all 0.3s"
                onClick={() => slider?.slickNext()}
            >
                <BiRightArrowAlt />
            </IconButton>
            {/* Slider */}
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
                {/* <Flex> */}
                {books.map((book) => (
                    <Box key={book.id}>
                        <Flex direction="column" align="center">
                            <Flex direction="column" w="95%">
                                <BookSnippetItem book={book} />
                                <Button mt={4}>Xóa</Button>
                            </Flex>
                        </Flex>
                    </Box>
                ))}
                {/* </Flex> */}
            </Slider>
        </Box>
    );
};

export default Carousel;
