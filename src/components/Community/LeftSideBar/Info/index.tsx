import useCommunity from "@/hooks/useCommunity";
import {
    Flex,
    Icon,
    IconButton,
    Input,
    Text,
    Textarea,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineCheck } from "react-icons/ai";

type CommunityLeftSideBarInfoProps = {
    canEdit?: boolean;
};

const CommunityLeftSideBarInfo: React.FC<CommunityLeftSideBarInfoProps> = ({
    canEdit,
}) => {
    const { communityState, communityAction } = useCommunity();
    const [isUpdateName, setIsUpdateName] = useState(false);
    const [updateNameLoading, setUpdateNameLoading] = useState(false);
    const [name, setName] = useState("");
    const [isUpdateDescription, setIsUpdateDescription] = useState(false);
    const [updateDescriptionLoading, setUpdateDescriptionLoading] =
        useState(false);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setName(communityState.selectedCommunity?.name || "");
    }, [
        communityState.selectedCommunity &&
            communityState.selectedCommunity.name,
    ]);

    useEffect(() => {
        setDescription(communityState.selectedCommunity?.description || "");
    }, [
        communityState.selectedCommunity &&
            communityState.selectedCommunity.description,
    ]);

    return (
        <>
            <Flex align="flex-end" mt={4} mb={2}>
                {!isUpdateName ? (
                    <Text fontSize={20} fontWeight={500} lineHeight={1}>
                        {communityState.selectedCommunity?.name}
                    </Text>
                ) : (
                    <Input
                        value={name}
                        autoFocus
                        onChange={(e) => setName(e.target.value)}
                        onBlur={(e) => {
                            const item = e.nativeEvent
                                .relatedTarget as HTMLElement;
                            if (
                                item &&
                                item.getAttribute("aria-label") ===
                                    "update-name-button"
                            ) {
                                e.preventDefault();
                            } else {
                                setIsUpdateName(false);
                            }
                        }}
                    />
                )}
                {canEdit &&
                    (!isUpdateName ? (
                        <Icon
                            as={AiFillEdit}
                            ml={2}
                            cursor="pointer"
                            onClick={() => setIsUpdateName(true)}
                        />
                    ) : (
                        <IconButton
                            alignSelf="center"
                            ml={2}
                            aria-label="update-name-button"
                            size={"xs"}
                            bg="green.300"
                            fontSize={14}
                            _hover={{
                                bg: "green.400",
                            }}
                            icon={<AiOutlineCheck />}
                            isLoading={updateNameLoading}
                            onClick={async () => {
                                if (name) {
                                    setUpdateNameLoading(true);
                                    await communityAction.updateCommunityName(
                                        name
                                    );
                                    setUpdateNameLoading(false);
                                    setIsUpdateName(false);
                                }
                            }}
                        />
                    ))}
            </Flex>
            {communityState.selectedCommunity?.createdAt?.seconds && (
                <Text>
                    {moment(
                        new Date(
                            communityState.selectedCommunity?.createdAt
                                ?.seconds * 1000
                        )
                    ).format("DD/MM/YYYY")}
                </Text>
            )}
            <Text fontSize={14}>
                {communityState.selectedCommunity?.numberOfMembers} thành viên
            </Text>
            <Text color="gray.300">----------</Text>
            {!isUpdateDescription ? (
                <Text align="center">
                    {communityState.selectedCommunity?.description}
                </Text>
            ) : (
                <Textarea
                    mb={2}
                    value={description}
                    resize={"none"}
                    h={"250px"}
                    autoFocus
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={(e) => {
                        const item = e.nativeEvent.relatedTarget as HTMLElement;
                        if (
                            item &&
                            item.getAttribute("aria-label") ===
                                "update-description-button"
                        ) {
                            e.preventDefault();
                        } else {
                            setIsUpdateDescription(false);
                        }
                    }}
                />
            )}
            {canEdit &&
                (!isUpdateDescription ? (
                    <Icon
                        as={AiFillEdit}
                        ml={2}
                        cursor="pointer"
                        onClick={() => setIsUpdateDescription(true)}
                    />
                ) : (
                    <IconButton
                        alignSelf="center"
                        ml={2}
                        aria-label="update-description-button"
                        size={"xs"}
                        bg="green.300"
                        fontSize={14}
                        _hover={{
                            bg: "green.400",
                        }}
                        icon={<AiOutlineCheck />}
                        isLoading={updateDescriptionLoading}
                        onClick={async () => {
                            if (name) {
                                setUpdateDescriptionLoading(true);
                                await communityAction.updateCommunityDescription(
                                    description
                                );
                                setUpdateDescriptionLoading(false);
                                setIsUpdateDescription(false);
                            }
                        }}
                    />
                ))}
        </>
    );
};
export default CommunityLeftSideBarInfo;
