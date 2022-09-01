import { SharedArray } from "k6/data";

// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

export function getUrlWithHost(route: string): string {
    return `http://${__ENV.HOSTNAME}/${route}`;
}

export function loadCSV(fileName: string) {
    return new SharedArray(
        fileName,
        () =>
            papaparse.parse(open("../data/" + fileName), {
                header: true,
            }).data
    );
}

export const requestParams = {
    headers: {
        "Content-Type": "application/json",
    },
};
