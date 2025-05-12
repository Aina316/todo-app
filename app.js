// Select the form element with the ID 'todo-form'
const form  = document.getElementById('todo-form');

// Select the input element with the ID 'todo-input'
const input = document.getElementById('todo-input');

// Select the list element with the ID 'todo-list'
const list  = document.getElementById('todo-list');

// Add an event listener to the form to handle the submit event
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const text = input.value.trim(); // Get the trimmed value of the input field
    if (!text) return; // If the input is empty, do nothing
    addTask(text); // Call the addTask function to add the new task
    input.value = ''; // Clear the input field
});

// Function to add a task to the list
function addTask(text, completed = false) {
    const li = document.createElement('li'); // Create a new list item element
    if (completed) li.classList.add('completed'); // Add 'completed' class if the task is completed

    // Set the inner HTML of the list item with the task text and controls
    li.innerHTML = `
      <span>${text}</span> <!-- Display the task text -->
      <div>
        <input type="checkbox" ${completed ? 'checked' : ''}/> <!-- Checkbox for marking task as completed -->
        <button class="delete-btn">&times;</button> <!-- Button to delete the task -->
      </div>
    `;

    // Add an event listener to the checkbox to toggle the 'completed' class
    li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      li.classList.toggle('completed'); // Toggle the 'completed' class on the list item
      save(); // Save the updated task list to localStorage
    });

    // Add an event listener to the delete button to remove the task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove(); // Remove the list item from the DOM
      save(); // Save the updated task list to localStorage
    });

    list.appendChild(li); // Append the new list item to the task list
    save(); // Save the updated task list to localStorage
    refreshEmptyState(); // Refresh the empty state of the task list
    announce(`Added task ${text}`); // Announce the addition of the task for screen readers
}

// Function to save the current task list to localStorage
function save() {
    const tasks = [...list.children].map(li => ({ // Map each list item to an object
      text: li.querySelector('span').textContent, // Get the task text
      completed: li.classList.contains('completed') // Check if the task is completed
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save the task list as a JSON string in loca
    refreshEmptyState(); // Refresh the empty state of the task list    
}

// Function to load the task list from localStorage
function load() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Parse the task list from localStorage or use an empty array
    tasks.forEach(t => addTask(t.text, t.completed)); // Add each task to the list
}

load(); // Call the load function once when the page loads


const srAlert = document.getElementById('sr-alert');

function announce(msg) {
  srAlert.textContent = msg;          // screen reader says it
  setTimeout(() => (srAlert.textContent = ''), 1000);
}

announce(`Added task ${text}`);
announce(`Deleted task ${text}`);
announce(`Marked ${text} ${checked ? 'complete' : 'active'}`);

function refreshEmptyState() {
    document.getElementById('empty-state')
            .classList.toggle('hidden', list.children.length !== 0);
  }
  let currentFilter = 'all';

document.getElementById('filters').addEventListener('click', (e) => {
  if (!e.target.matches('button')) return;
  currentFilter = e.target.dataset.filter;
  [...e.currentTarget.children].forEach(btn =>
       btn.classList.toggle('active', btn === e.target));
  applyFilter();
});

function applyFilter() {
  [...list.children].forEach(li => {
    const done = li.classList.contains('completed');
    const show =
      currentFilter === 'all' ||
      (currentFilter === 'active' && !done) ||
      (currentFilter === 'completed' && done);
    li.style.display = show ? '' : 'none';
  });
}
