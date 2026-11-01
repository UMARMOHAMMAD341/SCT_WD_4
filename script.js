
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load saved tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";
let editTaskId = null;

// Save tasks to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        const info = document.createElement("div");
        info.className = "task-info";

        if (task.completed) {
            info.classList.add("completed");
        }

        const title = document.createElement("h3");
        title.textContent = task.text;

        const dateTime = document.createElement("p");
        dateTime.textContent =
            "Due: " + (task.date || "No date") +
            " | " + (task.time || "No time");

        info.append(title, dateTime);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.className = "complete-btn";
        completeBtn.textContent = task.completed ? "Undo" : "Done";
        completeBtn.onclick = () => toggleTask(task.id);

        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.append(completeBtn, editBtn, deleteBtn);
        li.append(info, actions);
        taskList.appendChild(li);
    });
}

// Add or update task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    if (editTaskId !== null) {
        const task = tasks.find(task => task.id === editTaskId);

        if (task) {
            task.text = text;
            task.date = taskDate.value;
            task.time = taskTime.value;
        }

        editTaskId = null;
        addTaskBtn.textContent = "+ Add Task";

    } else {
        tasks.push({
            id: Date.now(),
            text: text,
            date: taskDate.value,
            time: taskTime.value,
            completed: false
        });
    }

    saveTasks();
    clearInputs();
    displayTasks();
}

// Clear input fields
function clearInputs() {
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
}

// Mark task as completed or pending
function toggleTask(id) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        taskInput.value = task.text;
        taskDate.value = task.date;
        taskTime.value = task.time;

        editTaskId = id;
        addTaskBtn.textContent = "Update Task";

        taskInput.focus();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);

        if (editTaskId === id) {
            editTaskId = null;
            addTaskBtn.textContent = "+ Add Task";
            clearInputs();
        }

        saveTasks();
        displayTasks();
    }
}

// Filter tasks
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");
        displayTasks();
    });
});

// Button click event
addTaskBtn.addEventListener("click", addTask);

// Press Enter to add or update task
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Show saved tasks when page loads
displayTasks();
