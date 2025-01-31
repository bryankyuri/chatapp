import { sideBarWrapperStyle } from "./variants";
import { cn, debugVariant } from "../../lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";
import { ArrowLeft } from "lucide-react";
export const SideBar = (props) => {
  const [listChatHistory, setListChatHistory] = useState([]);
  const { deviceType, className, showSideBar, setShowSideBar } = props;
  const displaySideBar =
    deviceType === "desktop"
      ? styles.open
      : showSideBar
      ? styles.open
      : styles.close;
  useEffect(() => {
    // const myHeaders = new Headers();
    // myHeaders.append(
    //   "Authorization",
    //   "Bearer abde359f5ba9cf67e9b619f6e001e97e-c0a08189fd-2567e85210976450e3eb58385f19459f5d41f87c9d3f43d655"
    // );

    // const requestOptions = {
    //   method: "GET",
    //   headers: myHeaders,
    //   redirect: "follow",
    // };

    // fetch(
    //   "https://dev.api.asisten.ai/api/elevate/YT781HjqsTR/677f88dc-c440-8007-96bd-6e86883e43ed/list-history",
    //   requestOptions
    // )
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
    setListChatHistory([
      {
        case_id: "4f080900-0400-2d52-5b00-001000006246",
        title: "4f080900-0400-2d52-5b00-001000006246",
        started_at: "2025-01-28 03:49:18",
        updated_at: "2025-01-28 03:50:16.000",
      },
      {
        case_id: "60006207-0000-2f09-0000-3f0000000001",
        title: "60006207-0000-2f09-0000-3f0000000001",
        started_at: "2025-01-28 03:53:44",
        updated_at: "2025-01-29 19:48:44.000",
      },
      {
        case_id: "002b0163-221c-0409-5955-5000032a002e",
        title: "002b0163-221c-0409-5955-5000032a002e",
        started_at: "2025-01-28 07:30:14",
        updated_at: "2025-01-28 09:29:46.000",
      },
    ]);
  }, []);
  debugVariant(
    "sideBarWrapperStyle",
    { deviceType, displaySideBar },
    sideBarWrapperStyle({ deviceType, displaySideBar })
  );
  return (
    <div
      className={`${cn(
        sideBarWrapperStyle({ deviceType, displaySideBar }),
        className
      )} ${displaySideBar}`}
    >
      {deviceType === "desktop" || (
        <div className="p-4 border-b border-gray-300 flex items-center ">
          <button onClick={() => setShowSideBar("")} className="text-[#8B8686]">
            <ArrowLeft size={20} />
          </button>
          <div className="font-bold ml-4">Recent Chat</div>
        </div>
      )}
      <div className="w-full flex flex-col">
        {deviceType === "desktop" && (
          <div className="font-bold ml-4 my-4">Recent Chat</div>
        )}
        {listChatHistory.map((topic) => (
          <Link
            to={`/chat/${topic.case_id}`}
            key={topic.id}
            onClick={() => setShowSideBar("")}
            className={`w-full p-3 rounded-lg text-left transition-colors mb-2 border-b`}
            // ${
            //   selectedTopic === topic ? "bg-gray-100" : "bg-[#DF8021] text-[white]"
            // }
          >
            {topic.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
