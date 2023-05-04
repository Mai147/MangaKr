import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
    children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
    return (
        <Flex
            align="center"
            p={{ base: 0, md: 4 }}
            py={{ base: 0, md: 4 }}
            flexDirection="column"
            flexGrow={1}
        >
            <Flex width="100%" justify="center" flexGrow={1}>
                <Flex
                    direction="column"
                    maxW={{ base: "100%", lg: "75%" }}
                    flexGrow={1}
                >
                    {children && children[0]}
                </Flex>
                <Flex
                    direction="column"
                    display={{ base: "none", lg: "flex" }}
                    width={{ base: "0", lg: "25%" }}
                    flexShrink={0}
                    position="sticky"
                    top={24}
                    alignSelf="flex-start"
                    ml={{ base: 0, lg: 6 }}
                >
                    {children && children[1]}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PageContent;
