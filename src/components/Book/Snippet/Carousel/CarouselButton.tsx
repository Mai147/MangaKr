import { ButtonProps, IconButton, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import Slider from "react-slick";

interface CarouselButtonProps extends ButtonProps {
    slider: Slider | null;
    btnPos: "left" | "right";
    // btnType?:
    //     | "snippet"
    //     | "banner"
    //     | "librarySnippet"
    //     | "characterSnippet"
    //     | "grid";
    onNext?: () => Promise<void>;
    onPrev?: () => Promise<void>;
}

const CarouselButton: React.FC<CarouselButtonProps> = ({
    btnPos,
    slider,
    // btnType = "snippet",
    onNext,
    onPrev,
    ...rest
}) => {
    const top = useBreakpointValue({ base: "200%", md: "50%" });
    const side = useBreakpointValue({
        base: "35%",
        sm: "20px",
        md: "1rem",
    });
    return (
        <IconButton
            {...rest}
            aria-label={btnPos === "left" ? "left-arrow" : "right-arrow"}
            borderRadius="full"
            position="absolute"
            left={btnPos === "left" ? side : undefined}
            right={btnPos === "right" ? `calc(${side} + 0.5rem)` : undefined}
            top={top}
            transform={"translate(0%, -50%)"}
            zIndex={2}
            bg="gray.500"
            opacity="30%"
            _hover={{ bg: "brand.700", opacity: "100%" }}
            transition="opacity 0.3s, bg 0.3s"
            size={{ base: "sm", md: "md" }}
            onClick={async () => {
                if (btnPos === "left") {
                    onPrev && (await onPrev());
                    slider?.slickPrev();
                } else {
                    onNext && (await onNext());
                    slider?.slickNext();
                }
            }}
        >
            {btnPos === "left" ? <MdArrowBackIosNew /> : <MdArrowForwardIos />}
        </IconButton>
    );
};

export default CarouselButton;
