/**
 * Main JavaScript for Lilith.Eve Dashboard
 * Handles UI interactions, API calls, and dynamic content
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize sidebar toggle
    initSidebar();
    
    // Initialize mobile menu toggle
    initMobileMenu();
    
    // Initialize dropdowns
    initDropdowns();
    
    // Initialize modals
    initModals();
    
    // Initialize forms
    initForms();
    
    // Initialize charts if on dashboard
    if (document.querySelector('.dashboard-page')) {
        initDashboardCharts();
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle') && !event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });
});

/**
 * Initialize tooltips using Tippy.js
 */
function initTooltips() {
    // Only initialize if Tippy is loaded
    if (typeof tippy === 'function') {
        tippy('[data-tippy-content]', {
            animation: 'shift-away',
            theme: 'light',
            arrow: true,
            delay: [100, 0],
            duration: [150, 150],
            interactive: true,
            placement: 'top',
        });
    }
}

/**
 * Initialize sidebar toggle functionality
 */
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('#sidebar-toggle');
    const overlay = document.querySelector('.overlay');
    
    if (!sidebar || !toggleBtn) return;
    
    // Toggle sidebar on button click
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('sidebar-mini');
        localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-mini'));
    });
    
    // Close sidebar when clicking on overlay (mobile)
    if (overlay) {
        overlay.addEventListener('click', function() {
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Load saved sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        document.body.classList.add('sidebar-mini');
    }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('#mobile-menu-button');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-open');
        });
    }
}

/**
 * Initialize dropdown menus
 */
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            const isOpen = dropdown.classList.contains('open');
            
            // Close all other dropdowns
            closeAllDropdowns();
            
            // Toggle this dropdown if it wasn't open
            if (!isOpen) {
                dropdown.classList.add('open');
            }
        });
    });
}

/**
 * Close all open dropdowns
 */
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('open');
    });
}

/**
 * Initialize modal dialogs
 */
function initModals() {
    // Open modal
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
        });
    });
    
    // Close modal when clicking on close button or outside
    document.querySelectorAll('.modal').forEach(modal => {
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            });
        }
        
        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    });
}

/**
 * Initialize form handling
 */
function initForms() {
    // Handle form submissions with AJAX
    document.querySelectorAll('form[data-ajax]').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Processing...';
            }
            
            // Send form data
            fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                // Handle success response
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else if (data.message) {
                    showAlert(data.message, data.success ? 'success' : 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            });
        });
    });
}

/**
 * Initialize dashboard charts
 */
function initDashboardCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') return;
    
    // Example: Activity chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Active Users',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 5
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }
    
    // Add more chart initializations as needed
}

/**
 * Show alert message
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, warning, info)
 */
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${getAlertClass(type)}`;
    alert.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                ${getAlertIcon(type)}
            </div>
            <div class="ml-3">
                <p class="text-sm font-medium">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span class="sr-only">Close</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    // Add close functionality
    const closeBtn = alert.querySelector('button');
    closeBtn.addEventListener('click', () => {
        alert.remove();
    });
    
    // Auto-remove after 5 seconds
    document.body.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

/**
 * Get alert classes based on type
 */
function getAlertClass(type) {
    const classes = {
        success: 'bg-green-50 border border-green-200 text-green-700',
        error: 'bg-red-50 border border-red-200 text-red-700',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
        info: 'bg-blue-50 border border-blue-200 text-blue-700'
    };
    return classes[type] || classes.info;
}

/**
 * Get alert icon based on type
 */
function getAlertIcon(type) {
    const icons = {
        success: `<svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>`,
        error: `<svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>`,
        warning: `<svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>`,
        info: `<svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clip-rule="evenodd" />
        </svg>`
    };
    return icons[type] || icons.info;
}

// Make functions available globally
window.showAlert = showAlert;
