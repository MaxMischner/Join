let title = "";
let description = "";
let assigned = "";
let category = "";
let duedate = "";
let priority = "";
let status = "To do";
let subtasks = "";


/**
 * Initializes the add task view by verifying user authentication.
 * Redirects to the login page if no active or guest user is found.
 * Loads contact data and sets up event listeners for priority buttons.
 *
 * @var {string|null} user - The serialized active user data from local storage.
 * @var {string|null} guestUser - The serialized guest user data from local storage.
 * @var {Object|null} activeUser - Parsed user object containing at least a name property.
 * @var {HTMLElement|null} mediumBtn - The DOM element for the "medium" priority button.
 */
function addTaskInit() {
  if (!isUserAuthenticated()) return;

  getAllContacts();
  setupPriorityButtons();
  restrictDueDateToToday();
  setupLiveValidation();
  renderActiveUserInitials();
  setDefaultMediumPriority();
  setupSubtaskEnterShortcut();
}

/**
 * Determines the priority level of a given button based on its CSS class.
 * Checks for 'urgent', 'medium', or 'low' classes and returns the matching level.
 * Returns null if no known priority class is found.
 *
 * @param {HTMLElement} button - The priority button element to evaluate.
 * @returns {string|null} The matching priority level or null if not found.
 */
function getPriorityLevel(button) {
  if (button.classList.contains("urgent")) return "urgent";
  if (button.classList.contains("medium")) return "medium";
  if (button.classList.contains("low")) return "low";
  return null;
}

/**
 * Resets all priority buttons to their default visual state.
 * Removes the 'selected' class and restores the default icon for each button.
 * Uses the provided icon map to determine which icon to apply.
 *
 * @param {NodeListOf<HTMLElement> | HTMLElement[]} buttons - A list of priority button elements.
 * @param {Object} iconMap - A mapping of priority levels to their default and active icon paths.
 *
 * @var {HTMLImageElement|null} img - The image element within each priority button.
 * @var {string|null} level - The priority level class of the current button.
 */
function buttenReset(buttons, iconMap) {
  buttons.forEach((btn) => {
    btn.classList.remove("selected");
    const img = btn.querySelector("img");
    const level = getPriorityLevel(btn);
    if (level) img.src = iconMap[level].default;
  });
}

/**
 * Toggles the visibility of the contact dropdown menu.
 * Adds or removes the 'show' class on the dropdown menu element.
 * Also toggles the 'back' class on the dropdown trigger for styling effects.
 *
 * @var {HTMLElement} menu - The element representing the dropdown menu container.
 * @var {HTMLElement} menuback - The element used to toggle and style the dropdown trigger.
 */
function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  const toggle = document.getElementById("toggleDropdown");

  if (menu) {
    menu.classList.toggle("show");
  }

  if (toggle) {
    toggle.classList.toggle("back");
  }
}

/**
 * Adds a new subtask item to the task's subtask list based on user input.
 * Creates a styled DOM element with metadata and an edit click handler.
 * Clears the input field and updates subtask-related icons after insertion.
 *
 * @var {HTMLInputElement} input - The input field where the user types the subtask.
 * @var {string} value - The trimmed text entered by the user.
 * @var {HTMLElement} todoList - The container element that holds all subtask items.
 * @var {HTMLDivElement} item - The newly created subtask element with text and metadata.
 */
function addTodo() {
  const input = document.getElementById("todoInput");
  const value = input.value.trim();
  if (value !== "") {
    const todoList = document.getElementById("todoList");
    const item = document.createElement("div");
    item.className = "subtask-list-item";
    item.textContent = value;
    item.dataset.completed = "false";
    item.dataset.name = value;
    item.addEventListener("click", () => editSubtask(item, value));
    todoList.appendChild(item);
    input.value = "";
    toggleSubtaskIcons();
  }
}

/**
 * Creates an image-based button element with a click event handler.
 * Sets the source, tooltip title, and cursor style for the icon.
 * Returns the configured image element ready for insertion.
 *
 * @param {string} src - The path to the icon image.
 * @param {string} title - The tooltip text shown on hover.
 * @param {Function} onClick - The event handler to execute when the icon is clicked.
 *
 * @var {HTMLImageElement} btn - The created image element acting as a button.
 * @returns {HTMLImageElement} The fully configured image button element.
 */
function createIconButton(src, title, onClick) {
  const btn = document.createElement("img");
  btn.src = src;
  btn.title = title;
  btn.onclick = onClick;
  btn.style.cursor = "pointer";
  return btn;
}

/**
 * Creates a new <div> element with the specified CSS class name.
 * Used as a container for dynamic UI elements.
 * Returns the created wrapper element.
 *
 * @param {string} className - The CSS class name to assign to the wrapper.
 *
 * @var {HTMLDivElement} wrapper - The newly created <div> element.
 * @returns {HTMLDivElement} The configured wrapper element.
 */
function createWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

/**
 * Replaces a subtask item with an editable input form.
 * Adds delete and save buttons, styled in a wrapper with a divider.
 * Focuses the input field for immediate editing.
 *
 * @param {HTMLElement} item - The subtask DOM element to be edited.
 * @param {string} oldValue - The current text value of the subtask.
 *
 * @var {HTMLDivElement} wrapper - The container element for the editable subtask UI.
 * @var {HTMLInputElement} input - The input field pre-filled with the old subtask value.
 * @var {HTMLImageElement} delBtn - The delete button for removing the subtask.
 * @var {HTMLImageElement} saveBtn - The save button for confirming subtask changes.
 * @var {HTMLDivElement} divider - A visual divider between buttons in the edit UI.
 */
function editSubtask(item, oldValue) {
  const wrapper = createWrapper("editable-subtask");
  const input = createSubtaskInput(oldValue);
  const delBtn = createDeleteButton(item);
  const saveBtn = createSaveButton(item, input);
  const divider = createDivider();
  wrapper.append(input, delBtn, divider, saveBtn);
  replaceSubtaskContent(item, wrapper);
  input.focus();
}

/**
 * Creates a text input element prefilled with the given value.
 * Used to allow the user to edit the subtask text.
 * Returns the configured input element.
 *
 * @param {string} value - The initial value to be set in the input field.
 *
 * @var {HTMLInputElement} input - The created input element configured for subtask editing.
 * @returns {HTMLInputElement} The configured text input element.
 */
function createSubtaskInput(value) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  return input;
}

/**
 * Creates a delete icon button that removes the current subtask item when clicked.
 * Uses a trash icon and attaches the removal logic via an event listener.
 * Returns the configured button element.
 *
 * @param {HTMLElement} item - The subtask DOM element to be removed on click.
 *
 * @returns {HTMLImageElement} The configured delete button as an image element.
 */
function createDeleteButton(item) {
  return createIconButton("asset/img/icons/delete.png", "Delete", () => {
    item.remove();
  });
}

/**
 * Creates a save icon button for confirming subtask edits.
 * If the input is empty, the subtask is removed; otherwise, it replaces the item with the updated value.
 * Returns the save button element with attached logic.
 *
 * @param {HTMLElement} item - The original subtask DOM element to be updated or removed.
 * @param {HTMLInputElement} input - The input field containing the edited subtask value.
 *
 * @var {string} newValue - The trimmed input value entered by the user.
 * @var {HTMLElement} newItem - The newly created subtask element to replace the original.
 *
 * @returns {HTMLImageElement} The configured save button as an image element.
 */
function createSaveButton(item, input) {
  return createIconButton("asset/img/icons/Subtasks icons11.png", "Save", () => {
    const newValue = input.value.trim();
    if (!newValue) return item.remove();
    const newItem = createNewSubtaskItem(newValue);
    item.replaceWith(newItem);
  });
}

/**
 * Builds a new subtask element using the provided value.
 * Sets its class and text, and adds an event listener to re-enable editing on click.
 * Returns the fully configured subtask element.
 *
 * @param {string} value - The text content of the subtask.
 *
 * @var {HTMLDivElement} newItem - The created subtask element with styling and click behavior.
 *
 * @returns {HTMLDivElement} The configured subtask DOM element.
 */
function createNewSubtaskItem(value) {
  const newItem = document.createElement("div");
  newItem.className = "subtask-list-item";
  newItem.textContent = value;
  newItem.addEventListener("click", () => editSubtask(newItem, value));
  return newItem;
}

/**
 * Creates a visual divider element for separating subtask icons.
 * Used within the editable subtask layout to improve structure.
 * Returns the configured divider element.
 *
 * @var {HTMLDivElement} divider - The created divider element with styling class.
 *
 * @returns {HTMLDivElement} The configured visual divider element.
 */
function createDivider() {
  const divider = document.createElement("div");
  divider.className = "subtask-divider";
  return divider;
}

/**
 * Clears and replaces the contents of a subtask item with a new wrapper element.
 * Removes all existing child elements and class names before inserting the new layout.
 *
 * @param {HTMLElement} item - The original subtask element to be cleared and updated.
 * @param {HTMLElement} wrapper - The new wrapper element to insert into the subtask.
 */
function replaceSubtaskContent(item, wrapper) {
  item.innerHTML = "";
  item.className = "";
  item.appendChild(wrapper);
}

/**
 * Toggles visibility of subtask action icons based on input field content.
 * Hides the plus button and shows confirm icons when input is not empty.
 * Restores the plus button and hides icons when input is cleared.
 *
 * @var {HTMLInputElement} input - The input field for entering a new subtask.
 * @var {HTMLElement} plusBtn - The plus (+) button shown when the input is empty.
 * @var {HTMLElement} iconGroup - The container for confirm/cancel icons shown when input is not empty.
 */
function toggleSubtaskIcons() {
  const input = document.getElementById("todoInput");
  const plusBtn = document.getElementById("subtaskPlus");
  const iconGroup = document.getElementById("subtaskConfirmIcons");
  if (input.value.trim() !== "") {
    plusBtn.style.display = "none";
    iconGroup.style.opacity = "1";
    iconGroup.style.pointerEvents = "all";
  } else {
    plusBtn.style.display = "inline";
    iconGroup.style.opacity = "0";
    iconGroup.style.pointerEvents = "none";
  }
}

/**
 * Clears the value of the subtask input field and updates the related UI icons.
 * Calls toggleSubtaskIcons() to reflect the cleared state in the interface.
 *
 * @var {HTMLInputElement} input - The input field to be cleared.
 */
function clearSubtaskInput() {
  const input = document.getElementById("todoInput");
  input.value = "";
  toggleSubtaskIcons();
}

/**
 * Collects all task-related data from the form fields and stores it in global variables.
 * Retrieves title, description, due date, selected priority, category, and subtasks.
 * Converts subtask elements into structured objects with name and completion status.
 *
 * @var {string} title - The entered task title.
 * @var {string} description - The task description entered by the user.
 * @var {string} duedate - The selected due date in YYYY-MM-DD format.
 * @var {HTMLElement|null} selectedPriorityBtn - The currently selected priority button element.
 * @var {string} priority - The priority value extracted from the selected button.
 * @var {string} category - The selected category from the dropdown.
 * @var {NodeListOf<HTMLElement>} subtaskElements - All subtask elements in the current task form.
 * @var {Array<{name: string, completed: boolean}>} subtasks - Parsed subtasks including completion state.
 */
  function collectTaskData() {
    title = document.getElementById("title-task").value;
    description = document.getElementById("description-task").value;
    duedate = document.getElementById("date-task").value;
    const selectedPriorityBtn = document.querySelector(".priorty_button.selected" );
    priority = selectedPriorityBtn ? selectedPriorityBtn.textContent.trim() : "";
    category = document.getElementById("assigned_category").value; 
    const subtaskElements = document.querySelectorAll(".subtask-list-item");
    subtasks = Array.from(subtaskElements).map((el) => {
      return {
        name: el.dataset.name || el.textContent.trim(),
        completed: el.dataset.completed === "true" 
      };
    });
  }
  
/**
 * Fetches all tasks from the backend and formats them for use.
 * Removes any null values from the subtasks array if present.
 * Returns an array of task objects with their corresponding Firebase keys.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of tasks with their keys.
 *
 * @var {Response} response - The raw fetch response from the backend.
 * @var {Object} responseJSON - The parsed JSON data containing all tasks.
 * @var {string[]} keys - The list of Firebase keys corresponding to the tasks.
 * @var {Array<Object>} allTasks - The final array containing all formatted task entries.
 * @var {string} key - The current task's Firebase key.
 * @var {Object} value - The task object associated with the current key.
 */
async function getAllTasks() {
  let response = await fetch(BASE_URL_TASK + ".json");
  let responseJSON = await response.json();
  let keys = Object.keys(responseJSON);
  let allTasks = [];
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const value = responseJSON[key];
    if (Object.keys(value).indexOf("subtasks") != -1)
      value["subtasks"] = value["subtasks"].filter((e) => e != null);
    if (responseJSON[key]) allTasks.push({ [key]: value });
  }
  return allTasks;
}

/**
 * Sends a new task to the backend using a POST request.
 * Converts the task data into JSON and logs the response from the server.
 * Returns the response object containing the generated task ID.
 *
 * @param {Object} data - The task data to be saved, including title, description, etc.
 * @param {string} [id=""] - (Unused) Optional ID parameter, reserved for future functionality.
 *
 * @returns {Promise<Object>} A promise resolving to the response containing the Firebase task ID.
 *
 * @var {Array<Object>} allTasks - All currently existing tasks, retrieved before saving (currently unused).
 * @var {Response} response - The fetch response from the POST request.
 * @var {Object} responseToJson - The parsed response object returned by the server (e.g. the new ID).
 */
async function putTask(data, id = "") {
  let allTasks = await getAllTasks();
  const response = await fetch(BASE_URL_TASK + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseToJson = await response.json();
  console.log("Response:", responseToJson);
  return responseToJson;
}


