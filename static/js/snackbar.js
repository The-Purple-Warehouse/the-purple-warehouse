const snackbarContainer = document.querySelector("#snackbar-container");
const snackbar = document.querySelector("#snackbar");

const SNACKBAR_TIMEOUT = 5000;
let timer;

function succBar(message) {
    if (timer) clearTimeout(timer);

    snackbarContainer.classList.remove("error");
    snackbarContainer.classList.add("success");
    snackbarContainer.classList.remove("hidden");

    snackbar.innerHTML = message;

    timer = setTimeout(clearSnackbar, SNACKBAR_TIMEOUT);
}

function errBar(message) {
    if (timer) clearTimeout(timer);

    snackbarContainer.classList.remove("success");
    snackbarContainer.classList.add("error");
    snackbarContainer.classList.remove("hidden");

    snackbar.innerHTML = message;

    timer = setTimeout(clearSnackbar, SNACKBAR_TIMEOUT);
}

const clearSnackbar = function () {
    snackbarContainer.classList.add("hidden");
};
