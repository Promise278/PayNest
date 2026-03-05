export interface TokenItem {
    symbol: string;
    name?: string;
    balance: string | number;
    value: string | number;
    price: string | number;
    change: number;
    icon?: string;
}

interface TokenListProps {
    tokens: TokenItem[];
}

export default function TokenList({ tokens }: TokenListProps) {
    return (
        <div className="space-y-3">
            {tokens.map((token) => {
                const isPositive = token.change >= 0;
                const changeFormat = `${isPositive ? '+' : ''}${token.change.toFixed(2)}%`;

                return (
                    <div
                        key={token.symbol}
                        className="bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center shadow-inner shrink-0">
                                    <span className="text-xl text-zinc-300 font-bold">
                                        {token.icon || token.symbol.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white font-bold leading-tight mb-0.5">{token.name || token.symbol}</p>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <span className="text-zinc-400 font-medium">{typeof token.price === 'number' ? `$${token.price.toFixed(2)}` : token.price}</span>
                                        <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {changeFormat}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold leading-tight mb-0.5 whitespace-nowrap">
                                    {token.balance} <span className="text-zinc-500 font-medium ml-0.5">{token.symbol}</span>
                                </p>
                                <p className="text-zinc-500 text-xs font-semibold">
                                    {typeof token.value === 'number' ? `$${token.value.toFixed(2)}` : token.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
