import { storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useState } from "react";
import { v4 } from "uuid";

const useSelectFile = () => {
    const [selectedFile, setSelectedFile] = useState<string>();
    const [selectedListFile, setSelectedListFile] = useState<string[]>([]);
    const [changed, setChanged] = useState(false);
    const [multipleChanged, setMultipleChanged] = useState(false);
    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                const url = readerEvent.target.result as string;
                setSelectedFile(url);
                setChanged(true);
            }
        };
    };

    const onSelectMultipleFile = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSelectedListFile([]);
        const files = event.target.files;
        const reader = new FileReader();
        const readFile = (index: number) => {
            if (index >= (files?.length || 0)) return;
            const file = files![index];
            reader.onload = (readerEvent) => {
                if (readerEvent.target?.result) {
                    const url = readerEvent.target.result as string;
                    setSelectedListFile((prev) => [...prev, url]);
                    setMultipleChanged(true);
                    readFile(index + 1);
                }
            };
            reader.readAsDataURL(file);
        };
        readFile(0);
    };

    const onUploadFile = async (route: string) => {
        if (changed && selectedFile) {
            const imageRef = ref(storage, route);
            await uploadString(imageRef, selectedFile, "data_url");
            const downloadUrl = await getDownloadURL(imageRef);
            return downloadUrl;
        }
    };

    const onUploadMultipleFile = async (route: string) => {
        let downloadUrls: string[] = [];
        if (multipleChanged && selectedListFile.length > 0) {
            for (const file of selectedListFile) {
                const imageRef = ref(storage, `${route}${v4()}`);
                await uploadString(imageRef, file, "data_url");
                const downloadUrl = await getDownloadURL(imageRef);
                downloadUrls.push(downloadUrl);
            }
        }
        return downloadUrls;
    };

    return {
        onSelectFile,
        onSelectMultipleFile,
        selectedFile,
        selectedListFile,
        setSelectedFile,
        setSelectedListFile,
        onUploadFile,
        onUploadMultipleFile,
    };
};

export default useSelectFile;
