activeUser = [];

async function init() {
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();
    console.log(responseJSON);    
    let keys = Object.keys(responseJSON);
    console.log(keys);    
}

async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let response = await fetch(BASE_URL_USER + ".json");
    let responseJSON = await response.json();
    let users = Object.values(responseJSON);
    let user = users.find(u => u.email == email && u.password == password);    
    if(user) {
        console.log('gefunden');  
        console.log(user);
        activeUser.push (user);
        console.log('active User: ' + JSON.stringify(activeUser));
 
    }else {
        console.log('nicht gefunden');        
    }    
}