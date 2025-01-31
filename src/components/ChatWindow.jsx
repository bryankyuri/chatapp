import { useState, useRef, useEffect } from "react";
import { SendMessageIcons } from "./icons/send";
import { ArrowLeft, Star, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
  const [newTopic, setNewTopic] = useState("");
  const themeStyles = useTheme();

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

  return (
    <div className="flex flex-col h-full">
      {/* Topic header */}
      <div
        className="w-full flex flex-col items-center justify-center lg:justify-between p-4 bg-white rounded-[28px] lg:bg-transparent"
        style={{ height: "calc(100vh - 80px" }}
      >
        <div className="w-full lg:max-w-[800px] lg:mx-auto h-full">
          <div className="text-center ">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Elevate
            </h2>
            <p className="text-gray-600">
              One-Stop Service <br />
              for your Business and Compliance Information
            </p>
          </div>

          <div className="font-bold text-[16px] mb-1 mt-[60px]">
            Hallo, Nadia
          </div>

          <div className="text-[14px] text-justify mb-4">
            Kamu dapat menanyakan informasi atau meminta dokumen terkait{" "}
            <span className="font-bold">
              Working Outline (WO) & Guideline, Compliance
            </span>
            &nbsp;dan <span className="font-bold">informasi bisnis</span>{" "}
            lainnya untuk menunjang pekerjaanmu
          </div>
          <div className="mb-4 text-[12px] text-[#8B8686]">
            {" "}
            Rekomendasi Topik
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {defaultTopics.map((defaultTopic) => (
              <button
                key={defaultTopic.title}
                // onClick={() => onNewTopic(defaultTopic.title)}
                className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                style={{
                  borderRight: "4px solid #DF80214D",
                  background:
                    "linear-gradient(257.86deg, #F7E8DA 2.79%, #FAF3EC 96.16%)",
                }}
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

          {/* <div className="border-t lg:border-none bg-white sticky lg:fixed bottom-0 left-0 z-[4] w-full lg:bg-transparent lg:w-[calc(100vh - 263px)] lg:left-[263px] ">
            <div className="w-full mx-auto px-4 py-4">
              <form onSubmit={handleSubmit}>
                <div className="relative flex w-full lg:w-[95%] lg:mx-auto lg:bg-white lg:rounded-full lg:px-4">
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Tanya Informasi"
                    className={`w-full px-4 h-[40px] flex justify-start items-center rounded-full bg-[#F4F4F4] outline-none mr-2 lg:bg-transparent`}
                  />
                  <button
                    type="submit"
                    className={`flex min-w-[40px] max-w-[40px] h-[40px] justify-center items-center rounded-full ${
                      newTopic?.length > 0 ? "bg-[#F1D9C1]" : ""
                    }`}
                  >
                    <SendMessageIcons isDisabled={newTopic?.length < 1} />
                  </button>
                </div>
              </form>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
