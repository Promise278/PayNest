import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import CreateWallet from "./pages/create";
import ImportWallet from "./pages/import";
import Dashboard from "./pages/dashboard";
import SendAssets from "./pages/send";
import ReceiveAssets from "./pages/receive";
import Settings from "./pages/settings";
import { WalletProvider } from "./context/WalletContext";
import Assets from "./pages/assets";

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="w-full h-full relative overflow-hidden flex flex-col bg-black text-white">
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
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  )
}
export default App;