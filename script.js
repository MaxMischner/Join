const BASE_URL_TASK = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/tasks/"
const BASE_URL_USER = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/users/"
const BASE_URL_CONTACT = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/contacts/"



let initialNamesDiv = document.getElementById("initialNames");

function closeOverlay(event) {
    if (event.target !== event.currentTarget) return;

    initialNamesDiv.style.background = "white";
    initialNamesDiv.style.color = "rgb(41, 171, 226)";

    let overlay = document.getElementById("overlay");
    overlay.classList.add("d-none");

    event.stopPropagation();
}


function openOverlay(event) {
    initialNamesDiv.style.background = "rgb(41, 171, 226)"
    initialNamesDiv.style.color = "white";

    let overlay = document.getElementById("overlay");
    overlay.classList.remove("d-none");

    event.stopPropagation();
}


function logout() {
    localStorage.removeItem("activeUser");
    window.location.href = "index.html";
}