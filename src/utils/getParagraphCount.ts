export const getParagraphCount = (htmlString: string): number => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.querySelectorAll("p").length;
};
