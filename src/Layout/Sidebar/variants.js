import { cva } from "class-variance-authority";
import styles from "./Sidebar.module.scss";

export const sideBarWrapperStyle = cva(
  styles.sideBarWrapper, // base styles
  {
    variants: {
      deviceType: {
        desktop: styles.desktop,
        mobile: styles.mobile,
      },
      diplaySideBar: {
        default: "",
        open: styles.open,
        close: styles.close,
      },
    },
    defaultVariant: { deviceType: "mobile" },
  }
);
