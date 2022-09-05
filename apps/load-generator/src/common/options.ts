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
                    duration: "110s",
                    target: 100,
                },
                {
                    duration: "100s",
                    target: 90,
                },
                {
                    duration: "90s",
                    target: 80,
                },
                {
                    duration: "80s",
                    target: 70,
                },
                {
                    duration: "70s",
                    target: 60,
                },
                {
                    duration: "60s",
                    target: 50,
                },
                {
                    duration: "50s",
                    target: 40,
                },
                {
                    duration: "40s",
                    target: 30,
                },
                {
                    duration: "30s",
                    target: 20,
                },
                {
                    duration: "20s",
                    target: 10,
                },
                {
                    duration: "10s",
                    target: 1,
                },
            ],
            gracefulRampDown: "110s",
        },
    },
};
