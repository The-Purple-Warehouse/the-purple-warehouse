/*
    All variables/data potentially necessary for shop items
*/
let blahajstring = "";

/*
    SHOP ITEMS
    toggle (if applicable)
    function for adding functionality of item to app
*/

// Dark Mode
function addDarkMode() {
    const darkModeToggle = `
        <button class="dark-mode-toggle-scouting" id="dark-mode-toggle">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>Dark Mode</span>
        </button>   
    `

    // Add dark mode toggle to scouting header
    document.getElementById("shop-items-toggle-container").insertAdjacentHTML('beforeend', darkModeToggle);
    
    // Unhide dark mode toggle
    document.getElementById("dark-mode-toggle").style.display = "flex";

    document.getElementById("dark-mode-toggle").onclick = () => {
        if (document.documentElement.getAttribute("data-theme") == "dark") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    };
}

// Blahaj Wallpaper
function addBlahajMode() {

    // Create background image div for the blahajs. This div is where all the sharks will be stored
    // and will be prepended to the body (so that it is behind all other elements)
    const blahajImgDiv = document.createElement("div");
    blahajImgDiv.class = "blahaj-bg-imgs";
    blahajImgDiv.id = "blahaj-img-container";
    document.body.prepend(blahajImgDiv);
    
    // Populates blahaj image div with the sharks
    const bcntr = document.getElementById("blahaj-img-container");
    if (bcntr.childNodes.length == 0) {
        // populate with blahaj
        for (let i=0; i<screen.height; i+=150) {
            let newBlahajRow = document.createElement("div");
            newBlahajRow.classList.add("blahaj-bg-row");
            for (let j=0; j<screen.width; j+=180){
                let newBlahaj = document.createElement("img");
                newBlahaj.classList.add("blahaj-img");
                newBlahaj.width = 150; newBlahaj.height=150;
                newBlahaj.src = "/img/blahajpng.png";
                newBlahaj.alt = ":)";
                newBlahajRow.appendChild(newBlahaj);
            }
            bcntr.appendChild(newBlahajRow);
        }
    }
    
    // Adding the blahaj mode toggle in the sidebar
    const blahajToggle = `
        <button class="blahaj-bg-toggle-scouting" id = "blahaj-bg-toggle">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>Blahaj Mode</span>
        </button>
    `
    document.getElementById("shop-items-toggle-container").insertAdjacentHTML('beforeend', blahajToggle);
    // Show toggle
    document.getElementById("blahaj-bg-toggle").style.display = "flex";

    // Event listener for blahaj mode toggle
    // Checks if current data theme is blahaj or other
    document.getElementById("blahaj-bg-toggle").onclick = () => {
        if (document.documentElement.getAttribute("data-theme") == "blahaj") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "blahaj");
            localStorage.setItem("theme", "blahaj");
        }
    };

    /*
        Event listener for keydown
        When user types "blahaj" in that order anywhere, make the sharks spin for 1 second
    */
    document.addEventListener("keydown", function (e) {
        // first make sure data theme is enabled
        if (document.documentElement.getAttribute("data-theme") != "blahaj") return;
        blahajstring += e.code.toLowerCase().at(-1);
        if (blahajstring.length >= 6 && 
            blahajstring.indexOf("blahaj")==blahajstring.length-6) {
            document.documentElement.setAttribute("data-theme", "blahaj-spin");
            setTimeout(() => {
                document.documentElement.setAttribute("data-theme", "blahaj");
            }, 1000)
            blahajstring = "";
        }
    })
}

// Blahaj Wallpaper (1072)
function addBlahaj1072Mode() {

    // Create background image div for the blahajs. This div is where all the sharks will be stored
    // and will be prepended to the body (so that it is behind all other elements)
    const blahajImgDiv = document.createElement("div");
    blahajImgDiv.class = "blahaj-bg-imgs";
    blahajImgDiv.id = "blahaj-1072-img-container";
    document.body.prepend(blahajImgDiv);
    
    // Populates blahaj image div with the sharks
    const bcntr = document.getElementById("blahaj-1072-img-container");
    if (bcntr.childNodes.length == 0) {
        // populate with blahaj
        for (let i=0; i<screen.height; i+=150) {
            let newBlahajRow = document.createElement("div");
            newBlahajRow.classList.add("blahaj-bg-row");
            for (let j=0; j<screen.width; j+=180){
                let newBlahaj = document.createElement("img");
                newBlahaj.classList.add("blahaj-img");
                newBlahaj.width = 150; newBlahaj.height=150;
                newBlahaj.src = "/img/fedorablahaj.png";
                newBlahaj.alt = ":)";
                newBlahajRow.appendChild(newBlahaj);
            }
            bcntr.appendChild(newBlahajRow);
        }
    }
    
    // Adding the blahaj mode toggle in the sidebar
    const blahajToggle = `
        <button class="blahaj-1072-bg-toggle-scouting" id = "blahaj-1072-bg-toggle">
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>Blahaj (1072) Mode</span>
        </button>
    `
    document.getElementById("shop-items-toggle-container").insertAdjacentHTML('beforeend', blahajToggle);
    // Show toggle
    document.getElementById("blahaj-1072-bg-toggle").style.display = "flex";

    // Event listener for blahaj1072 mode toggle
    // Checks if current data theme is blahaj1072 or other
    document.getElementById("blahaj-1072-bg-toggle").onclick = () => {
        if (document.documentElement.getAttribute("data-theme") == "blahaj1072") {
            document.documentElement.removeAttribute("data-theme");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "blahaj1072");
            localStorage.setItem("theme", "blahaj1072");
        }
    };

    /*
        Event listener for keydown
        When user types "blahaj" in that order anywhere, make the sharks spin for 1 second
    */
    document.addEventListener("keydown", function (e) {
        // first make sure data theme is enabled
        if (document.documentElement.getAttribute("data-theme") != "blahaj1072") return;
        blahajstring += e.code.toLowerCase().at(-1);
        if (blahajstring.length >= 6 && 
            blahajstring.indexOf("blahaj")==blahajstring.length-6) {
            document.documentElement.setAttribute("data-theme", "blahaj1072spin");
            setTimeout(() => {
                document.documentElement.setAttribute("data-theme", "blahaj1072");
            }, 1000)
            blahajstring = "";
        }
    })
}


/*
    Adds item (and its functionality) to the app given its name. This function simply makes a call
    to the function for each item written above. For instance, addItemToApp("blahaj wallpaper")
    will result in a call to addBlahajMode() in this function's code. 
*/
function addItemToApp(itemName) {
    switch (itemName) {
        case "Dark Mode":
            addDarkMode();
            break;
        case "Blahaj Wallpaper":
            addBlahajMode();
            break;
        case "Blahaj Wallpaper 1072":
            addBlahaj1072Mode();
            break;
        default:
            break;
    }
}

// Retrieve all shop items & user inventory items
let userInventory, shopItems;

// Retrieve user inventory data
try {
    const inventorydata = await (await fetch(
        "/api/v1/scouting/shop/inventory"
    )).json();
    userInventory = inventorydata.body?.inventory;

    if (userInventory.length > 0) {
        for (let i=0; i<userInventory.length; i++) {
            userInventory[i] = userInventory[i].itemId._id;
        }
    }

} catch (e) {
    console.log("error retrieving user inventory" , e)
    userInventory = []
}

// Retrieve shop items data
try {
    const shopdata = await (await fetch(
        "/api/v1/scouting/shop/items"
    )).json();
    shopItems = shopdata.body.items;
} catch (e) {
    console.log("error retrieving shop items, ", e);
    shopItems = [];
}

// add toggles
shopItems.forEach((item) => {
    console.log(item);
    console.log(userInventory);
    if (userInventory.includes(item.id)) {
        addItemToApp(item.name);
    }
})