import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { JsonRpcProvider, HDNodeWallet, Wallet } from "ethers";
import { getBalance, loadWallet } from "../utils/wallet";
import { NETWORKS, getSavedNetworkId, saveNetworkId, type Network } from "../utils/networks";
import { loadTransactions, saveTransaction, type Transaction } from "../utils/transactions";

interface WalletContextType {
    address: string | null;
    balance: string;
    isConnected: boolean;
    isLoadingBalance: boolean;
    provider: JsonRpcProvider | null;
    wallet: HDNodeWallet | Wallet | null;
    activeNetwork: Network;
    transactions: Transaction[];
    refreshBalance: () => Promise<void>;
    connectWallet: (password: string) => Promise<boolean>;
    saveNewWallet: (mnemonic: string, password: string) => Promise<void>;
    switchNetwork: (networkId: string) => void;
    addTransaction: (tx: Transaction) => void;
    logout: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState("0");
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [wallet, setWallet] = useState<HDNodeWallet | Wallet | null>(null);
    const [activeNetworkId, setActiveNetworkId] = useState<string>(getSavedNetworkId());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const providerRef = useRef<JsonRpcProvider>(
        new JsonRpcProvider(NETWORKS[getSavedNetworkId()].rpcUrl)
    );

    const activeNetwork = NETWORKS[activeNetworkId] || NETWORKS["sepolia"];

    useEffect(() => {
        providerRef.current = new JsonRpcProvider(activeNetwork.rpcUrl);
    }, [activeNetworkId, activeNetwork.rpcUrl]);

    const refreshBalance = useCallback(async () => {
        if (!address) return;
        setIsLoadingBalance(true);
        try {
            const bal = await getBalance(address, activeNetworkId);
            setBalance(bal);
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [address, activeNetworkId]);

    const connectWallet = async (password: string): Promise<boolean> => {
        try {
            const loadedWallet = await loadWallet(password, activeNetworkId);
            if (loadedWallet) {
                setWallet(loadedWallet);
                setAddress(loadedWallet.address);
                setTransactions(loadTransactions(loadedWallet.address));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Failed to load wallet:", error);
            return false;
        }
    };

    const saveNewWallet = async (mnemonic: string, password: string) => {
        const { saveWallet: saveWalletUtil } = await import("../utils/wallet");
        await saveWalletUtil(mnemonic, password);
    };

    const switchNetwork = useCallback((networkId: string) => {
        if (!NETWORKS[networkId]) return;
        setActiveNetworkId(networkId);
        saveNetworkId(networkId);
        if (wallet) {
            const newProvider = new JsonRpcProvider(NETWORKS[networkId].rpcUrl);
            setWallet(wallet.connect(newProvider) as HDNodeWallet | Wallet);
        }
    }, [wallet]);

    const addTransaction = useCallback((tx: Transaction) => {
        if (!address) return;
        saveTransaction(address, tx);
        setTransactions(loadTransactions(address));
    }, [address]);

    const logout = () => {
        setWallet(null);
        setAddress(null);
        setBalance("0");
        setTransactions([]);
    };

    useEffect(() => {
        if (address) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 30000);
            return () => clearInterval(interval);
        }
    }, [address, activeNetworkId, refreshBalance]);

    return (
        <WalletContext.Provider
            value={{
                address,
                balance,
                isConnected: !!address,
                isLoadingBalance,
                provider: providerRef.current,
                wallet,
                activeNetwork,
                transactions,
                refreshBalance,
                connectWallet,
                saveNewWallet,
                switchNetwork,
                addTransaction,
                logout,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error("useWallet must be used within WalletProvider");
    return context;
};
