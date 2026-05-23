import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components"; // 🎯 1. Importe o provedor
import { theme } from "./styles/theme"; // 🎯 2. Importe o tema que criamos

import { GlobalStyle } from "./global";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ResetPassword } from "./pages/ResetPassword";

export default function App() {
  return (
    // 🎯 3. Envolva tudo com o ThemeProvider passando a variável theme
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}