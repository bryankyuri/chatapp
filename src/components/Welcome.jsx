import { useState } from "react";
import { SendMessageIcons } from "./icons/send";

function WelcomeChat(props) {
  const [newMessage, setNewMessage] = useState("");
  const { popularTopic, isLoading, handleSubmit } = props;

  return (
    <>
      <div
        className="w-full flex flex-col items-center justify-center lg:justify-between p-4 bg-white rounded-[28px] lg:bg-transparent"
        style={{ height: "calc(100vh - 80px" }}
      >
        <div className="w-full lg:max-w-[800px] lg:mx-auto h-full">
          <div className="text-center ">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome to Elevate
            </h2>
            <p className="text-gray-600">
              One-Stop Service <br />
              for your Business and Compliance Information
            </p>
          </div>

          <div className="font-bold text-[16px] mb-1 mt-[60px]">
            Hallo, Nadia
          </div>

          <div className="text-[14px] text-justify mb-4">
            Kamu dapat menanyakan informasi atau meminta dokumen terkait{" "}
            <span className="font-bold">
              Working Outline (WO) & Guideline, Compliance
            </span>
            &nbsp;dan <span className="font-bold">informasi bisnis</span>{" "}
            lainnya untuk menunjang pekerjaanmu
          </div>
          <div className="mb-4 text-[12px] text-[#8B8686]">
            {" "}
            Rekomendasi Topik
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {popularTopic.map((defaultTopic, index) => {
              return (
                <button
                  key={defaultTopic.topic}
                  onClick={() => handleSubmit(defaultTopic.sample_question)}
                  className="p-4 border rounded-lg hover:border-orange-500 hover:shadow-md transition-all text-left group"
                  style={{
                    borderRight: "4px solid #DF80214D",
                    background:
                      "linear-gradient(257.86deg, #F7E8DA 2.79%, #FAF3EC 96.16%)",
                  }}
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-orange-500">
                    {defaultTopic.topic}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {defaultTopic.sample_question}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t lg:border-none bg-white sticky bottom-0 left-0 z-[4] w-full lg:bg-transparent">
        <div className="w-full mx-auto px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(newMessage);
            }}
          >
            <div className="relative flex w-full lg:w-[95%] lg:mx-auto lg:bg-white lg:rounded-full lg:px-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tanya Informasi"
                className={`w-full px-4 h-[40px] flex justify-start items-center rounded-full bg-[#F4F4F4] outline-none mr-2 lg:bg-transparent`}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`flex min-w-[40px] max-w-[40px] h-[40px] justify-center items-center rounded-full ${
                  newMessage?.length > 0 ? "bg-[#F1D9C1]" : ""
                }`}
                disabled={isLoading}
              >
                <SendMessageIcons isDisabled={newMessage?.length < 1} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default WelcomeChat;
