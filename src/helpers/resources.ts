import Resource from "../models/resource";
import { uuid } from "uuidv4";

export async function addResource(type: string, name: string, parent: string = "global") {
    let identifier = uuid();
    let resource = new Resource({ identifier: identifier, type: type, name: name, parent: parent });
    await resource.save();
    return identifier;
}

export function getAllResources(limit: number = null) {
    return Resource.find().limit(limit).lean();
}

export function getAllResourcesByParent(parent: string = "global", limit: number = null) {
    return Resource.find({ parent: parent }).limit(limit).lean();
}

export function getAllResourcesByParentAndType(parent: string = "global", type: string = "file", limit: number = null) {
    return Resource.find({ parent: parent, type: type }).limit(limit).lean();
}

export async function removeAllResources() {
    await Resource.deleteMany({});
}