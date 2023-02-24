import React, { useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";
import CarouselButton from "./CarouselButton";
import { carouselSetting } from "@/constants/carouselSetting";

type Props = {
    children: any;
    length: number;
    type?: "snippet" | "banner" | "librarySnippet";
    autoplay?: boolean;
};

const BookCarousel: React.FC<Props> = ({
    children,
    length,
    type = "snippet",
    autoplay = false,
}) => {
    const {
        defaultSetting,
        bannerMd,
        bookSnippetSm,
        bookSnippetLg,
        bookSnippetLibraryLg,
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
            : useBreakpointValue({
                  base: defaultSetting.slidesToShow,
                  lg: bookSnippetLibraryLg.slidesToShow,
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
            : useBreakpointValue({
                  base: { ...defaultSetting, autoplay },
                  lg: { ...bookSnippetLibraryLg, autoplay },
              });
    return (
        <>
            {slidesToShow! >= length ? (
                <Flex w={"full"}>
                    {children.map((child: any) => (
                        <Box
                            w={{
                                base: "100%",
                                sm: `${100 / bookSnippetSm.slidesToShow}%`,
                                lg: `${
                                    100 /
                                    (type === "snippet"
                                        ? bookSnippetLg.slidesToShow
                                        : bookSnippetLibraryLg.slidesToShow)
                                }%`,
                            }}
                            key={child.key}
                        >
                            <Box>{child}</Box>
                        </Box>
                    ))}
                </Flex>
            ) : (
                <Box position={"relative"} width={"full"} overflow={"hidden"}>
                    <CarouselButton slider={slider} pos="left" type={type} />
                    <CarouselButton slider={slider} pos="right" type={type} />
                    <Slider {...settings} ref={(slider) => setSlider(slider)}>
                        {children}
                    </Slider>
                </Box>
            )}
        </>
    );
};

export default BookCarousel;
