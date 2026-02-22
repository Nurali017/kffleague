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
  championship_code?: string;  // Championship code: pl, 1l, cup, 2l, el
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
  per_page: number;  // Backend returns per_page, not limit
  pages: number;     // Backend returns pages, not total_pages
}

export interface NewsFilters {
  championship_code?: string;  // Championship code: pl, 1l, cup, 2l, el
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
