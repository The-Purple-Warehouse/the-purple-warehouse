import { assert } from "console";
import {
    generateAPIKey,
    addAPIKey,
    enableAPIKey,
    disableAPIKey,
    verifyAPIKey,
    removeAll,
    getAll
} from "../helpers/apiKey";

const keyOptions = {
    name: "Daniel Gergov",
    team: "1072",
    app: "TPW",
    scopes: ["request", "write"],
    expiration: Date.now() + 1000 * 60 * 60 * 24 * 7,
    source: "manual"
};

async function testGenerateKey() {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
        const key = generateAPIKey();
        assert(key != null && !keys.has(key), "Generated key is null or already exists");
        keys.add(key);
    }
}

async function testKeys() {
    const obj = await addAPIKey(keyOptions) as any;
    assert(obj != null);
    assert(obj.key != null);
    assert(obj.identifier != null);
}

async function testKeyVerification() {
    const obj = await addAPIKey(keyOptions) as any;
    let unhashedKey = obj.key;
    let identifier = obj.identifier;
    const properties = keyOptions;

    // verification passing in extra scopes
    assert(!(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, properties.scopes.concat(["everything"]))), "Verification passed with extra scopes");
    assert(!(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, properties.scopes.concat(["everything, read"]))), "Verification passed with 2 extra scopes");

    // verification passing in given scopes or less
    assert(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, properties.scopes), "Verification failed with given scopes");
    assert(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, [properties.scopes[0]]), "Verification failed with 1 scope");
    assert(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, [properties.scopes[1]]), "Verification failed with 1 scope");

    // verification passing in no scopes
    assert(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, []), "Verification failed with no scopes");

    // verification with not live key
    await disableAPIKey(identifier);
    assert(!(await verifyAPIKey(unhashedKey, properties.name, properties.app, properties.team, properties.scopes)), "Verification passed with disabled key");

    await enableAPIKey(unhashedKey);
}

(async () => {
    await removeAll();
    await testGenerateKey();
    await testKeys();
    await testKeyVerification();
})();