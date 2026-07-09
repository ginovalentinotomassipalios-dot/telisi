import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import "./styles/base.css";
import "./styles/themes.css";
import "./styles/components.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/calendar.css";
import "./styles/mobile.css";

createRoot(document.getElementById("root")).render(<App />);
