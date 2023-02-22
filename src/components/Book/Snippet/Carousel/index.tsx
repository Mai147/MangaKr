import React, { useState } from "react";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Slider from "react-slick";
import CarouselButton from "./CarouselButton";
import { carouselSetting } from "@/constants/carouselSetting";

type Props = {
    children: any;
    length: number;
    type?: "snippet" | "banner";
};

const BookCarousel: React.FC<Props> = ({
    children,
    length,
    type = "snippet",
}) => {
    const { defaultSetting, bannerMd, bookSnippetSm, bookSnippetLg } =
        carouselSetting;
    const [slider, setSlider] = useState<Slider | null>(null);

    const slidesToShow =
        type === "snippet"
            ? useBreakpointValue({
                  base: defaultSetting.slidesToShow,
                  sm: bookSnippetSm.slidesToShow,
                  lg: bookSnippetLg.slidesToShow,
              })
            : useBreakpointValue({
                  base: defaultSetting,
                  md: bannerMd.slidesToShow,
              });

    const settings =
        type === "snippet"
            ? useBreakpointValue({
                  base: defaultSetting,
                  sm: bookSnippetSm,
                  lg: bookSnippetLg,
              })
            : useBreakpointValue({
                  base: defaultSetting,
                  md: bannerMd,
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
                                lg: `${100 / bookSnippetLg.slidesToShow}%`,
                            }}
                            key={child.key}
                        >
                            <Box maxW="250px">{child}</Box>
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
