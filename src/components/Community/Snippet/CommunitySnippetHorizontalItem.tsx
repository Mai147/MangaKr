import Tag from "@/components/Tag";
import { BOOK_PAGE, COMMUNITY_PAGE } from "@/constants/routes";
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

interface CommunitySnippetHorizontalItemProps extends FlexProps {
    community: Community;
}

const CommunitySnippetHorizontalItem: React.FC<
    CommunitySnippetHorizontalItemProps
> = ({ community, ...rest }) => {
    return (
        <Link
            href={`${COMMUNITY_PAGE}/${community.id}`}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                {...rest}
                p={4}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex>
                    <Avatar
                        src={community.imageUrl || "/images/noImage.jpg"}
                        size="lg"
                    />
                    <VStack align="flex-start" ml={8}>
                        <Flex align="center">
                            <Text noOfLines={1} fontWeight={600}>
                                {community.name}
                            </Text>
                            <Text
                                flexShrink={0}
                                fontSize={12}
                                fontStyle="italic"
                                ml={2}
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
                        <Tag label={community.bookName} />
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default CommunitySnippetHorizontalItem;
