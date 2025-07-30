import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import TipTapEditor from "@/components/shared/TiptapEditor";

interface AdviceProps {
  onSaveAdvice: (value: string) => void;
}

const Advice = ({ onSaveAdvice }: AdviceProps) => {
  const form = useFormContext();
  const defaultContent = "<ol><li><p>Hello world</p></li></ol><p></p>"; 

  const [editorContent, setEditorContent] = useState(defaultContent);

  useEffect(() => {
    form.register("content", { required: "Description is required" });

    // If form is reset dynamically or populated later, update state
    const subscription = form.watch((value) => {
      if (value.content !== editorContent) {
        setEditorContent(value.content || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const handleSave = () => {
    form.setValue("content", editorContent, { shouldValidate: true });
    onSaveAdvice(editorContent);
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-sm font-semibold mb-4">Description</h2>
      <TipTapEditor
        content={editorContent} // pass default content here
        onChange={(value) => {
          setEditorContent(value);
          form.setValue("content", value, { shouldValidate: true });
        }}
      />
      {form.formState.errors.content && (
        <p className="text-red-500 text-xs mt-1">
          {form.formState.errors.content.message?.toString()}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        className="bg-blue-600 text-white text-xs px-4 py-2 mt-2 rounded-sm"
      >
        Save Description
      </button>
    </div>
  );
};

export default Advice;
