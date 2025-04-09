let activeUser = [];

// async function init() {
//     let response = await fetch(BASE_URL_USER + ".json");
//     let responseJSON = await response.json();
//     console.log(responseJSON);    
//     let keys = Object.keys(responseJSON);
//     console.log(keys);    
// }

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
        wrongLogin();
    }    
}

function wrongLogin() {
    const existingWarning = document.getElementById('loginError');
    if (existingWarning) return;
    let newElement = document.createElement('div');       
    newElement.textContent = 'Email or password incorrect';
    newElement.classList.add("wrong-login-text");
    newElement.id = 'loginError';
    document.getElementById('loginForm').appendChild(newElement); 
}

function guestLogin() {
    localStorage.removeItem("activeUser");
    window.location.href = "summary.html";
}