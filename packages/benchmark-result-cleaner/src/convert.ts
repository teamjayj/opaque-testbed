import { createObjectCsvWriter } from "csv-writer";
import { CsvHeader, CsvRecord, Point, Statistics } from "./types";
import fs from "fs";
import ndjson from "ndjson";

export async function convertToCSV(
    resultFilename: string,
    metric: string,
    headers: CsvHeader[] = []
) {
    const outputDirectory = `./data/output/${resultFilename}`;
    const records: CsvRecord[] = await readRecords(outputDirectory, metric);

    const csvOutputDirectory = `${outputDirectory}/csv`;
    fs.mkdirSync(csvOutputDirectory, { recursive: true });

    const csvWriter = createObjectCsvWriter({
        path: `${csvOutputDirectory}/${metric}.csv`,
        header: [
            { id: "date", title: "date" },
            { id: "value", title: "value" },
            { id: "min", title: "min" },
            { id: "max", title: "max" },
            { id: "mean", title: "mean" },
            { id: "median", title: "median" },
            { id: "p90", title: "p90" },
            { id: "p95", title: "p95" },
            { id: "url", title: "url" },
            ...headers,
        ],
    });

    await csvWriter.writeRecords(records);
}
const computeMin = (values: number[]) => Math.min(...values);
const computeMax = (values: number[]) => Math.max(...values);
const computeMean = (values: number[]) =>
    values.reduce((a, b) => a + b) / values.length;

const computeQuantile = (values: number[], q: number) => {
    const sorted = values.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

function computeStatistics(values: number[]): Statistics {
    return {
        min: computeMin(values),
        max: computeMax(values),
        mean: computeMean(values),
        median: computeQuantile(values, 0.5),
        p90: computeQuantile(values, 0.9),
        p95: computeQuantile(values, 0.95),
    };
}

function handleBucket(
    url: string | undefined,
    value: number,
    valueBuckets: Map<string, number[]>
): Statistics | undefined {
    if (url == null) {
        return;
    }

    const values = valueBuckets.get(url);

    if (values == null) {
        const initialValues = [value];
        valueBuckets.set(url, initialValues);
        return computeStatistics(initialValues);
    }

    values.push(value);

    return computeStatistics(values);
}
async function readRecords(
    outputDirectory: string,
    metric: string
): Promise<CsvRecord[]> {
    return new Promise((resolve, reject) => {
        const records: CsvRecord[] = [];

        const valueBuckets: Map<string, number[]> = new Map();

        fs.createReadStream(`${outputDirectory}/json/${metric}.json`)
            .pipe(ndjson.parse())
            .on("data", (point: Point) => {
                const { time: date, value, tags } = point.data;
                const url = tags?.url;

                const stats: Statistics | undefined = handleBucket(
                    url,
                    value,
                    valueBuckets
                );

                records.push({
                    date,
                    value,
                    url,
                    ...stats,
                });
            })
            .on("error", (error) => reject(error))
            .on("end", () => resolve(records));
    });
}

(async () => {
    const testRun = "trial-result-potls-register";

    const metrics = [
        "vus",
        "http_reqs",
        "http_req_duration",
        "http_req_failed",
        "data_received",
        "data_sent",
    ];

    for (const metric of metrics) {
        await convertToCSV(testRun, metric);
    }
})();
