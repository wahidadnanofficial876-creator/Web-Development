// ================= ELEMENTS =================
const signupScreen = document.getElementById('signup-screen');
const loginScreen = document.getElementById('login-screen');
const todoScreen = document.getElementById('todo-screen');
const forgotScreen = document.getElementById('forgot-screen');

const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const resetBtn = document.getElementById('reset-btn');

const showLogin = document.getElementById('show-login');
const showSignup = document.getElementById('show-signup');
const forgotPassword = document.getElementById('forgot-password');
const backToLogin = document.getElementById('back-to-login');

const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');
const forgotMessage = document.getElementById('forgot-message');
const todoWelcome = document.getElementById('todo-welcome');

// To-Do Elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// Logged-in user
let currentUser = null;

// ================= SCREEN SWITCHING =================
showLogin.addEventListener('click', () => {
    signupScreen.style.display = 'none';
    loginScreen.style.display = 'block';
});

showSignup.addEventListener('click', () => {
    loginScreen.style.display = 'none';
    signupScreen.style.display = 'block';
});

forgotPassword.addEventListener('click', () => {
    loginScreen.style.display = 'none';
    forgotScreen.style.display = 'block';
});

backToLogin.addEventListener('click', () => {
    forgotScreen.style.display = 'none';
    loginScreen.style.display = 'block';
});

// ================= SIGN UP =================
signupBtn.addEventListener('click', () => {
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;

    if (!username || !email || !password) {
        signupMessage.textContent = "All fields are required!";
        return;
    }
    if (!email.includes('@')) {
        signupMessage.textContent = "Invalid email!";
        return;
    }
    if (password.length < 6) {
        signupMessage.textContent = "Password must be at least 6 characters!";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        signupMessage.textContent = "Email already registered!";
        return;
    }

    users.push({ username, email, password, todos: [] });
    localStorage.setItem('users', JSON.stringify(users));

    signupMessage.textContent = '';
    signupScreen.style.display = 'none';
    loginScreen.style.display = 'block';
});

// ================= SIGN IN =================
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        loginMessage.textContent = '';
        loginScreen.style.display = 'none';
        todoScreen.style.display = 'block';
        todoWelcome.textContent = `Hello, ${user.username}!`;
        loadTodos();
    } else {
        loginMessage.textContent = "Incorrect email or password!";
    }
});

// ================= FORGOT PASSWORD =================
resetBtn.addEventListener('click', () => {
    const email = document.getElementById('forgot-email').value.trim();
    const newPassword = document.getElementById('new-password').value;

    if (!email || !newPassword) {
        forgotMessage.textContent = "All fields are required!";
        forgotMessage.style.color = "red";
        return;
    }

    if (newPassword.length < 6) {
        forgotMessage.textContent = "Password must be at least 6 characters!";
        forgotMessage.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.email === email);

    if (index === -1) {
        forgotMessage.textContent = "Email not found!";
        forgotMessage.style.color = "red";
        return;
    }

    users[index].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    forgotMessage.textContent = "Password reset successful!";
    forgotMessage.style.color = "green";

    setTimeout(() => {
        forgotScreen.style.display = 'none';
        loginScreen.style.display = 'block';
        forgotMessage.textContent = '';
    }, 1500);
});

// ================= LOGOUT =================
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    todoScreen.style.display = 'none';
    loginScreen.style.display = 'block';
    todoList.innerHTML = '';
});

// ================= TO-DO FUNCTIONALITY =================
function loadTodos() {
    todoList.innerHTML = '';
    if (!currentUser) return;
    currentUser.todos.forEach(task => createTodoItem(task));
}

addBtn.addEventListener('click', () => {
    const taskText = input.value.trim();
    if (!taskText || !currentUser) return;

    const task = { text: taskText, completed: false };
    currentUser.todos.push(task);

    saveCurrentUser();
    createTodoItem(task);
    input.value = '';
});

function createTodoItem(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        task.completed = !task.completed;
        saveCurrentUser();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = 'delete-btn';

    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentUser.todos = currentUser.todos.filter(t => t !== task);
        saveCurrentUser();
        li.remove();
    });

    li.appendChild(deleteBtn);
    todoList.appendChild(li);
}

function saveCurrentUser() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index > -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}
