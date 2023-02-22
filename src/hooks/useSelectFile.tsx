import { storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";

const useSelectFile = () => {
    const [selectedFile, setSelectedFile] = useState<string>();
    const [changed, setChanged] = useState(false);
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string);
            }
        };
        setChanged(true);
    };

    const onUploadFile = async (route: string) => {
        if (changed && selectedFile) {
            const imageRef = ref(storage, route);
            await uploadString(imageRef, selectedFile, "data_url");
            const downloadUrl = await getDownloadURL(imageRef);
            return downloadUrl;
        }
    };
    return {
        onSelectFile,
        selectedFile,
        setSelectedFile,
        onUploadFile,
    };
};

export default useSelectFile;
