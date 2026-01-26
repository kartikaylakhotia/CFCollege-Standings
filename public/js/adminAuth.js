const API_URL = '/api/auth';

const adminLoginForm = document.getElementById('adminLoginForm');
if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
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
                // Check if admin
                if (data.role !== 'admin' && data.role !== 'head-admin') {
                    message.classList.remove('hidden');
                    message.textContent = 'Access Denied: Not an admin account.';
                    return;
                }

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data._id,
                    name: data.name,
                    role: data.role,
                    status: data.status
                }));

                window.location.href = 'admin.html';
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
