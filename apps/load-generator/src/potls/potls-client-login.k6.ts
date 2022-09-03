import {
    loadCSV,
    getUrlWithHost,
    defaultRequestParameters,
    getSummaryOptions,
    getTestOptions,
} from "../common";
import { PotlsClientLoginRegister } from "./types";
import { sleep, check } from "k6";
import execution from "k6/execution";
import http from "k6/http";

export const options = getTestOptions();

export function handleSummary(data: any) {
    return getSummaryOptions(data, "potls-login");
}

const csvData = loadCSV("potls-client-login-register.csv");

export default function () {
    const {
        user_id: username,
        plaintext_password: password,
    }: PotlsClientLoginRegister = csvData[execution.vu.idInTest - 1];

    const user = JSON.stringify({ username, password });
    const response = http.post(
        getUrlWithHost("login"),
        user,
        defaultRequestParameters
    );

    check(response, {
        "status is 200": () => response.status === 200,
    });

    sleep(1);
}
