export type Tag = {
    url?: string;
};

export type Point = {
    type: string;
    data: {
        time: string;
        value: number;
    };
    tag?: Tag;
    metric: string;
};

export type CsvHeader = {
    id: string;
    title: string;
};

export type CsvRecord = {
    date: string;
    value: string | number;
};
