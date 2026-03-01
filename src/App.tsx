import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <div className="w-90 h-150 overflow-y-auto overflow-x-hidden bg-black">
          <Routes>
            <Route path="/" element={} />
            <Route path="/create" element={} />
            <Route path="/setup" element={} />
            <Route path="/validation" element={} />
            <Route path="/import" element={} />
            <Route path="/dashboard" element={} />
            <Route path="/send" element={} />
            <Route path="/receive" element={} />
            <Route path="/assets" element={} />
            <Route path="/settings" element={} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;