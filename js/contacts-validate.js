/** Validate Email */
function validateEmail(value) {
    if (!value.trim())  {
        return [false, "The email address cannot be empty"];
    }

    let patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
    if(!patt.test(value.trim())) {
        return [false, "Please fill a valid email address."];
    }

    return [true, ""];
}

/** Validate Username */
function validateUsername(value) {
    if (!value.trim())  {
        return [false, "The name cannot be empty"];
    }
        
    if(value.trim().length < 3) {
        return [false, "The name requires at least 3 letters."];
    }

    return [true, ""];
}

/** Validate Phone */
function validatePhone(value) {
    if (!value.trim())  {
        return [false, "The phone nummber cannot be empty"];
    }

    const patt = /^\+?\d+$/;
        
    if(!patt.test(value.trim())) {
        return [false, "Please fill a valid phone number."];
    }

    return [true, ""];
}


/** Valid 3 fields */
function validAllForm(nameField, emailField, phoneField, errorMSG) {
    
    let [bName, msgName] = validateUsername(nameField.value);
    if (!bName) {
        errorMSG.innerText = msgName;
        return bName;
    }

    let [bEmail, msgEmail] = validateEmail(emailField.value);
    if (!bEmail) {
        errorMSG.innerText = msgEmail;
        return bEmail;
    }

    let [bPhone, msgPhone] = validatePhone(phoneField.value);
    if (!bPhone) {
        errorMSG.innerText = msgPhone;
        return bPhone;
    }

    return true;
}