window.initBazaar = function (opts) {
    opts = opts || {};
    window._bazaarInitialized = true;

    let categories = [
        { value: "mechanical", label: "Mechanical" },
        { value: "electrical", label: "Electrical" },
        { value: "pneumatics", label: "Pneumatics" },
        { value: "tools", label: "Tools" },
        { value: "parts", label: "Parts" },
        { value: "other", label: "Other" }
    ];

    let listings = [];
    let currentFilter = "all";
    let currentCategory = "all";
    let currentEvent = "all";
    let currentSearch = "";
    let selectedType = "offer";
    let savedTeam = opts.team || null;

    function applyTeamToForm() {
        if (!savedTeam) {
            return;
        }
        if (document.getElementById("form-team")) {
            document.getElementById("form-team").value = savedTeam.team;
        }
        if (document.getElementById("form-team-name")) {
            document.getElementById("form-team-name").value =
                savedTeam.teamName || "";
        }
    }

    if (savedTeam) {
        applyTeamToForm();
    }

    function renderListings() {
        let filtered = listings.filter(function (listing) {
            if (currentFilter !== "all" && listing.type !== currentFilter) {
                return false;
            }
            if (
                currentCategory !== "all" &&
                listing.category !== currentCategory
            ) {
                return false;
            }
            if (currentEvent !== "all" && listing.event !== currentEvent) {
                return false;
            }
            if (currentSearch) {
                let q = currentSearch.toLowerCase();
                let searchable = (
                    listing.item +
                    " " +
                    (listing.teamName || "") +
                    " " +
                    listing.team +
                    " " +
                    (listing.description || "") +
                    " " +
                    listing.category
                ).toLowerCase();
                if (searchable.indexOf(q) === -1) {
                    return false;
                }
            }

            return true;
        });

        if (filtered.length === 0) {
            document.getElementById("trading-listings").style.display = "none";
            document.getElementById("trading-empty").style.display = "block";
            return;
        }

        document.getElementById("trading-listings").style.display = "grid";
        document.getElementById("trading-empty").style.display = "none";

        document.getElementById("trading-listings").innerHTML = filtered
            .map(function (listing) {
                let timeago = getTimeAgo(new Date(listing.timestamp).getTime());
                let owned = savedTeam && listing.team === savedTeam.team;
                return (
                    '<div class="trading-card" data-type="' +
                    listing.type +
                    '">' +
                    '<div class="trading-card-header">' +
                    '<span class="trading-card-badge ' +
                    listing.type +
                    '">' +
                    listing.type +
                    "</span>" +
                    '<span class="trading-card-category">' +
                    formatCategory(listing.category) +
                    "</span>" +
                    "</div>" +
                    '<h4 class="trading-card-title">' +
                    escapeHtml(listing.item) +
                    "</h4>" +
                    '<p class="trading-card-team">' +
                    "Team " +
                    listing.team +
                    (listing.teamName
                        ? " &mdash; " + escapeHtml(listing.teamName)
                        : "") +
                    "</p>" +
                    (listing.description
                        ? '<p class="trading-card-description">' +
                          escapeHtml(listing.description) +
                          "</p>"
                        : "") +
                    '<div class="trading-card-footer">' +
                    '<span class="trading-card-quantity">Qty: <span>' +
                    listing.quantity +
                    "</span> &middot; " +
                    timeago +
                    "</span>" +
                    (owned
                        ? '<button class="trading-card-delete" onclick="deleteListing(\'' +
                          listing._id +
                          '\')" title="Delete">&#x2715;</button>'
                        : "") +
                    '<button class="trading-card-contact" onclick="showContact(this, \'' +
                    escapeHtml(listing.contact) +
                    "')\">" +
                    "Contact" +
                    "</button>" +
                    "</div>" +
                    "</div>"
                );
            })
            .join("");

        updateStats();
    }

    function updateStats() {
        let offers = listings.filter(function (l) {
            return l.type === "offer";
        }).length;
        let requests = listings.filter(function (l) {
            return l.type === "request";
        }).length;
        let teams = [];
        listings.forEach(function (l) {
            if (teams.indexOf(l.team) === -1) teams.push(l.team);
        });

        setStatText("stat-offers", offers);
        setStatText("stat-requests", requests);
        setStatText("stat-teams", teams.length);
        setStatText("stat-total", listings.length);
    }

    function setStatText(id, val) {
        let el = document.getElementById(id);
        if (el) el.textContent = val;
    }

    function fetchListings() {
        fetch("/api/v1/trading/listings")
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (data.success && data.body && data.body.listings) {
                    listings = data.body.listings;
                    renderListings();
                }
            })
            .catch(function (err) {
                console.warn("Could not load listings:", err);
            });
    }

    function submitListing(formData) {
        fetch("/api/v1/trading/listings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (data.success && data.body && data.body.listing) {
                    listings.unshift(data.body.listing);
                    renderListings();
                    showFormSuccess(formData);
                } else {
                    alert(
                        "Error: " + (data.error || "Could not create listing")
                    );
                }
            })
            .catch(function () {
                alert("Network error. Please try again.");
            });
    }

    window.deleteListing = function (id) {
        if (!savedTeam) return;
        if (!confirm("Delete this listing?")) return;

        fetch("/api/v1/trading/listings/" + id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ team: savedTeam.team })
        })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (data.success) {
                    listings = listings.filter(function (l) {
                        return l._id !== id;
                    });
                    renderListings();
                } else {
                    alert("Error: " + (data.error || "Could not delete"));
                }
            })
            .catch(function () {
                alert("Network error. Please try again.");
            });
    };

    function showFormSuccess(formData) {
        document.getElementById("trading-form").style.display = "none";
        let success = document.createElement("div");
        success.className = "trading-success";
        success.style.display = "block";
        success.innerHTML =
            "<h3>Listing Posted!</h3>" +
            "<p>Your " +
            formData.type +
            ' for "' +
            escapeHtml(formData.item) +
            '" is now live.</p>' +
            "<button class=\"trading-btn-primary\" onclick=\"document.getElementById('browse').scrollIntoView({behavior:'smooth'})\">View Listings</button>" +
            '<br><br><a href="#" class="trading-post-another" style="color: var(--primaryBackgroundColor); font-size: 14px;">Post another</a>';
        document.getElementById("trading-form").parentNode.appendChild(success);

        success
            .querySelector(".trading-post-another")
            .addEventListener("click", function (ev) {
                ev.preventDefault();
                success.remove();
                document.getElementById("trading-form").style.display = "block";
                document.getElementById("trading-form").reset();
                applyTeamToForm();
            });
    }

    function formatCategory(cat) {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].value === cat) return categories[i].label;
        }
        return cat.replace(/-/g, " ").replace(/\b\w/g, function (c) {
            return c.toUpperCase();
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        let div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function getTimeAgo(timestamp) {
        let diff = Date.now() - timestamp;
        let mins = Math.floor(diff / 60000);
        if (mins < 60) return mins + "m ago";
        let hours = Math.floor(mins / 60);
        if (hours < 24) return hours + "h ago";
        let days = Math.floor(hours / 24);
        return days + "d ago";
    }

    window.showContact = function (btn, contact) {
        btn.innerHTML = escapeHtml(contact);
        btn.style.fontSize = "0.7rem";
        btn.style.cursor = "default";
        btn.onclick = null;
    };

    window.goToForm = function (typeId) {
        let btn = document.getElementById(typeId);
        if (btn) btn.click();
        let post = document.getElementById("post");
        if (post) post.scrollIntoView({ behavior: "smooth" });
    };

    document.querySelectorAll(".trading-tab").forEach(function (tab) {
        tab.addEventListener("click", function () {
            document.querySelectorAll(".trading-tab").forEach(function (t) {
                t.classList.remove("active");
            });
            tab.classList.add("active");
            currentFilter = tab.getAttribute("data-filter");
            renderListings();
        });
    });

    if (document.getElementById("trading-search")) {
        document
            .getElementById("trading-search")
            .addEventListener("input", function () {
                currentSearch = document
                    .getElementById("trading-search")
                    .value.trim();
                renderListings();
            });
    }

    if (document.getElementById("trading-category")) {
        document
            .getElementById("trading-category")
            .addEventListener("change", function () {
                currentCategory =
                    document.getElementById("trading-category").value;
                renderListings();
            });
    }

    if (document.getElementById("trading-event-filter")) {
        document
            .getElementById("trading-event-filter")
            .addEventListener("change", function () {
                currentEvent = document.getElementById(
                    "trading-event-filter"
                ).value;
                renderListings();
            });
    }

    document.querySelectorAll(".trading-type-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document
                .querySelectorAll(".trading-type-btn")
                .forEach(function (b) {
                    b.classList.remove("active");
                });
            btn.classList.add("active");
            selectedType = btn.getAttribute("data-type");
        });
    });

    if (document.getElementById("trading-form")) {
        document
            .getElementById("trading-form")
            .addEventListener("submit", function (e) {
                e.preventDefault();

                if (!savedTeam) {
                    return;
                }

                if (
                    !document.getElementById("form-item").value.trim() ||
                    !document.getElementById("form-contact").value.trim()
                ) {
                    return;
                }

                submitListing({
                    type: selectedType,
                    team: savedTeam.team,
                    teamName: savedTeam.teamName,
                    item: document.getElementById("form-item").value.trim(),
                    category: document.getElementById("form-category").value,
                    quantity:
                        parseInt(
                            document.getElementById("form-quantity").value
                        ) || 1,
                    description: document
                        .getElementById("form-description")
                        .value.trim(),
                    contact: document
                        .getElementById("form-contact")
                        .value.trim(),
                    event: document.getElementById("form-event").value
                });
            });
    }

    function fetchEvents() {
        let year = new Date().getFullYear();
        fetch(`/api/v1/scouting/events/${encodeURIComponent(year)}/team`)
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (data.success && data.body && data.body.events) {
                    const filteredEvents = data.body.events.filter(function (
                        evt
                    ) {
                        return evt.name.includes("*");
                    });
                    populateEventDropdowns(filteredEvents);
                }
            })
            .catch(function (err) {
                console.warn("Could not load events from TBA:", err);
            });
    }

    function populateEventDropdowns(events) {
        if (document.getElementById("trading-event-filter")) {
            events.forEach(function (evt) {
                let option = document.createElement("option");
                option.value = evt.key;
                option.textContent = evt.name;
                document
                    .getElementById("trading-event-filter")
                    .appendChild(option);
            });
        }
        if (document.getElementById("form-event")) {
            events.forEach(function (evt) {
                let option = document.createElement("option");
                option.value = evt.key;
                option.textContent = evt.name;
                document.getElementById("form-event").appendChild(option);
            });
        }
    }

    function populateCategories() {
        let selects = [
            document.getElementById("trading-category"),
            document.getElementById("form-category")
        ];
        selects.forEach(function (sel) {
            if (!sel) return;
            categories.forEach(function (cat) {
                let option = document.createElement("option");
                option.value = cat.value;
                option.textContent = cat.label;
                sel.appendChild(option);
            });
        });
    }

    populateCategories();
    applyTeamToForm();
    fetchListings();
    fetchEvents();
};
