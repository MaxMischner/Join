let activeUser = [];

async function init() {
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();
    console.log(responseJSON);    
    let keys = Object.keys(responseJSON);
    console.log(keys);    
}

async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();
    let users = Object.values(responseJSON);
    let user = users.find(u => u.email == email && u.password == password);    
    if(user) {
        activeUser.push (user);
        localStorage.setItem("activeUser", JSON.stringify(activeUser));
        window.location.href = "summary.html";
 
    }else {
        console.log('nicht gefunden');        
    }    
}

function guestLogin() {
    localStorage.removeItem("activeUser");
    window.location.href = "summary.html";
}