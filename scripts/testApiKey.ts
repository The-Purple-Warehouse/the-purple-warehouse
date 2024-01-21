import { assert } from "console";
import {
    generateAPIKey,
    addAPIKey,
    enableAPIKey,
    disableAPIKey,
    verifyAPIKey,
    removeAll
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
        assert(
            key != null && !keys.has(key),
            "Generated key is null or already exists"
        );
        keys.add(key);
    }
}

async function testKeys() {
    const { key: unhashedKey, ...obj } = (await addAPIKey(keyOptions)) as any;
    const properties = obj._doc;
    console.log(properties);
    assert(properties != null);
    assert(
        properties.apiKey != null &&
            unhashedKey != null &&
            properties.apiKey.length === 64
    );
    assert(properties.name === keyOptions.name);
    assert(properties.team === keyOptions.team);
    assert(properties.app === keyOptions.app);
    assert(properties.scopes.length === keyOptions.scopes.length);
    for (let scope of keyOptions.scopes) {
        assert(properties.scopes.includes(scope));
    }
    assert(properties.expiration === keyOptions.expiration);
    assert(properties.source === keyOptions.source);
    assert(properties.live);
    assert(properties.hashType === "sha256");

    const disabledObj = (await disableAPIKey(unhashedKey)) as any;
    assert(disabledObj != null, "Disabled key is null");
    assert(!disabledObj.live, "Disabled key is still live");

    const enabledObj = (await enableAPIKey(unhashedKey)) as any;
    assert(enabledObj != null, "Enabled key is null");
    assert(enabledObj.live, "Enabled key is not live");
}

async function testKeyVerification() {
    const { key: unhashedKey, ...obj } = (await addAPIKey(keyOptions)) as any;
    const properties = obj._doc;

    // verification passing in extra scopes
    assert(
        !(await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            properties.scopes.concat(["everything"])
        )),
        "Verification passed with extra scopes"
    );
    assert(
        !(await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            properties.scopes.concat(["everything, read"])
        )),
        "Verification passed with 2 extra scopes"
    );

    // verification passing in given scopes or less
    assert(
        await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            properties.scopes
        ),
        "Verification failed with given scopes"
    );
    assert(
        await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            [properties.scopes[0]]
        ),
        "Verification failed with 1 scope"
    );
    assert(
        await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            [properties.scopes[1]]
        ),
        "Verification failed with 1 scope"
    );

    // verification passing in no scopes
    assert(
        await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            []
        ),
        "Verification failed with no scopes"
    );

    // verification with not live key
    const disabledObj = (await disableAPIKey(unhashedKey)) as any;
    assert(
        !(await verifyAPIKey(
            unhashedKey,
            properties.expiration,
            properties.scouter,
            properties.app,
            properties.team,
            properties.scopes
        )),
        "Verification passed with disabled key"
    );

    const enabledObj = (await enableAPIKey(unhashedKey)) as any;
}

(async () => {
    await removeAll();
    await testGenerateKey();
    await testKeys();
    await testKeyVerification();
})();
