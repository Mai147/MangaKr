import {
    Button,
    Flex,
    Grid,
    GridItem,
    Image,
    Stack,
    Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import ImageShow from "./ImageShow";

type ImageMultipleUploadProps = {
    selectedListFile?: string[];
    onSelectMultipleFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedListFile: (value: string[]) => void;
};

const ImageMultipleUpload: React.FC<ImageMultipleUploadProps> = ({
    onSelectMultipleFile,
    setSelectedListFile,
    selectedListFile,
}) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const [showImageList, setShowImageList] = useState(false);

    return (
        <Flex
            justify="center"
            align="center"
            width="100%"
            flexGrow={1}
            direction="column"
        >
            {showImageList &&
                selectedListFile &&
                selectedListFile.length > 0 && (
                    <ImageShow
                        imageList={selectedListFile}
                        onHidden={() => {
                            setShowImageList(false);
                        }}
                    />
                )}
            {selectedListFile && selectedListFile.length > 0 ? (
                <Flex direction="column" align="center" justify="center">
                    <Grid templateColumns={"repeat(5, 1fr)"} gap={1}>
                        {selectedListFile.map((url, idx) =>
                            idx < 4 ? (
                                <GridItem h="200px" key={url}>
                                    <Image
                                        src={url}
                                        h="100%"
                                        w="100%"
                                        borderRadius={4}
                                        objectFit="cover"
                                    />
                                </GridItem>
                            ) : (
                                <></>
                            )
                        )}
                        {selectedListFile.length > 4 && (
                            <GridItem
                                h="200px"
                                position="relative"
                                cursor="pointer"
                                onClick={() => setShowImageList(true)}
                            >
                                <Image
                                    src={selectedListFile[4]}
                                    h="100%"
                                    borderRadius={4}
                                    filter="auto"
                                    brightness={0.4}
                                />
                                <Text
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    translateX="-50%"
                                    translateY="-50%"
                                    transform="auto"
                                    fontSize={32}
                                    color="white"
                                >
                                    +{selectedListFile.length - 4}
                                </Text>
                            </GridItem>
                        )}
                    </Grid>
                    <Flex justify="center">
                        <Stack direction="row" mt={4}>
                            <Button
                                height={10}
                                w={28}
                                variant="outline"
                                onClick={() => setSelectedListFile([])}
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
                    // p={20}
                    flexGrow={1}
                    border="1px dashed"
                    borderColor="gray.400"
                    borderRadius={4}
                    width="100%"
                >
                    <Button
                        variant="outline"
                        height={10}
                        w={28}
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
                        onChange={onSelectMultipleFile}
                        accept="image/*"
                        multiple
                    />
                </Flex>
            )}
        </Flex>
    );
};
export default ImageMultipleUpload;
