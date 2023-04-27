import { storage } from "@/firebase/clientApp";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";

const useSelectVideo = () => {
    const [selectedVideo, setSelectedVideo] = useState<string>();
    const [changed, setChanged] = useState(false);
    const onSelectVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const url = URL.createObjectURL(event.target.files[0]);
            setSelectedVideo(url);
            setChanged(true);
        }
    };
    const onUploadVideo = async (route: string) => {
        if (changed && selectedVideo) {
            let blob = await fetch(selectedVideo).then((r) => r.blob());
            const videoRef = ref(storage, route);
            await uploadBytes(videoRef, blob);
            const downloadUrl = await getDownloadURL(videoRef);
            return downloadUrl;
        }
    };

    return {
        onSelectVideo,
        selectedVideo,
        setSelectedVideo,
        onUploadVideo,
    };
};

export default useSelectVideo;
