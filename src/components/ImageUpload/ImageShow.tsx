import { Flex, IconButton, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Overlay from "../Overlay";

type ImageShowProps = {
    imageList: string[];
    onHidden: () => void;
};

const ImageShow: React.FC<ImageShowProps> = ({ imageList, onHidden }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.key) {
            case "ArrowLeft":
                setSelectedIndex(
                    (prev) => (prev - 1 + imageList.length) % imageList.length
                );
                break;
            case "ArrowRight":
                setSelectedIndex((prev) => (prev + 1) % imageList.length);
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);

        return () => window.removeEventListener("keyup", handleKeyUp);
    }, []);

    return (
        <Overlay onHidden={onHidden} contentWidth="95%">
            <>
                {imageList.length > 1 && (
                    <IconButton
                        aria-label="Prev button"
                        bg="gray.600"
                        icon={<IoIosArrowBack />}
                        size="lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(
                                (prev) =>
                                    (prev - 1 + imageList.length) %
                                    imageList.length
                            );
                        }}
                    />
                )}
                <Flex flexGrow={1} px={12} align="center" justify="center">
                    <Image
                        src={imageList[selectedIndex]}
                        maxH="90vh"
                        cursor="default"
                        onClick={(e) => e.stopPropagation()}
                    />
                </Flex>
                {imageList.length > 1 && (
                    <IconButton
                        aria-label="Next button"
                        bg="gray.500"
                        size="lg"
                        icon={<IoIosArrowForward />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(
                                (prev) => (prev + 1) % imageList.length
                            );
                        }}
                    />
                )}
            </>
        </Overlay>
    );
};
export default ImageShow;
