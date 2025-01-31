import {
  headerWrapperStyle,
  headerTitleStyle,
  recentChatStyle,
} from "./variants";
import { cn } from "../../lib/utils";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RecentChatIcon } from "../../components/icons/RecentChat";
export const Header = (props) => {
  const navigate = useNavigate();
  const {
    deviceType,
    className,
    headerTitle: title,
    setShowSideBar,
    showSideBar,
    showArrowBack,
  } = props;
  return (
    <div className={cn(headerWrapperStyle({ deviceType }), className)}>
      <div className="flex items-center w-full justify-between lg:justify-center">
        <div className="flex items-center">
          {showArrowBack && (
            <>
              <button
                onClick={() => navigate("/")}
                className="lg:hidden  rounded-lg text-white flex "
              >
                <ArrowLeft size={20} />
              </button>
              <div className={cn(headerTitleStyle({ deviceType }))}>
                {title}
              </div>
            </>
          )}
        </div>
        {deviceType === "mobile" && (
          <button
            onClick={() => setShowSideBar(!showSideBar)}
            className={cn(recentChatStyle({ deviceType }))}
          >
            <RecentChatIcon />
          </button>
        )}
      </div>
    </div>
  );
};
