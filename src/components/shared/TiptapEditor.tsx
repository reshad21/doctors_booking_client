// "use client";

// import { useEffect, useState } from "react";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";
// import {
//   Bold,
//   Italic,
//   UnderlineIcon,
//   Strikethrough,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   AlignJustify,
//   List,
//   ListOrdered,
//   Heading1,
//   Heading2,
//   Heading3,
//   ImageIcon,
//   LinkIcon,
//   Undo,
//   Redo,
//   Code,
//   Quote,
//   Minus,
// } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "../ui/button";
// import Image from "@tiptap/extension-image";
// import TextAlign from "@tiptap/extension-text-align";

// interface TipTapEditorProps {
//   content: string;
//   onChange: (content: string) => void;
// }

// export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         horizontalRule: {
//           HTMLAttributes: {
//             class: "my-4 border-t border-gray-300",
//           },
//         },
//         orderedList: {
//           HTMLAttributes: {
//             class: "list-decimal ml-4",
//           },
//         },
//         bulletList: {
//           HTMLAttributes: {
//             class: "list-disc ml-4",
//           },
//         },
//       }),
//       Underline,
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           class: "text-blue-500 underline hover:text-blue-700",
//         },
//       }),
//       Image,
//       TextAlign.configure({
//         types: ["heading", "paragraph"],
//       }),
//     ],
//     content: content || "<p></p>",
//     editorProps: {
//       attributes: {
//         class:
//           "focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto prose-a:text-blue-500 prose-a:underline hover:prose-a:text-blue-700 prose-hr:my-4 prose-hr:border-t prose-hr:border-gray-300 prose-ol:list-decimal prose-ol:ml-4 prose-ul:list-disc prose-ul:ml-4",
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange(editor.getHTML());
//     },
//   });

//   if (!isMounted) {
//     return null;
//   }

//   if (!editor) {
//     return (
//       <div className="border rounded-md p-4 min-h-[200px]">
//         Loading editor...
//       </div>
//     );
//   }

//   return (
//     <div className="border rounded-md overflow-hidden">
//       <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
//         <div className="flex flex-wrap gap-1">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleBold().run()}
//             className={editor.isActive("bold") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <Bold className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleItalic().run()}
//             className={editor.isActive("italic") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <Italic className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleUnderline().run()}
//             className={editor.isActive("underline") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <UnderlineIcon className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleStrike().run()}
//             className={editor.isActive("strike") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <Strikethrough className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 1 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <Heading1 className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 2 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <Heading2 className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() =>
//               editor.chain().focus().toggleHeading({ level: 3 }).run()
//             }
//             className={
//               editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <Heading3 className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleBulletList().run()}
//             className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <List className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleOrderedList().run()}
//             className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <ListOrdered className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               if (editor.isActive({ textAlign: "left" })) {
//                 editor.chain().focus().unsetTextAlign().run();
//               } else {
//                 editor.chain().focus().setTextAlign("left").run();
//               }
//             }}
//             className={
//               editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <AlignLeft className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               if (editor.isActive({ textAlign: "center" })) {
//                 editor.chain().focus().unsetTextAlign().run();
//               } else {
//                 editor.chain().focus().setTextAlign("center").run();
//               }
//             }}
//             className={
//               editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <AlignCenter className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               if (editor.isActive({ textAlign: "right" })) {
//                 editor.chain().focus().unsetTextAlign().run();
//               } else {
//                 editor.chain().focus().setTextAlign("right").run();
//               }
//             }}
//             className={
//               editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <AlignRight className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               if (editor.isActive({ textAlign: "justify" })) {
//                 editor.chain().focus().unsetTextAlign().run();
//               } else {
//                 editor.chain().focus().setTextAlign("justify").run();
//               }
//             }}
//             className={
//               editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
//             }
//             type="button"
//           >
//             <AlignJustify className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               const url = window.prompt("URL");
//               if (url) {
//                 editor.chain().focus().setImage({ src: url }).run();
//               }
//             }}
//             type="button"
//           >
//             <ImageIcon className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => {
//               const url = window.prompt("URL");
//               if (url) {
//                 // Check if there's selected text
//                 if (editor.state.selection.empty) {
//                   // If no text is selected, just insert the URL as text
//                   editor
//                     .chain()
//                     .focus()
//                     .insertContent(`<a href="${url}">${url}</a>`)
//                     .run();
//                 } else {
//                   // If text is selected, apply the link to the selection
//                   editor.chain().focus().setLink({ href: url }).run();
//                 }
//               }
//             }}
//             type="button"
//           >
//             <LinkIcon className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().undo().run()}
//             type="button"
//           >
//             <Undo className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().redo().run()}
//             type="button"
//           >
//             <Redo className="h-4 w-4" />
//           </Button>
//           <span className="border-r mx-1"></span>

//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//             className={editor.isActive("codeBlock") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <Code className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().toggleBlockquote().run()}
//             className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
//             type="button"
//           >
//             <Quote className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => editor.chain().focus().setHorizontalRule().run()}
//             type="button"
//           >
//             <Minus className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>
//       <ScrollArea style={{ height: 200 }} className="rounded">
//         <EditorContent editor={editor} className="" />
//       </ScrollArea>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { List, ListOrdered } from "lucide-react";
import { Button } from "../ui/button";

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-4",
          },
        },
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
    <div className="border rounded-md overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}