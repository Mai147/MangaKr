import ImageUpload from "@/components/Review/Form/ImageUpload";
import useBookCreate from "@/hooks/useBookCreate";
import useSelectFile from "@/hooks/useSelectFile";
import React, { useEffect } from "react";

type BookFormImageTabProps = {
    onSelectFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedFile?: string;
    setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const BookFormImageTab: React.FC<BookFormImageTabProps> = ({
    onSelectFile,
    setSelectedFile,
    selectedFile,
}) => {
    const { setBookForm } = useBookCreate();

    useEffect(() => {
        setBookForm((prev) => ({
            ...prev,
            imageUrl: selectedFile,
        }));
    }, [selectedFile]);

    return (
        <ImageUpload
            selectedFile={selectedFile}
            onSelectImage={onSelectFile}
            setSelectedFile={setSelectedFile}
        />
    );
};
export default BookFormImageTab;
