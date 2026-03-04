import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import { NETWORKS, getNetworkColorClasses } from "../utils/networks";
import { formatRelativeTime } from "../utils/transactions";

function Dashboard() {
    const navigate = useNavigate();
    const {
        address,
        balance,
        isConnected,
        isLoadingBalance,
        refreshBalance,
        logout,
        activeNetwork,
        transactions,
        switchNetwork,
    } = useWallet();

    const [showNetworkPicker, setShowNetworkPicker] = useState(false);

    useEffect(() => {
        if (!isConnected) navigate("/");
    }, [isConnected, navigate]);

    const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
    const netColors = getNetworkColorClasses(activeNetwork.color);

    if (!isConnected) return null;

    return (
        <div className="min-h-full bg-black flex flex-col p-6 animate-fade-in-up relative">

            {/* Network Picker Overlay */}
            {showNetworkPicker && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex flex-col p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Select Network</h2>
                        <button
                            onClick={() => setShowNetworkPicker(false)}
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {Object.values(NETWORKS).map((net) => {
                            const colors = getNetworkColorClasses(net.color);
                            const isActive = net.id === activeNetwork.id;
                            return (
                                <button
                                    key={net.id}
                                    onClick={() => { switchNetwork(net.id); setShowNetworkPicker(false); }}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive ? `${colors.bg} ${colors.border} border` : "bg-white/5 border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${colors.bg} border-2 ${colors.border}`} />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white">{net.name}</p>
                                            <p className="text-xs text-gray-500">{net.symbol} • {net.isTestnet ? "Testnet" : "Mainnet"}</p>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">PN</div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Main Wallet</h2>
                        <p className="text-xs text-blue-400/70">{shortAddress}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => navigate("/settings")} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296-.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <button onClick={refreshBalance} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <svg className={`w-5 h-5 ${isLoadingBalance ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button onClick={logout} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 mb-6 shadow-2xl shadow-blue-600/30">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
                <p className="text-blue-100/80 text-xs font-medium mb-1">Total Balance</p>
                {isLoadingBalance ? (
                    <div className="space-y-2 mt-1">
                        <div className="h-9 w-40 bg-white/20 rounded-xl animate-pulse" />
                        <div className="h-3 w-24 bg-white/10 rounded-full animate-pulse" />
                    </div>
                ) : (
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-4xl font-bold text-white leading-none">{parseFloat(balance).toFixed(4)}</h1>
                        <span className="text-xl font-medium text-blue-100/90">{activeNetwork.symbol}</span>
                    </div>
                )}
                <button
                    onClick={() => setShowNetworkPicker(true)}
                    className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${netColors.bg} ${netColors.text} ${netColors.border} backdrop-blur-sm hover:opacity-80 transition-opacity`}
                >
                    <div className={`w-2 h-2 rounded-full ${netColors.bg} border ${netColors.border}`} />
                    {activeNetwork.shortName}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => navigate("/send")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-white">Send</span>
                </button>
                <button onClick={() => navigate("/receive")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-white">Receive</span>
                </button>
            </div>

            {/* Recent Activity */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Recent Activity</h3>
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-semibold">No transactions yet</p>
                        <p className="text-gray-700 text-xs mt-1">Your activity will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.slice(0, 10).map((tx) => {
                            const isReceived = tx.type === "received";
                            const net = NETWORKS[tx.network];
                            return (
                                <div
                                    key={tx.hash}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                                    onClick={() => net && window.open(`${net.explorerUrl}/tx/${tx.hash}`, "_blank")}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isReceived ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                                            {isReceived
                                                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{isReceived ? "Received" : "Sent"}</p>
                                            <p className="text-xs text-gray-500">{formatRelativeTime(tx.timestamp)} • {net?.shortName ?? tx.network}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${isReceived ? "text-green-400" : "text-white"}`}>
                                            {isReceived ? "+" : "-"}{tx.amount} {net?.symbol ?? ""}
                                        </p>
                                        <p className="text-xs text-gray-600 font-mono">{tx.hash.slice(0, 6)}…{tx.hash.slice(-4)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
