import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
    selectedFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedFile: (value: string) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
    selectedFile,
    onSelectImage,
    setSelectedFile,
}) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    return (
        <Flex justify="center" align="center" width="100%">
            {selectedFile ? (
                <Flex direction="column" align="center" justify="center">
                    <Image
                        src={selectedFile}
                        maxWidth="400px"
                        maxHeight="400px"
                    />
                    <Flex justify="center">
                        <Stack direction="row" mt={4}>
                            <Button
                                height="28px"
                                variant="outline"
                                onClick={() => setSelectedFile("")}
                            >
                                Xóa
                            </Button>
                        </Stack>
                    </Flex>
                </Flex>
            ) : (
                <Flex
                    justify="center"
                    align="center"
                    p={20}
                    border="1px dashed"
                    borderColor="gray.400"
                    borderRadius={4}
                    width="100%"
                >
                    <Button
                        variant="outline"
                        height="28px"
                        onClick={() => {
                            selectedFileRef.current?.click();
                        }}
                    >
                        Tải lên
                    </Button>
                    <input
                        type="file"
                        hidden
                        ref={selectedFileRef}
                        onChange={onSelectImage}
                        accept="image/*"
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default ImageUpload;
