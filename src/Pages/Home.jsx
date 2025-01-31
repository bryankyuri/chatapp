import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../utils/socket";
import TopicsList from "../components/TopicList";
import ChatWindow from "../components/ChatWindow";
import NewTopicModal from "../components/NewTopicModal";
import "../App.css";
import { RecentChatIcon } from "../components/icons/RecentChat";
import ReviewModal from "../components/ReviewModal";
import ChatStream from "../components/chat";

export const Home = () => {
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
  const [reviewTopic, setReviewTopic] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

    socket.on('review_prompt', ({ topic, message }) => {
      setMessages(prev => ({
        ...prev,
        [topic]: [
          ...(prev[topic] || []),
          { 
            role: 'system', 
            content: message,
            isReviewPrompt: true, // Add this flag
            timestamp: new Date().toISOString()
          }
        ]
      }));
    });

    socket.on('review_submitted', ({ topic }) => {
      setShowReviewModal(false);
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
      socket.off('review_prompt');
      socket.off('review_submitted');
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

  const handleReviewClick = (topic) => {
    setReviewTopic(topic);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (rating) => {
    socket.emit('submit_review', {
      userId,
      topic: reviewTopic,
      rating
    });
  };
  return (
    <div className="w-full flex h-screen overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full lg:pl-0">
        <ChatWindow
          topic={selectedTopic}
          messages={messages[selectedTopic] || []}
          onSendMessage={sendMessage}
          onNewTopic={createTopic} // Add this prop
          setSelectedTopic={setSelectedTopic}
          fs={fontSizeParam}
          onReviewClick={handleReviewClick}
        />
      </div>

    </div>
  );
}

export default Home;
