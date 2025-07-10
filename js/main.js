// Main Application Controller
class MainApp {
    constructor() {
        this.currentTab = 'dashboard';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.initializeManagers();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                if (tab) {
                    this.switchTab(tab);
                }
            });
        });

        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Mobile overlay
        const mobileOverlay = document.querySelector('.mobile-overlay');
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Global search
        const globalSearch = document.querySelector('.header .search-input');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => this.handlePopState(e));
    }

    setupMobileMenu() {
        // Add mobile menu toggle button to header if it doesn't exist
        const header = document.querySelector('.header-left');
        if (header && !header.querySelector('.mobile-menu-toggle')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'mobile-menu-toggle';
            toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            toggleBtn.addEventListener('click', () => this.toggleMobileMenu());
            header.insertBefore(toggleBtn, header.firstChild);
        }

        // Add mobile overlay if it doesn't exist
        if (!document.querySelector('.mobile-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            overlay.addEventListener('click', () => this.closeMobileMenu());
            document.body.appendChild(overlay);
        }
    }

    initializeManagers() {
        // Managers are already initialized globally
        // This method can be used for additional setup if needed
        if (window.dashboardManager) {
            window.dashboardManager.setupDashboardInteractions();
        }
    }

    handleInitialLoad() {
        // Check if user is authenticated
        if (!authManager.isAuthenticated()) {
            return; // Login form will be shown
        }

        // Set initial tab based on URL hash or default to dashboard
        const hash = window.location.hash.substring(1);
        const initialTab = hash && this.isValidTab(hash) ? hash : 'dashboard';
        this.switchTab(initialTab, false);
    }

    switchTab(tabName, updateHistory = true) {
        if (!this.isValidTab(tabName)) {
            console.warn(`Invalid tab: ${tabName}`);
            return;
        }

        // Update navigation
        this.updateNavigation(tabName);

        // Show/hide tab content
        this.showTabContent(tabName);

        // Update current tab
        this.currentTab = tabName;

        // Update URL hash
        if (updateHistory) {
            window.history.pushState({ tab: tabName }, '', `#${tabName}`);
        }

        // Close mobile menu if open
        this.closeMobileMenu();

        // Trigger tab-specific initialization
        this.initializeTab(tabName);
    }

    isValidTab(tabName) {
        const validTabs = ['dashboard', 'content', 'users', 'settings'];
        return validTabs.includes(tabName);
    }

    updateNavigation(activeTab) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.tab === activeTab) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    showTabContent(activeTab) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            if (content.id === `${activeTab}Tab`) {
                content.classList.add('active');
                content.classList.add('fade-in');
            } else {
                content.classList.remove('active');
                content.classList.remove('fade-in');
            }
        });
    }

    initializeTab(tabName) {
        switch (tabName) {
            case 'dashboard':
                if (window.dashboardManager) {
                    window.dashboardManager.refreshDashboard();
                }
                break;
            case 'content':
                if (window.contentManager) {
                    window.contentManager.loadContent();
                }
                break;
            case 'users':
                if (window.userManager) {
                    window.userManager.refreshUsers();
                }
                break;
            case 'settings':
                if (window.settingsManager) {
                    window.settingsManager.loadSettings();
                }
                break;
        }
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.mobile-overlay');

        if (this.isMobileMenuOpen) {
            sidebar.classList.add('mobile-open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
            const sidebar = document.querySelector('.sidebar');
            const overlay = document.querySelector('.mobile-overlay');

            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleGlobalSearch(query) {
        if (!query.trim()) return;

        // Implement global search functionality
        switch (this.currentTab) {
            case 'content':
                if (window.contentManager) {
                    const searchInput = document.getElementById('contentSearch');
                    if (searchInput) {
                        searchInput.value = query;
                        window.contentManager.filterContent();
                    }
                }
                break;
            case 'users':
                if (window.userManager) {
                    window.userManager.searchUsers(query);
                }
                break;
        }
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Ctrl/Cmd + key combinations
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.switchTab('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchTab('content');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchTab('users');
                    break;
                case '4':
                    e.preventDefault();
                    this.switchTab('settings');
                    break;
                case 'n':
                    e.preventDefault();
                    if (this.currentTab === 'content' && window.contentManager) {
                        window.contentManager.showContentForm();
                    }
                    break;
            }
        }

        // Escape key
        if (e.key === 'Escape') {
            // Close any open modals
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close mobile menu
            this.closeMobileMenu();
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handlePopState(e) {
        const state = e.state;
        if (state && state.tab) {
            this.switchTab(state.tab, false);
        } else {
            // Handle direct URL access
            const hash = window.location.hash.substring(1);
            const tab = hash && this.isValidTab(hash) ? hash : 'dashboard';
            this.switchTab(tab, false);
        }
    }

    // Utility methods
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-left: 4px solid #3b82f6;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 1000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification.success {
                    border-left-color: #10b981;
                }
                .notification.error {
                    border-left-color: #ef4444;
                }
                .notification.warning {
                    border-left-color: #f59e0b;
                }
                .notification i:first-child {
                    color: #3b82f6;
                }
                .notification.success i:first-child {
                    color: #10b981;
                }
                .notification.error i:first-child {
                    color: #ef4444;
                }
                .notification.warning i:first-child {
                    color: #f59e0b;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .notification-close:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    // Method to get current application state
    getState() {
        return {
            currentTab: this.currentTab,
            isAuthenticated: authManager.isAuthenticated(),
            currentUser: authManager.getCurrentUser(),
            isMobileMenuOpen: this.isMobileMenuOpen
        };
    }

    // Method to handle application errors
    handleError(error, context = '') {
        console.error(`Application Error ${context}:`, error);
        this.showNotification(
            `An error occurred${context ? ` in ${context}` : ''}. Please try again.`,
            'error'
        );
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    if (window.mainApp) {
        window.mainApp.handleError(e.reason, 'Promise');
    }
});

// Handle general errors
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (window.mainApp) {
        window.mainApp.handleError(e.error, 'Global');
    }
});