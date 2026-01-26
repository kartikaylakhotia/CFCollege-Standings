const auth = checkAuth('admin');

if (auth) {
    document.getElementById('adminName').textContent = auth.user.name;

    // Load initial data
    fetchPendingUsers();
}

async function fetchPendingUsers() {
    try {
        const res = await fetch('/api/admin/pending', {
            headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        const data = await res.json();

        const tbody = document.getElementById('pendingUsersBody');
        const noMsg = document.getElementById('noPendingMsg');
        tbody.innerHTML = '';

        if (data.success && data.data.length > 0) {
            noMsg.classList.add('hidden');
            data.data.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900 dark:text-white">${user.name}</div></td>
                    <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-500 dark:text-gray-400">${user.email}</div></td>
                    <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-500 dark:text-gray-400">${user.cfHandle}</div></td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="manageUser('${user._id}', 'approved')" class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-4">Approve</button>
                        <button onclick="manageUser('${user._id}', 'rejected')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">Reject</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            noMsg.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error fetching pending users:', error);
    }
}

async function manageUser(id, status) {
    try {
        const res = await fetch(`/api/admin/user/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (data.success) {
            fetchPendingUsers(); // Refresh list
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error managing user:', error);
    }
}

const potdForm = document.getElementById('potdForm');
if (potdForm) {
    potdForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const problemId = document.getElementById('problemId').value;
        const msg = document.getElementById('potdMessage');

        try {
            const res = await fetch('/api/admin/potd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({ problemId })
            });
            const data = await res.json();

            if (data.success) {
                msg.className = 'mt-2 text-sm text-green-600';
                msg.textContent = 'POTD Set Successfully!';
                potdForm.reset();
            } else {
                msg.className = 'mt-2 text-sm text-red-600';
                msg.textContent = data.message;
            }
        } catch (error) {
            console.error(error);
            msg.textContent = 'Error setting POTD';
        }
    });
}

async function checkProblem() {
    const btn = document.querySelector('button[onclick="checkProblem()"]');
    const originalText = btn.textContent;
    btn.textContent = 'Checking...';
    btn.disabled = true;

    try {
        const res = await fetch('/api/admin/check-problem', {
            headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        const data = await res.json();

        if (data.success) {
            document.getElementById('checkResults').classList.remove('hidden');
            document.getElementById('checkedProblemId').textContent = data.problemId;
            const tbody = document.getElementById('checkResultsBody');
            tbody.innerHTML = '';

            data.results.forEach(result => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${result.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${result.handle}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.status === 'Solved' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'}">
                            ${result.status}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error checking problem:', error);
        alert('Failed to run check');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
