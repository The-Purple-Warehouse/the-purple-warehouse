const snackbarContainer = document.querySelector("#snackbar-container");
const snackbar = document.querySelector("#snackbar");

const SNACKBAR_TIMEOUT = 5000;
let snackbarTimer;

function succBar(message) {
    if (snackbarTimer) clearTimeout(snackbarTimer);

    snackbarContainer.classList.remove("error");
    snackbarContainer.classList.add("success");
    snackbarContainer.classList.remove("hidden");

    snackbar.innerHTML = message;

    snackbarTimer = setTimeout(clearSnackbar, SNACKBAR_TIMEOUT);
}

function errBar(message) {
    if (snackbarTimer) clearTimeout(snackbarTimer);

    snackbarContainer.classList.remove("success");
    snackbarContainer.classList.add("error");
    snackbarContainer.classList.remove("hidden");

    snackbar.innerHTML = message;

    snackbarTimer = setTimeout(clearSnackbar, SNACKBAR_TIMEOUT);
}

const clearSnackbar = function () {
    snackbarContainer.classList.add("hidden");
};
