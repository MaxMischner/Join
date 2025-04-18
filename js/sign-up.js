let errorMSG = document.getElementById("error-msg");
let signupName = document.getElementById('signupName');
let password = document.getElementById('signupPassword');
let passwordAgain = document.getElementById('signupPasswordAgain');
let signupEmail = document.getElementById('signupEmail');
let signupCB = document.getElementById("signupCB");
let signupBtn = document.getElementById("signupBtn");


/** Clear error message */
function clearErrorMsg () {
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
    let patt = /^([\w+\.])+@(\w+)([.]\w+)+$/ig;
        
    if(!patt.test(signupEmail.value.trim())) {
        errorMSG.style.display = "block";
        errorMSG.innerText = "Please fill up a valid email address.";
        return ;
    }

    let allUsers = await getAllUsers();
    allUsers = reconstructAllUsers(allUsers);

    let user = allUsers.find(u => u.email == signupEmail.value.trim());
    
    if(user) {
        errorMSG.style.display = "block";
        errorMSG.innerText = "The email is already used.";
    } else {
        signupUser();
    }
}


/** Save User into DB */
async function signupUser() {
    signupBtn.disabled = true;
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
            
    }, 2000) 
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

