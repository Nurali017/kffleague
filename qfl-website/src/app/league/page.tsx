import { redirect } from 'next/navigation';

/**
 * League landing page - redirects to league management
 * This page ensures the main "League" navigation link has a valid destination
 */
export default function LeaguePage() {
  redirect('/league/management');
}
