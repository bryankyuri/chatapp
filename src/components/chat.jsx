import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, FileText, Image as ImageIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { SendMessageIcons } from "./icons/send";
import DOMPurify from "dompurify";
import { processMarkdown } from "../lib/utils";
import Cookies from "js-cookie";

const ChatStream = (props) => {
  const [messages, setMessages] = useState([...props.detailMessage]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const themeStyles = useTheme();
  const [isFirstChunk, setIsFirstChunk] = useState(true);
  const { caseID, handleNewPromptChat, newPromptChat } = props;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (newPromptChat) {
      setIsLoading(true);
      console.log(newPromptChat);

      handleSubmitNewPrompt();
    }
  }, [newPromptChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const LoadingDots = () => (
    <div className="bg-white rounded-full px-4 py-4 shadow-md">
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );

  const parseChunkedResponse = (text) => {
    const jsonObjects = [];
    let buffer = text;

    while (buffer.length > 0) {
      try {
        let objectEnd = 0;
        let braceCount = 0;
        let inString = false;
        let escapeNext = false;

        for (let i = 0; i < buffer.length; i++) {
          const char = buffer[i];

          if (escapeNext) {
            escapeNext = false;
            continue;
          }

          if (char === "\\") {
            escapeNext = true;
            continue;
          }

          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }

          if (!inString) {
            if (char === "{") {
              braceCount++;
            } else if (char === "}") {
              braceCount--;
              if (braceCount === 0) {
                objectEnd = i + 1;
                break;
              }
            }
          }
        }

        if (objectEnd === 0) {
          break; // No complete JSON object found
        }

        const jsonStr = buffer.slice(0, objectEnd);
        const parsed = JSON.parse(jsonStr);
        jsonObjects.push(parsed);

        buffer = buffer.slice(objectEnd);
      } catch (e) {
        console.error("Error parsing JSON chunk:", e);
        break;
      }
    }

    return jsonObjects;
  };

  async function streamAPI(message, onChunk) {
    const cookiesToken = Cookies.get("ut");
    try {
      const response = await fetch(
        "https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed?channel=base.1&mode=chunk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookiesToken}`,
          },
          body: JSON.stringify({
            caseID: caseID,
            channelType: "website",
            channelID: "0001",
            channelName: "Elevate",
            sender: {
              phone: "",
              contactName: "",
            },
            message: {
              id: `chat-${new Date().getTime()}`,
              type: "text",
              text: {
                body: message,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          if (buffer) {
            const chunks = parseChunkedResponse(buffer);
            chunks.forEach((chunk) => onChunk(chunk));
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        const chunks = parseChunkedResponse(buffer);
        if (chunks.length > 0) {
          chunks.forEach((chunk) => onChunk(chunk));
          const lastBrace = buffer.lastIndexOf("}");
          if (lastBrace !== -1) {
            buffer = buffer.slice(lastBrace + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  const handleSubmitNewPrompt = useCallback(async () => {
    const promptText = newPromptChat;
    const userMessage = {
      role: "user",
      content: promptText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setIsFirstChunk(true);

    let assistantMessage = {
      role: "assistant",
      content: "",
      documents: [],
      images: [],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await streamAPI(promptText, (chunk) => {
        if (chunk.data) {
          const { messages, document, images, finish_reason } = chunk.data;

          if (messages && messages[0]?.text?.body) {
            assistantMessage.content += messages[0].text.body;
            setIsFirstChunk(false);
          }

          if (finish_reason === "stop") {
            if (document) assistantMessage.documents = document;
            if (images) assistantMessage.images = images;
          }

          handleNewPromptChat("");

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { ...assistantMessage },
          ]);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsFirstChunk(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const promptText = inputText;
    const userMessage = {
      role: "user",
      content: promptText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setIsFirstChunk(true);

    let assistantMessage = {
      role: "assistant",
      content: "",
      documents: [],
      images: [],
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await streamAPI(promptText, (chunk) => {
        if (chunk.data) {
          const { messages, document, images, finish_reason } = chunk.data;

          if (messages && messages[0]?.text?.body) {
            assistantMessage.content += messages[0].text.body;
            setIsFirstChunk(false);
          }

          if (finish_reason === "stop") {
            if (document) assistantMessage.documents = document;
            if (images) assistantMessage.images = images;
          }

          setMessages((prev) => [
            ...prev.slice(0, -1),
            { ...assistantMessage },
          ]);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setIsFirstChunk(false);
    }
  }, []);

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

  const Message = ({ role, content, documents, images }) => (
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
                  ? DOMPurify.sanitize(processMarkdown(content), {
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
                    })
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

  return (
    <>
      <div
        className="w-full overflow-y-auto mb-4 space-y-4 pt-8 overflow-x-hidden px-4"
        style={{ height: "calc(100vh - 80px" }}
      >
        <div className="w-full lg:max-w-[1024px] mx-auto space-y-6">
          {messages.map((message, index) => (
            <Message key={index} {...message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t lg:border-none bg-white sticky bottom-0 left-0 z-[4] w-full lg:bg-transparent">
        <div className="w-full mx-auto px-4 py-4">
          <form onSubmit={handleSubmit}>
            <div className="relative flex w-full lg:w-[95%] lg:mx-auto lg:bg-white lg:rounded-full lg:px-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tanya Informasi"
                className={`w-full px-4 h-[40px] flex justify-start items-center rounded-full bg-[#F4F4F4] outline-none mr-2 lg:bg-transparent`}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`flex min-w-[40px] max-w-[40px] h-[40px] justify-center items-center rounded-full ${
                  inputText?.length > 0 ? "bg-[#F1D9C1]" : ""
                }`}
                disabled={isLoading}
              >
                <SendMessageIcons isDisabled={inputText?.length < 1} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatStream;
