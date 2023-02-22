import { Box, Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
    children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
    return (
        <Flex justify="center" p="16px 0px">
            <Flex width="100%" justify="center">
                <Flex
                    direction="column"
                    maxW={{ base: "100%", md: "75%" }}
                    flexGrow={1}
                    mr={{ base: 0, md: 6 }}
                >
                    {children && children[0]}
                </Flex>
                <Flex
                    direction="column"
                    display={{ base: "none", md: "flex" }}
                    width={{ base: "0", md: "25%" }}
                    flexShrink={0}
                >
                    {children && children[1]}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PageContent;
