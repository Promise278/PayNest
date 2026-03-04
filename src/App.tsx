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
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
          <div className="w-[420px] h-[720px] bg-black text-white border-neutral-900 shadow-2xl  ">
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
              <Route path="/settings" element={<Settings/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
  )
}
export default App;