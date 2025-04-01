// task priority : Urgent Medium Low
// task category : Technical Task, Administration Task, User Story
// task statuses : To do, In progress, Await feedback, Done 

/**
 * To fetch all tasks info from DB
 */

async function getAllTasks(){
    let response = await fetch(BASE_URL_TASK+ ".json");
    let responseJSON = await response.json();

    let keys = Object.keys(responseJSON);
    
    let allTasks = [];
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        const value = responseJSON[key];

        if (Object.keys(value).indexOf("subtasks") != -1)
            value["subtasks"] = value["subtasks"].filter(e => e != null);
         
        if (responseJSON[key]) allTasks.push({[key]: value});
    }   

    return allTasks;
}

// test
// getAllTasks().then(allTasks => {
//     console.log(allTasks);
// })

/**
 * 
 * @param {String} id id is only to be passed by updating task info.
 * @param {object} data {
                        title:"Meeting at 10", 
                        description:"call everybody", 
                        assigned:"Max, Xin",
                        category:"User Story",
                        duedate:"+4913023269953",
                        priority:"Medium",
                        status:"Await feedback",
                        subtasks:["call everybody", "nobody ist there"]
                        }
 */
async function putTask(data, id="") {
    let allTasks = await getAllTasks();
    
    let response = await fetch(BASE_URL_TASK + id + ".json", {
        method: id ? "PUT" : "POST" ,
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify(data)
    })

    let responseToJson = await response.json();
    console.log("Response:", responseToJson);

    return responseToJson;
    
}

// test add task
// putTask({
//     title:"Meeting at 10", 
//     description:"call everybody", 
//     assigned:"Max, Xin",
//     category:"User Story",
//     duedate:"+4913023269953",
//     priority:"Medium",
//     status:"Await feedback",
//     subtasks:["call everybody", "nobody ist there"]
// });

// test edit contact
// putTask({
//     title:"Meeting at 11", 
//     description:"call everybody", 
//     assigned:"Max, Xin",
//     category:"User Story",
//     duedate:"+4913023269953",
//     priority:"Medium",
//     status:"Await feedback",
//     subtasks:["call everybody", "nobody ist there"]
// }, "-OMOecH28TWHgoUqicT4");

async function deleteTask(id) {
    let response = await fetch(BASE_URL_TASK + id + ".json", {
        method: "DELETE"
    })
    return responseToJSON = await response.json();
}

// test delete one task
// deleteTask("-OMOecH28TWHgoUqicT4");