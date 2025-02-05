import { Routes, Route, useLocation } from "react-router-dom";
import { LoginPage } from "../Pages/Login";
import { Home } from "../Pages/Home";
import { NotFoundPage } from "../Pages/NotFound";
import { FixedNavigationLayout } from "../Layout/FixedNavigation";
// import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useEffect, useState } from "react";
import { Progress } from "../components/Nprogress";
import Cookies from "js-cookie";
import { LoadingPage } from "../components/Misc/LoadingPage";
import ChatPage from "../Pages/Chat";
// import ApiStreamClient from "../Pages/api";

const AppRoutes = () => {
  const isLogin = true;
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  const location = useLocation();

  useEffect(() => {
    const getUserData = Cookies.get("ud");
    const updateUserRole = getUserData
      ? JSON.parse(getUserData).role.name
      : "unauthorized";
    setUserRole(updateUserRole);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <>
      {userRole ? (
        <>
          <Progress isAnimating={isLoading} key={location.key} />
          {/* <TransitionGroup>
            <CSSTransition
              classNames="fade"
              key={location.key}
              onEnter={() => {
                setTimeout(() => {
                  setIsLoading(true);
                }, 300);
              }}
              onEntered={() => {
                setIsLoading(false);
              }}
              timeout={600}
            > */}
              <Routes>
                {isLogin && (
                  <>
                    <Route element={<FixedNavigationLayout />}>
                      <Route path="/" index element={<Home />} />
                    </Route>
                    <Route path="/" element={<FixedNavigationLayout />}>
                      <Route path="chat/:id" element={<ChatPage />} />
                    </Route>
                  </>
                )}
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            {/* </CSSTransition>
          </TransitionGroup> */}
        </>
      ) : (
        <LoadingPage />
      )}
    </>
  );
};

export default AppRoutes;
