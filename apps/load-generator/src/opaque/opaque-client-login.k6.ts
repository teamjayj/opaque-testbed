import {
    loadCSV,
    getUrlWithHost,
    defaultRequestParameters,
    getSummaryOptions,
    getTestOptions,
} from "../common";
import { OpaqueClientLogin } from "./types";
import { sleep, check, JSONObject } from "k6";
import execution from "k6/execution";
import http from "k6/http";

export const options = getTestOptions();

export function handleSummary(data: any) {
    return getSummaryOptions(data, "opaque-login");
}

const csvData = loadCSV("opaque-client-login.csv");

export default function () {
    const {
        user_id: userId,
        session_id: sessionId,
        auth_init: loginInitData,
        auth_finish: loginFinishData,
        session_key: sessionKey,
    }: OpaqueClientLogin = csvData[execution.vu.idInTest - 1];

    const loginInitRequest = JSON.stringify({
        userId,
        data: loginInitData,
    });

    const loginInitResponse = http.post(
        getUrlWithHost("login-init"),
        loginInitRequest,
        defaultRequestParameters
    );

    check(loginInitResponse, {
        "loginInit status is 200": () => loginInitResponse.status === 200,
    });

    sleep(0.5);

    const loginFinishRequest = JSON.stringify({
        sessionId,
        data: loginFinishData,
    });

    const loginFinishResponse = http.post(
        getUrlWithHost("login-finish"),
        loginFinishRequest,
        defaultRequestParameters
    );

    const responseJson = loginFinishResponse.json() as JSONObject;

    check(loginFinishResponse, {
        "loginFinish status is 200": () => loginFinishResponse.status === 200,
        "loginFinish has same session key": () =>
            responseJson.sessionKey === sessionKey,
    });

    sleep(0.5);
}
