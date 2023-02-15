import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

type EditorProps = {
    value?: string;
    onInit: (editor: any) => void;
};

const Editor: React.FC<EditorProps> = ({ value, onInit }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
            }}
            onInit={onInit}
        />
    );
};

export default Editor;
