import { cva } from "class-variance-authority";
import styles from "./Header.module.scss";

export const headerWrapperStyle = cva(
  styles.headerWrapper, // base styles
  {
    variants: {
      deviceType: {
        desktop: styles.desktop,
        mobile: styles.mobile,
      },
    },
    defaultVariant: { deviceType: "mobile" },
  }
);

export const headerTitleStyle = cva(
  styles.headerTitles, // base styles
  {
    variants: {
      deviceType: {
        desktop: "",
        mobile: "",
      },
    },
    defaultVariant: { deviceType: "mobile" },
  }
);


export const recentChatStyle = cva(
  styles.recentChat, // base styles
  {
    variants: {
      deviceType: {
        desktop: "",
        mobile: "",
      },
    },
    defaultVariant: { deviceType: "mobile" },
  }
);

