import { SharedArray } from "k6/data";

// @ts-ignore
import papaparse from "https://jslib.k6.io/papaparse/5.1.1/index.js";

export const urlWithHost = (route: string): string =>
  `http://${__ENV.HOSTNAME}/${route}`;

export const loadCSV = (dataName: string, fileName: string) => {
  return new SharedArray(
    dataName,
    () =>
      papaparse.parse(open(fileName), {
        header: true,
      }).data
  );
};
