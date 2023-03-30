import { Box, Flex, Icon, IconButton, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiClose } from "react-icons/tfi";

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
        <Box
            bg="transparent"
            position="fixed"
            top={0}
            bottom={0}
            left={0}
            right={0}
            zIndex={999}
        >
            <Box
                w="100%"
                h="100%"
                bg="black"
                opacity={0.8}
                filter="auto"
                brightness={0.3}
                zIndex={999}
            ></Box>
            <Icon
                color="white"
                as={TfiClose}
                position="absolute"
                right={6}
                top={6}
                fontSize={24}
                cursor="pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    onHidden();
                }}
            />
            <Flex
                position="absolute"
                top="50%"
                left="50%"
                translateY="-50%"
                translateX="-50%"
                transform="auto"
                align="center"
                w="95%"
            >
                <IconButton
                    aria-label="Prev button"
                    bg="gray.600"
                    icon={<IoIosArrowBack />}
                    size="lg"
                    onClick={() =>
                        setSelectedIndex(
                            (prev) =>
                                (prev - 1 + imageList.length) % imageList.length
                        )
                    }
                />
                <Flex flexGrow={1} px={12} align="center" justify="center">
                    <Image src={imageList[selectedIndex]} maxH="90vh" />
                </Flex>
                <IconButton
                    aria-label="Next button"
                    bg="gray.500"
                    size="lg"
                    icon={<IoIosArrowForward />}
                    onClick={() =>
                        setSelectedIndex(
                            (prev) => (prev + 1) % imageList.length
                        )
                    }
                />
            </Flex>
        </Box>
    );
};
export default ImageShow;
