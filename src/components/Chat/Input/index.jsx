import { useState } from "react";
import { SendMessageIcons } from "../../icons/send";

export const ChatInput = (props) => {
  const { handleSubmit } = props;
  const [newMessage, setNewMessage] = useState();
  return (
    <div className="border-t bg-white fixed bottom-0 left-0 z-[4] w-full">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="relative flex w-full">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tanya Informasi"
              className={`w-full px-4 h-[40px] flex justify-start items-center rounded-full bg-[#F4F4F4] outline-none mr-2 
                    `}
            />
            <button
              type="submit"
              className={`flex min-w-[40px] max-w-[40px] h-[40px] justify-center items-center rounded-full ${
                newMessage?.length > 0 ? "bg-[#F1D9C1]" : ""
              }`}
            >
              <SendMessageIcons isDisabled={newMessage?.length < 1} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
