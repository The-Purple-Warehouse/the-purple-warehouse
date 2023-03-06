const teamNumberInp = document.querySelector("#team-number");
const usernameInp = document.querySelector("#username");
const accessTokenInp = document.querySelector("#access-token");
const submitButton = document.querySelector("#submit");

submitButton.addEventListener("click", function () {
    submitButton.disabled = true;

    const inp = {
        teamNumber: teamNumberInp.value,
        username: usernameInp.value,
        accessToken: accessTokenInp.value
    };
    makeRequest("POST", "/scouting/login", inp, function (res) {
        submitButton.disabled = false;
        try {
            const response = JSON.parse(res.responseText);

            if (response.success) {
                succBar(response.message);
                setTimeout(function () {
                    window.location.reload(true);
                }, 750);
            } else {
                errBar(response.message);
            }
        } catch (e) {
            errBar("There was an error");
        }
    });
});
