import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import CreateWallet from "./pages/create";
import ImportWallet from "./pages/import";
import Dashboard from "./pages/dashboard";
import SendAssets from "./pages/send";
import ReceiveAssets from "./pages/receive";
import { WalletProvider } from "./context/WalletContext";
import Assets from "./pages/assets";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
          <div className="w-[420px] h-[720px] bg-black text-white relative overflow-hidden rounded-[3rem] border-[12px] border-neutral-900 shadow-2xl overflow-y-auto custom-scrollbar ">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/create" element={<CreateWallet />} />
              <Route path="/setup" element={<div>Setup</div>} />
              <Route path="/validation" element={<div>Validation</div>} />
              <Route path="/import" element={<ImportWallet />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/send" element={<SendAssets />} />
              <Route path="/receive" element={<ReceiveAssets />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
import Settings from "./pages/settings";

function App() {
  return (
    <Router>
      <div className="w-[360px] h-[600px] bg-black text-white relative">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create" element={<CreateWallet />} />
          <Route path="/setup" element={<div>Setup</div>} />
          <Route path="/validation" element={<div>Validation</div>} />
          <Route path="/import" element={<div>Import Wallet</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
          <Route path="/send" element={<div>Send Assets</div>} />
          <Route path="/receive" element={<div>Receive Assets</div>} />
          <Route path="/assets" element={<div>Assets</div>} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
