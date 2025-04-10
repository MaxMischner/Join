let queryedContacts = [];
let allContacts = [];
let contactListDIV = document.getElementById("contact-list");
let contactOverlay = document.getElementById("contact-overlay");
let prevLi;



function initContact() {
    queryContacts().then(() => {
        for (let index = 0; index < queryedContacts.length; index++) {

            let contact = queryedContacts[index];
            let keys = Object.keys(contact);

            let contactDetail = contact[keys[0]];
            contactDetail['id'] = keys[0];
            contactDetail['color']  = generateLightColor();
            
            allContacts.push(contactDetail);
        }
        console.log(allContacts);
        
        reconstructContactArray();
    })
}   


function reconstructContactArray() {
    let obj = {};
    allContacts.forEach(contact => {
        let letter = contact.name.at(0);
        
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
}

function extracNameInitials(name) {
    let arr = name.split(" ");
    let initialsStr = ""
    arr.forEach(n => {
        if (n.length) {
            initialsStr += n.at(0);
        }
    });

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
 
    const contactDetailDIV = document.getElementById("contact-detail");
    contactDetailDIV.innerHTML = getConactDetail(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, id, cont.color);
}

function editContact(id) {
    console.log(id);
    console.log(allContacts);
    
    
    contactOverlay.classList.remove("d-none");
    contactOverlay.innerHTML = getEditContact();

    const cont = allContacts.filter(c => c.id == id)[0];
    console.log(cont);
 
    const contactDetailDIV = document.getElementById("contact-detail");
    contactOverlay.innerHTML = getEditContact(extracNameInitials(cont.name), cont.name, cont.email, cont.phone, cont.color);
}

function clearEditContact() {
    const nameField = document.getElementById("edit-contact-name");
    const emailField = document.getElementById("edit-contact-email");
    const phoneField = document.getElementById("edit-contact-phone");

    nameField.value = "";
    emailField.value = "";
    phoneField.value = "";
}
