import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './global';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
    <GlobalStyle />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}