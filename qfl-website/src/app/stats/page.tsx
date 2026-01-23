import { redirect } from 'next/navigation';

/**
 * Stats landing page - redirects to teams statistics
 * This page ensures the main "Statistics" navigation link has a valid destination
 */
export default function StatsPage() {
  redirect('/stats/teams');
}
