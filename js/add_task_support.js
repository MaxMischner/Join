/**
 * Filters the visible contact list based on the search input value.
 * It compares the lowercase search term with each contact's `data-name` attribute.
 * Matching contacts remain visible, others are hidden from the dropdown.
 *
 * @var {string} input - The lowercase search string entered by the user.
 * @var {NodeListOf<HTMLElement>} items - All contact elements in the dropdown list.
 * @var {string} name - The lowercase name value from each contact's dataset.
 */
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

/**
 * Fetches all contacts from the API and transforms them into an array of objects.
 * Each object contains a contact's unique key and associated data.
 * Passes the result to the dropdown rendering function with optional preselected names.
 *
 * @param {string[]} [preSelectedNames=[]] - Optional list of contact names to be preselected in the dropdown.
 *
 * @var {Response} response - The raw fetch response from the contacts endpoint.
 * @var {Object} responseJSON - The parsed JSON response containing all contacts by ID.
 * @var {string[]} keys - The Firebase-generated keys for each contact entry.
 * @var {Array<Object>} allContacts - An array of contact objects in the format { key: contactData }.
 */
  async function getAllContacts(preSelectedNames = []) {
    let response = await fetch(BASE_URL_CONTACT + ".json");
    let responseJSON = await response.json();
    let keys = Object.keys(responseJSON);
    let allContacts = [];
  
    for (let index = 0; index < keys.length; index++) {
      let key = keys[index];
      let value = responseJSON[key];
      if (responseJSON[key]) allContacts.push({ [key]: value });
    }
  
    renderContactsInDropdown(allContacts, preSelectedNames); 
  }

/**
 * Renders all provided contacts into the dropdown menu.
 * Creates a contact item element for each contact and appends it to the container.
 * Then updates the selected contact chips based on the current checkbox states.
 *
 * @param {Array<Object>} allContacts - Array of contact objects in the format { key: contactData }.
 * @param {string[]} [preSelectedNames=[]] - List of names that should appear as selected.
 *
 * @var {HTMLElement} container - The dropdown container element where contacts are rendered.
 * @var {[string, Object]} key/value - The extracted key-value pair from each contact object.
 * @var {HTMLElement} contactItem - The DOM element representing a single contact entry.
 */
  function renderContactsInDropdown(allContacts, preSelectedNames = []) {
    const container = document.getElementById("dropdownContent");
    container.innerHTML = "";
  
    allContacts.forEach((contactObj) => {
      const [key, value] = Object.entries(contactObj)[0];
      const contactItem = createContactItem(key, value, preSelectedNames); 
      container.appendChild(contactItem);
    });
    handleSelectionChange();
  }
    
/**
 * Creates a contact item element with name, color, and selection checkbox.
 * Marks the checkbox as selected if the contact is in the preselected names list.
 * Adds a click listener to toggle selection and update the selected chips.
 *
 * @param {string} key - The unique ID or key for the contact.
 * @param {Object} contact - The contact object containing name and color properties.
 * @param {string[]} [preSelectedNames=[]] - Optional list of names to preselect.
 *
 * @var {string} name - The full name of the contact.
 * @var {string} colorItem - The background color associated with the contact.
 * @var {HTMLInputElement} checkbox - The checkbox used to mark the contact as selected.
 * @var {HTMLElement} contactItem - The full contact item element combining name, color, and checkbox.
 *
 * @returns {HTMLElement} The constructed contact item element.
 */
  function createContactItem(key, contact, preSelectedNames = []) {
    const name = contact.name;
    const colorItem = contact.color;
    const checkbox = createContactCheckbox(key, name);
  
    if (preSelectedNames.includes(name)) {
      checkbox.checked = true;
    }
  
    const contactItem = buildContactItem(name, checkbox, colorItem);
    contactItem.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleSelectionChange();
      }
    });
    return contactItem;
  }
  
/**
 * Builds a contact item element with name initials and a checkbox.
 * Applies the contact's color to the initials circle for visual identity.
 * Returns the complete DOM element for rendering in the dropdown list.
 *
 * @param {string} name - The full name of the contact.
 * @param {HTMLInputElement} checkbox - The checkbox used for selecting the contact.
 * @param {string} colorItem - The background color associated with the contact.
 *
 * @var {string} initials - The extracted initials from the contact name.
 * @var {string} color - The background color applied to the initials element.
 * @var {HTMLDivElement} item - The fully constructed contact item element.
 *
 * @returns {HTMLDivElement} The configured contact DOM element.
 */
    function buildContactItem(name, checkbox, colorItem) {
      const initials = getInitials(name);
      const color = colorItem;
      const item = document.createElement("div");
      item.className = "contact-item";
      item.dataset.name = name;
      item.appendChild(createContactLeft(name, initials, color));
      item.appendChild(createContactRight(checkbox));
      return item;
    }
    
/**
 * Creates a checkbox input element for a contact with its key and name.
 * Attaches a change listener to update the selected contact chips when toggled.
 * Returns the configured checkbox element.
 *
 * @param {string} key - The unique key or ID of the contact.
 * @param {string} name - The display name of the contact (used for selection tracking).
 *
 * @var {HTMLInputElement} checkbox - The configured checkbox element.
 *
 * @returns {HTMLInputElement} The checkbox input element ready for rendering.
 */
    function createContactCheckbox(key, name) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = key;
      checkbox.dataset.name = name;
      checkbox.classList.add("contact-checkbox");
      checkbox.addEventListener("change", handleSelectionChange);
      return checkbox;
    }
    
/**
 * Creates the left section of a contact item containing initials and name.
 * Displays the initials inside a colored circle using the provided color value.
 * Returns the constructed DOM element for use in the contact item layout.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} initials - The extracted initials to display in the colored circle.
 * @param {string} color - The background color for the initials circle.
 *
 * @var {HTMLDivElement} left - The DOM element containing the initials and name span.
 *
 * @returns {HTMLDivElement} The configured left section of the contact item.
 */
    function createContactLeft(name, initials, color) {
      const left = document.createElement("div");
      left.className = "contact-left";
      left.innerHTML = `<div class="contact-initial" style="background:${color}">${initials}</div>
        <span>${name}</span>`;
  
      return left;
    }
    
/**
 * Creates the right section of a contact item containing the checkbox.
 * Wraps the checkbox in a styled container for consistent layout.
 * Returns the complete DOM element for integration into the contact item.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element to be wrapped.
 *
 * @var {HTMLDivElement} right - The wrapper element for the checkbox.
 *
 * @returns {HTMLDivElement} The configured right section of the contact item.
 */
    function createContactRight(checkbox) {
      const right = document.createElement("div");
      right.className = "contact-checkbox-wrapper";
      right.appendChild(checkbox);
      return right;
    }
    
/**
 * Generates initials from a given full name string.
 * Splits the name by spaces and joins the first character of each word.
 * Returns the initials in uppercase or '??' if input is invalid.
 *
 * @param {string} name - The full name to generate initials from.
 *
 * @returns {string} The generated uppercase initials or '??' if input is invalid.
 */
  function getInitials(name) {
    if (!name || typeof name !== "string") return "??";
    return name.split(" ").map((word) => word[0]).join("").toUpperCase();
  }
  
 /**
 * Updates the list of selected contacts based on checkbox states.
 * Visually highlights selected items and generates contact chips for them.
 * Stores the selected contact names as a comma-separated string in the assigned variable.
 *
 * @var {HTMLInputElement[]} checkboxes - All contact checkboxes currently rendered in the dropdown.
 * @var {HTMLElement} selectedContactsDiv - The container where selected contact chips are rendered.
 * @var {Array<string>} selectedNames - Names of all currently selected contacts.
 * @var {string} name - The contact name from the checkbox's dataset.
 * @var {HTMLElement} contactItem - The wrapper element representing a contact entry.
 * @var {HTMLElement} contactInitial - The element showing the contact's initials and background color.
 * @var {string} bgColor - The computed background color used for the contact chip.
 * @global {string} assigned - Comma-separated list of selected contact names.
 */
  function handleSelectionChange() {
    const checkboxes = getAllContactCheckboxes();
    const selectedContactsDiv = document.getElementById("selectedContacts");
    selectedContactsDiv.innerHTML = "";
  
    const selectedNames = checkboxes
      .filter(cb => cb.checked)
      .map(cb => {
        const name = cb.dataset.name;
        const contactItem = cb.closest(".contact-item");
        contactItem.classList.add("selected");
  
        const contactInitial = contactItem.querySelector(".contact-initial");
        const bgColor = window.getComputedStyle(contactInitial).backgroundColor;
  
        addContactChip(name, selectedContactsDiv, bgColor);
        return name;
      });
  
    checkboxes
      .filter(cb => !cb.checked)
      .forEach(cb => cb.closest(".contact-item").classList.remove("selected"));
  
    assigned = selectedNames.join(", ");
  }
  
    
/**
 * Retrieves all contact checkbox elements from the dropdown content.
 * Selects input elements of type checkbox within the #dropdownContent container.
 * Returns them as an array for easy iteration and filtering.
 *
 * @returns {HTMLInputElement[]} An array of checkbox input elements for all contacts.
 */
    function getAllContactCheckboxes() {
      return Array.from(document.querySelectorAll('#dropdownContent input[type="checkbox"]'));
    }
    
 /**
 * Creates and displays a contact chip with initials and a background color.
 * Uses the contact's name to generate initials and assign a color.
 * Appends the chip element to the specified container.
 *
 * @param {string} name - The full name of the contact.
 * @param {HTMLElement} container - The container element where the chip should be appended.
 * @param {string} color - The background color to apply to the chip.
 *
 * @var {HTMLDivElement} chip - The chip element showing the contact's initials and color.
 */
    function addContactChip(name, container, color) {
        const chip = document.createElement("div");
        chip.className = "selected-contact-chip";
        chip.textContent = getInitials(name);
        chip.style.backgroundColor = color;
        container.appendChild(chip);
      }
      
/**
 * Validates the required fields of the task form before saving.
 * Checks that title, due date, and category fields are not empty.
 * Displays or hides error messages accordingly and returns the overall validity.
 *
 * @returns {boolean} True if all required fields are filled, otherwise false.
 *
 * @var {boolean} isValid - Indicates whether the form is valid (default: true).
 * @var {HTMLInputElement} titleField - The input field for the task title.
 * @var {HTMLInputElement} dateField - The input field for the task due date.
 * @var {HTMLSelectElement} categoryField - The dropdown select element for the task category.
 */
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
  
/**
 * Highlights a form field with an error state and displays the associated error message.
 * Adds the 'error' class to the input field and makes the error message visible.
 * The error message is selected using the provided element ID.
 *
 * @param {HTMLElement} field - The form field element to highlight (e.g. input or select).
 * @param {string} errorId - The ID of the element that displays the error message.
 */
  function showError(field, errorId) {
    field.classList.add("error");
    document.getElementById(errorId).style.display = "block";
  }
  
/**
 * Removes the error state from a form field and hides the associated error message.
 * Removes the 'error' class from the input field and sets the error message display to none.
 *
 * @param {HTMLElement} field - The form field element to clear from the error state.
 * @param {string} errorId - The ID of the element that displays the error message.
 */
  function hideError(field, errorId) {
    field.classList.remove("error");
    document.getElementById(errorId).style.display = "none";
  }
  
/**
 * Clears all input fields, selections, and visual states in the task form.
 * Resets text inputs, dropdowns, checkboxes, subtasks, and selected contact chips.
 * Prepares the form for a new task entry by restoring the default UI state.
 *
 * @var {HTMLInputElement} title - The input field for the task title.
 * @var {HTMLInputElement} description - The input field for the task description.
 * @var {HTMLInputElement} duedate - The input field for the task due date.
 * @var {HTMLSelectElement} category - The select dropdown for task categories.
 * @var {NodeListOf<HTMLElement>} priorityButtons - All priority button elements.
 * @var {NodeListOf<HTMLInputElement>} checkboxes - All contact selection checkboxes.
 * @var {NodeListOf<HTMLElement>} selectedItems - Contact items visually marked as selected.
 * @var {HTMLElement} selectedContacts - Container where contact chips are displayed.
 * @var {HTMLElement} todoList - The container holding all subtask items.
 * @var {HTMLInputElement} todoInput - The input field for adding new subtasks.
 * @var {HTMLElement|null} mediumBtn - The "medium" priority button to reselect as default.
 */
  function resetForm() {
    document.getElementById("title-task").value = "";
    document.getElementById("description-task").value = "";
    document.getElementById("date-task").value = "";
    document.getElementById("assigned_category").selectedIndex = 0;
    document.querySelectorAll(".priorty_button").forEach((btn) => btn.classList.remove("selected"));
    document.querySelectorAll("#dropdownMenu input[type='checkbox']").forEach((cb) => (cb.checked = false));
    document.querySelectorAll(".contact-item.selected").forEach(item => item.classList.remove("selected"));
    document.getElementById("selectedContacts").innerHTML = "";
    document.getElementById("todoList").innerHTML = "";
    document.getElementById("todoInput").value = "";
    const mediumBtn = document.querySelector(".priorty_button.medium");
    if (mediumBtn) {
      selectPriority(mediumBtn);
    }
  }

/**
 * Closes the contact dropdown menu when a click occurs outside of it.
 * Listens for all document-wide clicks and checks whether the click was inside the dropdown or its toggle.
 * If the click was outside, it removes the 'show' and 'back' classes to hide the dropdown.
 *
 * @param {MouseEvent} event - The click event triggered on the document.
 *
 * @var {HTMLElement|null} menu - The dropdown menu element being toggled.
 * @var {HTMLElement|null} toggle - The element that toggles the dropdown visibility (e.g. input or button).
 */
  document.addEventListener("click", function (event) {
    const menu = document.getElementById("dropdownMenu");
    const toggle = document.getElementById("toggleDropdown");
  
    if (
      menu &&
      toggle &&
      !menu.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      menu.classList.remove("show");
      toggle.classList.remove("back"); 
    }
  });