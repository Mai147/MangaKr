import { Box, Flex, Icon, ResponsiveValue } from "@chakra-ui/react";
import React, { ReactNode, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";

type OverlayProps = {
    children: ReactNode;
    onHidden: () => void;
    contentWidth: ResponsiveValue<string>;
};

const Overlay: React.FC<OverlayProps> = ({
    children,
    onHidden,
    contentWidth,
}) => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);
    return (
        <Box
            bg="transparent"
            position="fixed"
            top={0}
            bottom={0}
            left={0}
            right={0}
            zIndex={1000}
        >
            <Box
                onClick={(e) => {
                    e.stopPropagation();
                    onHidden();
                }}
                w="100%"
                h="100%"
                bg="black"
                opacity={0.8}
                filter="auto"
                brightness={0.3}
                zIndex={1000}
            />
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
                w={contentWidth}
                onClick={(e) => {
                    e.stopPropagation();
                    onHidden();
                }}
            >
                {children}
            </Flex>
        </Box>
    );
};
export default Overlay;
