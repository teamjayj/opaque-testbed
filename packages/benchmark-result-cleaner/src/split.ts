import jq from "node-jq";
import fs from "fs";

export async function query(testRun: string, metric: string): Promise<void> {
    const filter = `select(.type=="Point" and .metric == "${metric}")`;

    const output = await jq.run(filter, `data/input/${testRun}.json`, {
        output: "compact",
    });

    const splitOutputDirectory = `data/output/${testRun}/json`;

    fs.mkdirSync(splitOutputDirectory, { recursive: true });
    fs.writeFileSync(
        `${splitOutputDirectory}/${metric}.json`,
        output as string
    );
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
        await query(testRun, metric);
    }
})();
