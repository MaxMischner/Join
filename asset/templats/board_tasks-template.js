function showInProgressTasks(index, subtasksClass, names) {
    return `
            <div class="tasks-content">
                <span class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</span>
                <span class="tasks-content-title">${allTasks[index].title}</span>
                <span class="tasks-content-description">${allTasks[index].description}</span>
                
                <div id="subtasks" class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="1" max="${subTaskLenght(index)}" style="--value: 1; --max: ${subTaskLenght(index)};"></progress>
                    <span class="tasks-content-done-text">1/${subTaskLenght(index)} Subtasks</span>
                </div>                
                <div class="assigned-priority-container">
                    <div class="assigned-container">
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">${names[0] ? getInitials(names[0]) : ""}</span>
                        ${names[1] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[1])}</span>` : ""}
                        ${names[2] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[2])}</span>` : ""}
                        ${names[3] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[3])}</span>` : ""}
                        ${names[4] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[4])}</span>` : ""}
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showToDoTasks(index, subtasksClass, names) {
    return `
            <div class="tasks-content">
                <span class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</span>
                <span class="tasks-content-title">${allTasks[index].title}</span>
                <span class="tasks-content-description">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="1" max="${subTaskLenght(index)}" style="--value: 1; --max: ${subTaskLenght(index)};"></progress>
                    <span class="tasks-content-done-text">1/${subTaskLenght(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container">
                    <div class="assigned-container">
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">${names[0] ? getInitials(names[0]) : ""}</span>
                        ${names[1] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[1])}</span>` : ""}
                        ${names[2] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[2])}</span>` : ""}
                        ${names[3] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[3])}</span>` : ""}
                        ${names[4] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[4])}</span>` : ""}
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showAwaitFeedbackTasks(index, subtasksClass, names) {
    return `
            <div class="tasks-content">
                <span class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</span>
                <span class="tasks-content-title">${allTasks[index].title}</span>
                <span class="tasks-content-description">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="1" max="${subTaskLenght(index)}" style="--value: 1; --max: ${subTaskLenght(index)};"></progress>
                    <span class="tasks-content-done-text">1/${subTaskLenght(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container">
                    <div class="assigned-container">
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">${names[0] ? getInitials(names[0]) : ""}</span>
                        ${names[1] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[1])}</span>` : ""}
                        ${names[2] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[2])}</span>` : ""}
                        ${names[3] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[3])}</span>` : ""}
                        ${names[4] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[4])}</span>` : ""}
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showDoneTasks(index, subtasksClass, names) {
    return `
            <div class="tasks-content">
                <span class="tasks-content-${getCategoryClass(index)}">${allTasks[index].category}</span>
                <span class="tasks-content-title">${allTasks[index].title}</span>
                <span class="tasks-content-description">${allTasks[index].description}</span>
                <div class="tasks-content-done ${subtasksClass}">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="1" max="${subTaskLenght(index)}" style="--value: 1; --max: ${subTaskLenght(index)};"></progress>
                    <span class="tasks-content-done-text">1/${subTaskLenght(index)} Subtasks</span>
                </div>
                <div class="assigned-priority-container">
                    <div class="assigned-container">
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">${names[0] ? getInitials(names[0]) : ""}</span>
                        ${names[1] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[1])}</span>` : ""}
                        ${names[2] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[2])}</span>` : ""}
                        ${names[3] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[3])}</span>` : ""}
                        ${names[4] ? `<span class="assigned" style="background-color: ${randomBackgroundColor()};">${getInitials(names[4])}</span>` : ""}
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showAddTaskOverlay() {
    return `
            <div class="add-task-overlay" onclick="noBubbling(event)">                    
                <div>
                    <Span class="headline-left overlay-headline">Add task</Span>
                <div>
                <div class="content_box">                    
                    <div>
                        <div>
                        <label for="title-task" class="required">Title</label><br>
                        <p id="errorMsg" style="color: red; display: none;">*This field is required</p>
        
                        <input class="input_field" type="text" id="title-task" placeholder="Enter a title" required>
                        </div>
                        <div>
                            <label for="">Description</label><br>
                            <textarea class="input_field input_field_description" name="Description" id="description-task" placeholder="Enter a Description" ></textarea>
                    
                        </div>
                            <div>
                            <label for="" class="required">Due date</label><br>
                            <input class="input_field" type="date" id="date-task" required>
                        </div>
                    </div>
                    <div class="splitbar"></div>
                <div>
                    <div>
                        <label for="Priority">Priority</label><br>
                        <div class="priority-button-group">
                            <button class="priorty_button urgent" data-value="Urgent" onclick="selectPriority(this)">
                                Urgent <img src="asset/img/icons/icon_urgent.png" />
                            </button>
                            <button class="priorty_button medium" data-value="Medium" onclick="selectPriority(this)">
                                Medium <img src="asset/img/icons/icon_medium.png" />
                            </button>
                            <button class="priorty_button low" data-value="Low" onclick="selectPriority(this)">
                                Low <img src="asset/img/icons/icon_low.png" />
                            </button>
                            </div>
                        </div> 
                    <div class="dropdown-container">
                    <label for="">Assigned to</label>
                    <div class="dropdown-toggle" onclick="toggleDropdown()">
                        <input type="text" id="contactSearchInput" placeholder="Search..." oninput="filterContacts()">
                        <img src="asset/img/icons/arrow_drop_downaa.png" />
                    </div>
                    <div class="dropdown-menu" id="dropdownMenu">
                        <div id="dropdownContent"></div>
                    </div>
                    <div id="selectedContacts" class="selected-contacts"></div>
        
                    </div>
                    <div>
                    <label for="assigned_category">Category</label><br>
                    <select name="assigned_category" id="assigned_category" required>
                        <option value="">Select task category</option>
                        <option value="User Story">User Story</option>
                        <option value="Technical Task">Technical Task</option>
                    </select>
                    </div>
                    
                    <div class="todo-wrapper">
                    <label for="Subtasks">Subtasks</label><br>
                    <div class="subtask-input-wrapper">
                        <input
                            type="text"
                            id="todoInput"
                            class="input_field subtask-input"
                            placeholder="Add new subtask"
                            oninput="toggleSubtaskIcons()"
                        />
                        <button id="subtaskPlus" class="subtask-icon" onclick="addTodo()">+</button>
                        <div id="subtaskConfirmIcons" class="subtask-icon-group">
                            <img src="asset/img/icons/subtasks_icons_X.png" onclick="clearSubtaskInput()" />
                            <img src="asset/img/icons/Subtasks icons11.png" onclick="addTodo()" />
                        </div>
                        </div>
                        
                        
                        <div id="todoList" class="subtask-list"></div>
        
                    </div>
                </div>
                </div>
                <div class="button_container">
                    <p><span class="red-star">*</span>This field is required</p>
                    <div class="button-row">
                    <button class="cancel-btn" onclick="resetForm()">Cancel <img src="asset/img/icons/subtasks_icons_X.png" alt=""></button>
                    <button class="create-btn" onclick="if (validateTaskBeforeSave()) saveTask()">Create Task <img src="asset/img/icons/check.png" alt=""></button>
                    </div>
            </div>                
        </div>
    
    
    
    
    `
}