// DATE & HOUR
const date = new Date();

const printDate = () => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const actualDate = `${day} / ${month} / ${year}`;

    const today = dayOfTheWeek();

    const divDate = document.querySelector(".date");
    return divDate.innerHTML = `<span>${today}</span> <span>${actualDate}</span>`;
}

const dayOfTheWeek = () => {
    const getDay = date.getDay();
    let today;
    switch (getDay) {
        case 0: today = "Domingo";
            break;
        case 1: today = "Lunes";
            break;
        case 2: today = "Martes";
            break;
        case 3: today = "Miercoles";
            break;
        case 4: today = "Jueves";
            break;
        case 5: today = "Viernes";
            break;
        case 6: today = "Sábado";
            break;
        default: today = null;
    }

    return today;
}

printDate();

const addZero = (n) => {
    if (n.toString().length < 2) {
        return "0".concat(n);
    }

    return n;
}

const actHour = () => {
    const newHour = new Date()
    let hour = addZero(newHour.getHours());
    let minute = addZero(newHour.getMinutes());
    let second = addZero(newHour.getSeconds());

    const stringHour = document.querySelector(".hour");
    stringHour.textContent = `${hour} : ${minute} : ${second}`
}

actHour();
setInterval(actHour, 1000);

// TODO APP

const taskListContainer = document.querySelector(".tasks");
const addTask = document.getElementById("addTask");

const formDialog = document.getElementById("form-dialog");
const acceptNewtask = document.getElementById("accept-new-task");
const declineNewTask = document.getElementById("decline-new-task");
const taskTitleUser = document.getElementById("task-name");
const taskDateStartUser = document.getElementById("task-date-start");
const taskDateEndUser = document.getElementById("task-date-end");
const taskDescriptionUser = document.getElementById("task-description");

const confirmCloseDialog = document.getElementById("confirm-close");
const confirmCloseBtn = document.getElementById("confirm-close-btn");
const cancelCloseBtn = document.getElementById("cancel-close-btn");

const taskListArray = JSON.parse(localStorage.getItem("TaskList")) || [];
let currentTask = {};

const addOrEditTask = () => {
    const taskIndex = taskListArray.findIndex((i) => i.id === currentTask.id)

    const actualTask = {
        id: taskTitleUser.value.toLowerCase().split(" ").join("."),
        name: taskTitleUser.value,
        startDate: taskDateStartUser.value,
        endDate: taskDateEndUser.value,
        description: taskDescriptionUser.value
    };

    if (taskIndex === -1) {
        taskListArray.unshift(actualTask);
    } else {
        taskListArray[taskIndex] = actualTask;
    }

    localStorage.setItem("TaskList", JSON.stringify(taskListArray));
    addNewTask();
    resetValues();
}

const addNewTask = () => {
    taskListContainer.innerHTML = "";

    taskListArray.forEach(({id, name, startDate, endDate, description}) => {
        taskListContainer.innerHTML += `
                <div class="task" id=${id}>
                            <div class="info-task">
                                <h3>${name}</h3>
                                <div class="task-date">
                                    <h4>${startDate}</h4>
                                    <h4>${endDate}</h4>
                                </div>
                                <p>${description}</p>
                            </div>
                            <div class="edit-erase-task">
                                <button onclick="editTask(this)"><span class="material-symbols-outlined">edit</span></button>
                                <button onclick="deleteTask(this)"><span class="material-symbols-outlined">delete</span></button>
                            </div>
                </div>`
    });
}

const editTask = (t) => {
    const taskIndex = taskListArray.findIndex((i) => i.id === t.closest(".task").id);
    
    formDialog.showModal();
    currentTask = taskListArray[taskIndex];

    taskTitleUser.value = currentTask.name;
    taskDateStartUser.value = currentTask.startDate;
    taskDateEndUser.value = currentTask.endDate;
    taskDescriptionUser.value = currentTask.description;
}

const deleteTask = (t) => {
    const taskIndex = taskListArray.findIndex((i) => i.id === t.closest(".task").id);
    t.closest(".task").remove();
    taskListArray.splice(taskIndex, 1);

    localStorage.setItem("TaskList", JSON.stringify(taskListArray));
}

if (taskListArray.length) {
    addNewTask();
}

const resetValues = () => {
    taskTitleUser.value = "";
    taskDateStartUser.value = "";
    taskDateEndUser.value = "";
    taskDescriptionUser.value = "";
    currentTask = {};
    formDialog.close();
}

addTask.addEventListener("click", () => {
    formDialog.showModal();
})

formDialog.addEventListener("submit", (e) => {
    e.preventDefault();
})

acceptNewtask.addEventListener("click", () => {
    addOrEditTask();
})

declineNewTask.addEventListener("click", () => {
    const userValues = taskTitleUser.value || taskDateStartUser.value || taskDateEndUser.value || taskDescriptionUser.value;
    const newUserValues = taskTitleUser.value !== currentTask.name || taskDateStartUser.value !== currentTask.startDate || taskDateEndUser.value !== currentTask.endDate || taskDescriptionUser.value !== currentTask.description;

    if (userValues && newUserValues) {
        confirmCloseDialog.showModal();
    } else {
        resetValues();
    }
})

confirmCloseDialog.addEventListener("submit", (e) => {
    e.preventDefault();
})

confirmCloseBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
    resetValues();
})

cancelCloseBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
})

// USER

const userDialog = document.getElementById("user-session");
const userForm = document.querySelector(".user-form");
const nameUser = document.getElementById("user-name");
const userRegister = document.querySelector(".login");
const userLogin = document.getElementById("user");

const userLoged = document.getElementById("user-loged");
const editUser = document.getElementById("change-name");

const logedUser = JSON.parse(localStorage.getItem("User"));
let actualUser;

userRegister.addEventListener("click", () => {
    actualUser = nameUser.value;
    userLogin.textContent = actualUser;
    userLoged.textContent = actualUser;
    localStorage.setItem("User", JSON.stringify(actualUser));

    nameUser.value = "";
    userDialog.close();

})

userForm.addEventListener("submit", (e) => {
    e.preventDefault();
})

if (logedUser === null) {
    userDialog.showModal();
} else {
    userDialog.close();
}

editUser.addEventListener('click', () => {
  userDialog.showModal();
});

// NOTIFICATIONS

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permiso a notificaciones concedido.');
      } else if (permission === 'denied') {
        console.log('Permiso a notificaciones denegado.');
      } else {
        console.log('Pestaña de notificaciones ignorada.');
      }
    })
  } else {
    console.warn('Este navegador no soporta la API de "Notifications"');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  requestNotificationPermission();
})