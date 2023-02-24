import { Text, VStack } from "@chakra-ui/react";
import React from "react";

type LibrarySectionProps = {
    title: string;
    children: any;
};

const LibrarySection: React.FC<LibrarySectionProps> = ({ children, title }) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight={600} fontSize={24}>
                {title}
            </Text>
            {children}
        </VStack>
    );
};
export default LibrarySection;
