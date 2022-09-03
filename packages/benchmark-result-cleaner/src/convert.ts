import { createObjectCsvWriter } from "csv-writer";
import { CsvHeader, CsvRecord, Point } from "./types";
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
            { id: "url", title: "url" },
            ...headers,
        ],
    });

    await csvWriter.writeRecords(records);
}

async function readRecords(
    outputDirectory: string,
    metric: string
): Promise<CsvRecord[]> {
    return new Promise((resolve, reject) => {
        const records: CsvRecord[] = [];

        fs.createReadStream(`${outputDirectory}/json/${metric}.json`)
            .pipe(ndjson.parse())
            .on("data", (point: Point) => {
                records.push({
                    date: point.data.time,
                    value: point.data.value,
                    url: point.data.tags?.url,
                });
            })
            .on("error", (error) => reject(error))
            .on("end", () => resolve(records));
    });
}

(async () => {
    const testRun = "trial-result-opaque-register";

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
