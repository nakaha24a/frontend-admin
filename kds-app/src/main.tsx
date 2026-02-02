import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { loadConfig } from "./config/runTimeconfig";

async function bootstrap() {
  // ★ ここで config.json を読み込む
  await loadConfig();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();