// Types for static pages (Leadership, Contacts, Documents)

export interface PageBase {
  id: number;
  slug: string;
  language: string;
  title: string;
}

// Leadership member structure
export interface LeadershipMember {
  id: number;
  name: string;
  position: string;
  photo?: string;
  bio?: string;
}

// Leadership page response
export interface LeadershipPage extends PageBase {
  structured_data: {
    members: LeadershipMember[];
  };
}

// Social links structure
export interface SocialLinks {
  tiktok?: string;
  youtube?: string;
  instagram?: string;
  telegram?: string;
}

// Contacts page response
export interface ContactsPage extends PageBase {
  content_text?: string;
  structured_data: {
    emails: string[];
    phones?: string[];
    social: SocialLinks;
    address?: {
      kz: string;
      ru: string;
    };
    contact_person?: {
      name: string;
      position: string;
    };
  };
}

// Document structure
export interface DocumentItem {
  title: string;
  url: string;
}

// Documents page response
export interface DocumentsPage extends PageBase {
  structured_data: {
    documents: DocumentItem[];
  };
}
