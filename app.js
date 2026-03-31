class Task {
    constructor(text) {
        this.id = Date.now()        // unique id — use Date.now()
        this.text = text      // the task text
        this.completed = false // false by default
        this.createdAt = new Date() // new Date()
    }
}

// State
let tasks = []
let currentFilter = "all"

// DOM elements
const taskInput = document.querySelector("#task-input")
const addBtn = document.querySelector("#add-btn")
const taskList = document.querySelector("#task-list")
const emptyState = document.querySelector("#empty-state")
const clearBtn = document.querySelector("#clear-btn")
const filterBtns = document.querySelectorAll(".filter-btn")
const statTotal = document.querySelector("#stat-total")
const statCompleted = document.querySelector("#stat-completed")
const statRemaining = document.querySelector("#stat-remaining")

function addTask() {
    const text = taskInput.value.trim()
    if (!text) return
    if (checkDuplicates(text)) return // ← stop if duplicate!

    const newTask = new Task(text)
    tasks.push(newTask)
    taskInput.value = ""
    renderTasks()
    updateStats()   
    saveTasks()
}

function renderTasks() {
    // 1. filter tasks based on currentFilter
    const filtered = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed
        if (currentFilter === "completed") return task.completed
        return true // "all"
    })

    // 2. clear current list
    taskList.innerHTML = ""

    // 3. show/hide empty state
    if (filtered.length === 0) {
        taskList.appendChild(emptyState)
        emptyState.classList.add("visible")
        return
    }

    emptyState.classList.remove("visible")

    // 4. create and append each task
    filtered.forEach(task => {
        const li = document.createElement("li")
        li.className = `task-item ${task.completed ? "completed" : ""}`
        li.dataset.id = task.id

        li.innerHTML = `
            <div class="task-check ${task.completed ? "checked" : ""}" data-id="${task.id}"></div>
            <span class="task-text">${task.text}</span>
            <span class="task-date">${task.createdAt.toLocaleDateString()}</span>
            <button class="delete-btn" data-id="${task.id}">✕</button>
        `
        taskList.appendChild(li)
    })
}

function checkDuplicates(text) {
    const exists = tasks.some(task => task.text.toLowerCase() === text.toLowerCase())
    if (exists) {
        alert("This task already exists!")
        return true  // duplicate found
    }
    return false     // no duplicate
}

function updateStats() {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const remaining = tasks.filter(task => !task.completed).length

    statTotal.textContent = total
    statCompleted.textContent = completed
    statRemaining.textContent = remaining
}

function toggleTask(id) {
    // find the task with matching id
    // flip its completed value (true → false, false → true)
    const task = tasks.find(task => task.id === Number(id))
    task.completed = !task.completed
    renderTasks()
    updateStats()
    saveTasks()
}

function deleteTask(id) {
    // filter OUT the task with matching id
    tasks = tasks.filter(task => task.id !== Number(id))
    renderTasks()
    updateStats()
    saveTasks()
}

function saveTasks() {
    // save tasks array to localStorage as "tasks"
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function loadTasks() {
    const stored = localStorage.getItem("tasks")
    const parsed = stored ? JSON.parse(stored) : []
    
    // convert createdAt string back to Date object
    tasks = parsed.map(task => {
        task.createdAt = new Date(task.createdAt)
        return task
    })
    
    renderTasks()
    updateStats()
}

// add task on button click
addBtn.addEventListener("click", addTask)

// add task on Enter key
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask()
})

// event delegation for check and delete
taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-check")) {
        toggleTask(e.target.dataset.id)
    }
    if (e.target.classList.contains("delete-btn")) {
        deleteTask(e.target.dataset.id)
    }
})

// filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"))
        btn.classList.add("active")
        currentFilter = btn.dataset.filter
        renderTasks()
    })
})

// clear completed
clearBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed)
    renderTasks()
    updateStats()
    saveTasks()
})

// load tasks on startup
loadTasks()