import React from "react";
import { createRoot } from "react-dom/client";
import { Bootstrap } from "./Bootstrap";

// Base
import "./styles/base/styles.css";

// Layout
import "./styles/layout/dashboard.css";
import "./styles/layout/clean.css";
import "./styles/layout/polish.css";
import "./styles/layout/fix.css";
import "./styles/layout/header-scroll.css";
import "./styles/layout/nav-lock.css";
import "./styles/layout/side-menu.css";
import "./styles/layout/integrations.css";

// Themes
import "./styles/themes/aesthetic.css";
import "./styles/themes/unified-theme.css";

// Mobile
import "./styles/mobile/mobile.css";
import "./styles/mobile/mobile-v07.css";
import "./styles/mobile/calendar-mobile.css";

createRoot(document.getElementById("root")).render(<Bootstrap />);
