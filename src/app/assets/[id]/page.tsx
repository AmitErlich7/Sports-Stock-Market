"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAsset, getAssetHistory, getAssetLogs, Asset } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Activity, DollarSign, Wallet } from "lucide-react";
import Link from "next/link";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function AssetPage() {
    const params = useParams();
    const id = params.id as string;
    const [asset, setAsset] = useState<Asset | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetData, historyData, logsData] = await Promise.all([
                    getAsset(id),
                    getAssetHistory(id),
                    getAssetLogs(id),
                ]);
                setAsset(assetData);
                setHistory(historyData);
                setLogs(logsData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-white min-h-screen bg-slate-950 flex items-center justify-center">Loading...</div>;
    if (!asset) return <div className="p-8 text-white min-h-screen bg-slate-950 flex items-center justify-center">Asset not found</div>;

    const formatXAxis = (tickItem: string) => {
        return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const latestLog = logs.length > 0 ? logs[0] : null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-white pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
                    </Button>
                </Link>

                <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800 backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-lg relative shrink-0">
                            <img
                                src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${asset.id}.png`}
                                alt={asset.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/logoman.png' }}
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white flex flex-col md:flex-row md:items-center gap-2">
                                {asset.name}
                                <span className="text-xl text-slate-500 font-mono bg-slate-800 px-2 py-1 rounded">
                                    {asset.ticker}
                                </span>
                            </h1>
                            <p className="text-emerald-400 text-3xl font-bold mt-2 font-mono flex items-center gap-2">
                                ${asset.current_price.toFixed(2)}
                                <span className="text-sm font-normal text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded-full">Current Price</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12 text-lg shadow-lg shadow-emerald-900/20">
                            Buy {asset.ticker}
                        </Button>
                        <Button variant="destructive" className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white font-bold px-8 h-12 text-lg shadow-lg shadow-red-900/20">
                            Sell {asset.ticker}
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-slate-900 border-slate-800 shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-slate-400 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Price History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="#475569"
                                        tickFormatter={formatXAxis}
                                    />
                                    <YAxis
                                        stroke="#475569"
                                        domain={['auto', 'auto']}
                                        tickFormatter={(val) => `$${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                        labelFormatter={(label) => new Date(label).toLocaleString()}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {/* Last Game Performance Card */}
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity className="w-32 h-32 text-indigo-400" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-indigo-400 uppercase tracking-wider text-sm font-bold flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Last Night's Game
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {latestLog ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                            <div>
                                                <div className="text-sm text-slate-500">Opponent</div>
                                                <div className="text-lg font-bold text-white">{latestLog.opponent}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-slate-500">Date</div>
                                                <div className="text-white text-sm">{new Date(latestLog.game_date).toLocaleDateString()}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-white">{latestLog.stats.PTS}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">PTS</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-white">{latestLog.stats.REB}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">REB</div>
                                            </div>
                                            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                                                <div className="text-2xl font-bold text-white">{latestLog.stats.AST}</div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wider">AST</div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                                                <span>Performance Score</span>
                                                <span className="text-white font-mono">{latestLog.performance_score.toFixed(1)}</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                    style={{ width: `${Math.min(latestLog.performance_score, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-slate-500 italic">
                                        No recent games recorded.
                                        <br />
                                        <span className="text-xs">Run a simulation to generate logs!</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Season Stats Card - Kept below */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-400 text-sm uppercase tracking-wider">Season Avg (Projected)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(asset.projected_stats || {}).slice(0, 3).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center border-b border-slate-800 pb-2 last:border-0">
                                            <span className="text-slate-400 font-medium">{key}</span>
                                            <span className="text-white font-bold">{Number(value).toFixed(1)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
