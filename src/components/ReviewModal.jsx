import { useState } from 'react';
import { Star } from 'lucide-react';

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
            <h3 className="text-xl font-semibold text-center">
              Rate this conversation
            </h3>
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
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className="px-4 py-2 bg-[#e29241] text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-xl">
              ✓
            </div>
            <h3 className="text-xl font-semibold">
              Thank you for your feedback!
            </h3>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#e29241] text-white rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewModal