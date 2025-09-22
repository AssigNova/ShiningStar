import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Silk from "./components/Silk.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <Silk speed={5} scale={1} color="#8200db" noiseIntensity={1.5} rotation={0} />
      </div>
      <App />
    </div>
  </StrictMode>
);
