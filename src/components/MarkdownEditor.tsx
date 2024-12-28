import React, { useState, useEffect } from "react";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface MarkdownEditorProps {
  onChange: (markdown: string) => void;
  initialValue?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  onChange,
  initialValue = "",
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    if (initialValue) {
      console.log(initialValue);
      const rawData = markdownToDraft(initialValue);
      const contentState = convertFromRaw(rawData);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialValue]);

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    const markdown = draftToMarkdown(
      convertToRaw(newEditorState.getCurrentContent())
    );
    onChange(markdown);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ["inline", "blockType", "list", "link", "image"],
          inline: {
            options: ["bold", "italic", "underline", "strikethrough"],
          },
          blockType: {
            options: [
              "Normal",
              "H1",
              "H2",
              "H3",
              "H4",
              "H5",
              "H6",
              "Blockquote",
              "Code",
            ],
          },
          list: {
            options: ["unordered", "ordered"],
          },
        }}
        editorClassName="min-h-[200px] px-3 py-2"
      />
    </div>
  );
};

export default MarkdownEditor;
