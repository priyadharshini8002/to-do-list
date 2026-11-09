// ---------- Get references to HTML elements ----------
const taskInput    = document.getElementById("taskInput");
const addBtn       = document.getElementById("addBtn");
const taskList     = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount    = document.getElementById("taskCount");

// Key used to store data in the browser's LocalStorage
const STORAGE_KEY = "todoTasks";

// Array that holds all tasks. Each task looks like:
// { id: 1700000000000, text: "Study Java", completed: false }
let tasks = [];

// ---------- LocalStorage functions ----------

// Save the tasks array into LocalStorage (as a JSON string)
function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// Load tasks from LocalStorage when the page opens
function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    tasks = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(tasks)) tasks = [];
  } catch (error) {
    console.error("Could not load tasks:", error);
    tasks = [];
  }
}

// ---------- Display tasks on the page ----------
function renderTasks() {
  // Clear the current list before drawing again
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    // Create the list item
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");

    // Checkbox to mark task as completed
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Task name
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = task.text; // textContent is safe against HTML injection

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-delete";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    // Put everything together and add to the list
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateInfo();
}

// Show/hide the empty message and update the task counter
function updateInfo() {
  emptyMessage.style.display = tasks.length === 0 ? "block" : "none";

  const done = tasks.filter(function (t) { return t.completed; }).length;
  taskCount.textContent = tasks.length === 0
    ? ""
    : done + " of " + tasks.length + " tasks completed";
}

// ---------- Add a new task ----------
function addTask() {
  const text = taskInput.value.trim(); // remove extra spaces

  // Do not add empty tasks
  if (text === "") {
    taskInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),   // unique id based on current time
    text: text,
    completed: false
  });

  saveTasks();        // update LocalStorage
  renderTasks();      // refresh the list

  taskInput.value = "";
  taskInput.focus();
}

// ---------- Mark a task as completed / not completed ----------
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// ---------- Delete a task ----------
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

// ---------- Event listeners ----------

// Click the "Add Task" button
addBtn.addEventListener("click", addTask);

// Press the Enter key inside the input field
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// ---------- Start the app ----------
loadTasks();     // read saved tasks from LocalStorage
renderTasks();   // display them automatically
