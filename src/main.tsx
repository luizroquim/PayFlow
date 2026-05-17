import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import emailjs from '@emailjs/browser'

emailjs.init("6i9UszG5Qr_Afz3zi");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>)