
/**
 * To fetch all contact info from DB
 */

async function getAllContacts(){
    let response = await fetch(BASE_URL_CONTACT+ ".json");
    let responseJSON = await response.json();

    let keys = Object.keys(responseJSON);
    
    let allContacts = [];
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = responseJSON[key];
        if (responseJSON[key]) allContacts.push({[key]: value});
    }   

    return allContacts;
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