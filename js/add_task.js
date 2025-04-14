
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
 */

function init() {
  let user = localStorage.getItem("activeUser");
    let guestUser = localStorage.getItem("guestUser");
    if (!user && !guestUser) {
        window.location.href = "log_in.html";
        return ;
    } 
  getAllContacts();
  setupPriorityButtons();
}

/**
 * Sets up click event listeners for all priority buttons.
 * Ensures only one button can be selected at a time by toggling the 'selected' class.
 * Visually indicates the active priority level.
 */

function setupPriorityButtons() {
  const priorityButtons = document.querySelectorAll(".priorty_button");
  priorityButtons.forEach((btn) => {btn.addEventListener("click", () => {
      priorityButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

/**
 * Activates a selected priority button and updates its icon to the active state.
 * Resets all other priority buttons to their default style and icon using an icon map.
 * Updates the global `priority` variable based on the selected button's data attribute.
 */

function selectPriority(button) {
  const buttons = document.querySelectorAll(".priorty_button");
  const iconMap = {
    urgent: {
      default: "asset/img/icons/icon_urgent.png",
      active: "asset/img/icons/prio_alta.png",
    },
    medium: {
      default: "asset/img/icons/icon_medium.png",
      active: "asset/img/icons/prio_media.png",
    },
    low: {
      default: "asset/img/icons/icon_low.png",
      active: "asset/img/icons/prio_baja.png",
    },
  };

  buttenReset(buttons, iconMap);
  button.classList.add("selected");
  const selectedLevel = getPriorityLevel(button);
  const activeImg = button.querySelector("img");
  if (selectedLevel) activeImg.src = iconMap[selectedLevel].active;
  priority = button.dataset.value;
}

/**
 * Determines the priority level of a given button based on its CSS class.
 * Checks for 'urgent', 'medium', or 'low' classes and returns the matching level.
 * Returns null if no known priority class is found.
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
 */

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
  const menuback = document.getElementById("toggleDropdown");
  menuback.classList.toggle("back");
}

/**
 * Adds a new subtask item to the task's subtask list based on user input.
 * Creates a styled DOM element with metadata and an edit click handler.
 * Clears the input field and updates subtask-related icons after insertion.
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
 */

function createDivider() {
  const divider = document.createElement("div");
  divider.className = "subtask-divider";
  return divider;
}

/**
 * Clears and replaces the contents of a subtask item with a new wrapper element.
 * Removes all existing child elements and class names before inserting the new layout.
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
 */

function clearSubtaskInput() {
  const input = document.getElementById("todoInput");
  input.value = "";
  toggleSubtaskIcons();
}

/**
 * Adds an event listener to trigger subtask creation when Enter is pressed.
 * Waits for the DOM to fully load before attaching the listener to the input field.
 * Ensures the input exists to prevent errors on pages where it may be missing.
 */

window.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  if (todoInput) {
    todoInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        addTodo();
      }
    });
  }
});


/**
 * Collects all task-related data from the form fields and stores it in global variables.
 * Retrieves title, description, due date, selected priority, category, and subtasks.
 * Converts subtask elements into structured objects with name and completion status.
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
 * Gathers task data from the form and sends it to the backend for saving.
 * Uses putTask to store the task in the database, then resets the form.
 * Redirects the user to the board view after saving is complete.
 */

async function saveTask() {
  collectTaskData();
  let data = {
    title,description,assigned,category,duedate,priority,status,subtasks,
  };
  await putTask(data);
  resetForm();
  window.location.href = "board.html"; 
}

/**
 * Fetches all tasks from the backend and formats them for use.
 * Removes any null values from the subtasks array if present.
 * Returns an array of task objects with their corresponding Firebase keys.
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


