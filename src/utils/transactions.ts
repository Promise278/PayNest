export type TxType = "sent" | "received";

export interface Transaction {
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
