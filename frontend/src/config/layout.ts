export const LAYOUT = {
  SIDEBAR_WIDTH: "16rem", // w-64
  HEADER_HEIGHT: "4rem", // h-16
  CARD_RADIUS: "0.5rem", // rounded-md
  SPACING: {
    SM: "0.5rem",
    MD: "1rem",
    LG: "1.5rem",
    XL: "2rem"
  },
  CONTAINER_WIDTHS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    XXL: "1536px"
  },
  ANIMATION_DURATION: {
    FAST: "150ms",
    NORMAL: "300ms",
    SLOW: "500ms"
  },
  Z_INDEX: {
    BASE: 0,
    DROPDOWN: 10,
    STICKY: 20,
    MODAL: 50,
    TOAST: 100
  }
} as const;
