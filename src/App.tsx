import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import CreateWallet from "./pages/create";
import Dashboard from "./pages/dashboard";
import SendAssets from "./pages/send";
import ReceiveAssets from "./pages/receive";

function App() {
  return (
    <Router>
      <div className="w-[360px] h-[600px] bg-black text-white relative overflow-hidden border border-white/10 shadow-2xl">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create" element={<CreateWallet />} />
          <Route path="/setup" element={<div>Setup</div>} />
          <Route path="/validation" element={<div>Validation</div>} />
          <Route path="/import" element={<div>Import Wallet</div>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendAssets />} />
          <Route path="/receive" element={<ReceiveAssets />} />
          <Route path="/assets" element={<div>Assets</div>} />
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;