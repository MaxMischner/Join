
let tasks = [];
let toDoTasks = [];
let doneTasks = [];
let urgentTasks = [];
let awaitFeedback = [];
let inProgress = [];

async function init() {
    await getTasks()
}

async function getTasks() {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();    
    let keys = Object.keys(responseJson);   
    for (let index = 0; index < keys.length; index++) {
        renderTodoDone(keys, index);
        renderUrgent(keys, index);
        renderSummary(keys, index);
    } 
}

async function renderTodoDone(keys, index) {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();    
    let key = keys[index];  
    let task = responseJson[key];
    if (task.status === "To do") {
        toDoTasks.push(task)
        document.getElementById('toDos').innerHTML = toDoTasks.length;            
    }else if (task.status === "done")  
        doneTasks.push(task)
        document.getElementById('done').innerHTML = doneTasks.length;   
}  

async function renderUrgent(keys, index) {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();    
    let key = keys[index];  
    let task = responseJson[key];
    if (task.priority === "Urgent") {
        urgentTasks.push(task)
        document.getElementById('urgent').innerHTML = urgentTasks.length; 
    }
}

async function renderSummary(keys, index) {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();   
    let key = keys[index];  
    let task = responseJson[key];
    document.getElementById('taksTotal').innerHTML = keys.length;
    if (task.status === "in Progress") {
        awaitFeedback.push(task)
        document.getElementById('taksProgress').innerHTML = awaitFeedback.length; 
    }else if (task.status === "await feedback") { 
        awaitFeedback.push(task);
        document.getElementById('awaitFeedback').innerHTML = awaitFeedback.length; 
    }
}