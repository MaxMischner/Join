
let tasks = [];
let toDoTasks = [];
let doneTasks = [];
let urgentTasks = [];
let awaitFeedback = [];
let inProgress = [];
let upcomingDeadline = null;


/**
 * onload init Function.
 * - checks if the user is logged in. if not, the user ist forwarded to the log in site
 * - starts several functions
 * - renders the content when getTasks is done
 */
async function initSummary() {
    let user = localStorage.getItem("activeUser");
    if (!user) {
        window.location.href = "log_in.html";
        return ;
    } 
    await getTasks();
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderName (activeUser);
    renderGreeting();
    renderInitials(activeUser);
    renderContent();
}

/**
 * Renders and shows the content of the site
 * Wait till all data is loaded in the fields an removes display:none
 * from the content and ads it to the logo. 
 *  
 */
function renderContent() {
    document.getElementById('mainContainer').classList.remove('d-none');
    document.getElementById('waitLogo').classList.add('d-none');
}


/**
 * Renders the initials of the active user into the DOM.
 * 
 * If no user is active, a default letter "G" is shown.
 * If a user is present, the initials are generated from the user's name.
 * 
 * @param {Array<Object>} activeUser - An array with one user object that contains a `name` property.
 * @property {string} activeUser[].name - The full name of the active user (e.g., "John Doe").
 */
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
 * Fetches all task data from the Firebase database and processes it for display on the summary page.
 * 
 * The function retrieves all tasks from the database, extracts their keys, and iterates over each task. 
 * It then calls different render functions to process the task:
 * - `renderTodoDone(task)` checks the task status and updates the number of "To do" and "Done" tasks.
 * - `renderUrgent(task)` checks and updates the count of tasks with high priority.
 * - `renderSummary(task, keys)` updates the general task summary.
 * 
 * Additionally, `renderDeadline()` is called before the loop to display upcoming deadlines.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves after all tasks are fetched and processed.
 */
async function getTasks() {
    let response = await fetch(BASE_URL_TASK + ".json");
    let responseJson = await response.json();    
    let keys = Object.keys(responseJson);   
    renderDeadline();
    for (let index = 0; index < keys.length; index++) {
        let key = keys[index];
        let task = responseJson[key];
        renderTodoDone(task);
        renderUrgent(task);
        renderSummary(task, keys);
    }     
}

/**
 * Renders the amount of tasks with status 'To do' and 'Done'.
 * Checks if the status of the given task is 'To do' or 'Done' and pushes it into 
 * the corresponding arrays `toDoTasks` or `doneTasks`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
function renderTodoDone(task) {
    if (task.status === "To do") {
        toDoTasks.push(task);
        document.getElementById('toDos').innerHTML = toDoTasks.length;
    } else if (task.status === "done") {
        doneTasks.push(task);
        document.getElementById('done').innerHTML = doneTasks.length;
    }
}

/**
 * Renders the amount of tasks with status 'Urgent'.
 * Checks if the status of the given task is 'Urgent' and pushes it into 
 * the corresponding arrays `urgentTasks`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
async function renderUrgent(task) {
    if (task.priority === "Urgent") {
        urgentTasks.push(task)
        document.getElementById('urgent').innerHTML = urgentTasks.length; 
    }
}

/**
 * Fetches all tasks from the database and determines the earliest upcoming deadline.
 * 
 * Iterates through all tasks and checks for valid `duedate` values.
 * The function finds the closest upcoming date and sets it as the global 
 * `upcomingDeadline`.
 * It then formats this date using Moment.js and renders it in the DOM element 
 * with the ID `deadline`.
 * 
 */
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

/**
 * Renders the amount of tasks with status 'in Progress' and 'Done'.
 * checks the amount of all tasks in object keys updates the HTML with the current 
 * number of all tasks.
 * Checks if the status of the given task is 'in Progress' or 'await Feedback' and pushes it into 
 * the corresponding arrays `inProgress` or `awaitFeedback`.
 * Then updates the HTML with the current number of tasks in each category.
 * 
 * @param {object} task - A single task object fetched from the database.
 */
async function renderSummary(task, keys) {
    document.getElementById('tasksTotal').innerHTML = keys.length;
    if (task.status === "in Progress") {
        inProgress.push(task)
        document.getElementById('tasksInProgress').innerHTML = inProgress.length; 
    }else if (task.status === "await Feedback") { 
        awaitFeedback.push(task);
        document.getElementById('tasksAwaitFeedback').innerHTML = awaitFeedback.length; 
    }
}

/**
 * Checks the current time and selects the appropriate greeting 
 * for the user depending on the time.
 * 
 */
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

/**
 * Checks the looged in user and updates his name in HTML. 
 * 
 * @param {string} activeUser - name of the logged in user
 */
function renderName(activeUser) {
   if (!activeUser) {
        document.getElementById('userName').innerHTML = ""; 
   }else
        document.getElementById('userName').innerHTML = activeUser[0].name; 
}
