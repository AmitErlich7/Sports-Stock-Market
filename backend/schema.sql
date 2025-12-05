-- Users table (managed by Supabase Auth usually, but defining public profile here)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    balance DECIMAL(12, 2) DEFAULT 1000.00 -- Starting balance
);

-- Assets (Players/Teams)
CREATE TABLE public.assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    ticker TEXT UNIQUE NOT NULL, -- e.g. LEBRON, LAKERS
    type TEXT CHECK (type IN ('PLAYER', 'TEAM')),
    current_price DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    projected_stats JSONB, -- e.g. { "points": 25.5, "assists": 7.0 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio (User Holdings)
CREATE TABLE public.portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id),
    asset_id UUID REFERENCES public.assets(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    average_buy_price DECIMAL(10, 2) NOT NULL,
    UNIQUE(user_id, asset_id)
);

-- Match Logs (Historical Performance)
CREATE TABLE public.match_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id),
    game_date TIMESTAMP WITH TIME ZONE NOT NULL,
    opponent TEXT,
    stats JSONB NOT NULL, -- Actual stats: { "points": 30, ... }
    performance_score DECIMAL(10, 2), -- Calculated score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price History (For Charts)
CREATE TABLE public.price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id),
    price DECIMAL(10, 2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
