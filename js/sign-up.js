let errorMSG = document.getElementById("error-msg");
let signupName = document.getElementById('signupName');
let password = document.getElementById('signupPassword');
let passwordAgain = document.getElementById('signupPasswordAgain');
let signupEmail = document.getElementById('signupEmail');
let signupCB = document.getElementById("signupCB");
let signupBtn = document.getElementById("signupBtn");


/** Clear error message */
function clearErrorMsg () {
    signupBtn.innerText = "Sign Up";

    errorMSG.style.display = "none";
    errorMSG.innerText = "";
}


/** Clear all files */
function clearField () {
    errorMSG.style.display = "none";
    signupName.value = "";
    signupEmail.value = "";
    password.value = "";
    passwordAgain.value = "";
    signupCB.checked = false;
}


/** User clicks the Singup Button */
async function signup() {
    
    let obj = checkField();
    if (!obj["b"]) {
        errorMSG.style.display = "block";
        errorMSG.innerText = obj["message"];

        if (obj["type"] == "password") {
            password.value = "";
            passwordAgain.value = "";
        }
        return ;
    }
    checkEmail();
}


/** Validate Email */
function validateEmail() {
    if (!signupEmail.value.trim())  {
        errorMSG.innerText = "The email address cannot be empty";
        return false;
    }

    let patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
    if(!patt.test(signupEmail.value.trim())) {
        errorMSG.innerText = "Please fill up a valid email address.";
        return false;
    }

    return true;
}

/** Validate Username */
function validateUsername() {
    if (!signupName.value.trim())  {
        errorMSG.innerText = "Username cannot be empty";
        return false;
    }
        
    if(signupName.value.trim().length < 3) {
        errorMSG.innerText = "Username requires at least 3 letters.";
        return false;
    }

    return true;
}

/** Validate password */
function validatePassword() {
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

/** Validate the second password */
function validatePasswordAgain() {
    if (!passwordAgain.value.trim())  {
        errorMSG.innerText = "Password cannot be empty";
        return false;
    }
        
    if(passwordAgain.value.trim().length < 6) {
        errorMSG.innerText = "Password requires at least 6 characters";
        return false;
    }

    return true;
}


/**
 * Reconstruct user array
 * @param {array} allUsers 
 * @returns array
 */
function reconstructAllUsers(allUsers) {
    let allUserArr = [];
    for (let index = 0; index < allUsers.length; index++) {
        let oneUser = allUsers[index]; 
        let allEntries = Object.keys(oneUser);
        allUserArr.push(oneUser[allEntries[0]]);
    }
    return allUserArr;
}

/** Validate if the mail is already in DB  */
async function checkEmail() {
    if (!validateUsername() || !validateEmail() || !validatePassword() || !validatePasswordAgain()) {
        errorMSG.style.display = "block";
        return false;
    } 
    signupBtn.disabled = true;
    signupBtn.innerText = "Signing Up";
    let allUsers = await getAllUsers();
    allUsers = reconstructAllUsers(allUsers);
    let user = allUsers.find(u => u.email == signupEmail.value.trim());
    if(user) {
        signupBtn.disabled = false;
        errorMSG.style.display = "block";
        errorMSG.innerText = "The email is already used.";
    } else {
        signupUser();
    }
}


/** Save User into DB */
async function signupUser() {
   
    
    let data = {email:signupEmail.value, name:signupName.value, password:signupPassword.value}
    await fetch(BASE_URL_USER + ".json", {
        method: "POST" ,
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    }).then ((response) => {
        if (response.ok) {
            showNotification();
        }
    })

}


/** Show signup success notification */
function showNotification() {
    clearField();
    signupBtn.innerText = "You signed up successsfully."
    setTimeout(() => {
            window.location.href = "index.html";
            
    }, 1000) 
}


/** Check if all fields are correctly filled */
function checkField() {
    let b = true;
    let msg = "";

    if (signupPassword.value != signupPasswordAgain.value) {
        b = false;
        msg = "The passwords are not consistent.";
        return {'b':b, 'message': msg, 'type': "password"}
    }

    if (!signupCB.checked) {
        b = false;
        msg = "Please read Privacy Policy.";
        return {'b':b, 'message': msg, 'type': "checkbox"}
    }

    return {'b':b, 'message': ""}
}

