const form  = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list  = document.getElementById('todo-list');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addTask(text);
    input.value = '';
  });
  function addTask(text, completed = false) {
    const li = document.createElement('li');
    if (completed) li.classList.add('completed');
  
    li.innerHTML = `
      <span>${text}</span>
      <div>
        <input type="checkbox" ${completed ? 'checked' : ''}/>
        <button class="delete-btn">&times;</button>
      </div>
    `;
  
    // Toggle completion
    li.querySelector('input[type="checkbox"]').addEventListener('change', () => {
      li.classList.toggle('completed');
      save();
    });
  
    // Delete
    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      save();
    });
  
    list.appendChild(li);
    save();            // persist after every change
  }
  function save() {
    const tasks = [...list.children].map(li => ({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function load() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(t => addTask(t.text, t.completed));
  }
  load();   // call once on page load
      