import { FileText } from "lucide-react";
import { processMarkdown } from "../../lib/utils";
import { LoadingDots } from "../Misc/LoadingDots";
import DOMPurify from "dompurify";
import { useTheme } from "../../context/ThemeContext";

const DocumentItem = ({ document }) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mt-2">
    <FileText className="w-5 h-5 text-blue-500" />
    <div className="flex-1">
      <div className="font-medium">{document.file_name}</div>
      <div className="text-sm text-gray-500">
        {document.file_extension.toUpperCase()} • {document.file_size} •{" "}
        {document.file_total_pages} pages
      </div>
    </div>
  </div>
);

const ImageGrid = ({ images }) => (
  <div className="grid grid-cols-2 gap-2 mt-2">
    {images.map((image, index) => (
      <div
        key={index}
        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          src={image.file_link}
          alt={`Image ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
);

export const Message = ({ isFirstChunk, role, content, documents, images }) => {
  const themeStyles = useTheme();
  const handlePreviewDocument = (src, title) => {
    console.log(src, title);
  };

  const handlePreviewImage = (src) => {};
  return (
    <div className={`${themeStyles.chatBubbles[role].wrapper}`}>
      <div
        className={`${themeStyles.chatBubbles.base} ${themeStyles.chatBubbles[role].bubble.base} ${themeStyles.chatBubbles[role].bubble.after}`}
      >
        {role === "assistant" && content === "" && isFirstChunk ? (
          <LoadingDots />
        ) : (
          <div
            className={`markdown-content ${
              role === "user" ? "text-white" : "text-gray-800"
            }`}
            dangerouslySetInnerHTML={{
              __html:
                role === "assistant"
                  ? DOMPurify.sanitize(
                      processMarkdown(
                        content,
                        handlePreviewDocument,
                        handlePreviewImage
                      ),
                      {
                        ADD_TAGS: ["svg", "path", "line", "polyline", "circle"],
                        ADD_ATTR: [
                          "stroke",
                          "stroke-width",
                          "stroke-linecap",
                          "stroke-linejoin",
                          "points",
                          "fill",
                          "viewBox",
                          "onclick",
                        ],
                      }
                    )
                  : content,
            }}
          />
        )}

        {role === "assistant" &&
          documents &&
          documents.map((doc, index) => (
            <DocumentItem key={index} document={doc} />
          ))}

        {role === "assistant" && images && images.length > 0 && (
          <ImageGrid images={images} />
        )}
      </div>
    </div>
  );
};
