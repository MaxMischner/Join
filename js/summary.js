
let tasks = [];
let toDoTasks = [];
let doneTasks = [];
let urgentTasks = [];
let awaitFeedback = [];
let inProgress = [];
let upcomingDeadline = null;


/**
 * onload init Function
 */
async function init() {
    await getTasks();
}


/**
 * fetch the tasks from firebase API and start next render Functions
 */
async function getTasks() {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();    
    let keys = Object.keys(responseJson);   
    for (let index = 0; index < keys.length; index++) {
        renderTodoDone(keys, index);
        renderUrgent(keys, index);
        renderSummary(keys, index);
        renderDeadline()
    } 
}

/**
 * render the values in the first line of the site (To do and Done)
 * @param {*} keys 
 * @param {*} index 
 */

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

async function renderDeadline() {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();  
    let tasksArray = Object.values(responseJson);
    for (let i = 0; i < tasksArray.length; i++) {
        let task = tasksArray[i];
        if (task.duedate && task.duedate !== 'null') {
            if (upcomingDeadline === null || new Date(task.duedate) < new Date(upcomingDeadline)) {
                upcomingDeadline = task.duedate;  
            }
        }
    }
    deadline = moment(upcomingDeadline).format('ll');
    document.getElementById('deadline').innerHTML = deadline; 
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
    }else if (task.status === "await Feedback") { 
        awaitFeedback.push(task);
        document.getElementById('awaitFeedback').innerHTML = awaitFeedback.length; 
    }
}