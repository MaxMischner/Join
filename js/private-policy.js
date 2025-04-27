const notRedirect = true;
const menuUL = document.getElementById("menu-ul");
const loginUL = document.getElementById("log-in-ul");
const sidebarBottom= document.getElementById("sidebar-bottom");
const headerRight = document.getElementById("header-right");

let user = localStorage.getItem("activeUser");
let guestUser = localStorage.getItem("guestUser");

/** Check if user already logged in */
if (!user && !guestUser) {
    menuUL.style.display = "none";
    loginUL.style.display = "block";
    headerRight.style.display = "none";

} else {
    menuUL.style.display = "block";
    loginUL.style.display = "none";
    headerRight.style.display = "flex";
}

showSidebarBottom ();


/** if show sidebar bottom */
function showSidebarBottom () {
    if (window.innerWidth <= 780 && (user || guestUser)) {
        sidebarBottom.style.display = "none";
        
    } else {
        sidebarBottom.style.display = "block";
    }
}


/** resize screen*/
addEventListener("resize", (event) => {});
onresize = (event) => {
    if (window.innerWidth <= 780 && (user || guestUser)) {
        sidebarBottom.style.display = "none";
        
    } else {
        sidebarBottom.style.display = "block";
    }
};


/** Go gack to last page */
function goBack() {
  window.history.back();
}