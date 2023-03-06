import { addFile, addFolder, removeAllResources } from "../helpers/resources";

async function initializeExampleResources() {
    await removeAllResources();
    const subteams = [
        "App Dev",
        "Software",
        "Scouting",
        "Mechanical",
        "Machining",
        "Electrical",
        "Design",
        "Outreach",
        "Media"
    ];
    let ids = {};
    for (let i = 0; i < subteams.length; i++) {
        ids[subteams[i]] = await addFolder(subteams[i]);
        console.log(`Added resource: ${subteams[i]}`);
    }
    const subfiles = ["README.md", "Instructions.md"];
    for (let i = 0; i < subfiles.length; i++) {
        await addFile(
            subfiles[i],
            { link: `https://google.com/search?q=file${i}` },
            ids["App Dev"]
        );
        console.log(`Added resource: ${subfiles[i]}`);
    }
    return;
}

initializeExampleResources();
