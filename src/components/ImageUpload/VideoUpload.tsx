import { Button, Flex, Stack } from "@chakra-ui/react";
import React, { useRef } from "react";

type VideoUploadProps = {
    selectedFile?: string;
    onSelectVideo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedFile: (value: string) => void;
};

const VideoUpload: React.FC<VideoUploadProps> = ({
    selectedFile,
    onSelectVideo,
    setSelectedFile,
}) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    return (
        <Flex justify="center" align="center" width="100%" direction="column">
            {selectedFile ? (
                <Flex direction="column" align="center" justify="center">
                    <video
                        src={selectedFile}
                        width="800px"
                        height="600px"
                        controls
                    />
                    <Flex justify="center">
                        <Stack direction="row" mt={4}>
                            <Button
                                height={10}
                                w={28}
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
                        onChange={onSelectVideo}
                        accept="video/mp4,video/x-m4v,video/*"
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default VideoUpload;
