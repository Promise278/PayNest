import { createContext } from "react";
import { JsonRpcProvider, HDNodeWallet, Wallet } from "ethers";

export interface WalletContextType {
    address: string | null;
    balance: string;
    isConnected: boolean;
    provider: JsonRpcProvider | null;
    wallet: HDNodeWallet | Wallet | null;
    refreshBalance: () => Promise<void>;
    connectWallet: (password: string) => Promise<boolean>;
    saveNewWallet: (mnemonic: string, password: string) => Promise<void>;
    logout: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);
