import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
import CreateWallet from "./pages/create";

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
          <Route path="/settings" element={<div>Settings</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;