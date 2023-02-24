import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import React from "react";

type EditorProps = {
    value?: string;
    onChange: (value: string) => void;
    height?: string;
    setLoading?: (value: boolean) => void;
};

const Editor: React.FC<EditorProps> = ({
    value,
    onChange,
    height,
    setLoading,
}) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={(editor) => {
                editor.editing.view.change((writer: any) => {
                    writer.setStyle(
                        "height",
                        height,
                        editor.editing.view.document.getRoot()
                    );
                });
                setLoading && setLoading(false);
            }}
            config={{
                toolbar: {
                    shouldNotGroupWhenFull: true,
                },
                allowedContent: true,
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default Editor;
