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
    const validNames = names.filter(name => isNameInContacts(name));
    const additionalCount = validNames.length - 4;
    return additionalCount > 0 ? additionalCount : '';
}

/**
 * checks if the name ist still in contacts
 * @param {string} name - name of the assigned contact
 * @returns 
 */
function isNameInContacts(name) {
    if (!name) return false;
    let nameToFind = name.trim().replace(/\u200B/g, '').toLowerCase();
    return allContactsBoard.some(c =>
        c.name.trim().replace(/\u200B/g, '').toLowerCase() === nameToFind
    );
}