import { addCategory } from "../helpers/scouting";

async function addCategoryToDatabase(name, identifier, dataType = undefined) {
    if (name == null) {
        console.log("Missing --name argument");
        return;
    }
    if (identifier == null) {
        console.log("Missing --identifier argument");
        return;
    }
    let category = (await addCategory(name, identifier, dataType)) as any;
    console.log(`Added category: ${category.name} (${category.identifier})`);
    return;
}

let rawArgs = process.argv.slice(2);
let args: any = {};
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] == "--name" && args["name"] == null) {
        args["name"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--identifier" && args["identifier"] == null) {
        args["identifier"] = rawArgs[i + 1];
        i++;
    } else if (rawArgs[i] == "--dataType" && args["dataType"] == null) {
        args["dataType"] = rawArgs[i + 1];
        i++;
    }
}

addCategoryToDatabase(args.name, args.identifier, args.dataType);
