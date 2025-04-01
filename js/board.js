let allTasks = [];

async function init() {
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderInitials(activeUser);
    await getAllTasks();    
}

function renderInitials(activeUser) {
    if (!activeUser) {
        document.getElementById('initialNames').innerHTML = "G"; 
    }else {
        let originalName = activeUser[0].name;
        let initials = originalName.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        document.getElementById('initialNames').innerHTML = initials; 
    }
}

async function getAllTasks() {
    let response = await fetch(BASE_URL_TASK + '.json');
    let responseJson = await response.json();  
    let keys = Object.keys(responseJson);  
    for (let index = 0; index < keys.length; index++) {
        let task = responseJson[keys[index]];
        allTasks.push(task); 
         
    }     
    console.log(allTasks); 
    renderProgressTasks();   
    
}


function renderProgressTasks() {
    let inProgress = document.getElementById('inProgress'); 
    let ToDo = document.getElementById('ToDo'); 
   
    for (let index = 0; index < allTasks.length; index++) {
        if (allTasks[index].status === "in Progress") {
            inProgress.innerHTML += showInProgressTasks(index);        
        } 
        if (allTasks[index].status === "To do") {
            ToDo.innerHTML += showToDoTasks(index);        
        } 
    }}