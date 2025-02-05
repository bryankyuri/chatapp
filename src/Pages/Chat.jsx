import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ChatStream from "../components/Chat";
import Cookies from "js-cookie";

export const ChatPage = () => {
  const getParams = useParams();
  const {
    handleLoading,
    isLoading,
    fetchRecentChat,
    newPromptChat,
    handleNewPromptChat,
  } = useContext(AppContext);

  const [detailMessage, setDetailMessage] = useState([]);

  const handleGetDetailMessage = useCallback(async () => {
    const myHeaders = new Headers();
    const cookiesToken = Cookies.get("ut");
    myHeaders.append("Authorization", `Bearer ${cookiesToken}`);

    myHeaders.append("Content-Type", "application/json; charset=UTF-8");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed/chat/${getParams.id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Extract the 'detail' array from the response
      const detailMessage = result.data.detail;

      // Store the detail array in state
      setDetailMessage(detailMessage);
    } catch (error) {
      console.error("Error fetching detail message:", error);
    }
    handleLoading(false);
  }, [getParams.id]);

  useEffect(() => {
    handleLoading(true);
    fetchRecentChat();
    if (!newPromptChat) {
      handleGetDetailMessage();
    } else{
      handleLoading(false);
    }
  }, [handleGetDetailMessage]);
  console.log(detailMessage);
  return (
    <>
      {isLoading ? (
        ""
      ) : (
        <ChatStream
          caseID={getParams.id}
          detailMessage={detailMessage}
          newPromptChat={newPromptChat}
          handleNewPromptChat={handleNewPromptChat}
        />
      )}
    </>
  );
};

export default ChatPage;
