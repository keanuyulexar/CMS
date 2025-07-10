// Dashboard Management
class DashboardManager {
    constructor() {
        this.stats = null;
        this.init();
    }

    init() {
        this.loadStats();
        this.updateCurrentDate();
        this.loadRecentContent();
        this.loadAnalytics();
    }

    loadStats() {
        this.stats = dataManager.getContentStats();
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        if (!this.stats) return;

        // Update stat cards
        const totalContentEl = document.getElementById('totalContent');
        const publishedContentEl = document.getElementById('publishedContent');
        const totalViewsEl = document.getElementById('totalViews');

        if (totalContentEl) {
            totalContentEl.textContent = this.stats.total;
        }
        if (publishedContentEl) {
            publishedContentEl.textContent = this.stats.published;
        }
        if (totalViewsEl) {
            totalViewsEl.textContent = dataManager.formatNumber(this.stats.totalViews);
        }
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        if (dateElement) {
            const now = new Date();
            dateElement.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }

    loadRecentContent() {
        const contents = dataManager.getContents().slice(0, 5);
        const recentContentList = document.getElementById('recentContentList');
        
        if (!recentContentList) return;

        if (contents.length === 0) {
            recentContentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-text"></i>
                    <h3>No content yet</h3>
                    <p>Create your first piece of content to see it here.</p>
                </div>
            `;
            return;
        }

        recentContentList.innerHTML = contents.map(content => `
            <div class="recent-content-item">
                <div class="content-indicator"></div>
                <div class="content-info">
                    <div class="content-title">${this.escapeHtml(content.title)}</div>
                    <div class="content-meta">
                        <span class="status-badge status-${content.status}">${content.status}</span>
                        <span class="content-views">${dataManager.formatNumber(content.views)} views</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadAnalytics() {
        if (!this.stats) return;

        const articlesCountEl = document.getElementById('articlesCount');
        const pagesCountEl = document.getElementById('pagesCount');
        const featuredCountEl = document.getElementById('featuredCount');

        if (articlesCountEl) {
            articlesCountEl.textContent = this.stats.articles;
        }
        if (pagesCountEl) {
            pagesCountEl.textContent = this.stats.pages;
        }
        if (featuredCountEl) {
            featuredCountEl.textContent = this.stats.featured;
        }
    }

    refreshDashboard() {
        this.loadStats();
        this.loadRecentContent();
        this.loadAnalytics();
    }

    // Utility method for escaping HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Method to handle dashboard-specific interactions
    setupDashboardInteractions() {
        // Add click handlers for stat cards to navigate to relevant sections
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                switch(index) {
                    case 0: // Total Content
                    case 1: // Published Content
                        this.navigateToContent();
                        break;
                    case 3: // Active Users
                        this.navigateToUsers();
                        break;
                }
            });
        });

        // Add hover effects for interactive elements
        this.addHoverEffects();
    }

    navigateToContent() {
        if (window.mainApp) {
            window.mainApp.switchTab('content');
        }
    }

    navigateToUsers() {
        if (window.mainApp) {
            window.mainApp.switchTab('users');
        }
    }

    addHoverEffects() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.classList.add('hover-lift');
            card.style.cursor = 'pointer';
        });
    }

    // Method to update dashboard in real-time
    startRealTimeUpdates() {
        // Update dashboard every 30 seconds
        setInterval(() => {
            this.refreshDashboard();
        }, 30000);
    }

    // Method to handle dashboard animations
    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(el => {
            const finalValue = parseInt(el.textContent.replace(/,/g, ''));
            this.animateNumber(el, 0, finalValue, 1000);
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = dataManager.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        requestAnimationFrame(update);
    }
}

// Create global instance
window.dashboardManager = new DashboardManager();