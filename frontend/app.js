
const API_URL = 'https://fresh-basket-sno7.onrender.com';


const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const dashboard = document.getElementById('dashboard');
const messageBox = document.getElementById('message');





function showSignup() {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    clearMessage();
}


function showLogin() {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearMessage();
}


function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const icon = event.target;
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.textContent = 'Hide';
    } else {
        passwordField.type = 'password';
        icon.textContent = 'Show';
    }
}

function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    setTimeout(() => clearMessage(), 3000);
}


function clearMessage() {
    messageBox.textContent = '';
    messageBox.className = 'message';
}


document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showMessage(data.message, 'success');

            setTimeout(() => showDashboard(data.user), 1000);
        } else {
            showMessage(data.message, 'error');
        }

    } catch (error) {
        showMessage('Network error. Backend may be offline.', 'error');
        console.error('Signup error:', error);
    }
});


document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showMessage(data.message, 'success');

            setTimeout(() => showDashboard(data.user), 1000);
        } else {
            showMessage(data.message, 'error');
        }

    } catch (error) {
        showMessage('Network error. Backend may be offline.', 'error');
        console.error('Login error:', error);
    }
});



function showDashboard(user) {
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');

    dashboard.classList.remove('hidden');

    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
}



function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    dashboard.classList.add('hidden');
    loginForm.classList.remove('hidden');

    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    showMessage('Logged out successfully!', 'success');
}



window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        showDashboard(JSON.parse(user));
    }
});
