import { createContext, useCallback, useEffect, useState } from "react";
import { LoadingPage } from "../components/Misc/LoadingPage";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  let screen = window.screen;
  const [screenWidth, setScreenWidth] = useState(screen.width);
  const [screenHeight, setScreenHeight] = useState(screen.height);
  const [headerTitle, setHeaderTitle] = useState("");
  const [isModalTokenExp, setIsModalTokenExp] = useState(false);
  const [isModalForbidden, setIsModalForbidden] = useState(false);
  const [showSideBar, setShowSideBar] = useState(false);
  const [recentChat, setRecentChat] = useState([]);
  const [newPromptChat, setNewPromptChat] = useState("");
  const screenResize = useCallback(() => {
    setScreenWidth(screen.width);
    setScreenHeight(screen.height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.width]);

  useEffect(() => {
    window.addEventListener("resize", screenResize);
    return () => {
      window.removeEventListener("resize", screenResize);
    };
  }, [screenResize]);

  const [isLoading, setIsloading] = useState(false);
  // const [userRole, SetUserRole] = useState(false);
  const handleLoading = (value) => {
    setIsloading(value);
  };

  const triggerExpiredToken = () => {
    setIsModalTokenExp(true);
    setTimeout(() => {
      //Cookies Remove
      setIsModalTokenExp(false);
      window.location.href = "/";
    }, 1300);
  };
  const triggerModalForbidden = (urlCallback, message) => {
    setIsModalForbidden(message ? message : true);
    setTimeout(() => {
      window.location.href = urlCallback;
    }, 2000);
  };

  const fetchRecentChat = useCallback(async () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer 1036b115929138b12407efb154e17738-5554adcc4a-3452057b0a97bc726d8c5fefdf72aa45eb19b7c003b612cc0a"
    );

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed/list-history?=",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Parse the response as JSON

      // Extract the 'list' array from the response
      const list = result.data.list;

      // Store the 'list' array in the 'recentChat' state
      setRecentChat(list);

      console.log("Recent Chat:", list); // Log the list to the console
    } catch (error) {
      console.error("Error fetching recent chat:", error);
    }
  }, []);

  const handleNewPromptChat = (value) => {
    setNewPromptChat(value)
  };
  const isMobile = screenWidth < 1270;
  const deviceType =
    screenWidth >= 1270 ? "desktop" : screenWidth >= 744 ? "mobile" : "mobile";
  console.log(deviceType);
  return (
    <AppContext.Provider
      value={{
        isLoading,
        handleLoading,
        isMobile,
        screenWidth,
        screenHeight,
        deviceType,
        headerTitle,
        showSideBar, setShowSideBar,
        setHeaderTitle,
        triggerExpiredToken,
        triggerModalForbidden,
        fetchRecentChat,
        recentChat,
        newPromptChat,
        handleNewPromptChat
      }}
    >
      {isLoading && <LoadingPage />}
      {children}
      {isModalForbidden && console.log("forbidden")}
      {isModalTokenExp && console.log("token expired")}
    </AppContext.Provider>
  );
};
