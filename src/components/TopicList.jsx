import React from "react";
import { ArrowLeft, PlusCircle } from "lucide-react";

function TopicsList({
  topics,
  selectedTopic,
  onSelectTopic,
  onNewTopic,
  onClose,
}) {
  return (
    <div className="h-full bg-white text-black flex flex-col">
      <div className="p-4 border-b border-gray-300 flex items-center ">
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-[#8B8686]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="font-bold ml-4">Recent Chat</div>

        {/* Close button - only visible on mobile */}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-4">
          <button
            onClick={onNewTopic}
            className="flex-1 p-3 bg-gray-100 hover:bg-gray-300 rounded-lg text-left flex items-center gap-3 mr-2 w-full mb-6"
          >
            <span className="">
              <PlusCircle />
            </span>
            New Topic
          </button>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={`w-full p-3 rounded-lg text-left transition-colors mb-2 border-b`}
              // ${
              //   selectedTopic === topic ? "bg-gray-100" : "bg-[#DF8021] text-[white]"
              // }
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopicsList;
