function showInProgressTasks(index) {
    return `
            <div class="tasks-content">
                <span class="tasks-content-category">User Story</span>
                <span class="tasks-content-title">${allTasks[index].title}</span>
                <span class="tasks-content-description">${allTasks[index].description}</span>
                <div class="tasks-content-done">
                    <progress class="tasks-content-done-progressbar" class="progress-bar" value="1" max="2" style="--value: 1; --max: 1;"></progress>
                    <span class="tasks-content-done-text">1/2 Subtasks</span>
                </div>
                <div class="assigned-priority-container">
                    <div class="assigned-container">
                        <span class="assigned1">AM</span>
                        <span class="assigned1">EM</span>
                        <span class="assigned1">MB</span>
                    </div>
                    <div class="priority"></div>
                </div>
            </div>
        `
}