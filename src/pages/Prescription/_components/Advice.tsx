/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import TipTapEditor, { type TipTapEditorRef } from "@/components/shared/TiptapEditor";
import SelectedAdvice from "./SelectedAdvice";

interface AdviceProps {
  onSaveAdvice: (value: string) => void;
  initialContent?: string;
  handleAdviceSaveInput:any
}

const Advice = ({ onSaveAdvice, initialContent = "",handleAdviceSaveInput }: AdviceProps) => {
  const form = useFormContext();
  const editorRef = useRef<TipTapEditorRef>(null);

  useEffect(() => {
    form.register("content", { required: "Description is required" });
  }, [form]);

  const handleEditorChange = (content: string) => {
    form.setValue("content", content, { shouldValidate: true });
    onSaveAdvice(content); 
  };

  const handleSave = () => {
    const html = editorRef.current?.getHTML() ?? "";
    onSaveAdvice(html);
  };

  const handleSelectAdvice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      editorRef.current?.insertContent(`<p>${selected}</p>`);
    }
  };

  const handleExtraSelectAdvice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      editorRef.current?.insertContent(`<p>${selected}</p>`);
    }
  };
  const handleExtraSelectAdviceInput = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      handleAdviceSaveInput(`<u><li>${selected}</li></u>`);
    }
  };

  return (
    <div className="flex justify-between items-center gap-5">
      <SelectedAdvice 
        handleExtraSelectAdvice={handleExtraSelectAdvice} 
        handleSelectAdvice={handleSelectAdvice} 
        handleSave={handleSave}
        handleExtraSelectAdviceInput={handleExtraSelectAdviceInput}
      />
      <div className="flex flex-col w-1/2">
        <TipTapEditor
          ref={editorRef}
          content={initialContent} 
          onChange={handleEditorChange} 
        />
        {form.formState.errors.content && (
          <p className="text-red-500 text-xs mt-1">
            {form.formState.errors.content.message?.toString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Advice;