let allTasks = [];
let subtaskContent = [];
let currentDraggedElement;

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
        task.firebaseID = keys[index];
        allTasks.push(task);                 
    }                 
}

async function renderTasks() {  
    document.getElementById('inProgress').innerHTML = "";
    document.getElementById('ToDo').innerHTML = "";
    document.getElementById('await').innerHTML = "";
    document.getElementById('done').innerHTML = "";
    for (let index = 0; index < allTasks.length; index++) {
        renderProgress(index);
        renderTodo(index);
        renderAwaitFeedback(index);
        renderDone(index);    
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

function closeOverlay() {
    let overlayRef = document.getElementById('overlay');
    let overlayDetail = document.getElementById('taskDetail')
    overlayDetail.classList.remove('slide-in')
    overlayDetail.classList.add('slide-out')
    setTimeout(() => {
        overlayRef.classList.add('d-none'); // Blende das Overlay aus
    }, 300);
    subtaskContent = [];
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

function startDragging(index) {
    currentDraggedElement = index;
    
}

function allowDrop(ev) {
    ev.preventDefault();
}

async function moveTo(status) {
    let task = allTasks[currentDraggedElement]; 
    task.status = status; 
    renderTasks();    
    let response = await fetch(`${BASE_URL_TASK}/${task.firebaseID}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status }) 
    });
    let responseJson = await response.json();
}

function getDoneSubtasks(index) {
    let subTasks = allTasks[index].subtasks;   
    if(!subTasks){
        return
    }else{
    let doneSubtasks = subTasks.filter(subtask => subtask.includes('"completed" : true'));
    return doneSubtasks.length;    
    }    
}

function renderTaskDetail(index) {
    let overlay = document.getElementById('overlay');
    let names = allTasks[index].assigned.split(',');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    parseSubtasks(index);
    overlay.innerHTML = showTaskDetail(index, names, subtasksClass);
    overlay.classList.remove('d-none');  
}

function renderTaskDetailNew(index) {
    document.getElementById('taskDetail').classList.remove('slide-in');
    let overlay = document.getElementById('overlay');
    let names = allTasks[index].assigned.split(',');
    let subtasksClass = (!allTasks[index].subtasks) ? 'd-none' : '';
    parseSubtasks(index);
    overlay.classList.remove('d-none');  
    overlay.innerHTML = showTaskDetail(index, names, subtasksClass);    
}

function parseSubtasks(index) {
    subtaskContent = []; 
    let subtasks = allTasks[index].subtasks;
    if (!subtasks) return; 
    for (let i = 0; i < subtasks.length; i++) {
        let subtaskObj = JSON.parse('{' + subtasks[i] + '}');       
        subtaskContent.push({
            name: subtaskObj.name,
            completed: subtaskObj.completed
        });
    }
}

function taskDeatilDueDate(date) {
   let dueDate = moment(date).format('L');     
   return dueDate
}

function getSubTaskImage(index) {
    let subTaskImage = (subtaskContent[index].completed === true ? 'on' : 'off');
    return subTaskImage
}

function changeSubtaskComplete(completed, index, i) { 
        let subtaskString = allTasks[index].subtasks[i];
        let subtaskObj = JSON.parse('{' + subtaskString + '}');
        subtaskObj.completed = !subtaskObj.completed;
        let updatedSubtaskString = JSON.stringify(subtaskObj).slice(1, -1); 
        allTasks[index].subtasks[i] = updatedSubtaskString;
        renderTaskDetailNew(index)                
}
    

async function changeSubtaskCompleteApi(index, i) {
   firebaseID = allTasks[index].firebaseID;
   let response = await fetch(`${BASE_URL_TASK}/${firebaseID}.json`);
   let responseJson = await response.json(); 
   let SubTaskString = responseJson.subtasks[i]
   if (SubTaskString.includes('"completed" : true')) {
        SubTaskString = SubTaskString.replace('"completed" : true', '"completed" : false');
    } else if (SubTaskString.includes('"completed" : false')) {
        SubTaskString = SubTaskString.replace('"completed" : false', '"completed" : true');
    }
    responseJson.subtasks[i] = SubTaskString;
    let updateResponse = await fetch(`${BASE_URL_TASK}/${firebaseID}.json`, {
        method: 'PUT',  
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseJson),
    });
}

function deleteTask() {
    let test = document.getElementById('taskDetail')
    console.log('hallo');
    
    test.innerHTML = showDeleteTask()
    
}
   
    


   


 

    
    
   
