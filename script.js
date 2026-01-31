// Interactive Web Elements - JavaScript File

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded. Initializing interactive elements...");
    
    // ========== GLOBAL VARIABLES ==========
    let clickCount = 0;
    let currentTheme = 'light';
    let timer = 0;
    let taskId = 1;
    
    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const currentThemeSpan = document.getElementById('currentTheme');
    
    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            currentTheme = 'dark';
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Switch to Light Mode';
            currentThemeSpan.textContent = 'Dark';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            currentTheme = 'light';
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Switch to Dark Mode';
            currentThemeSpan.textContent = 'Light';
        }
        
        updateClickCount();
        saveToLocalStorage('theme', currentTheme);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        currentTheme = savedTheme;
        if (savedTheme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Switch to Light Mode';
            currentThemeSpan.textContent = 'Dark';
        }
    }
    
    // ========== COUNTER ==========
    const counterValue = document.getElementById('counterValue');
    const incrementBtn = document.getElementById('incrementBtn');
    const decrementBtn = document.getElementById('decrementBtn');
    const resetCounterBtn = document.getElementById('resetCounterBtn');
    let counter = localStorage.getItem('counter') ? parseInt(localStorage.getItem('counter')) : 0;
    counterValue.textContent = counter;
    
    incrementBtn.addEventListener('click', function() {
        counter++;
        counterValue.textContent = counter;
        updateClickCount();
        saveToLocalStorage('counter', counter);
        animateCounterChange('increment');
    });
    
    decrementBtn.addEventListener('click', function() {
        if (counter > 0) {
            counter--;
            counterValue.textContent = counter;
            updateClickCount();
            saveToLocalStorage('counter', counter);
            animateCounterChange('decrement');
        }
    });
    
    resetCounterBtn.addEventListener('click', function() {
        counter = 0;
        counterValue.textContent = counter;
        updateClickCount();
        saveToLocalStorage('counter', counter);
        animateCounterChange('reset');
    });
    
    function animateCounterChange(type) {
        counterValue.style.transform = 'scale(1.2)';
        counterValue.style.color = type === 'increment' ? '#2ecc71' : 
                                 type === 'decrement' ? '#e74c3c' : 
                                 '#f39c12';
        
        setTimeout(() => {
            counterValue.style.transform = 'scale(1)';
            counterValue.style.color = '';
        }, 300);
    }
    
    // ========== DYNAMIC TEXT UPDATE ==========
    const textInput = document.getElementById('textInput');
    const updateTextBtn = document.getElementById('updateTextBtn');
    const textDisplay = document.getElementById('textDisplay');
    
    updateTextBtn.addEventListener('click', function() {
        if (textInput.value.trim() !== '') {
            textDisplay.textContent = textInput.value;
            textDisplay.style.animation = 'none';
            setTimeout(() => {
                textDisplay.style.animation = 'fadeIn 0.5s ease';
            }, 10);
            updateClickCount();
        } else {
            textDisplay.textContent = 'Please enter some text first!';
            textDisplay.style.color = '#e74c3c';
        }
    });
    
    // ========== COLOR PICKER ==========
    const colorOptions = document.querySelectorAll('.color-option');
    const resetColorBtn = document.getElementById('resetColorBtn');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get color from data attribute
            const color = this.getAttribute('data-color');
            
            // Apply color to display box
            textDisplay.style.backgroundColor = color;
            textDisplay.style.color = getContrastColor(color);
            
            updateClickCount();
        });
    });
    
    resetColorBtn.addEventListener('click', function() {
        // Reset to default
        colorOptions.forEach(opt => opt.classList.remove('active'));
        textDisplay.style.backgroundColor = '';
        textDisplay.style.color = '';
        textDisplay.textContent = 'Your text will appear here...';
        textInput.value = '';
        
        updateClickCount();
    });
    
    // Helper function to determine text color based on background
    function getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    
    // ========== TOGGLE CONTENT ==========
    const toggleContentBtn = document.getElementById('toggleContentBtn');
    const toggleStatus = document.getElementById('toggleStatus');
    const hiddenContent = document.getElementById('hiddenContent');
    
    toggleContentBtn.addEventListener('click', function() {
        hiddenContent.classList.toggle('show');
        
        if (hiddenContent.classList.contains('show')) {
            toggleContentBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Content';
            toggleStatus.textContent = 'Currently Visible';
            toggleStatus.style.color = '#2ecc71';
        } else {
            toggleContentBtn.innerHTML = '<i class="fas fa-eye"></i> Show Hidden Content';
            toggleStatus.textContent = 'Currently Hidden';
            toggleStatus.style.color = '#e74c3c';
        }
        
        updateClickCount();
    });
    
    // ========== TASK LIST ==========
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllTasksBtn = document.getElementById('clearAllTasksBtn');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks on load
    renderTasks();
    
    addTaskBtn.addEventListener('click', function() {
        addTask();
    });
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            const task = {
                id: taskId++,
                text: taskText,
                completed: false,
                timestamp: new Date().toLocaleString()
            };
            
            tasks.push(task);
            renderTasks();
            saveTasks();
            taskInput.value = '';
            taskInput.focus();
            updateClickCount();
        }
    }
    
    function renderTasks() {
        // Clear task list
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="task-item empty-task">
                    <i class="fas fa-clipboard-list"></i>
                    <span>No tasks yet. Add your first task above!</span>
                </div>
            `;
            taskCount.textContent = '0';
            return;
        }
        
        // Add each task
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskElement.dataset.id = task.id;
            
            taskElement.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <small class="task-time">${task.timestamp}</small>
                <button class="task-delete"><i class="fas fa-trash-alt"></i></button>
            `;
            
            taskList.appendChild(taskElement);
            
            // Add event listeners to new task
            const checkbox = taskElement.querySelector('.task-checkbox');
            const deleteBtn = taskElement.querySelector('.task-delete');
            
            checkbox.addEventListener('change', function() {
                task.completed = this.checked;
                taskElement.classList.toggle('completed', this.checked);
                saveTasks();
                updateTaskCount();
                updateClickCount();
            });
            
            deleteBtn.addEventListener('click', function() {
                tasks = tasks.filter(t => t.id !== task.id);
                renderTasks();
                saveTasks();
                updateClickCount();
            });
        });
        
        updateTaskCount();
    }
    
    function updateTaskCount() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        taskCount.textContent = `${completedTasks}/${totalTasks}`;
    }
    
    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        saveTasks();
        updateClickCount();
    });
    
    clearAllTasksBtn.addEventListener('click', function() {
        if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            renderTasks();
            saveTasks();
            updateClickCount();
        }
    });
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // ========== RANDOM GENERATOR ==========
    const randomQuoteBtn = document.getElementById('randomQuoteBtn');
    const randomNumberBtn = document.getElementById('randomNumberBtn');
    const randomColorBtn = document.getElementById('randomColorBtn');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const numberDisplay = document.getElementById('numberDisplay');
    const colorSample = document.getElementById('colorSample');
    const colorCode = document.getElementById('colorCode');
    
    const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "Get busy living or get busy dying.", author: "Stephen King" },
        { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", author: "Brian Tracy" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" }
    ];
    
    randomQuoteBtn.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        
        quoteText.textContent = `"${randomQuote.text}"`;
        quoteAuthor.textContent = `- ${randomQuote.author}`;
        
        updateClickCount();
    });
    
    randomNumberBtn.addEventListener('click', function() {
        // Generate random number between 1 and 100
        const randomNum = Math.floor(Math.random() * 100) + 1;
        
        // Animation effect
        numberDisplay.style.transform = 'scale(0)';
        numberDisplay.style.opacity = '0';
        
        setTimeout(() => {
            numberDisplay.textContent = randomNum;
            numberDisplay.style.transform = 'scale(1)';
            numberDisplay.style.opacity = '1';
            
            // Color based on number
            if (randomNum < 33) {
                numberDisplay.style.color = '#e74c3c'; // Red for low numbers
            } else if (randomNum < 67) {
                numberDisplay.style.color = '#f39c12'; // Orange for medium numbers
            } else {
                numberDisplay.style.color = '#2ecc71'; // Green for high numbers
            }
        }, 300);
        
        updateClickCount();
    });
    
    randomColorBtn.addEventListener('click', function() {
        // Generate random hex color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        
        // Update display
        colorSample.style.backgroundColor = randomColor;
        colorCode.textContent = randomColor.toUpperCase();
        colorCode.style.color = randomColor;
        
        updateClickCount();
    });
    
    // ========== FORM VALIDATION ==========
    const interactiveForm = document.getElementById('interactiveForm');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userMessage = document.getElementById('userMessage');
    const submitFormBtn = document.getElementById('submitFormBtn');
    const resetFormBtn = document.getElementById('resetFormBtn');
    const formResult = document.getElementById('formResult');
    const resultMessage = document.getElementById('resultMessage');
    
    // Real-time validation
    userName.addEventListener('input', validateName);
    userEmail.addEventListener('input', validateEmail);
    userMessage.addEventListener('input', validateMessage);
    
    function validateName() {
        const nameValue = userName.value.trim();
        const validationElement = document.getElementById('nameValidation');
        
        if (nameValue.length === 0) {
            showValidationError(userName, validationElement, "Name is required");
            return false;
        } else if (nameValue.length < 2) {
            showValidationError(userName, validationElement, "Name must be at least 2 characters");
            return false;
        } else {
            showValidationSuccess(userName, validationElement, "Name looks good!");
            return true;
        }
    }
    
    function validateEmail() {
        const emailValue = userEmail.value.trim();
        const validationElement = document.getElementById('emailValidation');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValue.length === 0) {
            showValidationError(userEmail, validationElement, "Email is required");
            return false;
        } else if (!emailRegex.test(emailValue)) {
            showValidationError(userEmail, validationElement, "Please enter a valid email");
            return false;
        } else {
            showValidationSuccess(userEmail, validationElement, "Email looks good!");
            return true;
        }
    }
    
    function validateMessage() {
        const messageValue = userMessage.value.trim();
        const validationElement = document.getElementById('messageValidation');
        
        if (messageValue.length === 0) {
            showValidationError(userMessage, validationElement, "Message is required");
            return false;
        } else if (messageValue.length < 10) {
            showValidationError(userMessage, validationElement, "Message must be at least 10 characters");
            return false;
        } else {
            showValidationSuccess(userMessage, validationElement, "Message looks good!");
            return true;
        }
    }
    
    function showValidationError(inputElement, validationElement, message) {
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        validationElement.textContent = message;
        validationElement.classList.add('error');
        validationElement.classList.remove('success');
    }
    
    function showValidationSuccess(inputElement, validationElement, message) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        validationElement.textContent = message;
        validationElement.classList.remove('error');
        validationElement.classList.add('success');
    }
    
    interactiveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();
        
        if (isNameValid && isEmailValid && isMessageValid) {
            // Form is valid
            resultMessage.innerHTML = `
                <strong>Form Submitted Successfully!</strong><br><br>
                <strong>Name:</strong> ${userName.value}<br>
                <strong>Email:</strong> ${userEmail.value}<br>
                <strong>Message:</strong> ${userMessage.value}<br><br>
                <em>Submitted at: ${new Date().toLocaleString()}</em>
            `;
            
            formResult.style.backgroundColor = '#d4edda';
            formResult.style.borderLeft = '4px solid #28a745';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                interactiveForm.reset();
                // Clear validation messages
                document.querySelectorAll('.validation-message').forEach(el => {
                    el.textContent = '';
                    el.classList.remove('error', 'success');
                });
                // Reset input classes
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'valid');
                });
            }, 3000);
            
            updateClickCount();
        } else {
            resultMessage.innerHTML = `
                <strong style="color: #e74c3c;">Form Submission Failed!</strong><br><br>
                Please fix the errors above and try again.
            `;
            
            formResult.style.backgroundColor = '#f8d7da';
            formResult.style.borderLeft = '4px solid #dc3545';
        }
        
        // Show form result with animation
        formResult.style.display = 'block';
        formResult.style.animation = 'fadeIn 0.5s ease';
    });
    
    resetFormBtn.addEventListener('click', function() {
        interactiveForm.reset();
        
        // Clear validation messages
        document.querySelectorAll('.validation-message').forEach(el => {
            el.textContent = '';
            el.classList.remove('error', 'success');
        });
        
        // Reset input classes
        document.querySelectorAll('.form-input').forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        resultMessage.textContent = 'Your form submission will appear here.';
        formResult.style.backgroundColor = '';
        formResult.style.borderLeft = '';
        
        updateClickCount();
    });
    
    // ========== CLICK COUNTER & TIMER ==========
    const totalClicks = document.getElementById('totalClicks');
    const pageTimer = document.getElementById('pageTimer');
    
    // Load click count from localStorage
    const savedClicks = localStorage.getItem('totalClicks');
    if (savedClicks) {
        clickCount = parseInt(savedClicks);
        totalClicks.textContent = clickCount;
    }
    
    // Update click count on any button click
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', updateClickCount);
    });
    
    function updateClickCount() {
        clickCount++;
        totalClicks.textContent = clickCount;
        saveToLocalStorage('totalClicks', clickCount);
    }
    
    // Timer
    setInterval(() => {
        timer++;
        pageTimer.textContent = timer;
        saveToLocalStorage('pageTimer', timer);
    }, 1000);
    
    // Load timer from localStorage
    const savedTimer = localStorage.getItem('pageTimer');
    if (savedTimer) {
        timer = parseInt(savedTimer);
        pageTimer.textContent = timer;
    }
    
    // ========== HELPER FUNCTIONS ==========
    function saveToLocalStorage(key, value) {
        localStorage.setItem(key, value);
    }
    
    // ========== INITIALIZATION ==========
    console.log("All interactive elements initialized!");
    
    // Show welcome message
    setTimeout(() => {
        console.log("Welcome to Interactive Web Elements!");
        console.log("Try interacting with the different elements on the page.");
    }, 1000);
});