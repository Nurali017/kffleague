import { redirect } from 'next/navigation';

/**
 * Media landing page - redirects to video section
 * This page ensures the main "Media" navigation link has a valid destination
 */
export default function MediaPage() {
  redirect('/video');
}
