import jq from "node-jq";
import fs from "fs";
import inquirer from "inquirer";

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
    const { testRunType } = await inquirer.prompt([
        {
            name: "testRunType",
            type: "list",
            message: "What type of test run result should be split?",
            choices: ["trial", "full"],
        },
    ]);

    const { testRun } = await inquirer.prompt([
        {
            name: "testRun",
            type: "list",
            message: "What test run result should be split?",
            choices: [
                `${testRunType}-result-potls-register`,
                `${testRunType}-result-potls-login`,
                `${testRunType}-result-opaque-register`,
                `${testRunType}-result-opaque-login`,
            ],
        },
    ]);

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
        console.log(`Splitted ${metric} metric from ${testRun} as JSON`);
    }
})();
