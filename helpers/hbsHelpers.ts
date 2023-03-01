import Handlebars from "handlebars";

export default function () {
    Handlebars.registerHelper("json", function (context) {
        return JSON.stringify(context);
    });
}
