import InputText from "@/components/Input/InputText";
import useSelectFile from "@/hooks/useSelectFile";
import { VotingOption } from "@/models/Vote";
import { Box, Button, Flex, Icon, Image, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { RiImageAddLine } from "react-icons/ri";

type VotingOptionItemProps = {
    votingOption: VotingOption;
    setVotingOption: (
        callback: (prevOption: VotingOption) => VotingOption
    ) => void;
    onDelete: () => void;
};

const VotingOptionItem: React.FC<VotingOptionItemProps> = ({
    votingOption,
    setVotingOption,
    onDelete,
}) => {
    const imageRef = useRef<HTMLInputElement>(null);
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();

    useEffect(() => {
        setVotingOption((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

    return (
        <Flex
            w="100%"
            p={6}
            boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
            borderRadius={8}
        >
            <VStack w="100%" spacing={4}>
                <Flex w="100%" direction={{ base: "column", md: "row" }}>
                    {votingOption.imageUrl ? (
                        <Flex direction="column" w="100%">
                            <Image
                                src={votingOption.imageUrl}
                                maxW={{ base: "100%", md: "200px" }}
                                w="100%"
                                h="150px"
                                objectFit="cover"
                                borderRadius={8}
                            />
                            <Button
                                mt={4}
                                variant="outline"
                                onClick={() => setSelectedFile(undefined)}
                            >
                                Xóa
                            </Button>
                        </Flex>
                    ) : (
                        <Box
                            p={6}
                            borderRadius={8}
                            border="1px solid"
                            borderColor="gray.400"
                            textAlign="center"
                            flexShrink={0}
                            cursor="pointer"
                            onClick={() => {
                                imageRef.current?.click();
                            }}
                        >
                            <Icon as={RiImageAddLine} fontSize={30}></Icon>
                            <Text fontWeight={500}>Thêm hình ảnh</Text>
                            <input
                                type="file"
                                hidden
                                ref={imageRef}
                                onChange={onSelectFile}
                                accept="image/*"
                            />
                        </Box>
                    )}
                    <InputText
                        onInputChange={(e) =>
                            setVotingOption((prev) => ({
                                ...prev,
                                value: e.target.value,
                            }))
                        }
                        isMultipleLine
                        height="100%"
                        placeholder="Nội dung lựa chọn..."
                        value={votingOption.value}
                        ml={{ base: 0, md: 4 }}
                        mt={{ base: 4, md: 0 }}
                    />
                </Flex>
                <Button
                    variant="outline"
                    alignSelf="flex-end"
                    w="28"
                    onClick={onDelete}
                >
                    Xóa
                </Button>
            </VStack>
        </Flex>
    );
};
export default VotingOptionItem;
