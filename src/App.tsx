// // import { useState } from 'react'
// // import './index.css'

// function App() {

//   return (
//     <div className="h-screen flex items-center justify-center bg-blue-50">
//       <div className="bg-white p-8 rounded-2xl shadow-xl">
//         <h1 className="text-2xl font-bold text-blue-600">
//           PayNest Wallet
//         </h1>
//         <p className='text-green-500 text-xl'>PayNest a secure digital wallet for simple payments, smart transfers, and trusted financial control.</p>
//         <p className="mt-2 text-gray-600 text-5xl">
//           Coming Soon Watch Out!!!!!!!!
//         </p>
//       </div>
//     </div>
//   )
// }

// export default App
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