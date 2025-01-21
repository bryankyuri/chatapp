import React, { useState, useRef, useEffect } from "react";
import { SendMessageIcons } from "./icons/send";
import { ArrowLeft } from "lucide-react";

const defaultTopics = [
  {
    title: "Code Assistant",
    description: "Get help with programming, debugging, and code reviews",
  },
  {
    title: "Writing Helper",
    description: "Improve your writing, grammar, and content structure",
  },
  {
    title: "Math Tutor",
    description: "Learn mathematics concepts and solve problems",
  },
  {
    title: "Interview Prep",
    description: "Practice for job interviews and get career advice",
  },
];

function ChatWindow({
  topic,
  messages,
  onSendMessage,
  onNewTopic,
  setSelectedTopic,
  fs,
  onReviewClick,
}) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

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

  useEffect(() => {
    // Show typing indicator when new message is sent
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!topic) {
    return (
      <div className="flex flex-col h-full">
        {/* Topic header */}
        <div
          className="bg-white border-b px-4 py-3 h-[116px] fixed top-0 left-0 w-full"
          style={{
            background:
              "linear-gradient(92.79deg, rgb(247 189 130) 26.68%, rgb(223, 128, 33) 112.35%)",
          }}
        />
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white rounded-[28px] relative z-2 mt-[80px]">
          <div className="max-w-2xl w-full space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to Elevate
              </h2>
              <p className="text-gray-600">
                One-Stop Service <br />
                for your Business and Compliance Information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultTopics.map((defaultTopic) => (
                <button
                  key={defaultTopic.title}
                  onClick={() => onNewTopic(defaultTopic.title)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {defaultTopic.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {defaultTopic.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => onNewTopic()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#e29241]"
              >
                Create New Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pt-[80px]">
      {/* Topic header */}
      <div
        className="bg-white h-[116px]  fixed top-0 left-0 w-full z-[4] flex flex-col justify-between"
        style={{
          background:
            "linear-gradient(92.79deg, rgb(247 189 130) 26.68%, rgb(223, 128, 33) 112.35%)",
        }}
      >
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => setSelectedTopic("")}
            className="lg:hidden p-2 rounded-lg text-white mt-[16px] "
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-medium mt-[16px] ml-[4px] text-white">
            {topic}
          </h2>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1  rounded-t-[28px] sticky z-[4] top-[80px] pb-[80px] overflow-y-auto bg-white"
        style={{ height: "calc(100vh - 188px" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 relative z-[3] ">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.isReviewPrompt ? (
                <>
                  <div className={`max-w-2xl  order-1`}>
                    <div
                      className={`px-4 py-2 rounded-[24px] bg-chat-ai text-gray-800`}
                    >
                      <div className="relative z-[1]">
                        <div>{msg.content}</div>
                        <div>
                          <button
                            onClick={() => onReviewClick(topic)}
                            className="text-blue-600 font-medium underline"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`max-w-2xl ${
                    msg.role === "user" ? "order-2" : "order-1"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-[24px] ${
                      msg.role === "user"
                        ? "bg-chat-user text-white"
                        : isTyping
                        ? "bg-none"
                        : "bg-chat-ai text-gray-800"
                    }`}
                  >
                    <div className="relative z-[1]">{msg.content}</div>
                  </div>
                  {/* <div
                  className={`text-xs mt-1 text-gray-500 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div> */}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-2xl">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="border-t bg-white fixed bottom-0 left-0 z-[4] w-full">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit}>
            <div className="relative flex w-full">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tanya Informasi"
                className={`w-full px-4 h-[40px] flex justify-start items-center rounded-full bg-[#F4F4F4] outline-none mr-2 ${
                  fs !== "16px" ? "text-sm" : ""
                }`}
              />
              <button
                type="submit"
                className={`flex min-w-[40px] max-w-[40px] h-[40px] justify-center items-center rounded-full ${
                  newMessage?.length > 0 ? "bg-[#F1D9C1]" : ""
                }`}
              >
                <SendMessageIcons isDisabled={newMessage?.length < 1} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
