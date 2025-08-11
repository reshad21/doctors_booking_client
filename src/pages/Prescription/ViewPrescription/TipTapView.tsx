import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

interface PreviewProps {
  content: string;
  className?: string;
  limitCount?: number;
  adPositions?: number[];
  adComponent?: ReactNode;
  plainText?: boolean;
}

const TipTapView = ({
  content,
  className,
  limitCount,
  adPositions,
  adComponent,
  plainText = false,
}: PreviewProps) => {
  const baseStyles =
    "prose prose-sm sm:prose lg:prose-lg xl:prose-xl [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_p]:mb-4";

  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const tmp = document.createElement("div");
    tmp.innerHTML = html.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>");
    return tmp.textContent || tmp.innerText || "";
  };

  const formatContent = (text: string) => {
    return text.replace(/\n\n+/g, "</p><p>").replace(/\n/g, "<br>");
  };

  if (plainText) {
    const textContent = stripHtml(content);
    const limitedText = limitCount
      ? textContent.split(" ").slice(0, limitCount).join(" ") + "..."
      : textContent;

    return (
      <div className={className} style={{ lineHeight: 1.8 }}>
        {limitedText}
      </div>
    );
  }

  if (limitCount) {
    return (
      <div
        className={cn(baseStyles, className)}
        dangerouslySetInnerHTML={{ __html: `<p>${formatContent(content)}</p>` }}
      />
    );
  }

  if (!adPositions || adPositions.length === 0) {
    return (
      <div
        className={cn(baseStyles, className)}
        dangerouslySetInnerHTML={{ __html: formatContent(content) }}
      />
    );
  }

  const contentChunks: string[] = [];
  let lastPosition = 0;
  const contentLength = content.length;

  const sortedPositions = [...adPositions]
    .sort((a, b) => a - b)
    .map((wordPosition) => Math.floor((wordPosition / 100) * contentLength));

  sortedPositions.forEach((position) => {
    if (position > lastPosition && position < contentLength) {
      const chunk = content.substring(lastPosition, position);
      contentChunks.push(chunk);
      lastPosition = position;
    }
  });

  if (lastPosition < contentLength) {
    const chunk = content.substring(lastPosition);
    contentChunks.push(chunk);
  }

  const defaultAdComponent = (
    <div className="my-6 p-4 bg-gray-100 rounded-lg text-center">
      <p className="text-gray-500">Advertisement</p>
    </div>
  );

  return (
    <div className={cn(baseStyles, className)}>
      {contentChunks.map((chunk, index) => (
        <React.Fragment key={index}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<p>${formatContent(chunk)}</p>`,
            }}
          />
          {index < contentChunks.length - 1 && (
            <div className="not-prose">{adComponent || defaultAdComponent}</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TipTapView;