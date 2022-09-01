import {
    InMemoryOpaqueCredentialStore,
    InMemoryOpaqueSessionStore,
} from "@teamjayj/opaque-core";
import { isLoadTestingEnvironment } from "./app";

export class ExposedOpaqueCredentialStore extends InMemoryOpaqueCredentialStore {
    async store(
        credentialId: string,
        credentialFile: Uint8Array
    ): Promise<void> {
        if (isLoadTestingEnvironment()) {
            return;
        }

        super.store(credentialId, credentialFile);
    }

    getCache(): Map<string, Uint8Array> {
        return this.cache;
    }
}

export class ExposedOpaqueSessionStore extends InMemoryOpaqueSessionStore {
    async store(
        sessionId: string,
        expectedAuthResult: Uint8Array,
        ttl?: number | undefined
    ): Promise<void> {
        if (isLoadTestingEnvironment()) {
            return;
        }

        super.store(sessionId, expectedAuthResult, ttl);
    }

    getCache(): Map<string, Uint8Array> {
        return this.cache;
    }
}
