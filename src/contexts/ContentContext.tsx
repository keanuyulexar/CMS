import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'published' | 'draft' | 'archived';
  type: 'article' | 'page' | 'post';
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  featured: boolean;
  views: number;
}

interface ContentContextType {
  contents: Content[];
  addContent: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => void;
  updateContent: (id: string, content: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  getContentById: (id: string) => Content | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [contents, setContents] = useState<Content[]>([]);

  useEffect(() => {
    // Initialize with mock data
    const mockContents: Content[] = [
      {
        id: '1',
        title: 'Getting Started with Our CMS',
        slug: 'getting-started-cms',
        content: 'Welcome to our powerful content management system. This guide will help you understand the basics...',
        excerpt: 'A comprehensive guide to getting started with our CMS platform.',
        status: 'published',
        type: 'article',
        author: 'Admin User',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        tags: ['tutorial', 'getting-started', 'cms'],
        featured: true,
        views: 1247
      },
      {
        id: '2',
        title: 'Advanced Content Features',
        slug: 'advanced-content-features',
        content: 'Discover the advanced features that make content management efficient and powerful...',
        excerpt: 'Explore advanced features for power users and content managers.',
        status: 'published',
        type: 'article',
        author: 'Admin User',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        tags: ['advanced', 'features', 'tutorial'],
        featured: false,
        views: 892
      },
      {
        id: '3',
        title: 'About Us',
        slug: 'about-us',
        content: 'Learn more about our company and our mission to provide the best content management solutions...',
        excerpt: 'Information about our company and mission.',
        status: 'published',
        type: 'page',
        author: 'Admin User',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        tags: ['company', 'about'],
        featured: false,
        views: 534
      }
    ];
    setContents(mockContents);
  }, []);

  const addContent = (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    const newContent: Content = {
      ...content,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0
    };
    setContents(prev => [newContent, ...prev]);
  };

  const updateContent = (id: string, updatedContent: Partial<Content>) => {
    setContents(prev => prev.map(content => 
      content.id === id 
        ? { ...content, ...updatedContent, updatedAt: new Date() }
        : content
    ));
  };

  const deleteContent = (id: string) => {
    setContents(prev => prev.filter(content => content.id !== id));
  };

  const getContentById = (id: string) => {
    return contents.find(content => content.id === id);
  };

  return (
    <ContentContext.Provider value={{ contents, addContent, updateContent, deleteContent, getContentById }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}