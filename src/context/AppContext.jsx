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
  const isMobile = screenWidth < 1270;
  const deviceType =
    screenWidth >= 1270 ? "desktop" : screenWidth >= 744 ? "mobile" : "mobile";
  console.log(deviceType);
  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {isLoading && <LoadingPage />}
      {children}
      {isModalForbidden && console.log("forbidden")}
      {isModalTokenExp && console.log("token expired")}
    </AppContext.Provider>
  );
};
