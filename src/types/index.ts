export interface Website {
  id: number;
  name: string;
  url: string;
  status: 'active' | 'inactive' | 'maintenance' | 'setting-up';
  articles: number;
  adminUrl?: string;
}

export interface TempDomainProvider {
  id: string;
  name: string;
  baseUrl: string;
  setupTime: string;
  features: string[];
}

export interface ContentItem {
  id: number;
  title: string;
  excerpt?: string;
  status: 'generated' | 'published' | 'scheduled';
  website?: string;
}