import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Clear stale auth data if no token exists
if (!localStorage.getItem("aps_token")) {
  ["aps_logged_in", "aps_session"].forEach((k) => localStorage.removeItem(k));
}

createRoot(document.getElementById("root")!).render(<App />);
