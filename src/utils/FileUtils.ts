import { storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 } from "uuid";

let FileUtils = {};

const uploadFile = async ({
    imageRoute,
    imageUrl,
}: {
    imageRoute: string;
    imageUrl?: string;
}) => {
    if (!imageUrl) {
        return;
    }
    const imageRef = ref(storage, imageRoute);
    await uploadString(imageRef, imageUrl, "data_url");
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
};

const uploadMulitpleFile = async ({
    imageUrls,
    imagesRoute,
}: {
    imagesRoute: string;
    imageUrls: string[];
}) => {
    let downloadUrls: string[] = [];
    for (const file of imageUrls) {
        const imageRef = ref(storage, `${imagesRoute}${v4()}`);
        await uploadString(imageRef, file, "data_url");
        const downloadUrl = await getDownloadURL(imageRef);
        downloadUrls.push(downloadUrl);
    }
    return downloadUrls;
};

export default FileUtils = {
    uploadFile,
    uploadMulitpleFile,
};
