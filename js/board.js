let allTasks = [];
let allContactsBoard = [];
let subtaskContent = [];
let currentDraggedElement;
let currentButton;

async function init() {
    let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return ;
    } 
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));   
    renderInitials(activeUser);
    await getAllTasks();  
    await getAllContactsBoard(); 
    await  renderTasks();           
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
 * Fetches the data from the firebase API ans pushes it in the empty object 'allTasks'
 * 
 * generates the new key 'firebase.ID' in the object allTasks 
 * 
 */
async function getAllTasks() {
    let response = await fetch(BASE_URL_TASK + '.json');
    let responseJson = await response.json();  
    let keys = Object.keys(responseJson);   
    for (let index = 0; index < keys.length; index++) {
        let task = responseJson[keys[index]];
        task.firebaseID = keys[index];
        allTasks.push(task);                 
    }                    
}

/**
 * Fetches the data from the firebase API ans pushes it in the empty object 'allContactsBoard'
 * 
 * generates the new key 'firebase.ID' in the object allContactsBoard 
 * 
 */
async function getAllContactsBoard() {
    let response = await fetch(BASE_URL_CONTACT  + '.json');
    let responseJson = await response.json();  
    let keys = Object.keys(responseJson);  
    for (let index = 0; index < keys.length; index++) {
        let allContacts = responseJson[keys[index]];
        allContactsBoard.push(allContacts);                 
    }          
}

/**
 * Returns the background color assigned to a contact by name.
 * 
 * The function searches through the global `allContactsBoard` array
 * to find a contact object whose name matches the given `name` parameter.
 * 
 * - It normalizes both the input name and contact names by:
 *   - trimming whitespace
 *   - removing zero-width spaces (\u200B)
 *   - converting to lowercase (for case-insensitive comparison)
 * 
 * If a matching contact is found, the contact's `color` property is returned.
 * 
 * @param {string} name - The name of the contact to find.
 * @returns {string} - The color associated with the matched contact.
 */

function getBackgroundColorNames(name) {   
    let nameToFind = name.trim().replace(/\u200B/g, '').toLowerCase();   
    let contact = allContactsBoard.find(c =>
        c.name.trim().replace(/\u200B/g, '').toLowerCase() === nameToFind
    );
    return contact ? contact.color : 'null'; 
}

/**
 * Renders the data from allTasks in the the four splits of the board: To-Do, Progress, Await Feedback and Done
 * 
 * 
 */
async function renderTasks() {  
    document.getElementById('inProgress').innerHTML = "";
    document.getElementById('ToDo').innerHTML = "";
    document.getElementById('await').innerHTML = "";
    document.getElementById('done').innerHTML = "";
    showNoTasksContainer();
    for (let index = 0; index < allTasks.length; index++) {
        renderProgress(index);
        renderTodo(index);
        renderAwaitFeedback(index);
        renderDone(index);    
    }
}

/**
 * Removes display:none from the No-Tasks-Container if there are no tasks 
 * in the split after dragging in a new split.   
 * 
 */

function showNoTasksContainer() {
    document.getElementById('noTasksToDo').classList.remove('d-none');
    document.getElementById('noTasksInProgress').classList.remove('d-none');
    document.getElementById('noTasksAwaitFeedback').classList.remove('d-none'); 
    document.getElementById('noTasksDone').classList.remove('d-none'); 
}

/**
 * Render the allTasks data with status 'in Progress' in the split To-do with 
 * the showInProgressTasks-function.
 * If there are tasks, the Container "No Tasks To Do" will be removed.
 * 
 * @param {*} index - the index of the task ind the allTasks object
 * @property {string} allTasks[index].subtasks - if there are no subtasks in the object, the container 
 * gets a display:none
 * @property {string} allTasks[index].assigned - the name value is a string. with split it is 
 * transformed for Initials
 */
function renderTodo(index) {
    let ToDo = document.getElementById('ToDo'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "To do") {
        ToDo.innerHTML += showToDoTasks(index, subtasksClass, names); 
        document.getElementById('noTasksToDo').classList.add('d-none');       
    } 
}

/**
 * Render the allTasks data with status 'in Progress' in the split Progress with 
 * the showInProgressTasks-function.
 * If there are tasks, the Container "In Progress" will be removed.
 * 
 * @param {*} index - the index of the task ind the allTasks object
 * @property {string} allTasks[index].subtasks - if there are no subtasks in the object, the container 
 * gets a display:none
 * @property {string} allTasks[index].assigned - the name value is a string. with split it ist transformed for Initials
 */
function renderProgress(index) {
    let inProgress = document.getElementById('inProgress'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "in Progress") {
        inProgress.innerHTML += showInProgressTasks(index, subtasksClass, names);  
        document.getElementById('noTasksInProgress').classList.add('d-none');  
    } 
}

/**
 * Render the allTasks data with status 'in Progress' in the split Await Feedback-do with 
 * the showInProgressTasks-function.
 * If there are tasks, the Container "Await Feedback" will be removed.
 * 
 * @param {*} index - the index of the task ind the allTasks object
 * @property {string} allTasks[index].subtasks - if there are no subtasks in the object, the container 
 * gets a display:none
 * @property {string} allTasks[index].assigned - the name value is a string. with split it is 
 * transformed for Initials
 */
function renderAwaitFeedback(index) {
    let await = document.getElementById('await');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "await Feedback") {
        await.innerHTML += showAwaitFeedbackTasks(index, subtasksClass, names); 
        document.getElementById('noTasksAwaitFeedback').classList.add('d-none');        
    } 
}

/**
 * Render the allTasks data with status 'in Progress' in the split Doneo with 
 * the showInProgressTasks-function.
 * If there are tasks, the Container "Done" will be removed.
 * 
 * @param {*} index - the index of the task ind the allTasks object
 * @property {string} allTasks[index].subtasks - if there are no subtasks in the object, the container 
 * gets a display:none
 * @property {string} allTasks[index].assigned - the name value is a string. with split it is 
 * transformed for Initials
 */
function renderDone(index) {
    let done = document.getElementById('done'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "done") {
        done.innerHTML += showDoneTasks(index, subtasksClass, names);  
        document.getElementById('noTasksDone').classList.add('d-none');             
    }           
}

/**
 * Extracts and returns the category name for a task and formats it as a CSS class.
 * 
 * This function retrieves the category of a task from the `allTasks` array at the specified index, 
 * splits the category by a space (to handle compound category names), 
 * and returns the first part of the category name, formatted as a lowercase string. 
 * This can be used for dynamically applying CSS classes based on the task's category.
 *
 * @param {number} index - The index of the task in the `allTasks` array.
 * @returns {string} - A string representing the category name in lowercase, 
 * which can be used as a CSS class.
 * 
 * @example
 * // Assuming the task at index 2 has a category "High Priority Task"
 * const categoryClass = getCategoryClass(2); 
 * console.log(categoryClass); // Output: "high"
 */
function getCategoryClass(index) {
    let category = allTasks[index].category;
    let categoryName = category.split(' ')[0];  
    return categoryName.toLowerCase(); 
}

/**
 * Extracts the amount of subtasks in a task if subtasks exists. The amount is used for the length of the progress bar 
 * in the task.  
 * 
 * @param {*} index - The index of the task in the allTasks-object
 * @returns {number} - The number of subtasks as a number, or an empty string if no subtasks are present.
 * @example:
 * if the task has two subtasks, subTaskLength is 2. The 2 will be used in attributes of the progressbar, it ist max="2" 
 * 
 */
function subTaskLenght(index) {
    if (allTasks[index].subtasks) {
        subTaskLength = allTasks[index].subtasks.length
    } else {
    subTaskLength = ""
    }
    return subTaskLength;
}
/**
 * Stops the propagation of an event to parent elements.
 * 
 * @param {*} event - The event object that was triggered.
 */
function noBubbling(event) {
    event.stopPropagation();
}   

/**
 * Creats the initals of value 'name' in the allTasks-object, e.g. 'name' : 'John Doe' -> initials JD.
 * the initials are used in the header and in the tasks to show who is assigned
 * 
 * @param {*} names - key 'name' in the allTasks-object
 * @returns - returns the initials of the name
 */
function getInitials(names) {
    let initials = names.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
    return initials;
}

/**
 * Sets the index of the currently dragged element.
 * This function is used to store the index of the element being dragged.
 * Typically used in a drag-and-drop scenario to track the item being moved.
 *
 * @param {number} index - The index of the dragged element.
 * 
 */
function startDragging(index) {
    if (window.innerWidth <= 1330) return;
    currentDraggedElement = index;  
    document.getElementById(`task-card-${index}`).classList.add('tilt-on-drag'); 
    document.body.classList.add('drag-active'); 
}

/**
 * Allows the dropped element by preventing the default handling of the event.
 * This function is used in a drag-and-drop scenario to prevent the browser's default
 * handling of the drop event, enabling custom behavior (like moving the element).
 *
 * @param {Event} ev - The event object associated with the drop action.
 * @returns {void} - This function does not return any value.
 */
function allowDrop(ev) {
    if (window.innerWidth <= 1330) return;
    ev.preventDefault();
}

/**
 * Updates the status of a task based on its new position after a drag-and-drop operation.
 * For example, if a task with the status "Awaiting Feedback" is dragged to the "Done" section, 
 * the task's status will be updated to 'done', and it will be rendered in the 'Done' section.
 * Additionally, the function updates the task's status in the database (Firebase).
 * 
 * @param {string} status - The new status of the task based on the split where it is dropped, 
 * e.g., 'done', 'in progress'.
 * @returns {Promise<void>} - A promise indicating the completion of the operation. 
 * The function performs asynchronous tasks but does not return any result.
 */
async function moveTo(status) {
    let task = allTasks[currentDraggedElement]; 
    task.status = status; 
    renderTasks();    
    document.body.classList.remove('drag-active');
    let response = await fetch(`${BASE_URL_TASK}/${task.firebaseID}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status }) 
    });
    let responseJson = await response.json();
}

/**
 * Opens the task move overlay by displaying the specified button and the mobile overlay.
 * This function makes the overlay visible by removing the `d-none` class from the provided button and the overlay element.
 * It also stops the event propagation to avoid triggering unwanted event listeners.
 *
 * @param {string} buttonID - The ID of the button that should be displayed (passed as `currentButton`).
 * @param {Event} event - The event object representing the user interaction (e.g., click).
 * @returns {void} This function does not return any value.
 *
 * @example
 * // Example usage:
 * openMoveTaskOverlay('overlayMoveToProgress', event);
 * 
 * // The button with the ID 'overlayMoveToProgress' and the mobile overlay will be made visible.
 */
function openMoveTaskOverlay(buttonID, event) {
    event.stopPropagation();    
    currentButton = buttonID;
    document.getElementById(currentButton).classList.remove('d-none');
    document.getElementById('overlayMoveToMobile').classList.remove('d-none');    
}

/**
 * Moves a task to a new status and updates the task status in the backend.
 * This function hides the move overlay and updates the task status in the backend via a PATCH request.
 * It also re-renders the task list to reflect the updated status.
 *
 * @param {string} overlayMoveTo - The ID of the overlay to be closed after moving the task.
 * @param {number} index - The index of the task in the `allTasks` array.
 * @param {string} status - The new status to be assigned to the task.
 * @param {Event} event - The event object representing the user interaction (e.g., click).
 * @returns {Promise<void>} This function returns a promise that resolves when the backend update is complete.
 *
 * @example
 * // Example usage:
 * moveToMobile('overlayMoveToProgress', 1, 'await Feedback', event);
 * 
 * // The task at index 1 will have its status updated to 'await Feedback' and the UI will be updated.
 */
async function moveToMobile(overlayMoveTo, index, status, event) {
    event.stopPropagation();
    let task = allTasks[index];         
    document.getElementById(overlayMoveTo).classList.add('d-none');
    document.getElementById('overlayMoveToMobile').classList.add('d-none');
    task.status = status; 
    renderTasks();    
    let response = await fetch(`${BASE_URL_TASK}/${task.firebaseID}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status }) 
    });
    let responseJson = await response.json();
}

/**
 * Extracts the number of completed subtasks for a task. For example, if there are 3 subtasks, 
 * 2 have the value 'false' and one has the value 'true', the function returns 1. 
 * The function is used to display the number of completed subtasks for a task on the board.
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 * @returns {number|undefined} - If there are no subtasks, the function returns `undefined`. 
 * If there are subtasks, the function returns the number of completed subtasks (those with the value 'true').
 */
function getDoneSubtasks(index) {
    let subTasks = allTasks[index].subtasks;
    if (!subTasks) {
        return;
    }
    let doneSubtasks = subTasks.filter(subtask => subtask.completed === true);
    return doneSubtasks.length;
}



    


   


 

    
    
   
