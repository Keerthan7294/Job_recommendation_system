document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const switchToRegisterLink = document.getElementById('switchToRegister');
    const switchToLoginLink = document.getElementById('switchToLogin');
    const toastNotification = document.getElementById('toast');
    const passwordStrengthBar = document.getElementById('pwBar');
    const registerPasswordInput = document.getElementById('regPassword');
    const setActiveTab = (tabName) => {
        const isLoginView = tabName === 'login';
        loginTab.classList.toggle('active', isLoginView);
        registerTab.classList.toggle('active', !isLoginView);
        loginForm.classList.toggle('active', isLoginView);
        registerForm.classList.toggle('active', !isLoginView);
    };
    loginTab.addEventListener('click', () => setActiveTab('login'));
    registerTab.addEventListener('click', () => setActiveTab('register'));
    switchToRegisterLink.addEventListener('click', () => setActiveTab('register'));
    switchToLoginLink.addEventListener('click', () => setActiveTab('login'));
    let toastTimeout;
    const showToast = (message, messageType = 'success') => {
        clearTimeout(toastTimeout);
        toastNotification.textContent = message;
        toastNotification.className = `toast ${messageType}`;
        requestAnimationFrame(() => toastNotification.classList.add('show'));
        toastTimeout = setTimeout(() => toastNotification.classList.remove('show'), 3500);
    };
    registerPasswordInput.addEventListener('input', () => {
        const passwordValue = registerPasswordInput.value;
        let strengthScore = 0;
        if (passwordValue.length >= 6) strengthScore++;
        if (passwordValue.length >= 10) strengthScore++;
        if (/[A-Z]/.test(passwordValue)) strengthScore++;
        if (/[0-9]/.test(passwordValue)) strengthScore++;
        if (/[^A-Za-z0-9]/.test(passwordValue)) strengthScore++;
        const percentageWidth = (strengthScore / 5) * 100;
        const strengthColors = ['#d94f4f', '#e8883c', '#d4b94e', '#8cb87a', '#5a9a6e'];
        passwordStrengthBar.style.width = `${percentageWidth}%`;
        passwordStrengthBar.style.background = strengthColors[strengthScore - 1] || strengthColors[0];
    });
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const registerButton = document.getElementById('registerBtn');
        registerButton.disabled = true;
        registerButton.textContent = 'Creating your account…';
        try {
            const serverResponse = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('regUsername').value.trim(),
                    email: document.getElementById('regEmail').value.trim(),
                    password: registerPasswordInput.value
                })
            });
            const responseData = await serverResponse.json();
            if (responseData.success) {
                showToast('Account created successfully! Redirecting you now…', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            } else {
                showToast(responseData.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Unable to reach the server. Is it running?', 'error');
        } finally {
            registerButton.disabled = false;
            registerButton.textContent = 'Create Account';
        }
    });
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginButton = document.getElementById('loginBtn');
        loginButton.disabled = true;
        loginButton.textContent = 'Signing you in…';
        try {
            const serverResponse = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('loginUsername').value.trim(),
                    password: document.getElementById('loginPassword').value
                })
            });
            const responseData = await serverResponse.json();
            if (responseData.success) {
                showToast('Welcome back! Redirecting to your dashboard…', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            } else {
                showToast(responseData.message || 'Invalid username or password.', 'error');
            }
        } catch (error) {
            showToast('Unable to reach the server. Is it running?', 'error');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In';
        }
    });
});
