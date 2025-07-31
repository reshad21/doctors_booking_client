import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { List } from "lucide-react";
import { Button } from "../ui/button";

export interface TipTapEditorRef {
  insertContent: (html: string) => void;
  getHTML: () => string;
}

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  ({ content, onChange }, ref) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          // orderedList: {
          //   HTMLAttributes: {
          //     class: "list-decimal ml-4",
          //   },
          // },
          bulletList: {
            HTMLAttributes: {
              class: "list-disc ml-4",
            },
          },
        }),
      ],
      content: content || "<p></p>",
      editorProps: {
        attributes: {
          class:
            "focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto",
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      insertContent: (html: string) => {
        if (editor) {
          editor.chain().focus().insertContent(html).run();
        }
      },
      getHTML: () => {
        return editor?.getHTML() ?? "";
      },
    }));

    if (!isMounted) {
      return null;
    }

    if (!editor) {
      return (
        <div className="border rounded-md p-4 min-h-[200px]">
          Loading editor...
        </div>
      );
    }

    return (
      <div className="border rounded-md border-gray-300 bg-[#FDFDFF] overflow-hidden">
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button> */}
        </div>
        <EditorContent editor={editor} />
      </div>
    );
  }
);

export default TipTapEditor;
