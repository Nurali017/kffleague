import { redirect } from 'next/navigation';

/**
 * Stats landing page - redirects to teams statistics
 */
export default function StatsPage() {
    redirect('/stats/teams');
}
