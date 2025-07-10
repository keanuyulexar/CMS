// Mock Data and Storage Management
class DataManager {
    constructor() {
        this.initializeData();
    }

    initializeData() {
        // Initialize mock content data
        if (!localStorage.getItem('cms-contents')) {
            const mockContents = [
                {
                    id: '1',
                    title: 'Getting Started with Our CMS',
                    slug: 'getting-started-cms',
                    content: 'Welcome to our powerful content management system. This guide will help you understand the basics of creating, managing, and publishing content. Our CMS provides a user-friendly interface that makes content management simple and efficient.',
                    excerpt: 'A comprehensive guide to getting started with our CMS platform.',
                    status: 'published',
                    type: 'article',
                    author: 'Admin User',
                    createdAt: new Date('2024-01-15').toISOString(),
                    updatedAt: new Date('2024-01-15').toISOString(),
                    tags: ['tutorial', 'getting-started', 'cms'],
                    featured: true,
                    views: 1247
                },
                {
                    id: '2',
                    title: 'Advanced Content Features',
                    slug: 'advanced-content-features',
                    content: 'Discover the advanced features that make content management efficient and powerful. Learn about content scheduling, SEO optimization, media management, and collaboration tools that streamline your workflow.',
                    excerpt: 'Explore advanced features for power users and content managers.',
                    status: 'published',
                    type: 'article',
                    author: 'Admin User',
                    createdAt: new Date('2024-01-10').toISOString(),
                    updatedAt: new Date('2024-01-12').toISOString(),
                    tags: ['advanced', 'features', 'tutorial'],
                    featured: false,
                    views: 892
                },
                {
                    id: '3',
                    title: 'About Us',
                    slug: 'about-us',
                    content: 'Learn more about our company and our mission to provide the best content management solutions. We are dedicated to creating tools that empower content creators and businesses to succeed online.',
                    excerpt: 'Information about our company and mission.',
                    status: 'published',
                    type: 'page',
                    author: 'Admin User',
                    createdAt: new Date('2024-01-05').toISOString(),
                    updatedAt: new Date('2024-01-05').toISOString(),
                    tags: ['company', 'about'],
                    featured: false,
                    views: 534
                },
                {
                    id: '4',
                    title: 'Content Strategy Best Practices',
                    slug: 'content-strategy-best-practices',
                    content: 'Developing an effective content strategy is crucial for success. This article covers planning, creation, distribution, and measurement of content performance.',
                    excerpt: 'Learn how to develop and implement an effective content strategy.',
                    status: 'draft',
                    type: 'article',
                    author: 'Admin User',
                    createdAt: new Date('2024-01-20').toISOString(),
                    updatedAt: new Date('2024-01-22').toISOString(),
                    tags: ['strategy', 'planning', 'best-practices'],
                    featured: false,
                    views: 0
                },
                {
                    id: '5',
                    title: 'SEO Optimization Guide',
                    slug: 'seo-optimization-guide',
                    content: 'Master the art of search engine optimization with our comprehensive guide. Learn about keyword research, on-page optimization, and technical SEO.',
                    excerpt: 'Complete guide to optimizing your content for search engines.',
                    status: 'published',
                    type: 'post',
                    author: 'Admin User',
                    createdAt: new Date('2024-01-18').toISOString(),
                    updatedAt: new Date('2024-01-19').toISOString(),
                    tags: ['seo', 'optimization', 'search'],
                    featured: true,
                    views: 1856
                }
            ];
            localStorage.setItem('cms-contents', JSON.stringify(mockContents));
        }

        // Initialize mock users data
        if (!localStorage.getItem('cms-users')) {
            const mockUsers = [
                {
                    id: '1',
                    name: 'Admin User',
                    email: 'admin@cms.com',
                    role: 'admin',
                    status: 'active',
                    lastLogin: new Date().toISOString(),
                    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                    id: '2',
                    name: 'John Editor',
                    email: 'john@cms.com',
                    role: 'editor',
                    status: 'active',
                    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
                },
                {
                    id: '3',
                    name: 'Jane Viewer',
                    email: 'jane@cms.com',
                    role: 'viewer',
                    status: 'inactive',
                    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
                }
            ];
            localStorage.setItem('cms-users', JSON.stringify(mockUsers));
        }

        // Initialize settings
        if (!localStorage.getItem('cms-settings')) {
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
            localStorage.setItem('cms-settings', JSON.stringify(defaultSettings));
        }
    }

    // Content Management
    getContents() {
        return JSON.parse(localStorage.getItem('cms-contents') || '[]');
    }

    getContentById(id) {
        const contents = this.getContents();
        return contents.find(content => content.id === id);
    }

    addContent(contentData) {
        const contents = this.getContents();
        const newContent = {
            ...contentData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            views: 0
        };
        contents.unshift(newContent);
        localStorage.setItem('cms-contents', JSON.stringify(contents));
        return newContent;
    }

    updateContent(id, contentData) {
        const contents = this.getContents();
        const index = contents.findIndex(content => content.id === id);
        if (index !== -1) {
            contents[index] = {
                ...contents[index],
                ...contentData,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('cms-contents', JSON.stringify(contents));
            return contents[index];
        }
        return null;
    }

    deleteContent(id) {
        const contents = this.getContents();
        const filteredContents = contents.filter(content => content.id !== id);
        localStorage.setItem('cms-contents', JSON.stringify(filteredContents));
        return true;
    }

    // User Management
    getUsers() {
        return JSON.parse(localStorage.getItem('cms-users') || '[]');
    }

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    // Settings Management
    getSettings() {
        return JSON.parse(localStorage.getItem('cms-settings') || '{}');
    }

    updateSettings(settingsData) {
        const currentSettings = this.getSettings();
        const updatedSettings = { ...currentSettings, ...settingsData };
        localStorage.setItem('cms-settings', JSON.stringify(updatedSettings));
        return updatedSettings;
    }

    // Authentication
    authenticate(email, password) {
        // Mock authentication - in production, this would be a real API call
        if (email === 'admin@cms.com' && password === 'admin123') {
            const user = {
                id: '1',
                email: 'admin@cms.com',
                name: 'Admin User',
                role: 'admin',
                avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
            };
            localStorage.setItem('cms-user', JSON.stringify(user));
            return user;
        }
        return null;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('cms-user') || 'null');
    }

    logout() {
        localStorage.removeItem('cms-user');
    }

    // Utility Methods
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    // Search and Filter
    searchContents(query, filters = {}) {
        let contents = this.getContents();
        
        // Text search
        if (query) {
            const searchTerm = query.toLowerCase();
            contents = contents.filter(content => 
                content.title.toLowerCase().includes(searchTerm) ||
                content.excerpt.toLowerCase().includes(searchTerm) ||
                content.content.toLowerCase().includes(searchTerm) ||
                content.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Status filter
        if (filters.status && filters.status !== 'all') {
            contents = contents.filter(content => content.status === filters.status);
        }

        // Type filter
        if (filters.type && filters.type !== 'all') {
            contents = contents.filter(content => content.type === filters.type);
        }

        // Featured filter
        if (filters.featured !== undefined) {
            contents = contents.filter(content => content.featured === filters.featured);
        }

        return contents;
    }

    // Analytics
    getContentStats() {
        const contents = this.getContents();
        return {
            total: contents.length,
            published: contents.filter(c => c.status === 'published').length,
            draft: contents.filter(c => c.status === 'draft').length,
            archived: contents.filter(c => c.status === 'archived').length,
            articles: contents.filter(c => c.type === 'article').length,
            pages: contents.filter(c => c.type === 'page').length,
            posts: contents.filter(c => c.type === 'post').length,
            featured: contents.filter(c => c.featured).length,
            totalViews: contents.reduce((sum, c) => sum + c.views, 0)
        };
    }

    getUserStats() {
        const users = this.getUsers();
        return {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'inactive').length,
            admins: users.filter(u => u.role === 'admin').length,
            editors: users.filter(u => u.role === 'editor').length,
            viewers: users.filter(u => u.role === 'viewer').length
        };
    }
}

// Create global instance
window.dataManager = new DataManager();