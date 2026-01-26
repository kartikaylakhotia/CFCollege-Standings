const API_URL = '/api/auth';

// Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const cfHandle = document.getElementById('cfHandle').value;
        const message = document.getElementById('message');

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, cfHandle })
            });
            const data = await res.json();

            if (data.success) {
                message.className = 'text-center text-sm mt-4 text-green-600 block';
                message.textContent = 'Account requested! Please wait for admin approval.';
                registerForm.reset();
            } else {
                message.className = 'text-center text-sm mt-4 text-red-600 block';
                message.textContent = data.message;
            }
        } catch (error) {
            console.error(error);
            message.textContent = 'An error occurred';
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;
        const message = document.getElementById('message');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data._id,
                    name: data.name,
                    role: data.role,
                    status: data.status
                }));

                if (data.status === 'pending') {
                    // Start polling or just show message? Requirement said wait for approval.
                    // For now, redirect to a waiting page or just alert.
                    // But actually, we should check role.
                    alert('Your account is pending approval.');
                    return;
                }

                if (data.role === 'admin' || data.role === 'head-admin') {
                    // Redirect to dashboard (Admin link is available there)
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                message.classList.remove('hidden');
                message.textContent = data.message;
            }
        } catch (error) {
            console.error(error);
            message.textContent = 'An error occurred';
        }
    });
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Check Auth on restricted pages
function checkAuth(roleRequired = null) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = 'index.html';
        return null;
    }

    if (roleRequired === 'admin' && user.role !== 'admin' && user.role !== 'head-admin') {
        window.location.href = 'dashboard.html';
        return null;
    }

    return { token, user };
}
