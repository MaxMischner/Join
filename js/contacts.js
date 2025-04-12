let queryedContacts = [];
let allContacts = [];
let contactListDIV = document.getElementById("contact-list");
let contactOverlay = document.getElementById("contact-overlay");
const contactDetailDIV = document.getElementById("contact-detail");
let prevLi;
let currentID = "";

let shouldChnageColor = currentID ? false : true;
let colorStr;


function initContact() {
    queryContacts().then(() => {
        for (let index = 0; index < queryedContacts.length; index++) {

            let contact = queryedContacts[index];
            let keys = Object.keys(contact);

            let contactDetail = contact[keys[0]];
            contactDetail['id'] = keys[0];
            // contactDetail['color']  = generateLightColor();
            
            allContacts.push(contactDetail);
        }
        console.log(allContacts);
        
        reconstructContactArray();
    })
}   


function reconstructContactArray() {
    let obj = {};
    allContacts.forEach(contact => {
        let letter = contact.name.at(0).toUpperCase();
        
        if (Object.keys(obj).indexOf(letter) != -1) {
            // letter exist
            let arr = obj[letter];
            arr.push(contact);
            obj[letter] = arr;
        } else {
            // letter does no exist
            let arr = [contact];
            obj[letter] = arr;
        }
    });

    renderContactList(obj);
}


function renderContactList(obj) {
    let allKeys = Object.keys(obj);
    allKeys.sort();
    
    let contactListDIVHTML = "";
    allKeys.forEach(key => {
        let arr = obj[key];
        let listCardHTML = "";
        arr.forEach(contact => {
            let initials = extracNameInitials(contact.name);
            listCardHTML += getContactListCard(initials, contact.name, contact.email, contact.id, contact.color);
        });
        contactListDIVHTML += getConactLetterContainer(key, listCardHTML);
    });

    contactListDIV.innerHTML = contactListDIVHTML; 

    moveToEditedLi();
}

function moveToEditedLi() {
    if (currentID) {
        const li = document.getElementById("contact-li-" + currentID);
        li.style.background = "var(--btn-color)";
        li.querySelector(".contact-name").style.color = "#fff";
        li.scrollIntoView({ behavior: "smooth"});
        prevLi = li;
    }
}

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


async function queryContacts() {
    let response = await fetch(BASE_URL_CONTACT + ".json");
    let responseJSON = await response.json();
    let keys = Object.keys(responseJSON);
    
    for (let index = 0; index < keys.length; index++) {    
        const key = keys[index];
        const value = responseJSON[key];

        if (responseJSON[key]) queryedContacts.push({[key]: value});
    }   
 
}

function clickContactCard(id) {
    let li = document.getElementById(id);
    currentID = id;

    if (prevLi) {
        prevLi.style.background = "";
        prevLi.querySelector(".contact-name").style.color = "#000";
    }
    li.style.background = "var(--btn-color)";
    prevLi = li;
    li.querySelector(".contact-name").style.color = "#fff";
    
    renderContactDetail(li.getAttribute("contactID"));
}

function renderContactDetail(id) {
    const cont = allContacts.filter(c => c.id == id)[0];
 
    
    contactDetailDIV.innerHTML = getConactDetail(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, id, cont.color);
}

function addNewConact() {
    if (prevLi) {
        prevLi.style.background = "";
        prevLi.querySelector(".contact-name").style.color = "#000";
    }

    currentID = "";
    shouldChnageColor = true;

    contactOverlay.classList.remove("d-none");
    contactOverlay.innerHTML = getAddContact();
}

function editContact(id) {
    console.log("currentid:", id);
    currentID = id;
    shouldChnageColor = false;
    
    contactOverlay.classList.remove("d-none");
    const cont = allContacts.filter(c => c.id == id)[0];
    contactOverlay.innerHTML = getEditContact(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, cont.color, id);
}

function clearEditContact() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");
    const initialsDIV = document.getElementById("edit-contact-intitals");

    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";
    initialsDIV.style.background = "var(--bg-gray)";
    initialsDIV.querySelector("span").innerText = "";
    initialsDIV.querySelector("img").style.display = "block";
}


async function deleteContact(id){
    await fetch(BASE_URL_CONTACT + id + '.json',  {
        method: "DELETE",
    }).then ((response) => {
        if (response.ok) {
            document.body.appendChild(getNotification("Contact successfully deleted"));
            setTimeout(() => {
                document.body.removeChild(document.getElementById("notification-id"));

                contactListDIV.innerHTML = "";
                contactDetailDIV.innerHTML = "";
                queryedContacts = [];
                allContacts = [];
                currentID = "";
                initContact();
            }, 1000);
        }
    });
}


async function saveEditContact(e) {
    e.preventDefault();

    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");
    const initialsDIV = document.getElementById("edit-contact-intitals");
    const errorMSG = document.getElementById("edit-contact-error");
    
    let user = allContacts.find(c => (c.email == emailField.value && c.id != currentID));
    
    if(user) {
        errorMSG.style.display = "block";
        errorMSG.innerText = "The email is already used";
    } else {
        let data = {email:emailField.value.trim(), name:nameField.value.trim(), phone:phoneField.value.trim() , color:initialsDIV.style.backgroundColor}
        console.log(data);
        
        putContact(data, currentID);
    }
}

/**
 * 
 * @param {String} id id is only to be passed by updating contact.
 * @param {object} data {email:"xin33@gmail.com", name:"Yang Xin", phone:"1234567", color:""}
 */
async function putContact(data, id="") {
    console.log("putConatct");
    
    await fetch(BASE_URL_CONTACT + id + ".json", {
        method: id ? "PUT" : "POST" ,
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    })
    .then ((response) => {
        if (!response) throw new Error("Network Error");

        let overlay = document.getElementById("contact-overlay");
        overlay.classList.add("d-none");

        return response.json();
    })
    .then (result => {
        currentID = id || result.name;
        
        updatePageInfo();
        
    });
    // console.log("r", await r.json());

}



function updatePageInfo() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");
    const initialsDIV = document.getElementById("edit-contact-intitals");

    updateContactDetail(initialsDIV.style.backgroundColor, initialsDIV.querySelector("span").innerText, nameField.value, emailField.value, phoneField.value);
    updateContactNamceCard();
}

function updateContactNamceCard() {
    contactListDIV.innerHTML = "";
    queryedContacts = [];
    allContacts = [];
    initContact();
}

function updateContactDetail(bgColor, inital, name, email, phone){
    const detailLogo = document.getElementById("contact-detail-header-logo");
    const detailName = document.getElementById("contact-detail-name");
    const detailEmail = document.getElementById("contact-detail-email");
    const detailphone = document.getElementById("contact-detail-phone");

    detailLogo.style.backgroundColor = bgColor;
    detailLogo.innerText = inital;
    detailName.innerText = name;
    detailEmail.innerText = email;
    detailphone.innerText = phone;
}


function closeContactOverlay(event) {
    if (event.target !== event.currentTarget) return;

    let overlay = document.getElementById("contact-overlay");
    overlay.classList.add("d-none");

    event.stopPropagation();
}



function editChangeName() {
    clearErrorMsg();
    
    const nameField = document.getElementById("edit-contact-name");
    const initialsDIV = document.getElementById("edit-contact-intitals");
    const valueStr = String(nameField.value);

    if (valueStr.length) {
        if (shouldChnageColor) {
            colorStr = generateLightColor();
            initialsDIV.style.background = colorStr;
        } 
        shouldChnageColor = false;
        hideInitalPlaceholderImage(initialsDIV, valueStr);
    } else {
        shouldChnageColor = true;
        showInitalPlaceholderImage(initialsDIV)
    }
}


function hideInitalPlaceholderImage(initialsDIV, valueStr) {
    initialsDIV.querySelector("span").innerText = extracNameInitials(valueStr);
    initialsDIV.querySelector("img").style.display = "none";
}


function showInitalPlaceholderImage(initialsDIV) {
    initialsDIV.style.background = "var(--bg-gray)";
    initialsDIV.querySelector("span").innerText = "";
    initialsDIV.querySelector("img").style.display = "block";
}


function clearErrorMsg() {
    const errorMSG = document.getElementById("edit-contact-error");
    errorMSG.style.display = "none";
    errorMSG.innerText = "";
}



