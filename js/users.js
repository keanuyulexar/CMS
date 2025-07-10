// User Management
class UserManager {
    constructor() {
        this.users = [];
        this.init();
    }

    init() {
        this.loadUsers();
        this.updateUserStats();
    }

    loadUsers() {
        this.users = dataManager.getUsers();
        this.renderUsersTable();
    }

    renderUsersTable() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (this.users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-users"></i>
                        <h3>No users found</h3>
                        <p>Add users to manage access to your CMS.</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.users.map(user => `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${user.avatar}" alt="${this.escapeHtml(user.name)}" class="user-avatar-table">
                        <div class="user-info-table">
                            <div class="user-name-table">${this.escapeHtml(user.name)}</div>
                            <div class="user-email-table">
                                <i class="fas fa-envelope"></i>
                                ${this.escapeHtml(user.email)}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">${user.status}</span>
                </td>
                <td>
                    <div class="table-date">
                        <i class="fas fa-calendar"></i>
                        ${dataManager.formatDate(user.lastLogin)}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn more" onclick="userManager.showUserActions('${user.id}')" title="More actions">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateUserStats() {
        const stats = dataManager.getUserStats();
        
        // Update stats in the users tab if elements exist
        const totalUsersEl = document.querySelector('#usersTab .stat-value');
        if (totalUsersEl) {
            totalUsersEl.textContent = stats.total;
        }
    }

    showUserActions(userId) {
        const user = dataManager.getUserById(userId);
        if (!user) return;

        // Create a simple context menu or modal for user actions
        const actions = [
            { label: 'Edit User', action: () => this.editUser(userId) },
            { label: 'Change Role', action: () => this.changeUserRole(userId) },
            { label: 'Toggle Status', action: () => this.toggleUserStatus(userId) },
            { label: 'Delete User', action: () => this.deleteUser(userId), danger: true }
        ];

        this.showActionMenu(actions);
    }

    showActionMenu(actions) {
        // Simple implementation - in a real app, you'd want a proper context menu
        const actionLabels = actions.map((action, index) => 
            `${index + 1}. ${action.label}${action.danger ? ' (Danger)' : ''}`
        ).join('\n');

        const choice = prompt(`Choose an action:\n${actionLabels}\n\nEnter the number:`);
        const actionIndex = parseInt(choice) - 1;

        if (actionIndex >= 0 && actionIndex < actions.length) {
            actions[actionIndex].action();
        }
    }

    editUser(userId) {
        const user = dataManager.getUserById(userId);
        if (!user) return;

        // Simple edit implementation
        const newName = prompt('Enter new name:', user.name);
        const newEmail = prompt('Enter new email:', user.email);

        if (newName && newEmail) {
            // In a real implementation, you'd update the user data
            alert('User edit functionality would be implemented here');
        }
    }

    changeUserRole(userId) {
        const user = dataManager.getUserById(userId);
        if (!user) return;

        const roles = ['admin', 'editor', 'viewer'];
        const roleChoice = prompt(`Choose new role:\n1. Admin\n2. Editor\n3. Viewer\n\nCurrent role: ${user.role}`);
        
        const roleIndex = parseInt(roleChoice) - 1;
        if (roleIndex >= 0 && roleIndex < roles.length) {
            // In a real implementation, you'd update the user role
            alert(`Would change ${user.name}'s role to ${roles[roleIndex]}`);
        }
    }

    toggleUserStatus(userId) {
        const user = dataManager.getUserById(userId);
        if (!user) return;

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        
        if (confirm(`Change ${user.name}'s status to ${newStatus}?`)) {
            // In a real implementation, you'd update the user status
            alert(`Would change ${user.name}'s status to ${newStatus}`);
        }
    }

    deleteUser(userId) {
        const user = dataManager.getUserById(userId);
        if (!user) return;

        if (user.role === 'admin') {
            alert('Cannot delete admin users');
            return;
        }

        if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            // In a real implementation, you'd delete the user
            alert(`Would delete user ${user.name}`);
        }
    }

    addUser() {
        // Simple add user implementation
        const name = prompt('Enter user name:');
        const email = prompt('Enter user email:');
        const role = prompt('Enter user role (admin/editor/viewer):');

        if (name && email && role) {
            if (['admin', 'editor', 'viewer'].includes(role)) {
                // In a real implementation, you'd add the user
                alert(`Would add user: ${name} (${email}) as ${role}`);
            } else {
                alert('Invalid role. Please use admin, editor, or viewer.');
            }
        }
    }

    // Utility method for escaping HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Method to refresh user data
    refreshUsers() {
        this.loadUsers();
        this.updateUserStats();
    }

    // Method to search users
    searchUsers(query) {
        const filteredUsers = this.users.filter(user => 
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase()) ||
            user.role.toLowerCase().includes(query.toLowerCase())
        );
        
        // Render filtered results
        this.renderFilteredUsers(filteredUsers);
    }

    renderFilteredUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No users found</h3>
                        <p>Try adjusting your search criteria.</p>
                    </td>
                </tr>
            `;
            return;
        }

        // Use the same rendering logic as renderUsersTable but with filtered data
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>
                    <div class="user-cell">
                        <img src="${user.avatar}" alt="${this.escapeHtml(user.name)}" class="user-avatar-table">
                        <div class="user-info-table">
                            <div class="user-name-table">${this.escapeHtml(user.name)}</div>
                            <div class="user-email-table">
                                <i class="fas fa-envelope"></i>
                                ${this.escapeHtml(user.email)}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">${user.status}</span>
                </td>
                <td>
                    <div class="table-date">
                        <i class="fas fa-calendar"></i>
                        ${dataManager.formatDate(user.lastLogin)}
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn more" onclick="userManager.showUserActions('${user.id}')" title="More actions">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Create global instance
window.userManager = new UserManager();