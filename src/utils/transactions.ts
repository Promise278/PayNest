import { formatEther } from "ethers";
import { type Network } from "./networks";

export type TxType = "sent" | "received"; export interface Transaction {
    hash: string;
    type: TxType;
    amount: string;
    to?: string;
    from?: string;
    timestamp: number;
    network: string;
    status: "pending" | "confirmed" | "failed";
}

const storageKey = (address: string) => `paynest_txs_${address.toLowerCase()}`;

export const loadTransactions = (address: string): Transaction[] => {
    try {
        const raw = localStorage.getItem(storageKey(address));
        if (!raw) return [];
        return JSON.parse(raw) as Transaction[];
    } catch {
        return [];
    }
};

export const saveTransaction = (address: string, tx: Transaction): void => {
    const existing = loadTransactions(address);
    const filtered = existing.filter((t) => t.hash !== tx.hash);
    const updated = [tx, ...filtered].slice(0, 100);
    localStorage.setItem(storageKey(address), JSON.stringify(updated));
};

export const clearTransactions = (address: string): void => {
    localStorage.removeItem(storageKey(address));
};

export const formatRelativeTime = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
};

const getExplorerApiUrl = (explorerUrl: string) => {
    if (explorerUrl.includes("sepolia.etherscan.io")) return "https://api-sepolia.etherscan.io/api";
    if (explorerUrl.includes("etherscan.io")) return "https://api.etherscan.io/api";
    if (explorerUrl.includes("polygonscan.com")) return "https://api.polygonscan.com/api";
    if (explorerUrl.includes("bscscan.com")) return "https://api.bscscan.com/api";
    if (explorerUrl.includes("arbiscan.io")) return "https://api.arbiscan.io/api";
    if (explorerUrl.includes("optimistic.etherscan.io")) return "https://api-optimistic.etherscan.io/api";
    return "";
};

export const syncTransactionsFromExplorer = async (address: string, network: Network): Promise<void> => {
    const apiUrl = getExplorerApiUrl(network.explorerUrl);
    if (!apiUrl) return;

    try {
        const response = await fetch(`${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc`);
        const data = await response.json();

        if (data.status === "1" && Array.isArray(data.result)) {
            const existing = loadTransactions(address);
            const newTxs: Transaction[] = data.result.map((tx: Record<string, string>) => {
                const isReceived = tx.to.toLowerCase() === address.toLowerCase();
                return {
                    hash: tx.hash,
                    type: isReceived ? "received" : "sent",
                    amount: formatEther(tx.value),
                    to: tx.to,
                    from: tx.from,
                    timestamp: parseInt(tx.timeStamp) * 1000,
                    network: network.id,
                    status: tx.isError === "0" ? "confirmed" : "failed"
                };
            });

            const merged = [...existing];
            newTxs.forEach((newTx) => {
                const idx = merged.findIndex(t => t.hash === newTx.hash);
                if (idx !== -1) merged[idx] = newTx;
                else merged.push(newTx);
            });

            merged.sort((a, b) => b.timestamp - a.timestamp);
            const updated = merged.slice(0, 100);
            localStorage.setItem(storageKey(address), JSON.stringify(updated));
        }
    } catch (e) {
        console.error("Failed to sync transactions", e);
    }
};
