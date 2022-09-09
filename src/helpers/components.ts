/**
 * Across the various pages on this site, there are many pieces in common. We package each
 * piece into a component, which we store in the components directory inside of the partials
 * directory. In order to use these components, however, we must first register them with
 * Handlebars, our templating engine. Unfortunately, it doesn't seem like Handlebars supports
 * registering all files inside of a directory as components, so we have to implement that ourselves,
 * which is what this file does.
 */

import * as fs from "fs"
import { resolve } from "path"
import * as handlebars from "handlebars"

const HBS_FILE_EXTENSION = ".hbs"
const HBS_REGEX = /.+\.hbs$/

/**
 * This function registers a singular component given a filePath to the contents of the 
 * helper. If the file path is invalid (points to a nonexistant file) or it is not a 
 * handlbars file, then an error is thrown. 
 * 
 * @param filePath the path to the file which should be registered as a Handlebars helper.
 * It will be turned into an absolute path.
 */
export async function register(filePath) {
	filePath = resolve(filePath)

	if (!fs.existsSync(filePath)) {
		throw new Error(`File path ${filePath} doesn't exist!`)
	}

	if (!HBS_REGEX.test(filePath)) {
		throw new Error(`File path doesn't end with the handlebars extension, ${HBS_FILE_EXTENSION}`)
	}

	// extract the component name, so remove the front of the file path and the file extension
	// accounts for OS - macs use front slash "/" and windows uses "\"
	let startIndex = Math.max(filePath.lastIndexOf("/") + 1, filePath.lastIndexOf("\\") + 1)
	let endIndex = filePath.length - HBS_FILE_EXTENSION.length
	let componentName = filePath.substring(startIndex, endIndex)

	registerComponent(componentName, filePath)
}

/**
 * The function called by registerComponentsWithinDirectory and registerSingularComponent to 
 * actually register the component with handlebars. It does not do any validation, so it should
 * not be called on its own (which is why it is not exported from this module.)
 * 
 * @param componentName the name of the component to register as a helper
 * @param filePath the contents of the helper; should be an absolute file path
 */
async function registerComponent(componentName, filePath) {
	handlebars.registerPartial(componentName, `${fs.readFileSync(filePath)}`)
}

export function registerHelper(name, func) {
	handlebars.registerHelper(name, func)
}
