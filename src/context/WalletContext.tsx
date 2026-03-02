import React, { useState, useEffect, useCallback } from "react";
import { JsonRpcProvider, HDNodeWallet, Wallet } from "ethers";
import { getBalance, loadWallet } from "../utils/wallet";
import { WalletContext } from "./wallet-context";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState("0");
    const [wallet, setWallet] = useState<HDNodeWallet | Wallet | null>(null);
    const [provider] = useState(new JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com"));

    const refreshBalance = useCallback(async () => {
        if (address) {
            try {
                const bal = await getBalance(address);
                setBalance(bal);
            } catch (error) {
                console.error("Failed to fetch balance:", error);
            }
        }
    }, [address]);

    const connectWallet = async (password: string) => {
        try {
            const loadedWallet = await loadWallet(password);
            if (loadedWallet) {
                setWallet(loadedWallet);
                setAddress(loadedWallet.address);
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

    const logout = () => {
        setWallet(null);
        setAddress(null);
        setBalance("0");
    };

    useEffect(() => {
        if (address) {
            refreshBalance();
            const interval = setInterval(refreshBalance, 30000); // 30s refresh
            return () => clearInterval(interval);
        }
    }, [address, refreshBalance]);

    return (
        <WalletContext.Provider value={{
            address,
            balance,
            isConnected: !!address,
            provider,
            wallet,
            refreshBalance,
            connectWallet,
            saveNewWallet,
            logout
        }}>
            {children}
        </WalletContext.Provider>
    );
};
