import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

// The HTML5 drag-and-drop API does not fire for touch, so phones and tablets
// use the touch backend instead. It also handles the mouse, for touchscreen laptops.
export const isTouchDevice =
  typeof window !== "undefined" &&
  (window.matchMedia?.("(pointer: coarse)").matches ||
    navigator.maxTouchPoints > 0);

export const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

export const dndOptions = isTouchDevice
  ? { enableMouseEvents: true, touchSlop: 4 }
  : undefined;
