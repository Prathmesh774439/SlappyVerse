function updateDateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  document.getElementById("datetime").innerHTML = `
    <div class="time">${time}</div>
    <div class="date">${date}</div>
  `;
}

updateDateTime();
setInterval(updateDateTime, 1000);