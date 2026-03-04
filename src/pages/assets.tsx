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
    <div className="min-h-full bg-black flex flex-col p-6 overflow-y-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white ml-2">Assets</h1>
        </div>
        <button className="text-zinc-400 hover:text-white transition-colors p-2 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tokens..."
          className="w-full bg-zinc-900 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* Total Value */}
      <div className="bg-linear-to-r from-zinc-800 to-zinc-900 border border-white/5 rounded-2xl p-5 mb-6 shadow-lg shadow-black/50">
        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-1">Total Portfolio Value</p>
        <h2 className="text-3xl font-black text-white">$0.00</h2>
      </div>

      {/* Token List */}
      <div className="flex-1">
        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Tokens ({mockTokens.length})</h3>
        <div className="space-y-3">
          {mockTokens.map((token) => (
            <div
              key={token.symbol}
              className="bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center shadow-inner">
                    <span className="text-xl text-zinc-300">{token.icon}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{token.name}</p>
                    <p className="text-zinc-500 text-xs font-semibold">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{token.balance} {token.symbol}</p>
                  <p className="text-zinc-500 text-xs font-semibold">{token.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Token Button */}
      <button className="w-full py-4 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 font-bold rounded-2xl transition-colors duration-200 mt-6 flex items-center justify-center space-x-2 active:scale-[0.98]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Custom Token</span>
      </button>
    </div>
  );
}

export default Assets;