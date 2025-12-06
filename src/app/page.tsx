"use client";

import { useEffect, useState } from "react";
import { getAssets, simulateGame, Asset } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, TrendingUp, Search, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TopPerformerCard from "@/components/TopPerformerCard";

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const data = await getAssets();
      setAssets(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async (id: string) => {
    setLoading(true);
    try {
      await simulateGame(id);
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
              Sports Stock Exchange
            </h1>
            <p className="text-slate-400 mt-1 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Live Market Data • Auto-refreshing
            </p>
          </motion.div>

          {/* Right side: Search + Add Funds */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors">
              + Add Funds
            </Button>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search players..."
                className="pl-10 bg-slate-900/50 border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Top Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-1"
          >
            <TopPerformerCard />
          </motion.div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Market Cap", value: "$1.2M", change: "+2.5%", icon: TrendingUp },
              { title: "Active Traders", value: "1,234", change: "+12%", icon: Activity },
              { title: "Top Gainer", value: "LUKA", change: "+5.4%", icon: TrendingUp },
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-slate-700 transition-colors h-full flex flex-col justify-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <p className="text-sm text-emerald-400 flex items-center mt-2 font-medium">
                      <stat.icon className="h-4 w-4 mr-1" /> {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-slate-800/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white text-xl">Market Overview</CardTitle>
                <span className="text-xs text-slate-500 font-mono">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-900/50">
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-semibold">Ticker</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Name</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Price</TableHead>
                    <TableHead className="text-slate-400 font-semibold">Season PTS</TableHead>
                    <TableHead className="text-right text-slate-400 font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredAssets.map((asset) => (
                      <motion.tr
                        key={asset.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                      >
                        <TableCell className="font-bold text-blue-400 font-mono">
                          <Link href={`/assets/${asset.id}`} className="hover:underline">
                            {asset.ticker}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-200 font-medium flex items-center gap-3">
                          {/* Tiny headshot in table */}
                          <img
                            src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${asset.id}.png`}
                            alt={asset.name}
                            className="w-8 h-8 rounded-full bg-slate-800 object-cover object-top"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/logoman.png' }}
                          />
                          <Link href={`/assets/${asset.id}`} className="hover:underline">
                            {asset.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <motion.div
                            key={asset.current_price}
                            initial={{ scale: 1.2, color: "#10b981" }}
                            animate={{ scale: 1, color: "#34d399" }}
                            className="font-bold font-mono"
                          >
                            ${asset.current_price.toFixed(2)}
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {asset.projected_stats?.PTS?.toFixed(1) || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSimulate(asset.id)}
                            disabled={loading}
                            className="bg-slate-800 text-slate-200 hover:bg-emerald-600 hover:text-white transition-all duration-300"
                          >
                            Simulate
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredAssets.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        No players found matching "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
