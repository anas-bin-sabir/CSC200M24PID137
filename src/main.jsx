import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DndProvider } from "react-dnd";
import { dndBackend, dndOptions } from "./utils/dnd.js";
import "../src/styles/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DndProvider backend={dndBackend} options={dndOptions}>
      <App />
    </DndProvider>
  </StrictMode>
);
