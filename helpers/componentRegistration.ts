import * as fs from "fs";
import { join, resolve } from "path";
import * as handlebars from "handlebars";

const HBS_FILE_EXTENSION = ".hbs";
const HBS_REGEX = /.+\.hbs$/;

/**
 * Registers all the files that end with .hbs in a given directory as partials for a given
 * Handlbars instance. Ignores directories within the given directory. The name of the
 * registered component it its filename minus the .hbs ext.
 */
export async function registerComponentsWithinDirectory(dirName: string) {
    let entries = fs.readdirSync(dirName);

    entries.forEach((entry) => {
        if (HBS_REGEX.test(entry)) {
            let endIndex = entry.length - HBS_FILE_EXTENSION.length;
            let componentName = entry.substring(0, endIndex);

            registerComponent(componentName, resolve(join(dirName, entry)));
        }
    });
}

/**
 * @throw error if the filepath is invalid or not a handlebars file
 */
export async function registerSingularComponent(filePath: string) {
    filePath = resolve(filePath);

    if (!fs.existsSync(filePath))
        throw new Error(`File path ${filePath} doesn't exist!`);
    if (!HBS_REGEX.test(filePath))
        throw new Error(
            `File path doesn't end with the handlebars extension, ${HBS_FILE_EXTENSION}`
        );

    // extract the component name, so remove the front of the file path and the file extension
    // accounts for OS - macs use front slash '/' and windows uses '\'
    const startIndex = Math.max(
        filePath.lastIndexOf("/") + 1,
        filePath.lastIndexOf("\\") + 1
    );
    const endIndex = filePath.length - HBS_FILE_EXTENSION.length;
    const componentName = filePath.substring(startIndex, endIndex);

    registerComponent(componentName, filePath);
}

// Helper func (doesn't do any validation)
async function registerComponent(componentName: string, filePath: string) {
    handlebars.registerPartial(componentName, `${fs.readFileSync(filePath)}`);
}
