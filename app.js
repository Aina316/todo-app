/*
 * app.js – Vanilla JavaScript To‑Do List
 * Features:
 *  • CRUD operations (add / complete / delete)
 *  • LocalStorage persistence
 *  • Filter tabs: All / Active / Completed
 *  • Theme toggle (light / dark) with persistence
 *  • Keyboard accessibility + live‑region announcements
 *  • Empty‑state message
 *  • Subtle add/delete animations
 */

// ---------- DOM references ----------
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const filtersNav = document.getElementById("filters");
const themeToggle = document.getElementById("theme-checkbox");
const srAlert = document.getElementById("sr-alert");

let currentFilter = "all";

// ---------- THEME ----------
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);
// reflect saved choice in UI
themeToggle.checked = savedTheme === "dark";

// toggle handler
themeToggle.addEventListener("change", () => {
  setTheme(themeToggle.checked ? "dark" : "light");
});

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
}

// ---------- ACCESSIBILITY ANNOUNCEMENTS ----------
function announce(msg) {
  srAlert.textContent = msg;
  // Clear region after announcement so it can be reused
  setTimeout(() => (srAlert.textContent = ""), 1000);
}

// ---------- PERSISTENCE ----------
function save() {
  const tasks = [...list.children].map((li) => ({
    text: li.querySelector("span").textContent,
    completed: li.classList.contains("completed"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function load() {
  const stored = JSON.parse(localStorage.getItem("tasks")) || [];
  stored.forEach((t) => addTask(t.text, t.completed, false));
}

// ---------- UI HELPERS ----------
function refreshEmptyState() {
  emptyState.classList.toggle("hidden", list.children.length !== 0);
}

function applyFilter() {
  [...list.children].forEach((li) => {
    const done = li.classList.contains("completed");
    const visible =
      currentFilter === "all" ||
      (currentFilter === "active" && !done) ||
      (currentFilter === "completed" && done);
    li.style.display = visible ? "" : "none";
  });
}

// ---------- TASK CREATION & RENDER ----------
function addTask(text, completed = false, shouldAnnounce = true) {
  const li = document.createElement("li");
  if (completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${text}</span>
    <div>
      <input type="checkbox" aria-label="Mark task complete" ${
        completed ? "checked" : ""
      } />
      <button class="delete-btn" aria-label="Delete task">&times;</button>
    </div>`;

  /* ----- Event listeners inside each <li> ----- */
  // complete toggle
  li.querySelector("input").addEventListener("change", (e) => {
    li.classList.toggle("completed");
    save();
    applyFilter();
    announce(`Marked '${text}' ${e.target.checked ? "completed" : "active"}`);
  });

  // delete
  li.querySelector(".delete-btn").addEventListener("click", () => {
    // collapse animation defined in CSS
    li.style.animation = "collapse .25s forwards";
    setTimeout(() => {
      li.remove();
      save();
      refreshEmptyState();
      applyFilter();
      announce(`Deleted task ${text}`);
    }, 250);
  });

  list.appendChild(li);
  save();
  refreshEmptyState();
  applyFilter();
  if (shouldAnnounce) announce(`Added task ${text}`);
}

// ---------- GLOBAL EVENT LISTENERS ----------
// add
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

// filter buttons
filtersNav.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  currentFilter = e.target.dataset.filter;
  [...filtersNav.children].forEach((btn) =>
    btn.classList.toggle("active", btn === e.target)
  );
  applyFilter();
});

// ---------- INITIAL BOOTSTRAP ----------
load();
refreshEmptyState();
applyFilter();
