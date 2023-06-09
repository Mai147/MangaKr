import Tag from "@/components/Tag";
import { routes } from "@/constants/routes";
import { Community, communityTypeList } from "@/models/Community";
import {
    Avatar,
    Box,
    Flex,
    FlexProps,
    HStack,
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
            href={routes.getCommunityDetailPage(community.id!)}
            _hover={{ textDecoration: "none" }}
        >
            <Box
                {...rest}
                p={{ base: 2, sm: 4 }}
                boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                borderRadius={4}
                bg="white"
                _hover={{ bg: "gray.50" }}
                transition="all 0.5s"
            >
                <Flex align="center">
                    <Avatar
                        src={community.imageUrl || "/images/noImage.jpg"}
                        size={{ base: "md", sm: "lg", md: "xl" }}
                    />
                    <VStack
                        align="flex-start"
                        ml={{ base: 4, sm: 6, md: 8 }}
                        lineHeight={1}
                    >
                        <HStack align="flex-end">
                            <Text noOfLines={1} fontWeight={600}>
                                {community.name}
                            </Text>
                            <Text
                                flexShrink={0}
                                fontSize={12}
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
                        </HStack>
                        <Text color="gray.500" fontSize={14}>
                            {community.numberOfMembers} thành viên
                        </Text>
                        <Tag label={community.bookName} />
                    </VStack>
                </Flex>
            </Box>
        </Link>
    );
};
export default CommunitySnippetHorizontalItem;
