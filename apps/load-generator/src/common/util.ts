import { SharedArray } from "k6/data";
import { trialTestRunOptions, fullTestRunOptions } from "./options";

// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export function getUrlWithHost(route: string): string {
    return `http://${__ENV.HOSTNAME}/${route}`;
}

export function loadCSV(fileName: string): [] {
    return new SharedArray(
        fileName,
        () =>
            papaparse.parse(open("../data/" + fileName), {
                header: true,
            }).data
    );
}

export const getTestRunType = (): string => {
    const testRunType = __ENV.TEST_RUN_TYPE;

    if (testRunType == null) {
        throw "No test run environment var set";
    }

    return testRunType.toLowerCase();
};

export const isTrialTestRun = (): boolean => getTestRunType() === "trial";

export const getSummaryOptions = (data: any, outputFilename: string) => {
    const jsonFileName = `${getTestRunType()}-summary-${outputFilename}.json`;

    return {
        stdout: textSummary(data, { indent: " ", enableColors: true }),
        [jsonFileName]: JSON.stringify(data),
    };
};

export const getTestOptions = () =>
    isTrialTestRun() ? trialTestRunOptions : fullTestRunOptions;

export const defaultRequestParameters = {
    headers: {
        "Content-Type": "application/json",
    },
};
