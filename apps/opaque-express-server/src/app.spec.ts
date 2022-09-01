import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { InMemoryOpaqueCredentialStore } from "@teamjayj/opaque-core";

describe("OPAQUE express server test", () => {
    it("should create app", async () => {
        const app = await createApp(
            new InMemoryOpaqueCredentialStore(),
            new InMemoryOpaqueCredentialStore()
        );

        expect(app).toBeTruthy();
    });
});
