"use client";

import { useEffect, useState } from "react";
import { getTopPerformer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function TopPerformerCard() {
    const [performer, setPerformer] = useState<any>(null);

    useEffect(() => {
        async function fetchPerformer() {
            const data = await getTopPerformer();
            if (data) setPerformer(data);
        }
        fetchPerformer();
    }, []);

    if (!performer) return (
        <Card className="bg-slate-900/50 border-slate-800 h-full flex items-center justify-center">
            <div className="text-slate-500 text-sm">Loading Top Performer...</div>
        </Card>
    );

    return (
        <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30 h-full relative overflow-hidden group hover:border-indigo-500/50 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="w-24 h-24 text-indigo-400" />
            </div>

            <CardHeader className="pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    Daily Top Performer
                </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800 mb-3 border-2 border-indigo-500/50 shadow-lg overflow-hidden relative">
                    <img
                        src={`https://cdn.nba.com/headshots/nba/latest/1040x760/${performer.id}.png`}
                        alt={performer.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.nba.com/headshots/nba/latest/1040x760/logoman.png' }}
                    />
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">{performer.name}</h3>
                <div className="text-indigo-200 text-xs font-mono mb-3">LAST GAME STATS</div>

                <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="bg-slate-900/60 rounded p-1">
                        <div className="text-base font-bold text-white">{performer.stats.PTS}</div>
                        <div className="text-[10px] text-slate-400">PTS</div>
                    </div>
                    <div className="bg-slate-900/60 rounded p-1">
                        <div className="text-base font-bold text-white">{performer.stats.REB}</div>
                        <div className="text-[10px] text-slate-400">REB</div>
                    </div>
                    <div className="bg-slate-900/60 rounded p-1">
                        <div className="text-base font-bold text-white">{performer.stats.AST}</div>
                        <div className="text-[10px] text-slate-400">AST</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
