class Todo {
    constructor() {
      
        this.tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];
        this.searchTerm = '';
        
       
        this.listContainer = document.getElementById('todo-list');
        this.searchInput = document.getElementById('searchInput');
        this.newTaskText = document.getElementById('newTaskText');
        this.newTaskDate = document.getElementById('newTaskDate');
        this.addBtn = document.getElementById('addBtn');
        this.errorMsg = document.getElementById('error-message');

        this.initEvents();
        this.draw();
    }

    initEvents() {

        this.addBtn.addEventListener('click', () => this.addTask());

       
        this.searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.draw();
        });
    }

  
    validate(text, dateStr) {
        if (text.length < 3 || text.length > 255) {
            return "Tekst zadania musi mieć od 3 do 255 znaków.";
        }
        
        if (dateStr) {
            const taskDate = new Date(dateStr);
            const now = new Date();
            if (taskDate < now) {
                return "Data wykonania musi być w przyszłości.";
            }
        }
        return null;
    }

  
    addTask() {
        const text = this.newTaskText.value.trim();
        const date = this.newTaskDate.value;

        const error = this.validate(text, date);
        if (error) {
            this.errorMsg.textContent = error;
            return;
        }

        this.errorMsg.textContent = '';
        
        const task = {
            id: Date.now().toString(),
            text: text,
            date: date
        };

        this.tasks.push(task);
        this.save();
        
      
        this.newTaskText.value = '';
        this.newTaskDate.value = '';
        
        this.draw();
    }

   
    removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.save();
        this.draw();
    }

  
    updateTask(id, newText, newDate) {
        const error = this.validate(newText, newDate);
        if (error) {
            alert("Błąd edycji: " + error);
            this.draw(); 
            return;
        }

        const taskIndex = this.tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            this.tasks[taskIndex].text = newText;
            this.tasks[taskIndex].date = newDate;
            this.save();
            this.draw();
        }
    }

    
    save() {
        localStorage.setItem('todo_tasks', JSON.stringify(this.tasks));
    }

    
    getFilteredTasks() {
        if (this.searchTerm.length >= 2) {
            const lowerTerm = this.searchTerm.toLowerCase();
            return this.tasks.filter(task => 
                task.text.toLowerCase().includes(lowerTerm)
            );
        }
        return this.tasks;
    }

   
    highlightText(text) {
        if (this.searchTerm.length >= 2) {
            const regex = new RegExp(`(${this.searchTerm})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        }
        return text;
    }

 
    draw() {
        this.listContainer.innerHTML = ''; 

        const tasksToDraw = this.getFilteredTasks();

        tasksToDraw.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'task-content';

            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.innerHTML = this.highlightText(task.text);

            const dateSpan = document.createElement('span');
            dateSpan.className = 'task-date';
            dateSpan.textContent = task.date ? new Date(task.date).toLocaleString() : 'Brak daty';

        
            contentDiv.addEventListener('click', () => {
                if (contentDiv.querySelector('input')) return;

                const textInput = document.createElement('input');
                textInput.type = 'text';
                textInput.value = task.text;
                textInput.className = 'edit-input';

                const dateInput = document.createElement('input');
                dateInput.type = 'datetime-local';
                dateInput.value = task.date;
                dateInput.className = 'edit-input';

                contentDiv.innerHTML = '';
                contentDiv.appendChild(textInput);
                contentDiv.appendChild(dateInput);
                textInput.focus();

                const saveEdit = () => {
                    setTimeout(() => {
                        if (document.activeElement !== textInput && document.activeElement !== dateInput) {
                            this.updateTask(task.id, textInput.value.trim(), dateInput.value);
                        }
                    }, 100);
                };

                textInput.addEventListener('blur', saveEdit);
                dateInput.addEventListener('blur', saveEdit);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Usuń / 🗑';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTask(task.id);
            });

            contentDiv.appendChild(textSpan);
            contentDiv.appendChild(dateSpan);
            
            taskDiv.appendChild(contentDiv);
            taskDiv.appendChild(deleteBtn);

            this.listContainer.appendChild(taskDiv);
        });
    }
}


document.todo = new Todo();
