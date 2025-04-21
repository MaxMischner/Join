let activeUser = [];
const email = document.getElementById('loginEmail');
const password = document.getElementById('loginPassword');
const errorMSG = document.getElementById('error-msg');


/** Validate Email */
function validateLoginEmail() {
    if (!email.value.trim())  {
        errorMSG.innerText = "The email address cannot be empty";
        return false;
    }

    let patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
    if(!patt.test(email.value.trim())) {
        errorMSG.innerText = "Please fill up a valid email address.";
        return false;
    }

    return true;
}


/** Validate password */
function validateLoginPassword() {
    if (!password.value.trim())  {
        errorMSG.innerText = "Password cannot be empty";
        return false;
    }
        
    if(password.value.trim().length < 6) {
        errorMSG.innerText = "Password requires at least 6 letters";
        return false;
    }

    return true;
}


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
    if(!validateLoginEmail() || !validateLoginPassword()) {
        errorMSG.classList.remove("d-none");
        return false;
    }
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();
    let users = Object.values(responseJSON);
    let user = users.find(u => u.email == email.value && u.password == password.value);    
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
    const existingWarning = document.getElementById('error-msg');
    if (!existingWarning) return;
  
    existingWarning.innerText = 'Email or password incorrect';
    existingWarning.classList.remove("d-none");
}


/** Clear error message */
function clearErrorMsg () {

    errorMSG.classList.add("d-none");
    errorMSG.innerText = "";
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

