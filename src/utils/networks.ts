export interface Network {
    id: string;
    name: string;
    shortName: string;
    rpcUrl: string;
    chainId: number;
    symbol: string;
    decimals: number;
    explorerUrl: string;
    explorerName: string;
    isTestnet: boolean;
    color: string;
}

export const NETWORKS: Record<string, Network> = {
    ethereum: {
        id: "ethereum",
        name: "Ethereum Mainnet",
        shortName: "Ethereum",
        rpcUrl: "https://ethereum.publicnode.com",
        chainId: 1,
        symbol: "ETH",
        decimals: 18,
        explorerUrl: "https://etherscan.io",
        explorerName: "Etherscan",
        isTestnet: false,
        color: "blue",
    },
    sepolia: {
        id: "sepolia",
        name: "Sepolia Testnet",
        shortName: "Sepolia",
        rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
        chainId: 11155111,
        symbol: "ETH",
        decimals: 18,
        explorerUrl: "https://sepolia.etherscan.io",
        explorerName: "Etherscan",
        isTestnet: true,
        color: "purple",
    },
    polygon: {
        id: "polygon",
        name: "Polygon",
        shortName: "Polygon",
        rpcUrl: "https://polygon-bor-rpc.publicnode.com",
        chainId: 137,
        symbol: "POL",
        decimals: 18,
        explorerUrl: "https://polygonscan.com",
        explorerName: "Polygonscan",
        isTestnet: false,
        color: "violet",
    },
    bnb: {
        id: "bnb",
        name: "BNB Smart Chain",
        shortName: "BNB Chain",
        rpcUrl: "https://bsc-rpc.publicnode.com",
        chainId: 56,
        symbol: "BNB",
        decimals: 18,
        explorerUrl: "https://bscscan.com",
        explorerName: "BscScan",
        isTestnet: false,
        color: "yellow",
    },
    arbitrum: {
        id: "arbitrum",
        name: "Arbitrum One",
        shortName: "Arbitrum",
        rpcUrl: "https://arbitrum-one-rpc.publicnode.com",
        chainId: 42161,
        symbol: "ETH",
        decimals: 18,
        explorerUrl: "https://arbiscan.io",
        explorerName: "Arbiscan",
        isTestnet: false,
        color: "cyan",
    },
    optimism: {
        id: "optimism",
        name: "Optimism",
        shortName: "Optimism",
        rpcUrl: "https://optimism-rpc.publicnode.com",
        chainId: 10,
        symbol: "ETH",
        decimals: 18,
        explorerUrl: "https://optimistic.etherscan.io",
        explorerName: "Optimism Explorer",
        isTestnet: false,
        color: "red",
    },
};

export const DEFAULT_NETWORK_ID = "sepolia";
export const ACTIVE_NETWORK_KEY = "paynest_active_network";

export const getSavedNetworkId = (): string =>
    localStorage.getItem(ACTIVE_NETWORK_KEY) || DEFAULT_NETWORK_ID;

export const saveNetworkId = (id: string): void =>
    localStorage.setItem(ACTIVE_NETWORK_KEY, id);

export const getNetworkColorClasses = (color: string) => {
    const map: Record<string, { bg: string; text: string; border: string }> = {
        blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40" },
        purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/40" },
        violet: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/40" },
        yellow: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/40" },
        cyan: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/40" },
        red: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40" },
    };
    return map[color] ?? map["blue"];
};
