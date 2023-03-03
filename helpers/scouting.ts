import ScoutingEntry from "../models/scoutingEntry";

export namespace Entry {
    async function create() {
        await (new ScoutingEntry({

        })).save();;
    }
}