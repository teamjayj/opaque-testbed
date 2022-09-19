export type Tags = {
    url?: string;
};

export type Point = {
    type: string;
    data: {
        time: string;
        value: number;
        tags?: Tags;
    };
    metric: string;
};

export type CsvHeader = {
    id: string;
    title: string;
};

export type Statistics = {
    min: number;
    max: number;
    mean: number;
    median: number;
    p90: number;
    p95: number;
};

export type CsvRecord = {
    date: string;
    secondsElapsed: number;
    url?: string;
    vus?: number;
    value: string | number;
} & Partial<Statistics>;

export type MemoryUsageCsvRecord = {
    date: string;
    secondsElapsed: number;
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    arrayBuffers: number;
};
