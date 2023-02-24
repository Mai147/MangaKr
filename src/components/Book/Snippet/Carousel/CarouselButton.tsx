import { IconButton, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import Slider from "react-slick";

type CarouselButtonProps = {
    slider: Slider | null;
    pos: "left" | "right";
    type?: "snippet" | "banner" | "librarySnippet";
};

const CarouselButton: React.FC<CarouselButtonProps> = ({
    pos,
    slider,
    type = "snippet",
}) => {
    const top = useBreakpointValue({ base: "80%", sm: "50%" });
    const side = useBreakpointValue({
        base: "35%",
        sm: "40px",
        md: "30px",
        // md: type === "snippet" ? "30px" : type === "banner" ? "40px" : "20px",
    });
    return (
        <IconButton
            aria-label={pos === "left" ? "left-arrow" : "right-arrow"}
            borderRadius="full"
            position="absolute"
            left={pos === "left" ? side : undefined}
            right={pos === "right" ? side : undefined}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            bg="gray.300"
            opacity="30%"
            _hover={{ bg: "brand.400", opacity: "100%" }}
            transition="all 0.3s"
            size={type === "snippet" ? "md" : "sm"}
            onClick={() =>
                pos === "left" ? slider?.slickPrev() : slider?.slickNext()
            }
        >
            {pos === "left" ? <BiLeftArrowAlt /> : <BiRightArrowAlt />}
        </IconButton>
    );
};

export default CarouselButton;
