import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/welcome";
function App() {
  return (
    <>
      <Router>
        <div className="w-90 h-150 overflow-y-auto overflow-x-hidden bg-black">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/create" element={null} />
            <Route path="/setup" element={null} />
            <Route path="/validation" element={null} />
            <Route path="/import" element={null} />
            <Route path="/dashboard" element={null} />
            <Route path="/send" element={null} />
            <Route path="/receive" element={null} />
            <Route path="/assets" element={null} />
            <Route path="/settings" element={null} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;