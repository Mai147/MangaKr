import ImageUpload from "@/components/Review/Form/ImageUpload";
import useSelectFile from "@/hooks/useSelectFile";
import React from "react";

type BookFormImageTabProps = {};

const BookFormImageTab: React.FC<BookFormImageTabProps> = () => {
    const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
    return (
        <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
        />
    );
};
export default BookFormImageTab;
