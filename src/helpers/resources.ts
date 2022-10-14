import Resource from "../models/resource";

export async function add(type: string, name: string, parent: string = "global") {
    let resource = new Resource({ identifier: "", type: type, name: name, parent: parent });
    await resource.save();
}

export async function getAll(limit: number = null) {
    return await Resource.find().limit(limit).lean();
}

export async function removeAll() {
    await Resource.deleteMany({});
}