const BASE_URL_TASK = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/tasks"
const BASE_URL_USER = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/users/"
const BASE_URL_CONTACT = "https://join-61c56-default-rtdb.europe-west1.firebasedatabase.app/contacts/"


let initialNamesDiv = document.getElementById("initialNames");

function initInitials () {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return ;
    } 
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));   
    renderInitials(activeUser);
}

/* Close Menu Overlay */
function closeOverlay(event) {
    if (event.target !== event.currentTarget) return;

    initialNamesDiv.style.background = "white";
    initialNamesDiv.style.color = "rgb(41, 171, 226)";

    let overlay = document.getElementById("overlay");
    overlay.classList.add("d-none");

    event.stopPropagation();
}

/**
 * Open Menu overlay
 * @param {*} event tiggered event
 */
function openOverlay(event) {
    initialNamesDiv.style.background = "rgb(41, 171, 226)"
    initialNamesDiv.style.color = "white";

    let overlay = document.getElementById("overlay");
    overlay.classList.remove("d-none");

    event.stopPropagation();
}


/** Check if user already log in */
function getUser() {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return ;
    } 

    let activeUser = JSON.parse(user);   
    renderInitials(activeUser);
}


/**
 * Get two letters of name
 * @param {} name 
 * @returns 
 */
function extracNameInitials(name) {
    let arr = name.split(" ");
    let initialsStr = ""
    arr.forEach(n => {
        if (n.length) {
            initialsStr += n.at(0).toUpperCase();
        }
    });
    if(initialsStr.length > 2) initialsStr = initialsStr.slice(0, 2);
    return initialsStr;
}


/** User Logout */
function logout() {
    localStorage.removeItem("activeUser");
    localStorage.removeItem("guestUser");
    window.location.href = "index.html";
}

/** generate a random color */ 
function generateLightColor() {
    const hue = Math.floor(Math.random() * 360); 
    const saturation = Math.floor(Math.random() * 30) + 70; 
    const lightness = Math.floor(Math.random() * 20) + 75; 
  
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

