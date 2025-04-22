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
    return contact.color            
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
 * Closes the overlay and hides the task details.
 * This function removes the slide-in animation, adds a slide-out animation, 
 * and hides the overlay after a short delay. Additionally, it resets the task data 
 * by clearing the `subtaskContent` and `allTasks` arrays, then reloads the task data 
 * by calling the `getAllTasks()` function followed by rendering the tasks.
 *
 * 
 */
async function closeOverlay() {
    let overlayRef = document.getElementById('overlayDetail');
    let overlayDetail = document.getElementById('taskDetail');
    overlayDetail.classList.remove('slide-in');
    overlayDetail.classList.add('slide-out');
    setTimeout(() => {
        overlayRef.classList.add('d-none'); 
    }, 300);
    subtaskContent = [];   
    allTasks = []; 
    await getAllTasks();
    renderTasks();
}

/**
 * Closes the add-task-overlay and hides the task details.
 * 
 */
function closeAddTaskOverlay() {
    document.getElementById('overlayAddTask').classList.add('d-none');
}

/**
 * Closes the add-task overlay.
 * This function removes the slide-in animation, adds a slide-out animation, 
 * and hides the overlay.
 * 
 */
function closeAddTaskOverlay() {
    let overlayAddTaskRef = document.getElementById('overlayAddTask');
    let addTaskOverlay = document.getElementById('addTaskOverlay');
    addTaskOverlay.classList.remove('slide-in');
    addTaskOverlay.classList.add('slide-out');
    overlayAddTaskRef.classList.add('d-none');
}

/**
 * Closes the overlay for the sign out function in the header.
 * It removes the background of container changes the font color back. 
 * The function that opnes the overlay is in script.js
 */
function closeSignOutOverlay() {
    let overlaySignOut = document.getElementById('overlay');
    initialNamesDiv.style.background = ""
    initialNamesDiv.style.color = "rgba(41, 171, 226, 1)";
    overlaySignOut.classList.add('d-none');
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
    currentDraggedElement = index;    
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
 * Closes the move overlay and hides the UI elements associated with the current button and mobile overlay.
 * This function adds the `d-none` class to the overlay and mobile overlay elements to make them invisible.
 *
 * @param {Event} event - The event object representing the user interaction (e.g., click).
 * @returns {void} This function does not return any value.
 *
 */
function closeMoveToOverlay(event) {
    document.getElementById(currentButton).classList.add('d-none');
    document.getElementById('overlayMoveToMobile').classList.add('d-none'); 
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

/**
 * Renders the overlay with detailed information of a task when clicking on it.
 * It splits the assigned names into separate strings to use with the initials function. 
 * The function checks if there are subtasks associated with the task. If no subtasks exist, 
 * it adds the 'd-none' class to hide the subtask container.
 * It also removes the 'd-none' class from the overlay to make it visible.
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 */
function renderTaskDetail(index) {
    currentTaskIndex = index;
    let overlay = document.getElementById('overlayDetail');
    let names = allTasks[index].assigned.split(',');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    parseSubtasks(index);
    overlay.innerHTML = showTaskDetail(index, names, subtasksClass);
    overlay.classList.remove('d-none');  
}

/**
 * Parses the subtasks of a task and stores the relevant information in the `subtaskContent` array.
 * This function checks whether the task has subtasks, and if so, extracts their names and 
 * completion status and pushes them into the `subtaskContent` array.
 * If there are no subtasks, the function does nothing and exits early.
 * 
 * @param {number} index - The index of the task in the `allTasks` array. This is used 
 * to access the subtasks of the specific task.
 * @returns {void} - This function does not return any value. It populates the `subtaskContent` 
 * array with subtask information.
 */
function parseSubtasks(index) {
    subtaskContent = [];
    let subtasks = allTasks[index].subtasks;
    if (!subtasks) return;
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContent.push({
            name: subtasks[i].name,
            completed: subtasks[i].completed
        });
    }
}

/**
 * Converts the due date from the object format to the format used in the task view.
 * Example: The date format in the object is '2025-04-27', and the task view format is '04/12/2025'.
 * 
 * @param {string} date - The due date value in the object (in ISO format, e.g., '2025-04-27').
 * @returns {string} - The due date formatted as 'MM/DD/YYYY'.
 */
function taskDetailDueDate(date) {
   let dueDate = moment(date).format('L');     
   return dueDate
}

/**
 * Retrieves the image status for a specific subtask based on its completion state.
 * If the subtask is completed (`completed === true`), it returns 'on' to indicate 
 * that the background image should reflect a "completed" status (e.g., a hook symbol).
 * If not completed, it returns 'off' to indicate an "incomplete" status.
 * 
 * @param {number} index - The index of the subtask in the `subtaskContent` array.
 * @returns {string} - Returns 'on' if the subtask is completed, otherwise 'off'.
 */
function getSubTaskImage(index) {
    let subTaskImage = (subtaskContent[index].completed === true ? 'on' : 'off');
    return subTaskImage;
}

/**
 * Toggles the completion state of a subtask.
 * When the image in `getSubTaskImage` is clicked, the state of the subtask is toggled, 
 * changing it from `true` to `false` or from `false` to `true`. Afterward, the function 
 * `renderSubtaskOverlay` is called to update the task view.
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 * @param {number} i - The index of the subtask in the `subtasks` array of the task.
 */
function changeSubtaskComplete(index, i) {
    let subtask = allTasks[index].subtasks[i];
    subtask.completed = !subtask.completed; 
    renderSubtaskOverlay(index);  
}

/**
 * Renders subtask view with updated subtask completion. 
 * If there are no subtasks in the task, a display:none is added to the subtask container. 
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 */
function renderSubtaskOverlay(index) {
    let subtasks = document.getElementById('subTasksOverlay');    
    let currentSubtasks = allTasks[index].subtasks;
    let subtasksClass = (!currentSubtasks || currentSubtasks.length === 0) ? 'd-none' : '';
    subtasks.innerHTML = showOverlaySubtasks(index, subtasksClass);
}    

/**
 * Updates the task's status in the database (Firebase). 
 * When the image in `getSubTaskImage` is clicked, the state of the subtask is toggled, 
 * changing it from `true` to `false` or from `false` to `true`.
 * 
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 * @param {number} i - The index of the subtask in the `subtasks` array of the task.
 */
async function changeSubtaskCompleteApi(index, i) {
    let firebaseID = allTasks[index].firebaseID;
    let response = await fetch(`${BASE_URL_TASK}/${firebaseID}.json`);
    let responseJson = await response.json();
    let subtask = responseJson.subtasks[i];
    subtask.completed = !subtask.completed;
    responseJson.subtasks[i] = subtask;
    await fetch(`${BASE_URL_TASK}/${firebaseID}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseJson),
    });
}

/**
 * Opens the confirmation overlay to verify the deletion of a task after clicking the 'Delete' button.
 * 
 * @param {number} index - The index of the task in the `allTasks` array.
 */
function deleteTask(index) {
    let test = document.getElementById('overlayDelete');
    test.classList.remove('d-none')
    test.innerHTML = showDeleteTask(index)   
}

/**
 * Closes the delete confirmation overlay after clicking the "No" button to deny the deletion.
 */
function noDelete() { 
    let overlayRef = document.getElementById('overlayDelete');
    document.getElementById('CompletelyDeleteTask').classList.add('d-none'); 
    overlayRef.classList.add('d-none'); 
}
   
/**
 * Deletes the task from the `allTasks` array and the Firebase database.
 * Triggered after clicking the "Yes" button in the delete confirmation overlay.
 * After deletion, the task list is re-rendered and the overlay is closed.
 *
 * @param {number} index - The index of the task in the `allTasks` array.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from Firebase.
 */
async function deleteTaskCompletely(index) {    
    document.getElementById('overlayDelete').classList.add('d-none');
    firebaseID = allTasks[index].firebaseID;
    let response = await fetch(`${BASE_URL_TASK}/${firebaseID}.json`,{
        method: "DELETE"
    });
    allTasks.splice(index, 1);
    closeOverlay();
    renderTasks();    
    return responseToJson = await response.json();
}

/**
 * Opens the 'add-task'-overlay after clicking the 'add-task'-button.
 * If the screen.-width is under 1.200px the buttons redirects to the Add task Html-site.
 * If the screen.-width is over 1.200px the buttons ober an overlay for adding a task.
 * The functions for the overlay are in add_task.js
 */
function renderAddTaskOverlay() {
    const isMobile = window.innerWidth <= 1200;
    if (isMobile) {
         window.location.href = `add_task.html`;
    }else {
    let overlay = document.getElementById('overlayAddTask');
    overlay.innerHTML = showAddTaskOverlay();
    overlay.classList.remove('d-none');
    getAllContacts();
    }
}


/**
 * Filters tasks based on the user's search input. * 
 * If the input is less than 3 characters long, the function returns without filtering.
 * With 3 or more charakters, it searches through the `title` and `description` of all tasks and updates the 
 * `allTasks` array with the filtered results. The filtered tasks are then rendered on the board.
 * When the search field is cleared, the tasks reload with init. 
 *
 * @function
 * 
 */
function filterTasks() {
    const searchInput = document.getElementById("boardSearchField").value;
    if (searchInput === "") {
        allTasks = []; 
        init(); 
        return;
    }
    if(searchInput.length < 3) return;
    const searchResults = allTasks.filter(result => {
    return result.title.toLowerCase().includes(searchInput.toLowerCase()) || result.description.toLowerCase().includes(searchInput.toLowerCase());}); 
    allTasks = searchResults;
    renderTasks();      
}

/**
 * Filters tasks based on the search input when the search button is clicked.  
 * - If the search input is empty, the task list will be reset and re-initialized via `init()`.
 * - If the input has a value, it filters `allTasks` by checking if the search term is included 
 *   in the task's `title` or `description`.
 * - After filtering, it updates the global `allTasks` array and re-renders the tasks.
 * 
 * @returns {void}
 */
function filterTasksButton() {
    const searchInput = document.getElementById("boardSearchField").value;
    if (searchInput == "") {
        allTasks = [];
        init();
    }else {
    const searchResults = allTasks.filter(result => {
        return result.title.toLowerCase().includes(searchInput.toLowerCase()) || result.description.toLowerCase().includes(searchInput.toLowerCase());}); 
    allTasks = searchResults;
    renderTasks(); }   
}

/**
 * Renders the "Edit Task" overlay with pre-filled data of the selected task.
 * 
 * This function retrieves the task based on the provided index, generates
 * the HTML content for the overlay using `showEditTaskOverlay`, displays the
 * overlay, and populates it with existing assigned contacts and subtasks.
 * 
 * @function renderEditTaskOverlay
 * @param {number} index - The index of the task to be edited from the allTasks array.
 * 
 * @example
 * renderEditTaskOverlay(3); // Opens the edit overlay for the task at index 3
 */
function renderEditTaskOverlay(index) {
    const task = allTasks[index];
    let overlay = document.getElementById('overlayAddTask');
    overlay.innerHTML = showEditTaskOverlay(task, index);
    overlay.classList.remove('d-none');
    const preSelectedNames = task.assigned.split(",").map(name => name.trim());
    getAllContacts(preSelectedNames);  
    if (task.subtasks && task.subtasks.length > 0) {
        const todoList = document.getElementById("todoList");
        task.subtasks.forEach((subtask) => {
            const item = document.createElement("div");
            item.className = "subtask-list-item";
            item.textContent = subtask.name;
            item.dataset.completed = subtask.completed;
            item.dataset.name = subtask.name;
            item.addEventListener("click", () => editSubtask(item, subtask.name));
            todoList.appendChild(item);
        });
    }
}

/**
 * Saves the edited task data to the backend and updates the UI accordingly.
 * 
 * This function collects the edited task data from the form, updates the corresponding task 
 * in Firebase using a `PUT` request, and then refreshes the task list and detail view.
 * 
 * @async
 * @function saveEditedTask
 * @param {number} index - The index of the task in the allTasks array to be updated.
 * 
 * @returns {Promise<void>}
 * 
 * @example
 * saveEditedTask(2); // Saves changes to the task at index 2
 */
async function saveEditedTask(index) {
    collectTaskData(); 
    const task = allTasks[index];
    const firebaseID = task.firebaseID;
    let updatedData = {
        title,
        description,
        assigned,
        category,
        duedate,
        priority,
        status: task.status, 
        subtasks,
    };
    await fetch(`${BASE_URL_TASK}/${firebaseID}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });  
    closeAddTaskOverlay();
    allTasks = [];
    await getAllTasks();
    renderTasks();
    renderTaskDetail(index)
}

/**
 * Calculates how many additional assigned users exist beyond the first four.
 * 
 * This function is typically used to determine whether a "+X" indicator
 * (e.g., "+2") should be shown when more than four users are assigned.
 * 
 * @function renderAdditionalAssigned
 * @param {string[]} names - An array of assigned user names.
 * @returns {number} The number of additional users beyond the first four.
 * 
 * @example
 * const names = ['Anna', 'Ben', 'Chris', 'Dana', 'Eva', 'Finn'];
 * const additional = renderAdditionalAssigned(names); // returns 2
 */
function renderAdditionalAssigned(names) {
   let additionalNames = names.length - 4;
   return additionalNames    
}

    


   


 

    
    
   
