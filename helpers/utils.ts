export function addAPIHeaders(ctx: any) {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    ctx.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
}

export function sortedStringify(data) {
    if (typeof data == "string") {
        return JSON.stringify(data);
    } else if (Array.isArray(data)) {
        return `[${data.map((item) => sortedStringify(item)).join(",")}]`;
    } else if (typeof data == "object" && data !== null) {
        let keys = Object.keys(data).sort();
        return `{${keys
            .map(
                (key) => `${sortedStringify(key)}:${sortedStringify(data[key])}`
            )
            .join(",")}}`;
    } else {
        return `${data}`;
    }
}
