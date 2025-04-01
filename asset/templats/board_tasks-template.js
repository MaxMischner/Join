function showInProgressTasks(index, subtasksClass) {
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
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showToDoTasks(index, subtasksClass) {
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
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showAwaitFeedbackTasks(index, subtasksClass) {
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
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}

function showDoneTasks(index, subtasksClass) {
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
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                        <span class="assigned" style="background-color: ${randomBackgroundColor()};">AM</span>
                    </div>
                    <div class="priority-${allTasks[index].priority}"></div>
                </div>
            </div>
        `
}