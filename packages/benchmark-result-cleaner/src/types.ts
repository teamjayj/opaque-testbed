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
    value: string | number;
    url?: string;
} & Partial<Statistics>;
