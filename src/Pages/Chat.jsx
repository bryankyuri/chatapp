import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ChatStream from "../components/chat";

export const ChatPage = () => {
  const getParams = useParams();
  const { handleLoading, isLoading, fetchRecentChat } = useContext(AppContext);

  const [detailMessage, setDetailMessage] = useState([]);

  const handleGetDetailMessage = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer 1036b115929138b12407efb154e17738-5554adcc4a-3452057b0a97bc726d8c5fefdf72aa45eb19b7c003b612cc0a"
    );

    myHeaders.append(
      "Content-Type",
      "application/json; charset=UTF-8"
    );

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
    handleGetDetailMessage();
  }, [handleGetDetailMessage]);
  console.log(detailMessage)
  return (
    <>
      {isLoading ? (
        ""
      ) : (
        <ChatStream caseId={getParams.id} detailMessage={detailMessage} />
      )}
    </>
  );
};

export default ChatPage;
