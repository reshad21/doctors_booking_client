"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  LinkIcon,
  Undo,
  Redo,
  Code,
  Quote,
  Minus,
} from "lucide-react";
import { Button } from "../ui/button";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: {
          HTMLAttributes: {
            class: "my-4 border-t border-[#334155]",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4 text-[#F8FAFC]",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-4 text-[#F8FAFC]",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#F91938] underline hover:text-[#F8FAFC]",
        },
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto text-[#F8FAFC] bg-[#0F172A] prose-a:text-[#F91938] prose-a:underline hover:prose-a:text-[#F8FAFC] prose-hr:my-4 prose-hr:border-t prose-hr:border-[#334155] prose-ol:list-decimal prose-ol:ml-4 prose-ul:list-disc prose-ul:ml-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!isMounted) {
    return (
      <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0F172A]">
        <div className="flex flex-wrap gap-1 p-2 border-b border-[#334155] bg-[#16213A]">
          <div className="flex flex-wrap gap-1">
            {/* Skeleton buttons */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 bg-[#334155] rounded animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="p-4 min-h-[200px]">
          
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0F172A]">
        <div className="flex flex-wrap gap-1 p-2 border-b border-[#334155] bg-[#16213A]">
          <div className="flex flex-wrap gap-1">
            {/* Skeleton buttons */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-9 bg-[#334155] rounded animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="p-4 min-h-[200px]">
          
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-md overflow-hidden bg-[#0F172A]">
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#334155] bg-[#16213A]">
        <div className="flex flex-wrap gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={
              editor.isActive("bold")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={
              editor.isActive("italic")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={
              editor.isActive("underline")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={
              editor.isActive("strike")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={
              editor.isActive("heading", { level: 3 })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (editor.isActive({ textAlign: "left" })) {
                editor.chain().focus().unsetTextAlign().run();
              } else {
                editor.chain().focus().setTextAlign("left").run();
              }
            }}
            className={
              editor.isActive({ textAlign: "left" })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (editor.isActive({ textAlign: "center" })) {
                editor.chain().focus().unsetTextAlign().run();
              } else {
                editor.chain().focus().setTextAlign("center").run();
              }
            }}
            className={
              editor.isActive({ textAlign: "center" })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (editor.isActive({ textAlign: "right" })) {
                editor.chain().focus().unsetTextAlign().run();
              } else {
                editor.chain().focus().setTextAlign("right").run();
              }
            }}
            className={
              editor.isActive({ textAlign: "right" })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (editor.isActive({ textAlign: "justify" })) {
                editor.chain().focus().unsetTextAlign().run();
              } else {
                editor.chain().focus().setTextAlign("justify").run();
              }
            }}
            className={
              editor.isActive({ textAlign: "justify" })
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                editor.chain().focus().setImage({ src: url }).run();
              }
            }}
            type="button"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const url = window.prompt("URL");
              if (url) {
                // Check if there's selected text
                if (editor.state.selection.empty) {
                  // If no text is selected, just insert the URL as text
                  editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${url}">${url}</a>`)
                    .run();
                } else {
                  // If text is selected, apply the link to the selection
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }
            }}
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().undo().run()}
            type="button"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().redo().run()}
            type="button"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <span className="border-r mx-1"></span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={
              editor.isActive("codeBlock")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={
              editor.isActive("blockquote")
                ? "bg-[#334155] text-[#F91938]"
                : "text-[#F8FAFC]"
            }
            type="button"
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            type="button"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="border-gray-800 text-green-500"
        placeholder="Type your content here..."
      />
    </div>
  );
}
