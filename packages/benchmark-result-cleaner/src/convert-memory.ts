import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import ndjson from "ndjson";
import inquirer from "inquirer";
import { differenceInMilliseconds } from "date-fns";
import { MemoryUsageCsvRecord } from "./types";

export async function writeToCSV(
    resultFilename: string,
    records: MemoryUsageCsvRecord[]
): Promise<void> {
    const csvOutputDirectory = `./data/output/memory-usage`;
    fs.mkdirSync(csvOutputDirectory, { recursive: true });

    const independentVariables = [
        { id: "date", title: "date" },
        { id: "secondsElapsed", title: "seconds_elapsed" },
    ];

    const dependentVariables = [
        { id: "heapUsed", title: "heapUsed" },
        { id: "heapTotal", title: "heapTotal" },
        { id: "external", title: "external" },
        { id: "rss", title: "rss" },
        { id: "arrayBuffers", title: "arrayBuffers" },
    ];

    const csvWriter = createObjectCsvWriter({
        path: `${csvOutputDirectory}/${resultFilename}.csv`,
        header: [...independentVariables, ...dependentVariables],
    });

    await csvWriter.writeRecords(records);
}

async function convertMemoryUsageJsonToCsvRecords(
    memoryUsageFile: string
): Promise<MemoryUsageCsvRecord[]> {
    return new Promise((resolve, reject) => {
        const inputDirectory = `./data/input/${memoryUsageFile}.json`;

        const records: MemoryUsageCsvRecord[] = [];

        let originDate: Date | undefined = undefined;

        fs.createReadStream(inputDirectory)
            .pipe(ndjson.parse())
            .on("data", (record: MemoryUsageCsvRecord) => {
                const {
                    date,
                    heapUsed,
                    heapTotal,
                    external,
                    rss,
                    arrayBuffers,
                } = record;

                const currentDate = new Date(date);

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
                    secondsElapsed,
                    heapUsed,
                    heapTotal,
                    external,
                    rss,
                    arrayBuffers,
                });
            })
            .on("error", (error) => reject(error))
            .on("end", () => resolve(records));
    });
}

(async () => {
    const { memoryUsageFile } = await inquirer.prompt([
        {
            name: "memoryUsageFile",
            type: "list",
            message:
                "What memory usage file should have its metrics converted to CSV?",
            choices: [
                `potls-register-used-memory`,
                `potls-login-used-memory`,
                `opaque-register-used-memory`,
                `opaque-login-used-memory`,
            ],
        },
    ]);

    const records: MemoryUsageCsvRecord[] =
        await convertMemoryUsageJsonToCsvRecords(memoryUsageFile);

    await writeToCSV(memoryUsageFile, records);
})();
