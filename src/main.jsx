import React from "react";
import { createRoot } from "react-dom/client";
import { Bootstrap } from "./Bootstrap";

// Orden de cascada estable: base → componentes → layout → tema → responsive.
import "./styles/app-foundation.css";
import "./styles/app-components.css";
import "./styles/app-layout.css";
import "./styles/app-theme.css";
import "./styles/app-mobile.css";

createRoot(document.getElementById("root")).render(<Bootstrap />);
