export const theme = {
  colors: {
    primary: {
      DEFAULT: "#3B82F6", // blue-500
      hover: "#2563EB", // blue-600
      light: "#EFF6FF", // blue-50
    },
    secondary: {
      DEFAULT: "#1F2937", // gray-800
      hover: "#111827", // gray-900
    },
    background: {
      primary: "#F9FAFB", // gray-50
      secondary: "#FFFFFF", // white
      sidebar: "#111827", // gray-900
    },
    text: {
      primary: "#111827", // gray-900
      secondary: "#4B5563", // gray-600
      light: "#9CA3AF", // gray-400
      inverse: "#FFFFFF", // white
    },
    border: {
      DEFAULT: "#E5E7EB", // gray-200
      focus: "#3B82F6", // blue-500
    },
    status: {
      success: "#059669", // green-600
      error: "#DC2626", // red-600
      warning: "#D97706", // yellow-600
    },
  },

  // Chat bubble themes
  chatBubbles: {
    base: "px-4 py-3 rounded-lg max-w-2xl break-words",
    user: {
      wrapper: "flex justify-end",
      bubble: {
        base: "bg-gradient-to-r from-[#ffb265] to-[#e29241] relative z-[2] text-white text-right flex",
        after:
          "after:content-[''] after:w-0 after:h-0 after:border-t-8 after:border-t-transparent after:border-l-[16px] after:border-l-[#e29241] after:border-b-8 after:border-b-transparent after:absolute after:bottom-[-4px] after:right-[-4px] after:rotate-[32deg] after:z-0",
      },
    },
    assistant: {
      wrapper: "flex justify-start",
      bubble: {
        base: "bg-[#f8f8f8] relative z-[2]",
        after:"content-[''] after:w-0 after:h-0 after:border-t-8 after:border-t-transparent after:border-r-[16px] after:border-r-[#f8f8f8] after:border-b-8 after:border-b-transparent after:absolute after:bottom-[-4px] after:left-[-4px] after:rotate-[-32deg] after:z-1"
      },
    },
  },
};
