
/**
 * To fetch all users from DB
 */

async function getAllUsers(){
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();

    let keys = Object.keys(responseJSON);
    
    let allUsers = [];
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = responseJSON[key];
        if (responseJSON[key]) allUsers.push({[key]: value});
    }   
     
    return allUsers;
}

// test
// getAllUsers().then(allUsers => {
//     console.log(allUsers);
// })

/**
 * 
 * @param {String} id id is only to be passed by updating user info.
 * @param {object} data {email:"xin33@gmail.com", name:"Yang Xin", password:"1234567"}
 */
async function putUser(data, id="") {
    let allUsers = await getAllUsers();
    let user = allUsers.find(u => u.email == data.email);
    if(user) {
        console.log("User already exist");   
    } else {
        let response = await fetch(BASE_URL_USER + id + ".json", {
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

// test
// putUser({email:"test@gmail.com", name:"test", password:"1234567"});

async function login(data) {
    let allUsers = await getAllUsers();
    let user = allUsers.find(u => u.email == data.email && u.password == data.password);

    if(user) {
        // Go to main.html
        window.location.href = "";
    } else {
        console.log("User does not exit");
    }
}
