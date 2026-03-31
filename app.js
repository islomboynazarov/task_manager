class Task {
    constructor(text) {
        this.id = Date.now()        // unique id — use Date.now()
        this.text = text      // the task text
        this.completed = false // false by default
        this.createdAt = new Date() // new Date()
    }
}