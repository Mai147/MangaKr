import useCommunity from "@/hooks/useCommunity";
import useSelectFile from "@/hooks/useSelectFile";
import { Flex, Avatar, Icon, IconButton } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { AiFillEdit, AiOutlineCheck } from "react-icons/ai";

type CommunityLeftSideBarImageProps = {
    canEdit?: boolean;
};

const CommunityLeftSideBarImage: React.FC<CommunityLeftSideBarImageProps> = ({
    canEdit,
}) => {
    const imageRef = useRef<HTMLInputElement>(null);
    const { communityState, communityAction } = useCommunity();
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
    const [updateImageLoading, setUpdateImageLoading] = useState(false);
    const [isUpdateImage, setIsUpdateImage] = useState(false);

    useEffect(() => {
        if (communityState.selectedCommunity?.imageUrl) {
            setSelectedFile(communityState.selectedCommunity.imageUrl);
        }
    }, [
        communityState.selectedCommunity &&
            communityState.selectedCommunity.imageUrl,
    ]);

    return (
        <>
            <Flex
                position="relative"
                cursor={canEdit ? "pointer" : "default"}
                onClick={() => {
                    setIsUpdateImage(true);
                    imageRef.current?.click();
                }}
            >
                <Avatar
                    src={selectedFile || "/images/noImage.jpg"}
                    size={"lg"}
                />
                {canEdit && (
                    <>
                        <Flex
                            w="6"
                            h="6"
                            fontSize={12}
                            borderRadius="50%"
                            bg="gray.700"
                            border="3px solid white"
                            position="absolute"
                            bottom={-2}
                            left="50%"
                            translateX={"-50%"}
                            transform={"auto"}
                            align="center"
                            justify="center"
                        >
                            <Icon as={AiFillEdit} color="white" />
                        </Flex>
                        <input
                            type="file"
                            hidden
                            ref={imageRef}
                            onChange={onSelectFile}
                            accept="image/*"
                        />
                    </>
                )}
            </Flex>
            {canEdit && selectedFile && isUpdateImage && (
                <IconButton
                    mt={4}
                    aria-label="update-image-button"
                    size={"sm"}
                    bg="green.300"
                    fontSize={18}
                    _hover={{
                        bg: "green.400",
                    }}
                    icon={<AiOutlineCheck />}
                    isLoading={updateImageLoading}
                    onClick={async () => {
                        setUpdateImageLoading(true);
                        await communityAction.updateCommunityImage(
                            selectedFile
                        );
                        setUpdateImageLoading(false);
                        setIsUpdateImage(false);
                    }}
                />
            )}
        </>
    );
};
export default CommunityLeftSideBarImage;
