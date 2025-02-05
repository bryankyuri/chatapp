import { useState, useEffect, useContext, useCallback } from "react";
import "../App.css";
import { AppContext } from "../context/AppContext";
import WelcomeChat from "../components/Welcome";
import Cookies from "js-cookie";
import { useNavigate} from "react-router-dom";

export const Home = () => {
  const [reviewTopic, setReviewTopic] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [popularTopic, setPopularTopic] = useState([]);
  const { handleLoading, isLoading, fetchRecentChat, handleNewPromptChat, newPromptChat } = useContext(AppContext);
  const cookiesToken = Cookies.get("ut");
  const navigate = useNavigate()

  const handleGetPopularTopic = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${cookiesToken}`);

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

  const handleSubmit = useCallback(async (value) => {
    console.log(value)
    const myHeaders = new Headers();

    myHeaders.append("Authorization", `Bearer ${cookiesToken}`);

    myHeaders.append("Content-Type", "application/json; charset=UTF-8");

    const raw = JSON.stringify({
      caseID: "",
      channelType: "website",
      channelID: "0001",
      channelName: "Elevate",
      sender: {
        phone: "",
        contactName: "",
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed/create-new-conversation?channel=base.1&mode=chunk`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Extract the 'detail' array from the response
      const dataCaseID = result.data.case_id;
      handleNewPromptChat(value);
      // console.log(dataCaseID,newPromptChat )
      // handleLoading(false);
      navigate(`/chat/${dataCaseID}`)
    } catch (error) {
      console.error("Error fetching detail message:", error);
    }
    handleLoading(false);
  }, []);

  useEffect(() => {
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
        {isLoading || (
          <WelcomeChat
            popularTopic={popularTopic}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
