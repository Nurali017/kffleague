export type ArticleType = 'NEWS' | 'ANALYTICS';

export interface NewsImage {
  id: string;
  filename: string;
  url: string;
  size: number;
}

export interface NewsArticle {
  id: number;
  title: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  category?: string;
  article_type?: ArticleType | null;
  publish_date: string;
  is_slider?: boolean;
  slider_order?: number;
  images?: NewsImage[];
  views?: number;
  likes?: number;
  tags?: string[];
}

export interface SliderNews extends NewsArticle {
  is_slider: true;
  slider_order: number;
}

export interface NewsPagination {
  items: NewsArticle[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface NewsFilters {
  category?: string;
  article_type?: 'news' | 'analytics';
  search?: string;
  sort?: 'date_desc' | 'date_asc' | 'views_desc' | 'likes_desc';
  dateFrom?: string;
  dateTo?: string;
}

export interface NewsNavigation {
  previous?: { id: number; title: string };
  next?: { id: number; title: string };
}

export interface NewsReactions {
  views: number;
  likes: number;
  liked?: boolean;
}
