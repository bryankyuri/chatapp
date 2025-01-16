import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "./utils/socket";
import TopicsList from "./components/TopicList";
import ChatWindow from "./components/ChatWindow";
import NewTopicModal from "./components/NewTopicModal";
import { Menu } from "lucide-react";
import "./App.css";
import { RecentChatIcon } from "./components/icons/RecentChat";

function App() {
  const [userId] = useState(() => {
    const savedId = localStorage.getItem("chatUserId");
    if (savedId) return savedId;
    const newId = uuidv4();
    localStorage.setItem("chatUserId", newId);
    return newId;
  });

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState({});
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fontSizeParam, setFontSizeParam] = useState("16px");

  useEffect(() => {
    // Register user with socket server
    socket.emit("register", userId);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Socket event listeners
    socket.on("registered", ({ userId }) => {
      console.log("Registered with server:", userId);
      socket.emit("get_topics", { userId });
    });

    socket.on("user_topics", ({ topics }) => {
      setTopics(topics);
    });

    socket.on("topic_created", ({ topic }) => {
      setTopics((prev) => [...prev, topic]);
      setSelectedTopic(topic);
      setIsNewTopicModalOpen(false);
    });

    const handleAiResponse = ({ topic, message, timestamp }) => {
      // Add small delay to make typing indicator visible
      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          [topic]: [
            ...(prev[topic] || []),
            { role: "assistant", content: message, timestamp },
          ],
        }));
      }, 500);

      if (
        !document.hasFocus() &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("New AI Response", {
          body: `${topic}: ${message.substring(0, 100)}...`,
          icon: "/vite.svg",
        });
      }
    };

    socket.on("ai_response", handleAiResponse);

    return () => {
      socket.off("registered");
      socket.off("user_topics");
      socket.off("topic_created");
      socket.off("ai_response", handleAiResponse);
    };
  }, [userId]);

  const createTopic = (defaultTopic) => {
    if (defaultTopic) {
      // If a default topic is selected
      socket.emit("create_topic", { userId, topic: defaultTopic });
    } else {
      // If user wants to create custom topic
      setIsNewTopicModalOpen(true);
    }
  };

  const sendMessage = (message) => {
    if (!message.trim() || !selectedTopic) return;

    // Add user message to local state
    setMessages((prev) => ({
      ...prev,
      [selectedTopic]: [
        ...(prev[selectedTopic] || []),
        { role: "user", content: message, timestamp: new Date().toISOString() },
      ],
    }));

    // Send message to server
    socket.emit("chat_message", {
      userId,
      topic: selectedTopic,
      message,
    });
  };

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const fontsize = sp.get("fs"); // world
    if (fontsize) {
      setFontSizeParam(fontsize);
    }
  }, []);

  console.log(fontSizeParam)
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      {/* {isSidebarOpen || ( */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-[24px] right-[12px] z-[3] p-2 bg-white rounded-full shadow-lg"
      >
        <RecentChatIcon />
      </button>
      {/* )} */}

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-y-0" : "translate-y-full"
        } lg:translate-x-0 fixed lg:relative z-40 lg:w-72 w-full max-w-[100vw] h-full transition-transform duration-300 ease-in-out top-0`}
      >
        <TopicsList
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={(topic) => {
            setSelectedTopic(topic);
            setIsSidebarOpen(false);
          }}
          onNewTopic={() => setIsNewTopicModalOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full lg:pl-0">
        <ChatWindow
          topic={selectedTopic}
          messages={messages[selectedTopic] || []}
          onSendMessage={sendMessage}
          onNewTopic={createTopic} // Add this prop
          setSelectedTopic={setSelectedTopic}
          fs={fontSizeParam}
        />
      </div>

      <NewTopicModal
        isOpen={isNewTopicModalOpen}
        onClose={() => setIsNewTopicModalOpen(false)}
        onCreateTopic={createTopic}
      />
    </div>
  );
}

export default App;
