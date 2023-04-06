import { storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
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

export default FileUtils = {
    uploadFile,
    uploadMultipleFile,
};
