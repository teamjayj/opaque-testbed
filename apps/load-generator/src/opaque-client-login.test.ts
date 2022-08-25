import { loadCSV, urlWithHost } from "./util";

import { sleep, check } from "k6";
import { Options } from "k6/options";
import http from "k6/http";

export let options: Options = {
  vus: 1,
  duration: "10s",
};

const csvData = loadCSV("opaqueClientLogin", "../data/opaque-client-login.csv");

export default () => {
  console.log(csvData);

  const response = http.post(urlWithHost("login"));

  check(response, {
    "status is 200": () => response.status === 200,
  });

  sleep(1);
};
