import React, { ReactNode, useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";
import CarouselButton from "./CarouselButton";
import { carouselSetting } from "@/constants/carouselSetting";

type Props = {
    children: any;
    length: number;
    type?:
        | "snippet"
        | "banner"
        | "librarySnippet"
        | "characterSnippet"
        | "grid";
    autoplay?: boolean;
    onPrev?: () => Promise<void>;
    onNext?: () => Promise<void>;
};

const BookCarousel: React.FC<Props> = ({
    children,
    length,
    type = "snippet",
    autoplay = false,
    onNext,
    onPrev,
}) => {
    const {
        defaultSetting,
        bannerMd,
        bookSnippetSm,
        bookSnippetLg,
        bookSnippetLibraryLg,
        characterSnippetLg,
        characterSnippetSm,
        characterSnippetBase,
    } = carouselSetting;
    const [slider, setSlider] = useState<Slider | null>(null);

    const slidesToShow =
        type === "snippet"
            ? useBreakpointValue({
                  base: defaultSetting.slidesToShow,
                  sm: bookSnippetSm.slidesToShow,
                  lg: bookSnippetLg.slidesToShow,
              })
            : type === "banner"
            ? useBreakpointValue({
                  base: defaultSetting,
                  md: bannerMd.slidesToShow,
              })
            : type === "characterSnippet"
            ? useBreakpointValue({
                  base: characterSnippetBase.slidesToShow,
                  sm: characterSnippetSm.slidesToShow,
                  lg: characterSnippetLg.slidesToShow,
              })
            : type === "librarySnippet"
            ? useBreakpointValue({
                  base: defaultSetting.slidesToShow,
                  lg: bookSnippetLibraryLg.slidesToShow,
              })
            : useBreakpointValue({
                  base: defaultSetting.slidesToShow,
              });

    const settings =
        type === "snippet"
            ? useBreakpointValue({
                  base: { ...defaultSetting, autoplay },
                  sm: { ...bookSnippetSm, autoplay },
                  lg: { ...bookSnippetLg, autoplay },
              })
            : type === "banner"
            ? useBreakpointValue({
                  base: { ...defaultSetting, autoplay },
                  md: { ...bannerMd, autoplay },
              })
            : type === "characterSnippet"
            ? useBreakpointValue({
                  base: { ...characterSnippetBase, autoplay },
                  sm: { ...characterSnippetSm, autoplay },
                  lg: { ...characterSnippetLg, autoplay },
              })
            : type === "librarySnippet"
            ? useBreakpointValue({
                  base: { ...defaultSetting, autoplay },
                  lg: { ...bookSnippetLibraryLg, autoplay },
              })
            : useBreakpointValue({ base: { ...defaultSetting, autoplay } });

    return (
        <>
            {slidesToShow! >= length ? (
                <Flex w={"full"} align="stretch">
                    {children.map((child: any) => (
                        <Box
                            w={
                                type === "banner"
                                    ? "100%"
                                    : `${100 / (slidesToShow as number)}%`
                            }
                            px={2}
                            _first={{ ml: -2 }}
                            py={2}
                            key={child.key}
                        >
                            <Box h="100%">{child}</Box>
                        </Box>
                    ))}
                </Flex>
            ) : (
                <Box
                    position={"relative"}
                    width={"full"}
                    overflow={"hidden"}
                    role="group"
                    height="inherit"
                >
                    <CarouselButton
                        slider={slider}
                        btnPos="left"
                        // type={type}
                        onNext={onNext}
                        onPrev={onPrev}
                        display="none"
                        _groupHover={{ display: "flex" }}
                        transition="all 0.5s"
                    />
                    <CarouselButton
                        slider={slider}
                        btnPos="right"
                        // type={type}
                        onNext={onNext}
                        onPrev={onPrev}
                        display="none"
                        _groupHover={{ display: "flex" }}
                        transition="all 0.5s"
                    />
                    <Slider {...settings} ref={(slider) => setSlider(slider)}>
                        {children.map((child: any) => (
                            <Box key={child.key} py={2} height="inherit">
                                {child}
                            </Box>
                        ))}
                    </Slider>
                </Box>
            )}
        </>
    );
};

export default BookCarousel;
