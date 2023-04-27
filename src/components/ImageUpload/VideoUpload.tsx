import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import React, { useRef, useState } from "react";

type VideoUploadProps = {
    selectedFile?: string;
    onSelectVideo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedFile: (value: string) => void;
    onUpload: () => Promise<void>;
};

const VideoUpload: React.FC<VideoUploadProps> = ({
    selectedFile,
    onSelectVideo,
    setSelectedFile,
    onUpload,
}) => {
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    return (
        <Flex justify="center" align="center" width="100%">
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
                                height="28px"
                                variant="outline"
                                onClick={() => setSelectedFile("")}
                            >
                                Xóa
                            </Button>
                            <Button
                                height="28px"
                                variant="outline"
                                isLoading={loading}
                                onClick={async () => {
                                    setLoading(true);
                                    const x = await onUpload();

                                    setLoading(false);
                                }}
                            >
                                Upload
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
                        onChange={onSelectVideo}
                        accept="video/mp4,video/x-m4v,video/*"
                    />
                </Flex>
            )}
        </Flex>
    );
};

export default VideoUpload;
