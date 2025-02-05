import { sideBarWrapperStyle } from "./variants";
import { cn, debugVariant, formatDate } from "../../lib/utils";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import { ArrowLeft } from "lucide-react";
export const SideBar = (props) => {
  const { deviceType, className, showSideBar, setShowSideBar, recentChat } =
    props;
  const displaySideBar =
    deviceType === "desktop"
      ? styles.open
      : showSideBar
      ? styles.open
      : styles.close;

  // debugVariant(
  //   "sideBarWrapperStyle",
  //   { deviceType, displaySideBar },
  //   sideBarWrapperStyle({ deviceType, displaySideBar })
  // );
  const sortedRecentChat = recentChat?.sort((a, b) => {
    return new Date(b.updated_at) - new Date(a.updated_at);
  });
  return (
    <div
      className={`${cn(
        sideBarWrapperStyle({ deviceType, displaySideBar }),
        className
      )} ${displaySideBar}`}
    >
      {deviceType === "desktop" || (
        <div className="p-4 border-b border-gray-300 flex items-center">
          <button onClick={() => setShowSideBar("")} className="text-[#8B8686]">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold ml-4">Recent Chat</div>
        </div>
      )}
      <div className="w-full flex flex-col h-full overflow-auto">
        {deviceType === "desktop" && (
          <div className="font-bold ml-3 my-4">Recent Chat</div>
        )}
        {sortedRecentChat?.map((topic, index) => (
          <Link
            to={`/chat/${topic.case_id}`}
            key={`${topic.id}${index}`}
            onClick={() => setShowSideBar("")}
            className={`w-full p-3 rounded-lg text-left transition-colors mb-2 border-b`}
          >
            {topic.title}
            <div className="text-[12px]">{formatDate(topic.updated_at)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};
