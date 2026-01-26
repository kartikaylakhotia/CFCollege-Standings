// Theme Management Utility

const themeToggleBtn = document.createElement('button');
themeToggleBtn.id = 'themeToggle';
themeToggleBtn.className = 'fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none';
// Styling handled via classes in HTML to adapt to theme, but setting base here or in HTML

function initTheme() {
    // Check for saved theme preference, otherwise use system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateIcon(false);
    }

    // Insert toggle button if not present
    if (!document.getElementById('themeToggle')) {
        document.body.appendChild(themeToggleBtn);
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Apply styling classes to the button based on current theme
    updateButtonStyles();
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateIcon(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateIcon(true);
    }
    updateButtonStyles();
}

function updateIcon(isDark) {
    if (isDark) {
        // Moon Icon
        themeToggleBtn.innerHTML = `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    } else {
        // Sun Icon
        themeToggleBtn.innerHTML = `<svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
    }
}

function updateButtonStyles() {
    if (document.documentElement.classList.contains('dark')) {
        themeToggleBtn.classList.remove('bg-white', 'text-black', 'border-gray-200');
        themeToggleBtn.classList.add('bg-neutral-800', 'text-white', 'border', 'border-neutral-700');
    } else {
        themeToggleBtn.classList.remove('bg-neutral-800', 'text-white', 'border-neutral-700');
        themeToggleBtn.classList.add('bg-white', 'text-black', 'border', 'border-gray-200');
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initTheme);
