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

export type CsvRecord = {
    date: string;
    value: string | number;
    url?: string;
};
