// Content Management
class ContentManager {
    constructor() {
        this.currentContent = null;
        this.filteredContents = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadContent();
    }

    setupEventListeners() {
        // Add content button
        const addContentBtn = document.getElementById('addContentBtn');
        if (addContentBtn) {
            addContentBtn.addEventListener('click', () => this.showContentForm());
        }

        // Content form
        const contentForm = document.getElementById('contentForm');
        if (contentForm) {
            contentForm.addEventListener('submit', (e) => this.handleContentSubmit(e));
        }

        // Modal close buttons
        const closeModal = document.getElementById('closeModal');
        const cancelForm = document.getElementById('cancelContentForm');
        if (closeModal) closeModal.addEventListener('click', () => this.hideContentForm());
        if (cancelForm) cancelForm.addEventListener('click', () => this.hideContentForm());

        // Title to slug generation
        const titleInput = document.getElementById('contentTitle');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => this.generateSlug(e.target.value));
        }

        // Tag management
        const addTagBtn = document.getElementById('addTagBtn');
        const tagInput = document.getElementById('tagInput');
        if (addTagBtn) addTagBtn.addEventListener('click', () => this.addTag());
        if (tagInput) {
            tagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag();
                }
            });
        }

        // Search and filters
        const searchInput = document.getElementById('contentSearch');
        const statusFilter = document.getElementById('statusFilter');
        const typeFilter = document.getElementById('typeFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterContent());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterContent());
        }
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.filterContent());
        }

        // Modal backdrop click
        const modal = document.getElementById('contentModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideContentForm();
                }
            });
        }
    }

    loadContent() {
        const contents = dataManager.getContents();
        this.filteredContents = contents;
        this.renderContentTable();
        this.updateContentCount();
    }

    filterContent() {
        const searchTerm = document.getElementById('contentSearch')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || 'all';
        const typeFilter = document.getElementById('typeFilter')?.value || 'all';

        this.filteredContents = dataManager.searchContents(searchTerm, {
            status: statusFilter,
            type: typeFilter
        });

        this.renderContentTable();
        this.updateContentCount();
    }

    renderContentTable() {
        const tbody = document.getElementById('contentTableBody');
        if (!tbody) return;

        if (this.filteredContents.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-file-text"></i>
                        <h3>No content found</h3>
                        <p>Create your first piece of content to get started.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredContents.map(content => `
            <tr>
                <td>
                    <div class="table-title">${this.escapeHtml(content.title)}</div>
                    <div class="table-subtitle">${this.escapeHtml(content.excerpt)}</div>
                </td>
                <td>
                    <span class="type-badge">${content.type}</span>
                </td>
                <td>
                    <span class="status-badge status-${content.status}">${content.status}</span>
                </td>
                <td>
                    <div class="table-views">
                        <i class="fas fa-eye"></i>
                        ${dataManager.formatNumber(content.views)}
                    </div>
                </td>
                <td>
                    <div class="table-date">
                        <i class="fas fa-calendar"></i>
                        ${dataManager.formatDate(content.updatedAt)}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn edit" onclick="contentManager.editContent('${content.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="contentManager.deleteContent('${content.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateContentCount() {
        const countElement = document.getElementById('contentCount');
        if (countElement) {
            countElement.textContent = this.filteredContents.length;
        }
    }

    showContentForm(content = null) {
        this.currentContent = content;
        const modal = document.getElementById('contentModal');
        const modalTitle = document.getElementById('modalTitle');
        const submitBtnText = document.getElementById('submitBtnText');

        if (content) {
            modalTitle.textContent = 'Edit Content';
            submitBtnText.textContent = 'Update';
            this.populateForm(content);
        } else {
            modalTitle.textContent = 'Add New Content';
            submitBtnText.textContent = 'Create';
            this.resetForm();
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideContentForm() {
        const modal = document.getElementById('contentModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentContent = null;
        this.resetForm();
    }

    populateForm(content) {
        document.getElementById('contentTitle').value = content.title;
        document.getElementById('contentSlug').value = content.slug;
        document.getElementById('contentExcerpt').value = content.excerpt;
        document.getElementById('contentBody').value = content.content;
        document.getElementById('contentStatus').value = content.status;
        document.getElementById('contentType').value = content.type;
        document.getElementById('contentFeatured').checked = content.featured;

        // Populate tags
        this.renderTags(content.tags);
    }

    resetForm() {
        document.getElementById('contentForm').reset();
        this.renderTags([]);
    }

    generateSlug(title) {
        const slug = dataManager.generateSlug(title);
        document.getElementById('contentSlug').value = slug;
    }

    addTag() {
        const tagInput = document.getElementById('tagInput');
        const tagValue = tagInput.value.trim();

        if (tagValue && !this.getCurrentTags().includes(tagValue)) {
            const currentTags = this.getCurrentTags();
            currentTags.push(tagValue);
            this.renderTags(currentTags);
            tagInput.value = '';
        }
    }

    removeTag(tagToRemove) {
        const currentTags = this.getCurrentTags().filter(tag => tag !== tagToRemove);
        this.renderTags(currentTags);
    }

    getCurrentTags() {
        const tagsContainer = document.getElementById('tagsContainer');
        const tagElements = tagsContainer.querySelectorAll('.tag');
        return Array.from(tagElements).map(el => el.dataset.tag);
    }

    renderTags(tags) {
        const tagsContainer = document.getElementById('tagsContainer');
        tagsContainer.innerHTML = tags.map(tag => `
            <span class="tag" data-tag="${this.escapeHtml(tag)}">
                <i class="fas fa-tag"></i>
                ${this.escapeHtml(tag)}
                <button type="button" class="tag-remove" onclick="contentManager.removeTag('${this.escapeHtml(tag)}')">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');
    }

    async handleContentSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('contentTitle').value,
            slug: document.getElementById('contentSlug').value,
            excerpt: document.getElementById('contentExcerpt').value,
            content: document.getElementById('contentBody').value,
            status: document.getElementById('contentStatus').value,
            type: document.getElementById('contentType').value,
            featured: document.getElementById('contentFeatured').checked,
            tags: this.getCurrentTags(),
            author: authManager.getCurrentUser()?.name || 'Admin User'
        };

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (this.currentContent) {
                dataManager.updateContent(this.currentContent.id, formData);
            } else {
                dataManager.addContent(formData);
            }

            this.hideContentForm();
            this.loadContent();
            this.showNotification('Content saved successfully!', 'success');

        } catch (error) {
            this.showNotification('Error saving content. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    editContent(id) {
        const content = dataManager.getContentById(id);
        if (content) {
            this.showContentForm(content);
        }
    }

    deleteContent(id) {
        const content = dataManager.getContentById(id);
        if (!content) return;

        if (confirm(`Are you sure you want to delete "${content.title}"? This action cannot be undone.`)) {
            dataManager.deleteContent(id);
            this.loadContent();
            this.showNotification('Content deleted successfully!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Create global instance
window.contentManager = new ContentManager();