let activeUser = [];

/**
 * Checks if a user is registered and logs them in.
 * 
 * Fetches all users from the database and searches for a match with the entered
 * email and password. If a matching user is found, their data is stored in localStorage
 * under 'activeUser', and the user is redirected to 'summary.html'.
 * 
 * If the email or password is incorrect, the wrongLogin() function is triggered to show an error message.
 * 
 */
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

/**
 * Displays an info text if the login credentials are incorrect.
 * 
 * Creates a container element with the error message and assigns it a class and an ID.
 * If the container already exists (from a previous failed login), the function exits early.
 * 
 */
function wrongLogin() {
    const existingWarning = document.getElementById('loginError');
    if (existingWarning) return;
    let newElement = document.createElement('div');       
    newElement.textContent = 'Email or password incorrect';
    newElement.classList.add("wrong-login-text");
    newElement.id = 'loginError';
    document.getElementById('loginForm').appendChild(newElement); 
}

/**
 * Forwards an user without login to the summary-site.
 * Removes the stored activeUser data from the local storage.
 * 
 */
function guestLogin() {

    localStorage.removeItem("activeUser");
    localStorage.setItem("guestUser", "guest")
    window.location.href = "summary.html";
}