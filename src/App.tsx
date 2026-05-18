import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./global";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import {ResetPassword} from "./pages/ResetPassword"

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
