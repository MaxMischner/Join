
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
async function initSummary() {
    await getTasks();
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderName (activeUser);
    renderGreeting();
    renderInitials(activeUser);
    setTimeout(() => {
        renderContent();
    }, 800);
}

/**
 * Wait till all elements are loaded in the fields
 */

function renderContent() {
    document.getElementById('mainContainer').classList.remove('d-none')    
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
        renderDeadline();
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

function renderGreeting() {
    let today = new Date();
    let hour = today.getHours()
    if((hour >=0) && (hour <=9))
    document.getElementById('greeting').innerHTML = 'Good Morning'
    if((hour >=10) && (hour <=18))
    document.getElementById('greeting').innerHTML = 'Good Day'
    if((hour >=19) && (hour <=23))
    document.getElementById('greeting').innerHTML = 'Good Evening'
}


function renderName(activeUser) {
   if (!activeUser) {
        document.getElementById('userName').innerHTML = ""; 
   }else
        document.getElementById('userName').innerHTML = activeUser[0].name; 
}
