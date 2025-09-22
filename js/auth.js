// Authentication System for Ditzy Website
// File: js/auth.js

// Valid users database (in production, this should be server-side)
const validUsers = {
    'admin': 'ditzy123',
    'user': 'password',
    'ditzy': 'admin123',
    'guest': 'guest123'
};

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Check if user is already logged in
    const savedUser = sessionStorage.getItem('ditzyUser');
    const savedLoginTime = sessionStorage.getItem('ditzyLoginTime');
    
    if (savedUser && savedLoginTime) {
        // Check if session is still valid (24 hours)
        const loginTime = new Date(savedLoginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // Auto-login
            autoLogin(savedUser, savedLoginTime);
            return;
        } else {
            // Session expired
            clearSession();
        }
    }
    
    // Setup login form
    setupLoginForm();
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Add Enter key support for login
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !document.getElementById('mainApp').classList.contains('hidden')) {
            return; // Don't interfere with main app
        }
        
        if (e.key === 'Enter' && !document.getElementById('loginContainer').classList.contains('hidden')) {
            e.preventDefault();
            handleLogin(e);
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Validate input
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    // Check credentials
    if (validUsers[username] && validUsers[username] === password) {
        const loginTime = new Date().toISOString();
        login(username, loginTime);
        
        // Save session
        sessionStorage.setItem('ditzyUser', username);
        sessionStorage.setItem('ditzyLoginTime', loginTime);
        
        // Clear form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Clear any error messages
        clearLoginError();
        
    } else {
        showLoginError('Invalid username or password!');
        
        // Add shake animation to form
        const form = document.querySelector('.login-form');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

function login(username, loginTime) {
    // Hide login container
    document.getElementById('loginContainer').classList.add('hidden');
    
    // Show main app
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Update user info
    document.getElementById('currentUser').textContent = username;
    document.getElementById('loginTime').textContent = new Date(loginTime).toLocaleString();
    
    // Initialize main app features
    if (typeof initializeMainApp === 'function') {
        initializeMainApp();
    }
    
    // Show welcome message
    showWelcomeMessage(username);
}

function autoLogin(username, loginTime) {
    login(username, loginTime);
}

function logout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        clearSession();
        
        // Hide main app
        document.getElementById('mainApp').classList.add('hidden');
        
        // Show login container
        document.getElementById('loginContainer').classList.remove('hidden');
        
        // Reset form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        // Clear any data
        clearUserData();
        
        // Show logout message
        showLogoutMessage();
    }
}

function clearSession() {
    sessionStorage.removeItem('ditzyUser');
    sessionStorage.removeItem('ditzyLoginTime');
}

function clearUserData() {
    // Clear calculator
    if (document.getElementById('calcDisplay')) {
        document.getElementById('calcDisplay').value = '';
    }
    
    // Clear ping results
    if (document.getElementById('pingResult')) {
        document.getElementById('pingResult').innerHTML = '';
    }
    
    // Clear device info
    if (document.getElementById('deviceInfo')) {
        document.getElementById('deviceInfo').innerHTML = '';
    }
    
    // Clear tool results
    if (document.getElementById('toolResult')) {
        document.getElementById('toolResult').innerHTML = '';
    }
    
    // Clear weather info
    if (document.getElementById('weatherInfo')) {
        document.getElementById('weatherInfo').innerHTML = '';
    }
    
    // Stop any playing audio
    const audio = document.getElementById('audioElement');
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
    }
    
    // Clear file inputs
    const audioFile = document.getElementById('audioFile');
    if (audioFile) {
        audioFile.value = '';
    }
}

function showLoginError(message) {
    let errorDiv = document.getElementById('loginError');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'loginError';
        errorDiv.style.cssText = `
            color: #dc3545;
            text-align: center;
            margin-top: 10px;
            padding: 10px;
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.3);
            border-radius: 5px;
        `;
        
        const loginForm = document.querySelector('.login-form');
        loginForm.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(clearLoginError, 5000);
}

function clearLoginError() {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

function showWelcomeMessage(username) {
    // Create welcome toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
        z-index: 1000;
        font-weight: 600;
    `;
    toast.textContent = `Welcome back, ${username}!`;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLogoutMessage() {
    // Create logout toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6c757d, #495057);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
        z-index: 1000;
        font-weight: 600;
    `;
    toast.textContent = 'Logged out successfully!';
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Add CSS for shake animation
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Security functions
function getCurrentUser() {
    return sessionStorage.getItem('ditzyUser');
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function requireAuth(callback) {
    if (isLoggedIn()) {
        callback();
    } else {
        showLoginError('Please login first');
    }
}

// Export functions for use in other files
window.authFunctions = {
    logout,
    getCurrentUser,
    isLoggedIn,
    requireAuth
};
