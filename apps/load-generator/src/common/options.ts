import { Options } from "k6/options";

export const trialTestRunOptions: Options = {
    scenarios: {
        default: {
            executor: "ramping-vus",
            startVUs: 1,
            stages: [
                {
                    duration: "20s",
                    target: 10,
                },
                {
                    duration: "10s",
                    target: 1,
                },
            ],
            gracefulRampDown: "30s",
        },
    },
};

export const fullTestRunOptions: Options = {
    scenarios: {
        default: {
            executor: "ramping-vus",
            startVUs: 1,
            stages: [
                {
                    duration: "60s",
                    target: 100,
                },
                {
                    duration: "60s",
                    target: 0,
                },
            ],
            gracefulRampDown: "0s",
        },
    },
};
