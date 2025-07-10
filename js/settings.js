// Settings Management
class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const settingsForm = document.getElementById('settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }
    }

    loadSettings() {
        this.settings = dataManager.getSettings();
        this.populateSettingsForm();
    }

    populateSettingsForm() {
        // General Settings
        this.setInputValue('siteName', this.settings.siteName);
        this.setInputValue('siteUrl', this.settings.siteUrl);
        this.setInputValue('siteDescription', this.settings.siteDescription);
        this.setInputValue('adminEmail', this.settings.adminEmail);

        // Security Settings
        this.setCheckboxValue('requireApproval', this.settings.requireApproval);
        this.setCheckboxValue('enableComments', this.settings.enableComments);

        // Notification Settings
        this.setCheckboxValue('enableNotifications', this.settings.enableNotifications);

        // File Upload Settings
        this.setInputValue('maxFileSize', this.settings.maxFileSize);
        this.setInputValue('allowedFileTypes', this.settings.allowedFileTypes);
        this.setSelectValue('theme', this.settings.theme);
    }

    setInputValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined) {
            element.value = value;
        }
    }

    setCheckboxValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined) {
            element.checked = value;
        }
    }

    setSelectValue(id, value) {
        const element = document.getElementById(id);
        if (element && value !== undefined) {
            element.value = value;
        }
    }

    async handleSettingsSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const updatedSettings = {};

        // General Settings
        updatedSettings.siteName = document.getElementById('siteName').value;
        updatedSettings.siteUrl = document.getElementById('siteUrl').value;
        updatedSettings.siteDescription = document.getElementById('siteDescription').value;
        updatedSettings.adminEmail = document.getElementById('adminEmail').value;

        // Security Settings
        updatedSettings.requireApproval = document.getElementById('requireApproval').checked;
        updatedSettings.enableComments = document.getElementById('enableComments').checked;

        // Notification Settings
        updatedSettings.enableNotifications = document.getElementById('enableNotifications').checked;

        // File Upload Settings
        updatedSettings.maxFileSize = document.getElementById('maxFileSize').value;
        updatedSettings.allowedFileTypes = document.getElementById('allowedFileTypes').value;
        updatedSettings.theme = document.getElementById('theme').value;

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Validate settings
            if (!this.validateSettings(updatedSettings)) {
                throw new Error('Invalid settings data');
            }

            // Save settings
            dataManager.updateSettings(updatedSettings);
            this.settings = { ...this.settings, ...updatedSettings };

            // Apply theme if changed
            if (updatedSettings.theme !== this.settings.theme) {
                this.applyTheme(updatedSettings.theme);
            }

            this.showNotification('Settings saved successfully!', 'success');

        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    }

    validateSettings(settings) {
        // Basic validation
        if (!settings.siteName || settings.siteName.trim().length === 0) {
            this.showNotification('Site name is required', 'error');
            return false;
        }

        if (!settings.adminEmail || !this.isValidEmail(settings.adminEmail)) {
            this.showNotification('Valid admin email is required', 'error');
            return false;
        }

        if (settings.siteUrl && !this.isValidUrl(settings.siteUrl)) {
            this.showNotification('Valid site URL is required', 'error');
            return false;
        }

        const maxFileSize = parseInt(settings.maxFileSize);
        if (isNaN(maxFileSize) || maxFileSize <= 0 || maxFileSize > 100) {
            this.showNotification('Max file size must be between 1 and 100 MB', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    applyTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Apply new theme
        switch (theme) {
            case 'dark':
                body.classList.add('theme-dark');
                break;
            case 'auto':
                body.classList.add('theme-auto');
                this.applyAutoTheme();
                break;
            default:
                body.classList.add('theme-light');
        }
    }

    applyAutoTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const body = document.body;
        
        if (prefersDark) {
            body.classList.add('auto-dark');
        } else {
            body.classList.remove('auto-dark');
        }

        // Listen for changes in system theme preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (this.settings.theme === 'auto') {
                if (e.matches) {
                    body.classList.add('auto-dark');
                } else {
                    body.classList.remove('auto-dark');
                }
            }
        });
    }

    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
            // Reset to default settings
            const defaultSettings = {
                siteName: 'My CMS',
                siteDescription: 'A powerful content management system',
                siteUrl: 'https://mycms.com',
                adminEmail: 'admin@cms.com',
                enableNotifications: true,
                enableComments: false,
                requireApproval: true,
                maxFileSize: '10',
                allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
                theme: 'light',
                language: 'en'
            };

            dataManager.updateSettings(defaultSettings);
            this.settings = defaultSettings;
            this.populateSettingsForm();
            this.applyTheme(defaultSettings.theme);
            
            this.showNotification('Settings reset to default values', 'success');
        }
    }

    exportSettings() {
        const settingsJson = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([settingsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cms-settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Settings exported successfully', 'success');
    }

    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                
                if (this.validateSettings(importedSettings)) {
                    dataManager.updateSettings(importedSettings);
                    this.settings = importedSettings;
                    this.populateSettingsForm();
                    this.applyTheme(importedSettings.theme);
                    
                    this.showNotification('Settings imported successfully', 'success');
                }
            } catch (error) {
                this.showNotification('Invalid settings file', 'error');
            }
        };
        reader.readAsText(file);
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
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Method to get current settings
    getSettings() {
        return this.settings;
    }

    // Method to update a specific setting
    updateSetting(key, value) {
        this.settings[key] = value;
        dataManager.updateSettings({ [key]: value });
    }
}

// Create global instance
window.settingsManager = new SettingsManager();