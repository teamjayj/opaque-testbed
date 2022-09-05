import {
    loadCSV,
    getUrlWithHost,
    defaultRequestParameters,
    getSummaryOptions,
    getTestOptions,
} from "../common";
import { OpaqueClientRegister } from "./types";
import { sleep, check } from "k6";
import execution from "k6/execution";
import http from "k6/http";

export const options = getTestOptions();

export function handleSummary(data: any) {
    return getSummaryOptions(data, "opaque-register");
}

const csvData = loadCSV("opaque-client-register.csv");

export default function () {
    const {
        user_id: userId,
        register_init: registerInitData,
        register_finish: registerFinishData,
    }: OpaqueClientRegister = csvData[execution.vu.idInTest - 1];

    const registerInitRequest = JSON.stringify({
        userId,
        data: registerInitData,
    });

    const registerInitResponse = http.post(
        getUrlWithHost("register-init"),
        registerInitRequest,
        defaultRequestParameters
    );

    check(registerInitResponse, {
        "registerInit status is 200": () => registerInitResponse.status === 200,
    });

    sleep(0.5);

    const registerFinishRequest = JSON.stringify({
        userId,
        data: registerFinishData,
    });

    const registerFinishResponse = http.post(
        getUrlWithHost("register-finish"),
        registerFinishRequest,
        defaultRequestParameters
    );

    check(registerFinishResponse, {
        "registerFinish status is 200": () =>
            registerFinishResponse.status === 200,
    });

    sleep(0.5);
}
