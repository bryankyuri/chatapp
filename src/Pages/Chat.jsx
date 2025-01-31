import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ChatStream from "../components/chat";

export const ChatPage = () => {
  const getParams = useParams();
  const { setHeaderTitle } = useContext(AppContext);

  useEffect(() => {
    setHeaderTitle(`Chat-${getParams.id}`);
  }, []);
  return <ChatStream />;
};

export default ChatPage;
