"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAsset, getAssetHistory, Asset } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Activity } from "lucide-react";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assetData, historyData] = await Promise.all([
                    getAsset(id),
                    getAssetHistory(id),
                ]);
                setAsset(assetData);
                setHistory(historyData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!asset) return <div className="p-8 text-white">Asset not found</div>;

    const formatXAxis = (tickItem: string) => {
        return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <Link href="/">
                    <Button variant="ghost" className="text-slate-400 hover:text-white pl-0">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
                    </Button>
                </Link>

                <header className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                            {asset.name} <span className="text-2xl text-slate-500 font-mono">({asset.ticker})</span>
                        </h1>
                        <p className="text-emerald-400 text-2xl font-bold mt-2 font-mono">
                            ${asset.current_price.toFixed(2)}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-400">Price History</CardTitle>
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
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-slate-400">Season Stats (Avg)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {Object.entries(asset.projected_stats || {}).map(([key, value]) => (
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
