import { useEffect, useState } from "react";

interface PreviewProps {
  content: string;
  details?: boolean;
  className?: string;
  maxLength?: number;
  skipLength?: number;
  ellipsis?: boolean;
}

const Preview = ({
  content,
  details = false,
  className = "",
  maxLength = 200,
  skipLength = 0,
  ellipsis = false,
}: PreviewProps) => {
  const [truncatedContent, setTruncatedContent] = useState("");

  useEffect(() => {
    const truncateContent = (text: string, maxLen: number, skipLen: number) => {
      if (!text) return "";

      const startPosition = Math.min(skipLen, text.length);
      const textAfterSkip = text.substring(startPosition);

      if (textAfterSkip.length > maxLen) {
        return textAfterSkip.substring(0, maxLen) + (ellipsis ? " ..." : "");
      }

      return textAfterSkip;
    };

    if (details) {
      setTruncatedContent(content);
    } else {
      setTruncatedContent(truncateContent(content, maxLength, skipLength));
    }
  }, [content, details, maxLength, skipLength, ellipsis]);

  return (
    <div
      style={{ overflow: "hidden" }}
      className={`tiptap prose w-full max-w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: truncatedContent || "" }}
    />
  );
};

export default Preview;
