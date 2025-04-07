
let title = "";
let description = "";
let assigned = "";
let category = "";
let duedate = "";
let priority = "";
let status = "To do";
let subtasks = "";

function init() {
  getAllContacts();
  setupPriorityButtons();
}

function setupPriorityButtons() {
  const priorityButtons = document.querySelectorAll(".priorty_button");
  priorityButtons.forEach((btn) => {btn.addEventListener("click", () => {
      priorityButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

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

function getPriorityLevel(button) {
  if (button.classList.contains("urgent")) return "urgent";
  if (button.classList.contains("medium")) return "medium";
  if (button.classList.contains("low")) return "low";
  return null;
}

function buttenReset(buttons, iconMap) {
  buttons.forEach((btn) => {
    btn.classList.remove("selected");
    const img = btn.querySelector("img");
    const level = getPriorityLevel(btn);
    if (level) img.src = iconMap[level].default;
  });
}

function toggleDropdown() {
  const menu = document.getElementById("dropdownMenu");
  menu.classList.toggle("show");
  const menuback = document.getElementById("toggleDropdown");
  menuback.classList.toggle("back");
}

function filterContacts() {
  const input = document
    .getElementById("contactSearchInput")
    .value.toLowerCase();
  const items = document.querySelectorAll(".contact-item");
  items.forEach((item) => {
    const name = item.dataset.name.toLowerCase();
    item.style.display = name.includes(input) ? "flex" : "none";
  });
}

async function getAllContacts() {
  let response = await fetch(BASE_URL_CONTACT + ".json");
  let responseJSON = await response.json();
  let keys = Object.keys(responseJSON);
  let allContacts = [];
  for (let index = 0; index < keys.length; index++) {
    let key = keys[index];
    let value = responseJSON[key];
    if (responseJSON[key]) allContacts.push({ [key]: value });
  }
  renderContactsInDropdown(allContacts);
}

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

function createIconButton(src, title, onClick) {
  const btn = document.createElement("img");
  btn.src = src;
  btn.title = title;
  btn.onclick = onClick;
  btn.style.cursor = "pointer";
  return btn;
}

function createWrapper(className) {
  const wrapper = document.createElement("div");
  wrapper.className = className;
  return wrapper;
}

function editSubtask(item, oldValue) {
  const wrapper = createWrapper("editable-subtask");
  const input = document.createElement("input");
  input.type = "text";
  input.value = oldValue;
  const delBtn = createIconButton("asset/img/icons/delete.png", "Delete", () =>item.remove()
  );
  const saveBtn = createIconButton("asset/img/icons/Subtasks icons11.png","Save",() => {const newValue = input.value.trim();
      if (!newValue) return item.remove();
      const newItem = document.createElement("div");
      newItem.className = "subtask-list-item";
      newItem.textContent = newValue;
      newItem.addEventListener("click", () => editSubtask(newItem, newValue));
      item.replaceWith(newItem);
    }
  );

  const divider = document.createElement("div");
  divider.className = "subtask-divider";
  wrapper.append(input, delBtn, divider, saveBtn);
  item.innerHTML = "";
  item.className = "";
  item.appendChild(wrapper);
  input.focus();
}

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

function clearSubtaskInput() {
  const input = document.getElementById("todoInput");
  input.value = "";
  toggleSubtaskIcons();
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("todoInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        addTodo();}
    });
});

function renderContactsInDropdown(allContacts) {
    const container = document.getElementById("dropdownContent");
    container.innerHTML = "";
    allContacts.forEach((contactObj) => {
      const [key, value] = Object.entries(contactObj)[0];
      const contactItem = createContactItem(key, value);
      container.appendChild(contactItem);
    });
  }
  
  function createContactItem(key, contact) {
    const name = contact.name;
    const checkbox = createContactCheckbox(key, name);
    const contactItem = buildContactItem(name, checkbox);
    contactItem.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleSelectionChange();
      }
    });
    return contactItem;
  }

  function buildContactItem(name, checkbox) {
    const initials = getInitials(name);
    const color = getColorForName(name);
    const item = document.createElement("div");
    item.className = "contact-item";
    item.dataset.name = name;
    item.appendChild(createContactLeft(name, initials, color));
    item.appendChild(createContactRight(checkbox));
    return item;
  }
  
  function createContactCheckbox(key, name) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = key;
    checkbox.dataset.name = name;
    checkbox.classList.add("contact-checkbox");
    checkbox.addEventListener("change", handleSelectionChange);
    return checkbox;
  }
  
  function createContactLeft(name, initials, color) {
    const left = document.createElement("div");
    left.className = "contact-left";
    left.innerHTML = `<div class="contact-initial" style="background:${color}">${initials}</div>
      <span>${name}</span>`;
    return left;
  }
  
  function createContactRight(checkbox) {
    const right = document.createElement("div");
    right.className = "contact-checkbox-wrapper";
    right.appendChild(checkbox);
    return right;
  }
  

function getInitials(name) {
  if (!name || typeof name !== "string") return "??";
  return name.split(" ").map((word) => word[0]).join("").toUpperCase();
}

function getColorForName(name) {
  const colors = [
    "#29ABE2","#FF8A00","#9327FF", "#6E52FF","#FC71FF","#FFBB2B","#1FD7C1","#462F8A",
  ];
  if (!name || typeof name !== "string") {
    return "#D1D1D1";
  }
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function handleSelectionChange() {
    const checkboxes = getAllContactCheckboxes();
    const selectedContactsDiv = document.getElementById("selectedContacts");
    selectedContactsDiv.innerHTML = "";
    const selectedNames = checkboxes.filter(cb => cb.checked).map(cb => {
        const name = cb.dataset.name;
        const contactItem = cb.closest(".contact-item");
        contactItem.classList.add("selected");
        addContactChip(name, selectedContactsDiv);
        return name;
      });
    checkboxes.filter(cb => !cb.checked).forEach(cb => cb.closest(".contact-item").classList.remove("selected"));
    assigned = selectedNames.join(", ");
  }
  
  function getAllContactCheckboxes() {
    return Array.from(document.querySelectorAll('#dropdownContent input[type="checkbox"]'));
  }
  
  function addContactChip(name, container) {
    const chip = document.createElement("div");
    chip.className = "selected-contact-chip";
    chip.textContent = getInitials(name);
    chip.style.backgroundColor = getColorForName(name);
    container.appendChild(chip);
  }

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
  

async function saveTask() {
  collectTaskData();
  let data = {
    title,
    description,
    assigned,
    category,
    duedate,
    priority,
    status,
    subtasks,
  };
  await putTask(data);
  resetForm();
  window.location.href = "board.html"; 
}

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

function validateTaskBeforeSave() {
  let isValid = true;
  const titleField = document.getElementById("title-task");
  const dateField = document.getElementById("date-task");
  const categoryField = document.getElementById("assigned_category");

  if (!titleField.value.trim()) {
    showError(titleField, "errorMsg-title");
    isValid = false;
  } else {
    hideError(titleField, "errorMsg-title");
  }
  if (!dateField.value.trim()) {
    showError(dateField, "errorMsg-date");
    isValid = false;
  } else {
    hideError(dateField, "errorMsg-date");
  }
  if (!categoryField.value.trim()) {
    showError(categoryField, "errorMsg-category");
    isValid = false;
  } else {
    hideError(categoryField, "errorMsg-category");
  }
  return isValid;
}

function showError(field, errorId) {
  field.classList.add("error");
  document.getElementById(errorId).style.display = "block";
}

function hideError(field, errorId) {
  field.classList.remove("error");
  document.getElementById(errorId).style.display = "none";
}

function resetForm() {
  document.getElementById("title-task").value = "";
  document.getElementById("description-task").value = "";
  document.getElementById("date-task").value = "";
  document.getElementById("assigned_category").selectedIndex = 0;
  document.querySelectorAll(".priorty_button").forEach((btn) => btn.classList.remove("selected"));
  document.querySelectorAll("#dropdownMenu input[type='checkbox']").forEach((cb) => (cb.checked = false));
  document.getElementById("selectedContacts").innerHTML = "";
  document.getElementById("todoList").innerHTML = "";
  document.getElementById("todoInput").value = "";
}
