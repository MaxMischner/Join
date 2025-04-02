let allContacts = [];
/**
 * To fetch all contact info from DB
 */
function init() {
    getAllContacts();
}


async function getAllContacts(){
    let response = await fetch(BASE_URL_CONTACT+ ".json");
    let responseJSON = await response.json();

    let keys = Object.keys(responseJSON);
    
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = responseJSON[key];
        if (responseJSON[key]) allContacts.push({[key]: value});
    }   
    
    renderContactList(allContacts);
}

function renderContactList() {
    const contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // vorher leeren

    const gruppen = {};

    allContacts.forEach(contactObj => {
        const [key, contact] = Object.entries(contactObj)[0];
        const buchstabe = contact.name[0].toUpperCase();
        const name = contact.name;
        const email = contact.email;

        if (!gruppen[buchstabe]) {
            gruppen[buchstabe] = [];
        }

        gruppen[buchstabe].push({ name, email });
    });
    const sortierteBuchstaben = Object.keys(gruppen).sort();

    sortierteBuchstaben.forEach(buchstabe => {
        const heading = document.createElement("h3");
        heading.textContent = buchstabe;
        contactList.appendChild(heading);

       
        gruppen[buchstabe]
            .sort((a, b) => a.name.localeCompare(b.name)).forEach(contact=> {
                const contactItem = createContactItem( contact);
                contactList.appendChild(contactItem);
            });
    });
}




function createContactItem( contact) {
    const name = contact.name;
    const initials = getInitials(name);
    const color = getColorForName(name);
    const email = contact.email;
  
   
    const left = createContactLeft(name, initials, color);
    const right = createContactRight(name,email);
    const contactItem = document.createElement("div");
    contactItem.className = "contact-item";
    contactItem.dataset.name = name;
    contactItem.appendChild(left);
    contactItem.appendChild(right);
  
    return contactItem;
  }

  function getInitials(name) {
    if (!name || typeof name !== "string") return "??";
    return name.split(" ").map((word) => word[0]).join("").toUpperCase();
  }

  function getColorForName(name) {
    const colors = [
      "#29ABE2","#FF8A00","#9327FF","#6E52FF","#FC71FF","#FFBB2B","#1FD7C1", "#462F8A",
    ];
    if (!name || typeof name !== "string") {
      return "#D1D1D1";
    }
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  function createContactLeft(name, initials, color) {
    const left = document.createElement("div");
    left.className = "contact-left";
    left.innerHTML = `
      <div class="contact-initial" style="background:${color}">${initials}</div>
     
    `;
    return left;
  }

  function createContactRight(name, email) {
    const right = document.createElement("div");
    right.className = "contact-right";
    right.innerHTML = `
      <span>${name}</span>
      <span>${email}</span>
    `;
    return right;
  }
// test
// getAllContacts().then(allContacts => {
//     console.log(allContacts);
// })

/**
 * 
 * @param {String} id id is only to be passed by updating contact info.
 * @param {object} data {email:"Anna@gmail.com", name:"Anna Yang", phone:"+4913023269953"}
 */
async function putContact(data, id="") {
    let allUsers = await getAllContacts();
    let user = allUsers.find(u => u.email == data.email);
    if(user && !id) {
        console.log("Contact already exist");   
    } else {
        let response = await fetch(BASE_URL_CONTACT + id + ".json", {
            method: id ? "PUT" : "POST" ,
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(data)
        })
    
        let responseToJson = await response.json();
        console.log("Response:", responseToJson);
    
        return responseToJson;
    }
}

// test add contact
// putContact({email:"max11111@gmail.com", name:"Maximilian", phone:"+4913023269953"});

// test edit contact
// putContact({email:"Anna@gmail.com", name:"Anna Yang", phone:"+4913023269953"}, 1);


async function deleteContact(id) {
    let response = await fetch(BASE_URL_CONTACT + id + ".json", {
        method: "DELETE"
    })
    return responseToJSON = await response.json();
}

// test delete one contact
// deleteContact("-OMO6ieY9mPBiA33sDmv");