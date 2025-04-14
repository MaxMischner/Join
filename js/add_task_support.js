/**
 * Filters the visible contact list based on the search input value.
 * It compares the lowercase search term with each contact's `data-name` attribute.
 * Matching contacts remain visible, others are hidden from the dropdown.
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
 */

  function getInitials(name) {
    if (!name || typeof name !== "string") return "??";
    return name.split(" ").map((word) => word[0]).join("").toUpperCase();
  }
  
  /**
 * Updates the list of selected contacts based on checkbox states.
 * Visually highlights selected items and generates contact chips for them.
 * Stores the selected contact names as a comma-separated string in the assigned variable.
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
 */

    function getAllContactCheckboxes() {
      return Array.from(document.querySelectorAll('#dropdownContent input[type="checkbox"]'));
    }
    
    /**
 * Creates and displays a contact chip with initials and a background color.
 * Uses the contact's name to generate initials and assign a color.
 * Appends the chip element to the specified container.
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
   */
  
  function showError(field, errorId) {
    field.classList.add("error");
    document.getElementById(errorId).style.display = "block";
  }
  
  /**
   * Removes the error state from a form field and hides the associated error message.
   * Removes the 'error' class from the input field and sets the error message display to none.
   */
  
  function hideError(field, errorId) {
    field.classList.remove("error");
    document.getElementById(errorId).style.display = "none";
  }
  
  /**
   * Clears all input fields, selections, and visual states in the task form.
   * Resets text inputs, dropdowns, checkboxes, subtasks, and selected contact chips.
   * Prepares the form for a new task entry by restoring the default UI state.
   */
  
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