const API_URL = "http://localhost:8000";

export interface Asset {
    id: string;
    name: string;
    ticker: string;
    current_price: number;
    projected_stats: any;
}

export async function getAssets(): Promise<Asset[]> {
    const res = await fetch(`${API_URL}/assets`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
}

export async function simulateGame(assetId: string) {
    const res = await fetch(`${API_URL}/simulate?asset_id=${assetId}`, {
        method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to simulate game');
    return res.json();
}

export async function getAsset(id: string): Promise<Asset> {
    const res = await fetch(`${API_URL}/assets/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch asset');
    return res.json();
}

export async function getAssetHistory(id: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/assets/${id}/history`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch asset history');
    return res.json();
}

export async function getTopPerformer() {
    try {
        const res = await fetch(`${API_URL}/top-performer`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function getAssetLogs(id: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/assets/${id}/logs`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch asset logs');
    return res.json();
}
