let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log("start", tasks);
let idList = tasks.map(task => task.id);
let lastId = Math.max(...idList, 0);
const overlay = document.querySelector(".main .grid .overlay");
const message = "You Haven't Enter any Details About This Task";
let timeout;
let edit = false;
let taskElement;
function updateDateTime() {
    const now = new Date();
    const dayDiv = document.getElementById("today");
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let today = days[now.getDay()];
    dayDiv.innerText = today;

    const date =
        now.getDate().toString().padStart(2, "0") +
        "/" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    const time = hours + ":" + minutes;

    document.getElementById("date").innerText = date;
    document.getElementById("ampm").textContent = ampm;
    document.getElementById("time").innerText = time;
}

setInterval(updateDateTime, 1000);
updateDateTime();

function complete($this) {
    const task = $this.parentElement.parentElement;
    const div = document.createElement("div");
    div.classList.add("complete");
    div.textContent = "Completed";
    if (task.children.length === 4) {
        task.append(div);
    } else {
        task.removeChild(task.children[4]);
    }
}
function deleteTask($this, flag = false, task = undefined) {
    if (confirm("Delete This Task ?") == true) {
        tid = $this.closest(".task").dataset.id;
        const index = tasks.findIndex(obj => obj.id === +tid);
        if (index !== -1) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            console.log("del", tasks);
        }
        flag
            ? (task = $this.parentElement)
            : (task = $this.parentElement.parentElement);
        task.classList.add("delete");
        setTimeout(() => {
            task.remove();
            empty(null);
        }, 500);
    } else {
        return;
    }
}
function loadTasks(tasks, edit = false) {
    const grid = document.querySelector(".main .grid");
    const template = document.querySelector("template");
    if (edit) {
        grid.innerHTML = "";
        console.log("loadEdit", tasks, tasks.length);
    }
    if (empty(tasks, true)) {
        return;
    }
    for (let i = tasks.length - 1; i >= 0; i--) {
        if (!tasks[i]) {
            console.log("worked");
            continue;
        }
        const content = template.content.cloneNode(true);
        const t = content.querySelector(".task");
        t.setAttribute("data-id", tasks[i].id);
        content.querySelector(".task h2").innerText = tasks[i].head;
        content.querySelector(".task p").innerText = tasks[i].body;
        if (tasks[i].fin) {
            content.querySelector("input").setAttribute("checked", "checked");
            const div = document.createElement("div");
            div.classList.add("complete");
            div.setAttribute("ondblclick", "deleteTask(this,true)");
            div.innerHTML =
                "Completed <br/> <small>Double click to delete</small>";
            t.appendChild(div);
        }
        console.log("loadF", tasks);
        grid.append(content);
    }
}

function empty(tasks, flag = false, length = undefined) {
    const overlay = document.querySelector(".main .grid .overlay");
    tasks = tasks || document.querySelector(".main .grid");
    flag ? (length = tasks.length + 1) : (length = tasks.children.length);
    if (length === 1 || !length) {
        overlay.style.display = "flex";
        return true;
    }
}
function done(taskElement) {
    const task = taskElement.closest(".task");
    console.log(+task.dataset.id);
    const index = tasks.findIndex(obj => obj.id === +task.dataset.id);
    if (index !== -1) {
        tasks[index].fin = !tasks[index].fin;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log("done", tasks);
    }
    const completeDiv = task.querySelector(".complete") || null;
    completeDiv === null
        ? ""
        : (completeDiv.innerHTML =
              "Completed <br/> <small>Double click to delete</small>");
    completeDiv?.setAttribute("ondblclick", "deleteTask(this, true)");
}
function focusInput($this) {
    const cList = $this.parentElement.children[0].classList;
    cList.add("focusClass");
    console.log(cList);
}
function outFocus($this) {
    const cList = $this.parentElement.children[0].classList;
    if (!$this.value) {
        console.log(cList);
        cList.remove("focusClass");
    }
}
function openModal($this) {
    const error = document.getElementById("error");
    const modal = document.getElementById("modal");
    const taskName = document.getElementById("taskname");
    const taskDetails = document.getElementById("details");
    const btn = document.getElementById("btn");
    if ($this.classList.contains("rotate")) {
        console.log(true);
        error.textContent = "";
        taskName.value = "";
        taskName.parentElement.children[0].classList.remove("focusClass");
        taskDetails.parentElement.children[0].classList.remove("focusClass");
        taskDetails.value = "";
        $this.style.transform = "rotate(0)";
        $this.classList.remove("rotate");
        $this.classList.add("rerotate");
        if (edit) {
            edit = false;
            taskElement = null;
        }
        modal.style.display = "none";
        btn.textContent = "Add";
        return;
    }
    error.textContent = "";
    taskName.value = "";
    taskName.parentElement.children[0].classList.remove("focusClass");
    taskDetails.parentElement.children[0].classList.remove("focusClass");
    taskDetails.value = "";
    $this.style.transform = "rotate(-45deg)";
    $this.classList.remove("rerotate");
    $this.classList.add("rotate");
    modal.style.display = "flex";
}
function Add_Edit_Task(event) {
    event.preventDefault();
    const modal = document.getElementById("modal");
    const btnModal = document.getElementById("modal-btn");
    const form = document.getElementById("form");
    const taskName = document.getElementById("taskname");
    const taskDetails = document.getElementById("details");
    const error = document.getElementById("error");
    const grid = document.querySelector(".main .grid");
    const btn = document.getElementById("btn");
    const template = document.querySelector("template");
    console.log("ae", tasks);
    if (edit) {
        const task = taskElement;
        console.log(task);
        const taskId = +task.dataset.id;
        const index = tasks.findIndex(obj => obj.id === taskId);
        console.log("aee", tasks);
        if (index !== -1) {
            const oldTasks = tasks;
            let newTask = {
                id: taskId,
                head: taskName.value,
                body: taskDetails.value || message,
                fin: false
            };
            if (
                (newTask.head === oldTasks[index].head &&
                    newTask.body === oldTasks[index].body) ||
                !newTask.head
            ) {
                error.textContent = "Enter Your Edits First";
                return;
            } else if (
                newTask.head !== oldTasks[index].head ||
                newTask.body !== oldTasks[index].body
            ) {
                tasks.splice(index, 1);
                tasks?.push(newTask);
                edit = false;
                taskElement = null;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                console.log("aee", tasks);
                tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                loadTasks(tasks, true);
                console.log("aee", tasks);
                modal.style.display = "none";
                // loadTasks(tasks);
            }
        }
        console.log(taskId);
        btn.textContent = "Add";
        btnModal.style.transform = "rotate(0)";
        btnModal.classList.remove("rotate");
        btnModal.classList.add("rerotate");
        edit = false;
        taskElement = null;
        return;
    }
    if (!taskname.value) {
        error.textContent = "Please Enter a Name";
        return;
    }
    const newTask = {
        id: ++lastId || 1,
        head: taskName.value,
        body: taskDetails.value || message,
        fin: false
    };
    if (document.querySelector(".overlay")) {
        document.querySelector(".overlay").style.display = "none";
    }
    btnModal.style.transform = "rotate(0)";
    btnModal.classList.remove("rotate");
    btnModal.classList.add("rerotate");
    const content = template.content.cloneNode(true);
    const t = content.querySelector(".task");
    t.setAttribute("data-id", newTask.id);
    content.querySelector(".task h2").innerText = newTask.head;
    content.querySelector(".task p").innerText = newTask.body;
    grid.insertBefore(content, grid.firstChild);
    console.log(tasks);
    tasks?.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log("aea", lastId, tasks);
    modal.style.display = "none";
    form.reset();
}

document.querySelector(".grid").onscroll = () => {
    clearTimeout(timeout);
    timeout = setTimeout(onscrollend, 800);
    document.getElementById("modal-btn").style.display = "none";
};
function onscrollend() {
    console.log("Scrolling has ended!");
    document.getElementById("modal-btn").classList.remove("rerotate");
    document.getElementById("modal-btn").style.display = "flex";
}
function editTask($this) {
    let taskId = +$this.closest(".task").dataset.id;
    const modal = document.getElementById("modal");
    const taskName = document.getElementById("taskname");
    const taskDetails = document.getElementById("details");
    const btnModal = document.getElementById("modal-btn");
    const btn = document.getElementById("btn");
    console.log(taskId);
    btn.textContent = "Edit";
    btnModal.style.transform = "rotate(-45deg)";
    btnModal.classList.remove("rerotate");
    btnModal.classList.add("rotate");
    modal.style.display = "flex";
    const index = tasks.findIndex(obj => obj.id === taskId);
    taskName.value = tasks[index].head;
    if (tasks[index].body === message) {
        taskDetails.value = "";
    } else {
        taskDetails.value = tasks[index].body;
        document.querySelector(".detailsLabel").classList.add("focusClass");
    }
    document.querySelector(".taskLabel").classList.add("focusClass");
    edit = true;
    taskElement = $this.closest(".task");
    console.log("editt", tasks, taskDetails.value === message);
}

document.addEventListener("DOMContentLoaded", loadTasks(tasks));
