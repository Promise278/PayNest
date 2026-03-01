import { useNavigate } from 'react-router-dom';

interface Token {
  symbol: string;
  name: string;
  balance: string;
  value: string;
  icon: string;
}

const mockTokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    balance: '0.00',
    value: '$0.00',
    icon: '⟠',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    balance: '0.00',
    value: '$0.00',
    icon: '₮',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '0.00',
    value: '$0.00',
    icon: '$',
  },
];

function Assets() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-black flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white ml-4">Assets</h1>
        </div>
        <button className="text-blue-400 hover:text-blue-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg py-3 pl-12 pr-4 text-white placeholder-blue-300/40 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Total Value */}
      <div className="bg-linear-to-r from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4 mb-6">
        <p className="text-blue-300 text-sm mb-1">Total Portfolio Value</p>
        <h2 className="text-2xl font-bold text-white">$0.00</h2>
      </div>

      {/* Token List */}
      <div className="flex-1">
        <h3 className="text-blue-300 text-sm font-medium mb-4">Tokens ({mockTokens.length})</h3>
        <div className="space-y-3">
          {mockTokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 hover:bg-blue-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center">
                    <span className="text-2xl">{token.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{token.name}</p>
                    <p className="text-blue-300/70 text-sm">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{token.balance} {token.symbol}</p>
                  <p className="text-blue-300/70 text-sm">{token.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Token Button */}
      <button className="w-full py-4 border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 font-semibold rounded-lg transition-colors duration-200 mt-6 flex items-center justify-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Custom Token</span>
      </button>
    </div>
  );
}

export default Assets;