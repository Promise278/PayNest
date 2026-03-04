import { Wallet, JsonRpcProvider, formatEther } from "ethers";
import { NETWORKS, getSavedNetworkId } from "./networks";

const ENCRYPTED_WALLET_KEY = "paynest_encrypted_wallet";

export interface WalletState {
    address: string;
    balance: string;
    mnemonicSentences?: string;
}

export const getProvider = (networkId?: string) => {
    const id = networkId || getSavedNetworkId();
    const network = NETWORKS[id];
    if (!network) throw new Error(`Unknown network: ${id}`);
    return new JsonRpcProvider(network.rpcUrl);
};

export const saveWallet = async (mnemonic: string, password: string) => {
    const wallet = Wallet.fromPhrase(mnemonic);
    const encryptedJson = await wallet.encrypt(password);
    localStorage.setItem(ENCRYPTED_WALLET_KEY, encryptedJson);
    return wallet.address;
};

export const loadWallet = async (password: string, networkId?: string) => {
    const encryptedJson = localStorage.getItem(ENCRYPTED_WALLET_KEY);
    if (!encryptedJson) return null;
    const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
    return wallet.connect(getProvider(networkId));
};

export const getPrivateKey = async (password: string): Promise<string> => {
    const encryptedJson = localStorage.getItem(ENCRYPTED_WALLET_KEY);
    if (!encryptedJson) throw new Error("No wallet found");
    const wallet = await Wallet.fromEncryptedJson(encryptedJson, password);
    return wallet.privateKey;
};

export const isWalletSaved = () => !!localStorage.getItem(ENCRYPTED_WALLET_KEY);

export const getBalance = async (address: string, networkId?: string) => {
    const provider = getProvider(networkId);
    const balance = await provider.getBalance(address);
    return formatEther(balance);
};

export const clearWallet = () => {
    localStorage.removeItem(ENCRYPTED_WALLET_KEY);
};
