const timerDisplay = document.querySelector("#timer");
const modeEl = document.querySelector("#mode");
const start = document.querySelector("#start");
const pause = document.querySelector("#pause");
const reset = document.querySelector("#reset");
const modeBtns = document.querySelectorAll(".mode-btn");

let currentDuration = 25 * 60;
let timeLeft = currentDuration;
let interval = null;
let isRunning = false;

function renderTime() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopTimer() {
  clearInterval(interval);
  isRunning = false;
}

start.addEventListener("click", () => {
  if (isRunning) return;
  isRunning = true;

  interval = setInterval(() => {
    if (timeLeft <= 0) {
      stopTimer();
      return;
    }
    timeLeft--;
    renderTime();
  }, 1000);
});

pause.addEventListener("click", stopTimer);

reset.addEventListener("click", () => {
  stopTimer();
  timeLeft = currentDuration;
  renderTime();
});

modeBtns.forEach((modeBtn) => {
  modeBtn.addEventListener("click", () => {
    stopTimer();

    modeBtns.forEach((b) => b.classList.remove("active"));
    modeBtn.classList.add("active");

    currentDuration = Number(modeBtn.dataset.time);
    timeLeft = currentDuration;

    const labels = { 1500: "Focus Time", 300: "Short Break", 900: "Long Break" };
    modeEl.textContent = labels[currentDuration];

    renderTime();
  });
});

renderTime();


const taskInput = document.querySelector("#task");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    Swal.fire("Please enter a task before adding.");
    return;
  }

  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.textContent = text;
  span.className = "task-text";
  span.addEventListener("click", () => {
    li.classList.toggle("completed");
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    li.remove();
    Swal.fire("Task deleted Successfully!");
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = "";
  Swal.fire({
  title: "Task Added :=)",
  icon: "success",
  draggable: true,
  text : "Task added sucessfully!"
});
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

const plannerDate = document.querySelector("#plannerDate");
const taskTime = document.querySelector("#taskTime");
const taskPriority = document.querySelector("#taskPriority");
const addPlanBtn = document.querySelector("#addPlanBtn");
const planList = document.querySelector("#planList");

const STORAGE_KEY = "dailyPlannerTasks";

function renderDate() {
  const today = new Date();
  plannerDate.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function getTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatTime(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  const hour = Number(h);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${period}`;
}

function renderTasks() {
  const tasks = getTasks();
  tasks.sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  planList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "No tasks planned yet.";
    planList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `plan-item priority-${task.priority}`;
    if (task.completed) li.classList.add("completed");

    const timeEl = document.createElement("span");
    timeEl.className = "plan-time";
    timeEl.textContent = formatTime(task.time);

    const textEl = document.createElement("span");
    textEl.className = "plan-text";
    textEl.textContent = task.text;

    const tagEl = document.createElement("span");
    tagEl.className = "plan-tag";
    tagEl.textContent = task.priority;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";

    li.addEventListener("click", (e) => {
      if (e.target === deleteBtn) return;
      const updated = getTasks().map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      );
      saveTasks(updated);
      renderTasks();
    });

    deleteBtn.addEventListener("click", () => {
      const updated = getTasks().filter((t) => t.id !== task.id);
      saveTasks(updated);
      renderTasks();
    });

    li.appendChild(timeEl);
    li.appendChild(textEl);
    li.appendChild(tagEl);
    li.appendChild(deleteBtn);
    planList.appendChild(li);
  });
}

function addPlanTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task before adding.");
    return;
  }

  const tasks = getTasks();
  tasks.push({
    id: Date.now(),
    time: taskTime.value,
    text,
    priority: taskPriority.value,
    completed: false
  });

  saveTasks(tasks);
  renderTasks();

  taskInput.value = "";
  taskTime.value = "";
}

addPlanBtn.addEventListener("click", addPlanTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlanTask();
});

renderDate();
renderTasks();