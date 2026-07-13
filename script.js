const timerDisplay = document.querySelector("#timer");
const modeEl = document.querySelector("#mode");
const start = document.querySelector("#start");
const pause = document.querySelector("#pause");
const reset = document.querySelector("#reset");
const modeBtns = document.querySelectorAll(".mode-btn");

const todoInput = document.querySelector("#task");

let currentDuration = 25 * 60;
let timeLeft = currentDuration;
let interval = null;
let isRunning = false;

function renderTime() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

    const labels = {
      1500: "Focus Time",
      300: "Short Break",
      900: "Long Break",
    };
    modeEl.textContent = labels[currentDuration];

    renderTime();
  });
});

renderTime();
const quoteEl = document.querySelector("#quote");
const authorEl = document.querySelector("#author");
const newQuoteBtn = document.querySelector("#newQuoteBtn");

async function fetchQuote() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();

    quoteEl.textContent = `"${data.quote}"`;
    authorEl.textContent = `— ${data.author}`;
  } catch (error) {
    quoteEl.textContent = "Couldn't load quote.";
    authorEl.textContent = "";
    console.error(error);
  }
}

fetchQuote();

newQuoteBtn.addEventListener("click", fetchQuote);

const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");

function addTask() {
  const text = todoInput.value.trim();
todoInput.value = "";
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
    text: "Task added sucessfully!",
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});


todoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
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
    year: "numeric",
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
        t.id === task.id ? { ...t, completed: !t.completed } : t,
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
    completed: false,
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
/* =========================================================
   Weather (Open-Meteo — no API key required)
   ========================================================= */
 
const weatherStatus = document.querySelector("#weatherStatus");
const weatherIcon = document.querySelector("#weatherIcon");
const weatherTemp = document.querySelector("#weatherTemp");
const weatherLabel = document.querySelector("#weatherLabel");
const weatherFeels = document.querySelector("#weatherFeels");
const weatherHumidity = document.querySelector("#weatherHumidity");
const weatherWind = document.querySelector("#weatherWind");
 
// WMO weather codes -> { icon, label }
// https://open-meteo.com/en/docs -> "WMO Weather interpretation codes"
const WEATHER_CODES = {
  0: { icon: "☀️", label: "Clear sky" },
  1: { icon: "🌤️", label: "Mostly clear" },
  2: { icon: "⛅", label: "Partly cloudy" },
  3: { icon: "☁️", label: "Overcast" },
  45: { icon: "🌫️", label: "Fog" },
  48: { icon: "🌫️", label: "Fog" },
  51: { icon: "🌦️", label: "Light drizzle" },
  53: { icon: "🌦️", label: "Drizzle" },
  55: { icon: "🌦️", label: "Dense drizzle" },
  61: { icon: "🌧️", label: "Light rain" },
  63: { icon: "🌧️", label: "Rain" },
  65: { icon: "🌧️", label: "Heavy rain" },
  71: { icon: "🌨️", label: "Light snow" },
  73: { icon: "🌨️", label: "Snow" },
  75: { icon: "❄️", label: "Heavy snow" },
  80: { icon: "🌦️", label: "Rain showers" },
  81: { icon: "🌦️", label: "Rain showers" },
  82: { icon: "⛈️", label: "Violent showers" },
  95: { icon: "⛈️", label: "Thunderstorm" },
  96: { icon: "⛈️", label: "Thunderstorm, hail" },
  99: { icon: "⛈️", label: "Thunderstorm, hail" },
};
 
function setWeatherStatus(state, text) {
  if (!weatherStatus) return;
  weatherStatus.textContent = text;
  weatherStatus.className = `weather-status ${state}`;
}
 
async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&temperature_unit=celsius&wind_speed_unit=kmh`;
 
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
 
  const data = await res.json();
  const {
    temperature_2m,
    apparent_temperature,
    relative_humidity_2m,
    weather_code,
    wind_speed_10m,
  } = data.current;
 
  const info = WEATHER_CODES[weather_code] || { icon: "🌡️", label: "Unknown" };
 
  weatherIcon.textContent = info.icon;
  weatherTemp.textContent = `${Math.round(temperature_2m)}°C`;
  weatherLabel.textContent = info.label;
  weatherFeels.textContent = `${Math.round(apparent_temperature)}°`;
  weatherHumidity.textContent = `${Math.round(relative_humidity_2m)}%`;
  weatherWind.textContent = `${Math.round(wind_speed_10m)} km/h`;
 
  setWeatherStatus("live", "Live");
}
 
function initWeather() {
  if (!weatherStatus) return;
 
  if (!("geolocation" in navigator)) {
    setWeatherStatus("offline", "Offline");
    weatherLabel.textContent = "Geolocation not supported";
    return;
  }
 
  setWeatherStatus("loading", "Loading");
 
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude).catch(() => {
        setWeatherStatus("offline", "Offline");
        weatherLabel.textContent = "Couldn't load weather";
      });
    },
    (err) => {
      setWeatherStatus("offline", "Offline");
      weatherLabel.textContent =
        err.code === err.PERMISSION_DENIED
          ? "Location permission denied"
          : "Couldn't get location";
    },
    { timeout: 10000, maximumAge: 10 * 60 * 1000 }
  );
}
 
initWeather();
 

//Theme
const themeToggle = document.querySelector("#themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

themeToggle.addEventListener("click", () => {
  const isLight =
    document.documentElement.getAttribute("data-theme") === "light";

  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});


const card = document.querySelector('.quote-card');
card.classList.remove('fade');
void card.offsetWidth; // reflow trick to restart animation
card.classList.add('fade');