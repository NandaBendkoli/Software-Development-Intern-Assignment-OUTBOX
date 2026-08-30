import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComposeEmail from "./pages/ComposeEmail";
import EmailDetail from "./pages/EmailDetail";
import CampaignDetail from "./pages/CampaignDetail";
import SenderPage from "./pages/Sender";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/compose" element={<ComposeEmail />} />
        <Route path="/email/:id" element={<EmailDetail />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/senders" element={<SenderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
