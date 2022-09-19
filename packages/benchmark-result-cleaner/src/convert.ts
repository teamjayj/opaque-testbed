import { createObjectCsvWriter } from "csv-writer";
import { CsvRecord, Point, Statistics } from "./types";
import fs from "fs";
import ndjson from "ndjson";
import inquirer from "inquirer";
import { isAfter, differenceInMilliseconds } from "date-fns";

export async function writeToCSV(
    resultFilename: string,
    metric: string,
    records: CsvRecord[]
): Promise<void> {
    const csvOutputDirectory = `./data/output/${resultFilename}/csv`;
    fs.mkdirSync(csvOutputDirectory, { recursive: true });

    const independentVariables = [
        { id: "date", title: "date" },
        { id: "secondsElapsed", title: "seconds_elapsed" },
        { id: "url", title: "url" },
        { id: "vus", title: "vus" },
    ];

    const dependentVariables = [
        { id: "value", title: "value" },
        { id: "min", title: "min" },
        { id: "max", title: "max" },
        { id: "mean", title: "mean" },
        { id: "median", title: "median" },
        { id: "p90", title: "p90" },
        { id: "p95", title: "p95" },
    ];

    const csvWriter = createObjectCsvWriter({
        path: `${csvOutputDirectory}/${metric}.csv`,
        header: [...independentVariables, ...dependentVariables],
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

type VuBucket = {
    date: Date;
    vus: number;
};

async function convertJsonMetricToCsvRecords(
    testRun: string,
    metric: string,
    vuBuckets: VuBucket[] = []
): Promise<CsvRecord[]> {
    return new Promise((resolve, reject) => {
        const outputDirectory = `./data/output/${testRun}`;
        const records: CsvRecord[] = [];

        const valueBuckets: Map<string, number[]> = new Map();
        let currentVuBucketIndex = 0;
        let originDate: Date | undefined = undefined;

        fs.createReadStream(`${outputDirectory}/json/${metric}.json`)
            .pipe(ndjson.parse())
            .on("data", (point: Point) => {
                const { time: date, value, tags } = point.data;
                const url = tags?.url;
                const currentDate = new Date(date);

                let vus: number | undefined = undefined;

                if (vuBuckets.length > 0) {
                    if (
                        isAfter(
                            currentDate,
                            vuBuckets[currentVuBucketIndex].date
                        )
                    ) {
                        if (currentVuBucketIndex + 1 < vuBuckets.length) {
                            currentVuBucketIndex += 1;
                        }
                    }

                    vus = vuBuckets[currentVuBucketIndex].vus;
                }

                const dependentStatVariables: Statistics | undefined =
                    handleBucket(url, value, valueBuckets);

                let secondsElapsed = 0;

                if (originDate == null) {
                    originDate = currentDate;
                } else {
                    secondsElapsed =
                        differenceInMilliseconds(currentDate, originDate) /
                        1000;
                }

                records.push({
                    date,
                    url,
                    secondsElapsed,
                    vus,
                    value,
                    ...dependentStatVariables,
                });
            })
            .on("error", (error) => reject(error))
            .on("end", () => resolve(records));
    });
}

async function getVuBuckets(testRun: string) {
    const vuRecords: CsvRecord[] = await convertJsonMetricToCsvRecords(
        testRun,
        "vus"
    );

    await writeToCSV(testRun, "vus", vuRecords);

    const vuBuckets: VuBucket[] = [];

    for (const vuRecord of vuRecords) {
        vuBuckets.push({
            date: new Date(vuRecord.date),
            vus: vuRecord.value as number,
        });
    }

    return vuBuckets;
}

(async () => {
    const { testRunType } = await inquirer.prompt([
        {
            name: "testRunType",
            type: "list",
            message:
                "What type of test run result should have its metrics converted to CSV?",
            choices: ["trial", "full"],
        },
    ]);

    const { testRun } = await inquirer.prompt([
        {
            name: "testRun",
            type: "list",
            message:
                "What test run result should have its metrics converted to CSV?",
            choices: [
                `${testRunType}-result-potls-register`,
                `${testRunType}-result-potls-login`,
                `${testRunType}-result-opaque-register`,
                `${testRunType}-result-opaque-login`,
            ],
        },
    ]);

    const vuBuckets = await getVuBuckets(testRun);

    const metrics = [
        "http_reqs",
        "http_req_duration",
        "http_req_failed",
        "data_received",
        "data_sent",
    ];

    for (const metric of metrics) {
        const records: CsvRecord[] = await convertJsonMetricToCsvRecords(
            testRun,
            metric,
            vuBuckets
        );

        await writeToCSV(testRun, metric, records);
        console.log(`Converted ${metric} metric from ${testRun} into CSV`);
    }
})();
