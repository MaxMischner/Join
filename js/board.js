let allTasks = [];

async function init() {
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    renderInitials(activeUser);
    await getAllTasks();  
    await  renderTasks();  
    randomBackgroundColor();    
}

function renderInitials(activeUser) {
    if (!activeUser) {
        document.getElementById('initialNames').innerHTML = "G"; 
    }else {
        let originalName = activeUser[0].name;
        let initials = originalName.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
        document.getElementById('initialNames').innerHTML = initials; 
    }
}

async function getAllTasks() {
    let response = await fetch(BASE_URL_TASK + '.json');
    let responseJson = await response.json();  
    let keys = Object.keys(responseJson);  
    for (let index = 0; index < keys.length; index++) {
        let task = responseJson[keys[index]];
        allTasks.push(task);          
    }          
}

async function renderTasks() {  
    for (let index = 0; index < allTasks.length; index++) {
        renderProgress(index);
        renderTodo(index);
        renderAwaitFeedback(index);
        renderDone(index);    
        // renderTaskInitials(index);   
    }
}

function renderProgress(index) {
    let inProgress = document.getElementById('inProgress'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "in Progress") {
        inProgress.innerHTML += showInProgressTasks(index, subtasksClass, names);  // Übergabe von categoryColor an showInProgressTasks
    } 
}

function renderTodo(index) {
    let ToDo = document.getElementById('ToDo'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "To do") {
        ToDo.innerHTML += showToDoTasks(index, subtasksClass, names);        
    } 
}

function renderAwaitFeedback(index) {
    let await = document.getElementById('await');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "await Feedback") {
        await.innerHTML += showAwaitFeedbackTasks(index, subtasksClass, names);        
    } 
}

function renderDone(index) {
    let done = document.getElementById('done'); 
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    let names = allTasks[index].assigned.split(',');
    if (allTasks[index].status === "done") {
        done.innerHTML += showDoneTasks(index, subtasksClass, names);        
    }           
}

function getCategoryClass(index) {
    let category = allTasks[index].category;
    let categoryName = category.split(' ')[0];  
    return categoryName.toLowerCase(); 
}

function subTaskLenght(index) {
    if (allTasks[index].subtasks) {
        subTaskLength = allTasks[index].subtasks.length
    } else {
    subTaskLength = ""
    }
    return subTaskLength;
}

function randomBackgroundColor(index) {
    const Colors = [
        "#3498db", // bright blue
  "#9b59b6", // purple
  "#e74c3c", // red
  "#f39c12", // orange
  "#1abc9c", // turquoise
  "#2ecc71", // green
  "#34495e", // dark grey
  "#16a085", // dark teal
  "#2980b9", // ocean blue
  "#8e44ad", // dark purple
  "#d35400", // orange red
  "#c0392b", // brick red
  "#27ae60", // emerald green
  "#f1c40f", // yellow
  "#f66d44", // coral orange
  "#e67e22", // carrot orange
  "#7f8c8d", // grey
  "#95a5a6", // light grey
  "#dcdde1", // light slate grey
  "#9b59b6"  // lavender purple
      ];
    let backgroundColor = Colors[Math.floor(Math.random()*Colors.length)];
    return backgroundColor;    
}

function toggleOverlay() {
    let overlayRef = document.getElementById('overlay')
    overlayRef.classList.toggle('d-none');  
}

function renderAddTaskOverlay() {
    let overlay = document.getElementById('overlay');
    overlay.innerHTML = showAddTaskOverlay();
    overlay.classList.remove('d-none');
}

function noBubbling(event) {
    event.stopPropagation();
}   

function getInitials(names) {
    let initials = names.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase();
    return initials;
    
    }

    
    
   
