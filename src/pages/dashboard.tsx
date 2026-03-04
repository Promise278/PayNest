import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState, useRef } from "react";
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
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isConnected) navigate("/");
    }, [isConnected, navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [showMenu]);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
                            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
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
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive ? `${colors.bg} ${colors.border} border` : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${colors.bg} border-2 ${colors.border}`} />
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-white">{net.name}</p>
                                            <p className="text-xs text-zinc-500">{net.symbol} • {net.isTestnet ? "Testnet" : "Mainnet"}</p>
                                        </div>
                                    </div>
                                    {isActive && (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center font-bold text-white shadow-lg">PN</div>
                    <div>
                        <h2 className="text-sm font-semibold text-white">Main Wallet</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-zinc-400">{shortAddress}</p>
                            <button
                                onClick={copyAddress}
                                className="p-1 rounded transition-colors text-zinc-500 hover:text-white hover:bg-white/10 active:scale-[0.95]"
                                title="Copy full address"
                            >
                                {copied ? (
                                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Menu Dropdown */}
                    {showMenu && (
                        <div className="absolute right-0 top-12 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-40 min-w-50">
                            <button
                                onClick={() => {
                                    navigate("/settings");
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors text-left"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296-.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-semibold">Settings</span>
                            </button>
                            <button
                                onClick={() => {
                                    refreshBalance();
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors text-left border-t border-white/5"
                            >
                                <svg className={`w-5 h-5 ${isLoadingBalance ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="text-sm font-semibold">Refresh</span>
                            </button>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-white/5"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-semibold">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sleek Balance Card */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-zinc-800 to-zinc-950 p-6 mb-6 shadow-2xl shadow-black/80 border border-white/5">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 bg-zinc-700/10 rounded-full blur-3xl" />

                <p className="text-zinc-400 text-xs font-medium mb-1 relative z-10">Total Balance</p>

                {isLoadingBalance ? (
                    <div className="space-y-2 mt-1 relative z-10">
                        <div className="h-9 w-40 bg-zinc-700/50 rounded-xl animate-pulse" />
                        <div className="h-3 w-24 bg-zinc-800/80 rounded-full animate-pulse" />
                    </div>
                ) : (
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h1 className="text-4xl font-bold text-white leading-none">{parseFloat(balance).toFixed(4)}</h1>
                        <span className="text-xl font-medium text-zinc-400">{activeNetwork.symbol}</span>
                    </div>
                )}

                <button
                    onClick={() => setShowNetworkPicker(true)}
                    className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${netColors.bg} ${netColors.text} ${netColors.border} backdrop-blur-sm hover:opacity-80 transition-opacity relative z-10`}
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
                <button onClick={() => navigate("/send")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-white/5 transition-all duration-300 active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-white">Send</span>
                </button>
                <button onClick={() => navigate("/receive")} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-zinc-900 border border-white/5 transition-all duration-300 active:scale-[0.98]">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-sm font-semibold text-white">Receive</span>
                </button>
            </div>

            {/* Recent Activity */}
            <div className="flex-1 overflow-y-auto pr-1 -mr-1">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Recent Activity</h3>
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-zinc-400 text-sm font-semibold">No transactions yet</p>
                        <p className="text-zinc-600 text-xs mt-1">Your activity will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.slice(0, 10).map((tx) => {
                            const isReceived = tx.type === "received";
                            const net = NETWORKS[tx.network];
                            return (
                                <div
                                    key={tx.hash}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                                    onClick={() => net && window.open(`${net.explorerUrl}/tx/${tx.hash}`, "_blank")}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isReceived ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                                            {isReceived
                                                ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                                                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{isReceived ? "Received" : "Sent"}</p>
                                            <p className="text-xs text-zinc-500">{formatRelativeTime(tx.timestamp)} • {net?.shortName ?? tx.network}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold text-sm ${isReceived ? "text-green-400" : "text-white"}`}>
                                            {isReceived ? "+" : "-"}{tx.amount} {net?.symbol ?? ""}
                                        </p>
                                        <p className="text-xs text-zinc-600 font-mono">{tx.hash.slice(0, 6)}…{tx.hash.slice(-4)}</p>
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
