import Handlebars from "handlebars";

export default function () {
    Handlebars.registerHelper("json", function (context) {
        return JSON.stringify(context);
    });
    Handlebars.registerHelper("shorten", function (context, maximum) {
        return context.length > maximum
            ? `${context.substring(0, maximum - 3)}...`
            : context;
    });
    Handlebars.registerHelper("percent", function (context) {
        return `${Math.floor(context * 100)}%`;
    });
}
