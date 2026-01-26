// Check authentication immediately
const authData = checkAuth();

if (authData) {
    const { user, token } = authData;

    // Update UI with user info
    document.getElementById('navUserName').textContent = `Welcome, ${user.name}`;

    // Setup Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Initial Data Load
    loadDashboard();

    // Role Based UI
    handleRoleBasedUI(user);
}

function handleRoleBasedUI(user) {
    // Show Admin Nav for admins and head-admins
    if (user.role === 'admin' || user.role === 'head-admin') {
        const adminNav = document.getElementById('adminNavSection');
        if (adminNav) {
            adminNav.classList.remove('hidden');
        }
    }

    // Show Add User Section for Head Admin only
    if (user.role === 'head-admin') {
        const headAdminSection = document.getElementById('headAdminSection');
        if (headAdminSection) {
            headAdminSection.classList.remove('hidden');
            setupAddUserForm();
        }
    }
}

function setupAddUserForm() {
    const form = document.getElementById('addUserForm');
    const btnText = document.getElementById('addUserBtnText');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        const originalText = btnText.textContent;
        btnText.textContent = 'Adding...';

        const name = document.getElementById('newUserName').value;
        const email = document.getElementById('newUserEmail').value;
        const cfHandle = document.getElementById('newUserHandle').value;
        const password = document.getElementById('newUserPassword').value;
        const role = document.getElementById('newUserRole').value;

        try {
            const res = await fetch('/api/admin/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({ name, email, cfHandle, password, role })
            });

            const data = await res.json();

            if (data.success) {
                alert('User added successfully!');
                form.reset();
            } else {
                alert(data.message || 'Failed to add user');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while adding user');
        } finally {
            btnText.textContent = originalText;
        }
    });
}

async function loadDashboard() {
    try {
        const res = await fetch('/api/user/dashboard', {
            headers: { 'Authorization': `Bearer ${authData.token}` }
        });

        if (res.status === 403) {
            alert('Your account is not approved yet.');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();

        if (data.success) {
            updateStatsUI(data);
            updatePotdUI(data);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateStatsUI(data) {
    // Stats
    const stats = data.cfStats || {};
    document.getElementById('userRating').textContent = stats.rating || 'N/A';
    document.getElementById('userRank').textContent = stats.rank || 'N/A';
    document.getElementById('userMaxRating').textContent = stats.maxRating || 'N/A';
    document.getElementById('userSolvedCount').textContent = data.user.solvedCount || 0;

    // Color coding for rating
    const ratingEl = document.getElementById('userRating');
    if (stats.rating) {
        if (stats.rating >= 2400) ratingEl.classList.add('text-red-500'); // Grandmaster
        else if (stats.rating >= 2100) ratingEl.classList.add('text-orange-500'); // Master
        else if (stats.rating >= 1900) ratingEl.classList.add('text-violet-500'); // Candidate Master
        else if (stats.rating >= 1600) ratingEl.classList.add('text-blue-500'); // Expert
        else if (stats.rating >= 1400) ratingEl.classList.add('text-cyan-500'); // Specialist
        else if (stats.rating >= 1200) ratingEl.classList.add('text-green-500'); // Pupil
        else ratingEl.classList.add('text-gray-400'); // Newbie
    }
}

function updatePotdUI(data) {
    const potd = data.potd;
    const potdIdEl = document.getElementById('potdId');
    const potdDateEl = document.getElementById('potdDate');
    const badge = document.getElementById('potdStatusBadge');
    const linkBtn = document.getElementById('potdLink');

    if (potd) {
        potdIdEl.textContent = `Problem ${potd.problemId}`;
        potdDateEl.textContent = new Date(potd.dateAssigned).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (potd.isSolved) {
            badge.className = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-500/20 text-green-500 border border-green-500/20 shadow-lg shadow-green-900/20';
            badge.innerHTML = `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> SOLVED`;
        } else {
            badge.className = 'inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 shadow-lg shadow-yellow-900/20';
            badge.innerHTML = `<svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> PENDING`;
        }

        // Generate Link
        // CF Problem format: "123A" -> contest 123, index A
        const match = potd.problemId.match(/^(\d+)([A-Z]+[0-9]*)$/i);
        if (match) {
            linkBtn.href = `https://codeforces.com/problemset/problem/${match[1]}/${match[2]}`;
            linkBtn.classList.remove('hidden');
        } else {
            linkBtn.href = "#"; // Fallback
        }
    } else {
        potdIdEl.textContent = "No Problem Set";
        badge.classList.add('hidden');
        linkBtn.classList.add('hidden');
    }
}
