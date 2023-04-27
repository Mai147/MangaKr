import { storage } from "@/firebase/clientApp";
import {
    getDownloadURL,
    ref,
    uploadBytes,
    uploadString,
} from "firebase/storage";
import { v4 } from "uuid";
import { getFileExtensionFromBase64 } from "./StringUtils";

let FileUtils = {};

const uploadFile = async ({
    imageRoute,
    imageUrl,
}: {
    imageRoute: string;
    imageUrl?: string | null;
}) => {
    if (!imageUrl) {
        return;
    }
    const extension = getFileExtensionFromBase64(imageUrl);
    const path = `${imageRoute}${v4()}.${extension}`;
    const imageRef = ref(storage, path);
    await uploadString(imageRef, imageUrl, "data_url");
    const downloadUrl = await getDownloadURL(imageRef);
    return {
        downloadUrl,
        downloadRef: path,
    };
};

const uploadMultipleFile = async ({
    imageUrls,
    imagesRoute,
}: {
    imagesRoute: string;
    imageUrls: string[];
}) => {
    try {
        let downloadUrls: string[] = [];
        let downloadRefs: string[] = [];
        for (const file of imageUrls) {
            const extension = getFileExtensionFromBase64(file);
            const path = `${imagesRoute}${v4()}.${extension}`;
            const imageRef = ref(storage, path);
            await uploadString(imageRef, file, "data_url");
            const downloadUrl = await getDownloadURL(imageRef);
            downloadUrls.push(downloadUrl);
            downloadRefs.push(path);
        }
        return {
            downloadUrls,
            downloadRefs,
        };
    } catch (error) {
        console.log(error);
    }
};

const uploadVideo = async ({
    videoRoute,
    videoUrl,
}: {
    videoRoute: string;
    videoUrl?: string | null;
}) => {
    if (!videoUrl) {
        return;
    }
    let blob = await fetch(videoUrl).then((r) => r.blob());
    const path = `${videoRoute}${v4()}.mp4`;
    const videoRef = ref(storage, path);
    await uploadBytes(videoRef, blob);
    const downloadUrl = await getDownloadURL(videoRef);
    return {
        downloadUrl,
        downloadRef: path,
    };
};

export default FileUtils = {
    uploadFile,
    uploadMultipleFile,
    uploadVideo,
};
