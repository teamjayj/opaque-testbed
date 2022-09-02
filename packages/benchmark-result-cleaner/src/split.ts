import jq from "node-jq";
import fs from "fs";

const resultFilename = "my_test_result";

export async function query(metric: string, resultFilename: string) {
    const filter = `select(.type=="Point" and .metric == "${metric}")`;

    const output = await jq.run(filter, `data/input/${resultFilename}.json`, {
        output: "compact",
    });

    fs.writeFileSync(
        `data/output/${resultFilename}/${metric}.json`,
        output as string
    );
}

(async () => {
    await query("vus", resultFilename);
    await query("http_reqs", resultFilename);
    await query("http_req_duration", resultFilename);
})();
