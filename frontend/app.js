// Backend API URL
const API_URL = 'http://localhost:5001';

// Get all DOM elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const dashboard = document.getElementById('dashboard');
const messageBox = document.getElementById('message');

// ===========================
// FUNCTION 1: Show/Hide Forms
// ===========================

// Show signup form, hide login form
function showSignup() {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    clearMessage();
}

// Show login form, hide signup form
function showLogin() {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearMessage();
}

// Toggle password visibility
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

// ===========================
// FUNCTION 2: Display Messages
// ===========================

// Show success message
function showMessage(message, type) {
    messageBox.textContent = message;
    messageBox.className = `message ${type}`;
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
        clearMessage();
    }, 3000);
}

// Clear message
function clearMessage() {
    messageBox.textContent = '';
    messageBox.className = 'message';
}

// ===========================
// FUNCTION 3: Signup Handler
// ===========================

document.getElementById('signup').addEventListener('submit', async (e) => {
    e.preventDefault();  // Stop form from refreshing page
    
    // Get input values
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Validate password length
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    try {
        // Send data to backend
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        // Get response from backend
        const data = await response.json();
        
        if (data.success) {
            // Save token in browser storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage(data.message, 'success');
            
            // Show dashboard after 1 second
            setTimeout(() => {
                showDashboard(data.user);
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
        
    } catch (error) {
        showMessage('Network error. Please check if backend is running.', 'error');
        console.error('Signup error:', error);
    }
});

// ===========================
// FUNCTION 4: Login Handler
// ===========================

document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();  // Stop form from refreshing page
    
    // Get input values
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        // Send data to backend
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        // Get response from backend
        const data = await response.json();
        
        if (data.success) {
            // Save token in browser storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            showMessage(data.message, 'success');
            
            // Show dashboard after 1 second
            setTimeout(() => {
                showDashboard(data.user);
            }, 1000);
        } else {
            showMessage(data.message, 'error');
        }
        
    } catch (error) {
        showMessage('Network error. Please check if backend is running.', 'error');
        console.error('Login error:', error);
    }
});

// ===========================
// FUNCTION 5: Show Dashboard
// ===========================

function showDashboard(user) {
    // Hide forms
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    
    // Show dashboard
    dashboard.classList.remove('hidden');
    
    // Display user information
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
}

// ===========================
// FUNCTION 6: Logout
// ===========================

function logout() {
    // Remove token and user data from storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Hide dashboard
    dashboard.classList.add('hidden');
    
    // Show login form
    loginForm.classList.remove('hidden');
    
    // Clear input fields
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    showMessage('Logged out successfully!', 'success');
}

// ===========================
// FUNCTION 7: Check if Already Logged In
// ===========================

// When page loads, check if user is already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        // User is already logged in
        showDashboard(JSON.parse(user));
    }
});
