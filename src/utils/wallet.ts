import { Wallet, JsonRpcProvider, formatEther } from "ethers";

const ENCRYPTED_WALLET_KEY = "paynest_encrypted_wallet";
const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"; // Public Sepolia RPC

export interface WalletState {
    address: string;
    balance: string;
    mnemonicSentences?: string;
}

export const getProvider = () => new JsonRpcProvider(RPC_URL);

export const saveWallet = async (mnemonic: string, password: string) => {
    const wallet = Wallet.fromPhrase(mnemonic);
    const encryptedJson = await wallet.encrypt(password);
    localStorage.setItem(ENCRYPTED_WALLET_KEY, encryptedJson);
    return wallet.address;
};

export const loadWallet = async (password: string) => {
    const encryptedJson = localStorage.getItem(ENCRYPTED_WALLET_KEY);
    if (!encryptedJson) return null;

    const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
    return wallet.connect(getProvider());
};

export const isWalletSaved = () => !!localStorage.getItem(ENCRYPTED_WALLET_KEY);

export const getBalance = async (address: string) => {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return formatEther(balance);
};

export const clearWallet = () => {
    localStorage.removeItem(ENCRYPTED_WALLET_KEY);
};
