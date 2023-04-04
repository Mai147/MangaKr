import Tag from "@/components/Tag";
import { routes } from "@/constants/routes";
import { Community, communityTypeList } from "@/models/Community";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    Link,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";

interface CommunitySnippetHorizontalBasicItemProps extends FlexProps {
    community: Community;
}

const CommunitySnippetHorizontalBasicItem: React.FC<
    CommunitySnippetHorizontalBasicItemProps
> = ({ community, ...rest }) => {
    return (
        <Link
            href={routes.getCommunityDetailPage(community.id!)}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                {...rest}
                p={2}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex>
                    <Avatar
                        src={community.imageUrl || "/images/noImage.jpg"}
                        size="md"
                    />
                    <Flex
                        align="flex-start"
                        direction="column"
                        justify="space-around"
                        ml={2}
                    >
                        <Text noOfLines={1} fontWeight={600} fontSize={14}>
                            {community.name}
                        </Text>
                        <Text
                            flexShrink={0}
                            fontSize={10}
                            fontStyle="italic"
                            color="brand.400"
                        >
                            {
                                communityTypeList.find(
                                    (type) =>
                                        type.value === community.privacyType
                                )?.label
                            }
                        </Text>
                    </Flex>
                </Flex>
            </Box>
        </Link>
    );
};
export default CommunitySnippetHorizontalBasicItem;
