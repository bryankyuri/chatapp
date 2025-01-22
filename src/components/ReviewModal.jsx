import { useState } from "react";
import { Star, X } from "lucide-react";

function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // onSubmit(rating);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {!isSubmitted ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-[16px] font-semibold mr-4">
                Seberapa membantu informasi dari
                <br />
                Elevate?
              </div>
              <button onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div>
              <div className="text-[14px] font-bold mb-2">
                Apa saran dan komentar lainnya untuk Elevate?
              </div>
              <input
                type="text"
                // value={topic}
                // onChange={(e) => setTopic(e.target.value)}
                placeholder="Ketik saran dan komentar"
                className="w-full p-3 border rounded-lg mb-4 focus:outline-none "
                autoFocus
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="px-4 py-2 bg-[#e29241] text-white rounded-full w-full"
            >
              Selesai
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-left">
              Terima kasih atas penilaianmu!
            </h3>
            <div className="text-[48px]">🙏</div>
            <div className="text-left text-[14px]">
              Masukanmu berperan penting dalam meningkatkan kualitas layanan
              Elevate.
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#e29241] text-white rounded-full w-full"
            >
              Kembali ke Halaman Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;
