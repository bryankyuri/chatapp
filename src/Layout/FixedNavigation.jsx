import React, { useEffect, useState, useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { SideBar } from "./Sidebar";
import { Header } from "./Header";
import Cookies from "js-cookie";
import Style from "./Layout.module.scss";

import { LoadingWrapper } from "../components/Misc/Loading";

export const FixedNavigationLayout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showArrowBack, setShowArrowBack] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const {
    deviceType,
    triggerExpiredToken,
    headerTitle,
    setShowSideBar,
    showSideBar,
  } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(location);
    let splitPathUrl = [];
    if (location.pathname) {
      splitPathUrl = decodeURI(location.pathname)
        .split("/")
        .filter((item) => item);
    }

    if (splitPathUrl.includes("chat")) {
      setShowArrowBack(true);
    } else {
      setShowArrowBack(false);
    }
  }, [location]);

  useEffect(() => {
    const cookiesToken = Cookies.get("ut");
    if (!cookiesToken) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(deviceType);
  return (
    <div
      className="w-full overflow-hidden"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <Header
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
        deviceType={deviceType}
        headerTitle={headerTitle}
        showArrowBack={showArrowBack}
      />

      <div className="flex w-full">
        <SideBar
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
          deviceType={deviceType}
        />
        <div className="w-full">
          {/* {isLoading ? ( */}
          <div className={Style.contentWrapper}>
            <Outlet />
          </div>
          {/* ) : (
            <LoadingWrapper />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default FixedNavigationLayout;
