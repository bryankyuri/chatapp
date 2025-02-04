import { useState, useEffect, useContext, useCallback } from "react";
import "../App.css";
import { AppContext } from "../context/AppContext";
import WelcomeChat from "../components/Welcome";

export const Home = () => {
  // const [userId] = useState(() => {
  //   const savedId = localStorage.getItem("chatUserId");
  //   if (savedId) return savedId;
  //   const newId = uuidv4();
  //   localStorage.setItem("chatUserId", newId);
  //   return newId;
  // });

  const [reviewTopic, setReviewTopic] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [popularTopic, setPopularTopic] = useState([]);
  const { handleLoading, isLoading, fetchRecentChat } = useContext(AppContext);

  const handleGetPopularTopic = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer 1036b115929138b12407efb154e17738-5554adcc4a-3452057b0a97bc726d8c5fefdf72aa45eb19b7c003b612cc0a"
    );

    myHeaders.append("Content-Type", "application/json; charset=UTF-8");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed/recommendation`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Extract the 'detail' array from the response
      const dataRecommendation = result.data.recommendation;

      // Store the detail array in state
      setPopularTopic(dataRecommendation);
    } catch (error) {
      console.error("Error fetching detail message:", error);
    }
    handleLoading(false);
  }, []);

  useEffect(() => {
    // Register user with socket server
    handleLoading(true);
    handleGetPopularTopic();
    fetchRecentChat();
    handleLoading(false);
  }, []);

  const handleReviewClick = (topic) => {
    setReviewTopic(topic);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (rating) => {};
  return (
    <div className="w-full flex h-screen overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full lg:pl-0">
        {isLoading || <WelcomeChat popularTopic={popularTopic} /> }
        
      </div>
    </div>
  );
};

export default Home;
